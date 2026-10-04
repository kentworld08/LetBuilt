import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function requireAdmin() {
  // Read the logged-in user's session from the server cookies.
  const cookieStore = await cookies();

  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  // Use the admin client only for the privileged role lookup.
  const adminSupabase = createAdminClient();

  const { data: profile, error: profileError } = await adminSupabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    throw new Error("Forbidden");
  }

  return user;
}
