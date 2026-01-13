import { v } from "convex/values";
import { mutation } from "./_generated/server";

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
      totalPrice: args.totalPrice
    });
    return leadId;
  }
});
