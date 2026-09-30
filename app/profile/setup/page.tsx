"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";

const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Full name is too long."),

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username must be 30 characters or less.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores.",
    ),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileSetupPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  async function createProfile(formData: ProfileFormData) {
    const supabase = createClient();

    // Get the currently authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError("root", {
        type: "auth",
        message: "You must be signed in to create a profile.",
      });
      return;
    }

    // Create the profile
    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: user.id,
      full_name: formData.fullName,
      username: formData.username,
    });

    if (profileError) {
      // PostgreSQL unique constraint violation
      if (profileError.code === "23505") {
        setError("username", {
          type: "manual",
          message: "That username is already taken.",
        });
        return;
      }

      setError("root", {
        type: "database",
        message: "Something went wrong while creating your profile.",
      });
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Complete your profile</h1>

          <p className="mt-2 text-gray-600">Tell us a little about yourself.</p>
        </div>

        <form onSubmit={handleSubmit(createProfile)} className="space-y-4">
          {/* Full name */}
          <div>
            <label className="mb-2 block text-sm font-medium">Full name</label>

            <input
              type="text"
              placeholder="John Doe"
              {...register("fullName")}
              className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
            />

            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="mb-2 block text-sm font-medium">Username</label>

            <input
              type="text"
              placeholder="johndoe"
              {...register("username")}
              className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
            />

            {errors.username && (
              <p className="mt-1 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* General error */}
          {errors.root && (
            <p className="text-sm text-red-600">{errors.root.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-orange-500 px-4 py-3 font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create profile"}
          </button>
        </form>
      </div>
    </main>
  );
}
