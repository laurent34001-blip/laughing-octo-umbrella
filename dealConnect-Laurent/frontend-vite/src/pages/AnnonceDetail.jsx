import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AnnonceDetail() {
  const { id } = useParams();
  const [annonce, setAnnonce] = useState(null);
  const [loading, setLoading] = useState(true);

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
      }
      setLoading(false);
    }

    fetchAnnonce();
  }, [id]);

  if (loading) return <p className="p-4">Chargement...</p>;
  if (!annonce) return <p className="p-4">Annonce non trouvée.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Image principale */}
      {annonce.image_url && (
        <img
          src={annonce.image_url}
          alt={annonce.titre}
          className="w-full rounded-xl shadow-lg mb-6"
        />
      )}

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

      {/* CTA */}
      <button className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold transition">
        Contacter le vendeur
      </button>
    </div>
  );
}
