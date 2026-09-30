"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const Dashboard = () => {

  const router = useRouter();

  async function logout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/auth");
  }
  return (
    <div>
      <h1> welcome to the dashboard</h1>
      <button
        type="button"
        onClick={logout}
        className="rounded-md bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
