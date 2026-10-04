import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";

type Profile = {
  full_name: string | null;
  username: string | null;
  role: "user" | "admin";
};

export function useProfile() {
  return useQuery<Profile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User is not authenticated");
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, username, role")
        .eq("user_id", user.id)
        .single();

      if (error) {
        throw new Error("We couldn't load your profile.");
      }

      return data;
    },
  });
}
