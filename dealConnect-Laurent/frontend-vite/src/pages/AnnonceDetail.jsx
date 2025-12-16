import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export default function AnnonceDetail() {
  const { id } = useParams();
  const [annonce, setAnnonce] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchAnnonce() {
      const { data, error } = await supabase
        .from("annonces")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setAnnonce(data);
        // Récupérer le profil du vendeur
        if (data.user_id) {
          fetchSeller(data.user_id);
        }
      }
      setLoading(false);
    }

    fetchAnnonce();
  }, [id]);

  async function fetchSeller(userId) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    
    const { data: userProfileData } = await supabase
      .from("user_profiles")
      .select("avatar_url")
      .eq("id", userId)
      .single();
    
    setSeller({
      ...profileData,
      avatar_url: userProfileData?.avatar_url || ""
    });
  }

  if (loading) return <p className="p-4">Chargement...</p>;
  if (!annonce) return <p className="p-4">Annonce non trouvée.</p>;

  // Parse images from JSON si c'est un tableau, sinon string unique
  const images = annonce.image_url
    ? typeof annonce.image_url === 'string' && annonce.image_url.startsWith('[')
      ? JSON.parse(annonce.image_url)
      : [annonce.image_url]
    : [];

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Galerie d'images */}
      {images.length > 0 ? (
        <div className="relative bg-gray-200 rounded-xl shadow-lg mb-6 overflow-hidden">
          <img
            src={images[currentImageIndex]}
            alt={annonce.titre}
            className="w-full h-96 object-cover"
          />

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-3 rounded-full transition text-xl"
              >
                ❮
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-3 rounded-full transition text-xl"
              >
                ❯
              </button>

              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
                {currentImageIndex + 1}/{images.length}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="w-full h-96 bg-gray-200 rounded-xl shadow-lg mb-6 flex items-center justify-center text-gray-400">
          Pas d'image
        </div>
      )}

      {/* Miniatures */}
      {images.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden border-2 transition ${
                idx === currentImageIndex
                  ? "border-blue-600"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Infos annonce */}
          <h1 className="text-3xl font-bold mb-2">{annonce.titre}</h1>

          <p className="text-gray-700 text-lg mb-4">{annonce.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-100 rounded-xl">
              <p className="font-semibold text-gray-600">Prix</p>
              <p className="text-xl font-bold">{annonce.prix} €</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-xl">
              <p className="font-semibold text-gray-600">Commission</p>
              <p className="text-xl font-bold">{annonce.commission} €</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-xl">
              <p className="font-semibold text-gray-600">Ville</p>
              <p className="text-xl font-bold">{annonce.ville}</p>
            </div>
          </div>
        </div>

        {/* Profil du vendeur - Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-32">
            <h3 className="text-xl font-bold text-slate-900 mb-4">À propos du vendeur</h3>
            
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              {seller?.avatar_url ? (
                <img
                  src={seller.avatar_url}
                  alt={seller.nom}
                  className="w-20 h-20 rounded-full object-cover mb-3"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
                  {seller?.nom?.charAt(0).toUpperCase() || "V"}
                </div>
              )}
              <p className="text-lg font-semibold text-slate-900">
                {seller?.nom && seller?.prenom ? `${seller.nom} ${seller.prenom}` : seller?.nom || "Vendeur"}
              </p>
              <p className="text-sm text-slate-600">
                Membre depuis le {new Date(annonce.created_at).toLocaleDateString("fr-FR")}
              </p>
            </div>

            {/* Info vendeur */}
            {seller && (
              <div className="space-y-4 mb-6 border-t border-slate-200 pt-4">
                {seller.ville && (
                  <div>
                    <p className="text-sm text-slate-600">Localisation</p>
                    <p className="font-semibold text-slate-900">{seller.ville}</p>
                  </div>
                )}
                {seller.telephone && (
                  <div>
                    <p className="text-sm text-slate-600">Téléphone</p>
                    <p className="font-semibold text-slate-900">{seller.telephone}</p>
                  </div>
                )}
              </div>
            )}

            {/* CTA - Modifier/Supprimer pour le propriétaire, Contacter pour les autres */}
            {user && user.id === annonce.user_id ? (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/annonce/${id}/edit`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition"
                >
                  ✏️ Modifier l'annonce
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
                      await supabase.from("annonces").delete().eq("id", id);
                      navigate("/dashboard");
                    }
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold transition"
                >
                  🗑️ Supprimer l'annonce
                </button>
              </div>
            ) : (
              <button
                className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-semibold transition"
                onClick={() => {
                  if (!user) {
                    navigate("/login", { state: { from: location } });
                    return;
                  }
                  alert("Fonction de contact non-implémentée pour l'instant.");
                }}
              >
                💬 Contacter le vendeur
              </button>
            )}
          </div>
        </div>
      </div>    </div>
  );
}