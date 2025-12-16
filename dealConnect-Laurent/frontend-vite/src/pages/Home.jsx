import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import AnnonceList from "../components/AnnonceList";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const [annonces, setAnnonces] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchAnnonces();
  }, [search, category]);

  async function fetchAnnonces() {
    setLoading(true);

    let query = supabase
      .from("annonces")
      .select("*")
      .order("created_at", { ascending: false });

    if (search.trim()) {
      query = query.ilike("titre", `%${search}%`);
    }

    if (category) {
      query = query.eq("categorie", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erreur chargement annonces :", error);
    } else {
      setAnnonces(data);
    }

    setLoading(false);
  }

  const handleCreateAnnonce = () => {
    if (!user) {
      navigate("/register");
    } else {
      navigate("/creer-annonce");
    }
  };

  return (
    <div>
      {/* Hero Section - Figma Style */}
      <div className="relative overflow-hidden bg-white">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-40 -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-50 to-cyan-50 rounded-full blur-3xl opacity-30 -ml-40 -mb-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span className="text-sm font-semibold text-blue-600">Nouvelle plateforme</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Achetez et vendez en toute <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">sécurité</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  DealConnect est votre plateforme de trading peer-to-peer. Trouvez les meilleures affaires ou veillez vos articles en quelques clics.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="#annonces"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 text-center"
                >
                  Voir les annonces
                </a>
                <button
                  onClick={handleCreateAnnonce}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-900 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 text-center"
                >
                  Créer une annonce
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">1.2K+</p>
                  <p className="text-sm text-gray-600">Utilisateurs actifs</p>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">5K+</p>
                  <p className="text-sm text-gray-600">Annonces publiées</p>
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">98%</p>
                  <p className="text-sm text-gray-600">Satisfaction</p>
                </div>
              </div>
            </div>

            {/* Right Content - Illustration Area */}
            <div className="relative hidden lg:block">
              <div className="space-y-4">
                {/* Card 1 */}
                <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100 ml-8">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🔐</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Transactions sécurisées</p>
                      <p className="text-sm text-gray-600">Paiement protégé</p>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100 -ml-8 mt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Rapide et facile</p>
                      <p className="text-sm text-gray-600">Publiez en 30 secondes</p>
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-gray-100 ml-12 mt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Communauté fiable</p>
                      <p className="text-sm text-gray-600">Vendeurs vérifiés</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6" id="annonces">
        <h2 className="text-3xl font-bold mb-6">Toutes les annonces</h2>

        <SearchBar 
          value={search} 
          onChange={setSearch}
          selectedCategory={category}
          onCategoryChange={setCategory}
        />

        {loading ? (
          <p className="text-center text-gray-400">Chargement...</p>
        ) : (
          <AnnonceList annonces={annonces} />
        )}
      </div>
    </div>
  );
}
