// src/pages/Dashboard.jsx
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl">Bienvenue, {user.email}</h1>
      <button
        className="mt-4 bg-red-500 text-white p-3 rounded"
        onClick={() => supabase.auth.signOut()}
      >
        Se déconnecter
      </button>
    </div>
  );
}
