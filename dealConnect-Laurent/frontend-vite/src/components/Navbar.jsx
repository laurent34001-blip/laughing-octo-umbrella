import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* LOGO */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        DealConnect
      </Link>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
          Accueil
        </Link>

        {!user && (
          <>
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Connexion
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
            >
              Inscription
            </Link>
          </>
        )}

        {user && (
          <>
          <Link
            to="/creer-annonce"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + Nouvelle annonce
          </Link>

            <Link
              to="/dashboard"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Dashboard
            </Link>

            <button
              onClick={() => supabase.auth.signOut()}
              className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
            >
              Déconnexion
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
