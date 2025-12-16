import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    const { data: userProfileData } = await supabase
      .from("user_profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();
    
    setUserProfile({
      avatar_url: userProfileData?.avatar_url || ""
    });
  };

  return (
    <nav className="w-full bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">DC</span>
          </div>
          <span className="text-2xl font-bold text-white hidden sm:inline">DealConnect</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          {!user && (
            <>
              <Link
                to="/login"
                state={{ from: location }}
                className="px-4 py-2 text-gray-300 hover:text-white transition font-medium"
              >
                Connexion
              </Link>

              <Link
                to="/register"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition font-medium"
              >
                Inscription
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                to="/creer-annonce"
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition font-semibold flex items-center gap-2"
              >
                <span className="text-lg">+</span> Nouvelle annonce
              </Link>

              <Link
                to="/dashboard"
                className="px-4 py-2 text-gray-300 hover:text-white transition font-medium"
              >
                Tableau de bord
              </Link>

              {/* Profile Icon */}
              <Link
                to="/dashboard"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold hover:shadow-lg transition overflow-hidden"
                title="Profil"
              >
                {userProfile?.avatar_url ? (
                  <img
                    src={userProfile.avatar_url}
                    alt={userProfile.nom}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    👤
                  </div>
                )}
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white hover:text-gray-300 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-2">
          {!user && (
            <>
              <Link
                to="/login"
                state={{ from: location }}
                className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Connexion
              </Link>

              <Link
                to="/register"
                className="block px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Inscription
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                to="/creer-annonce"
                className="block px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded font-semibold hover:shadow-lg transition"
                onClick={() => setIsMenuOpen(false)}
              >
                + Nouvelle annonce
              </Link>

              <Link
                to="/dashboard"
                className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 rounded transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Tableau de bord
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
