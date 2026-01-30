import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  leads: defineTable({
    businessName: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    selectedServices: v.any(),
    totalPrice: v.number(),
    createdAt: v.optional(v.number()),
  }),
  audits: defineTable({
    businessName: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    website: v.optional(v.string()),
    socialPlatforms: v.string(),
    createdAt: v.number(),
  }),
});