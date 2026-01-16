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
        from: "Bloom Media <no-reply@bloommedia.ro>", // schimbă după ce îți verifici domeniul în Resend
        to: "bloommediacorporation@gmail.com",                 // adresa ta de notificare
        subject: "Lead nou Bloom Media",
        text: [
          `Business: ${args.businessName}`,
          `Nume: ${args.name}`,
          `Email: ${args.email}`,
          `Telefon: ${args.phone}`,
          `Servicii selectate: ${JSON.stringify(args.selectedServices)}`,
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
        from: "Bloom Media <onboarding@resend.dev>", // la fel, schimbă după setup domeniu
        to: args.email,
        subject: "Am primit solicitarea ta – Bloom Media",
        text: [
          `Salut, ${args.name},`,
          "",
          "Îți mulțumim pentru interesul față de serviciile Bloom Media.",
          "Am primit solicitarea ta și te vom contacta în curând pentru a discuta următorii pași.",
          "",
          "Rezumat solicitare:",
          `- Business: ${args.businessName}`,
          `- Telefon: ${args.phone}`,
          `- Servicii selectate: ${JSON.stringify(args.selectedServices)}`,
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