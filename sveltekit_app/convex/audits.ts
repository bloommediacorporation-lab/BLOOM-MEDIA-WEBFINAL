import { v } from "convex/values";
import { mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { Resend } from "resend";

export const create = mutation({
  args: {
    businessName: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    website: v.optional(v.string()),
    socialPlatforms: v.string(),
  },
  handler: async (ctx, args) => {
    const auditId = await ctx.db.insert("audits", {
      businessName: args.businessName,
      name: args.name,
      email: args.email,
      phone: args.phone,
      website: args.website,
      socialPlatforms: args.socialPlatforms,
      createdAt: Date.now()
    });
    return auditId;
  }
});

export const submit = action({
  args: {
    businessName: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    website: v.optional(v.string()),
    socialPlatforms: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Scriem audit-ul în DB
    const auditId = await ctx.runMutation(api.audits.create, args);

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("RESEND_API_KEY nu este setat în environment-ul Convex");
      return {
        auditId,
        emailSent: false,
        error: "Missing RESEND_API_KEY"
      };
    }

    const resend = new Resend(apiKey);

    // 2. Email către agenție
    try {
      await resend.emails.send({
        from: "Bloom Media <contact@bloommedia.ro>",
        to: "bloommediacorporation@gmail.com",
        subject: "Solicitare AUDIT GRATUIT - Bloom Media",
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #fca311;">Solicitare AUDIT GRATUIT</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <ul style="padding-left: 20px; margin-bottom: 0;">
                <li><strong>Business:</strong> ${args.businessName}</li>
                <li><strong>Nume Contact:</strong> ${args.name}</li>
                <li><strong>Email:</strong> ${args.email}</li>
                <li><strong>Telefon:</strong> ${args.phone}</li>
                <li><strong>Website:</strong> ${args.website || "-"}</li>
                <li><strong>Platforme Sociale / Detalii:</strong><br>${args.socialPlatforms.replace(/\n/g, "<br>")}</li>
              </ul>
            </div>
          </div>
        `
      });
    } catch (error) {
      console.error("Eroare la trimiterea emailului către agenție:", error);
    }

    // 3. Email către client
    try {
      await resend.emails.send({
        from: "Bloom Media <contact@bloommedia.ro>",
        to: args.email,
        replyTo: "contact@bloommedia.ro",
        subject: "Confirmare solicitare Audit Gratuit - Bloom Media",
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
            <h2>Salut, ${args.name},</h2>
            <p>Îți mulțumim pentru solicitarea unui audit gratuit din partea <strong>Bloom Media</strong>.</p>
            <p>Am primit datele tale și echipa noastră va analiza prezența ta online. Te vom contacta în curând cu raportul de audit și recomandările noastre.</p>
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #555;">Datele transmise:</h3>
              <ul style="padding-left: 20px; margin-bottom: 0;">
                <li><strong>Business:</strong> ${args.businessName}</li>
                <li><strong>Website:</strong> ${args.website || "-"}</li>
              </ul>
            </div>

            <p>Cu drag,<br><strong>Echipa Bloom Media</strong></p>
          </div>
        `
      });
    } catch (error) {
      console.error("Eroare la trimiterea emailului către client:", error);
    }

    return {
      auditId,
      emailSent: true
    };
  }
});
