import { v } from "convex/values";
import { mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { Resend } from "resend";

// MUTATION EXISTENTĂ - O LĂSĂM IDENTICĂ
export const create = mutation({
  args: {
    businessName: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    selectedServices: v.any(),
    totalPrice: v.number()
  },
  handler: async (ctx, args) => {
    const leadId = await ctx.db.insert("leads", {
      businessName: args.businessName,
      name: args.name,
      email: args.email,
      phone: args.phone,
      selectedServices: args.selectedServices,
      totalPrice: args.totalPrice,
      createdAt: Date.now()
    });
    return leadId;
  }
});

/**
 * ACTION: primește lead-ul, îl scrie în DB și trimite emailuri prin Resend.
 * - rulează în context de "action" pentru că face request extern HTTP.
 */
export const submitWithEmail = action({
  args: {
    businessName: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    selectedServices: v.any(),
    totalPrice: v.number()
  },
  handler: async (ctx, args) => {
    // 1. Scriem lead-ul în DB folosind mutation-ul existent
    const leadId = await ctx.runMutation(api.leads.create, args);

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY nu este setat în environment-ul Convex");
      return {
        leadId,
        emailSent: false,
        error: "Missing RESEND_API_KEY"
      };
    }

    const resend = new Resend(apiKey);

    // 2. Email către agenție (notificare lead nou)
    try {
      await resend.emails.send({
        from: "Bloom Media <contact@bloommedia.ro>",
        to: "bloommediacorporation@gmail.com",                 // adresa ta de notificare
        subject: "Lead nou Bloom Media",
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #d97706;">Lead Nou Primit</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <ul style="padding-left: 20px; margin-bottom: 0;">
                <li><strong>Business:</strong> ${args.businessName}</li>
                <li><strong>Nume Contact:</strong> ${args.name}</li>
                <li><strong>Email:</strong> ${args.email}</li>
                <li><strong>Telefon:</strong> ${args.phone}</li>
                <li><strong>Servicii:</strong>
                  <ul style="margin-top: 5px; padding-left: 20px;">
                    ${Array.isArray(args.selectedServices) ? args.selectedServices.map((s: any) => `<li style="margin-bottom: 5px;">${s.name}</li>`).join("") : JSON.stringify(args.selectedServices)}
                  </ul>
                </li>
                <li><strong>Total estimat:</strong> ${args.totalPrice} EUR</li>
              </ul>
            </div>
          </div>
        `,
        text: [
          `Business: ${args.businessName}`,
          `Nume: ${args.name}`,
          `Email: ${args.email}`,
          `Telefon: ${args.phone}`,
          `Servicii selectate:`,
          ...(Array.isArray(args.selectedServices) ? args.selectedServices.map((s: any) => `  - ${s.name}`) : [JSON.stringify(args.selectedServices)]),
          `Total estimat: ${args.totalPrice} EUR`
        ].join("\n")
      });
    } catch (error) {
      console.error("Eroare la trimiterea emailului către agenție:", error);
      // nu oprim aici, mergem mai departe spre emailul către client
    }

    // 3. Email către client (confirmare)
    try {
      await resend.emails.send({
        from: "Bloom Media <contact@bloommedia.ro>",
        to: args.email,
        replyTo: "contact@bloommedia.ro",
        subject: "Am primit solicitarea ta – Bloom Media",
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
            <h2>Salut, ${args.name},</h2>
            <p>Îți mulțumim pentru interesul față de serviciile <strong>Bloom Media</strong>.</p>
            <p>Am primit solicitarea ta și te vom contacta în curând pentru a discuta următorii pași.</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #555;">Rezumat solicitare:</h3>
              <ul style="padding-left: 20px; margin-bottom: 0;">
                <li><strong>Business:</strong> ${args.businessName}</li>
                <li><strong>Telefon:</strong> ${args.phone}</li>
                <li><strong>Servicii:</strong>
                  <ul style="margin-top: 5px; padding-left: 20px;">
                    ${Array.isArray(args.selectedServices) ? args.selectedServices.map((s: any) => `<li style="margin-bottom: 5px;">${s.name}</li>`).join("") : JSON.stringify(args.selectedServices)}
                  </ul>
                </li>
                <li><strong>Buget estimat:</strong> ${args.totalPrice} EUR</li>
              </ul>
            </div>

            <p>Cu drag,<br><strong>Echipa Bloom Media</strong></p>
          </div>
        `,
        text: [
          `Salut, ${args.name},`,
          "",
          "Îți mulțumim pentru interesul față de serviciile Bloom Media.",
          "Am primit solicitarea ta și te vom contacta în curând pentru a discuta următorii pași.",
          "",
          "Rezumat solicitare:",
          `- Business: ${args.businessName}`,
          `- Telefon: ${args.phone}`,
          `- Servicii selectate:`,
          ...(Array.isArray(args.selectedServices) ? args.selectedServices.map((s: any) => `  * ${s.name}`) : [JSON.stringify(args.selectedServices)]),
          `- Buget estimat: ${args.totalPrice} EUR`,
          "",
          "Cu drag,",
          "Echipa Bloom Media"
        ].join("\n")
      });
    } catch (error) {
      console.error("Eroare la trimiterea emailului către client:", error);
      // nu aruncăm eroare, lead-ul e deja salvat
    }

    return {
      leadId,
      emailSent: true
    };
  }
});