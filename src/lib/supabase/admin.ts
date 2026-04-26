import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "./server";

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function verifyAdmin() {
  const supabase = await createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Unauthorized: Please log in.");

  const adminClient = createAdminClient();
  const { data: adminUser, error: adminError } = await adminClient
    .from("admins")
    .select("role")
    .eq("id", user.id)
    .single();

  if (adminError || !adminUser || adminUser.role !== 'admin') {
    throw new Error("Unauthorized: Admin access required.");
  }
  
  return user;
}
