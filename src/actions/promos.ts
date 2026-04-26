"use server";

import { createClient } from "@/lib/supabase/server";
import { verifyAdmin, createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, DEMO_PROMOS } from "@/lib/demo-data";
import type { PromoCode } from "@/lib/types";

export async function validatePromoCode(code: string): Promise<{
  valid: boolean;
  discount: number;
  type: "percentage" | "fixed";
  message: string;
}> {
  if (!isSupabaseConfigured()) {
    // Validate against demo promos
    const promo = DEMO_PROMOS.find(
      (p) => p.code === code.toUpperCase() && p.is_active
    );
    if (!promo) {
      return { valid: false, discount: 0, type: "percentage", message: "Invalid promo code" };
    }
    if (promo.expiry_date && new Date(promo.expiry_date) < new Date()) {
      return { valid: false, discount: 0, type: "percentage", message: "Promo code has expired" };
    }
    if (promo.usage_limit > 0 && promo.times_used >= promo.usage_limit) {
      return { valid: false, discount: 0, type: "percentage", message: "Promo code usage limit reached" };
    }
    return {
      valid: true,
      discount: promo.discount_value,
      type: promo.discount_type,
      message: promo.discount_type === "percentage"
        ? `${promo.discount_value}% discount applied!`
        : `₹${promo.discount_value} discount applied!`,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return { valid: false, discount: 0, type: "percentage", message: "Invalid promo code" };
  }

  if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
    return { valid: false, discount: 0, type: "percentage", message: "Promo code has expired" };
  }

  if (data.usage_limit > 0 && data.times_used >= data.usage_limit) {
    return { valid: false, discount: 0, type: "percentage", message: "Promo code usage limit reached" };
  }

  return {
    valid: true,
    discount: data.discount_value,
    type: data.discount_type as "percentage" | "fixed",
    message: data.discount_type === "percentage"
      ? `${data.discount_value}% discount applied!`
      : `₹${data.discount_value} discount applied!`,
  };
}

export async function getPromoCodes(): Promise<PromoCode[]> {
  if (!isSupabaseConfigured()) return DEMO_PROMOS;
  await verifyAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
}

export async function createPromoCode(promo: Partial<PromoCode>): Promise<PromoCode> {
  if (!isSupabaseConfigured()) throw new Error("Connect Supabase to create promo codes");
  await verifyAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("promo_codes")
    .insert([{ ...promo, code: promo.code?.toUpperCase() }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updatePromoCode(id: string, updates: Partial<PromoCode>): Promise<PromoCode> {
  if (!isSupabaseConfigured()) throw new Error("Connect Supabase to update promo codes");
  await verifyAdmin();
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("promo_codes")
    .update({ ...updates, code: updates.code?.toUpperCase() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deletePromoCode(id: string): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Connect Supabase to delete promo codes");
  await verifyAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("promo_codes").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
