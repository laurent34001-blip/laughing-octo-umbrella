import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AnnonceCard({ annonce }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [sellerName, setSellerName] = useState(null);
  const [sellerAvatar, setSellerAvatar] = useState(null);

  useEffect(() => {
    fetchSellerInfo();
  }, [annonce.user_id]);

  async function fetchSellerInfo() {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("nom, prenom")
      .eq("id", annonce.user_id)
      .single();
    
    const { data: userProfileData } = await supabase
      .from("user_profiles")
      .select("avatar_url")
      .eq("id", annonce.user_id)
      .single();
    
    setSellerName(profileData?.nom && profileData?.prenom 
      ? `${profileData.nom} ${profileData.prenom}` 
      : profileData?.nom || "Vendeur");
    setSellerAvatar(userProfileData?.avatar_url || null);
  }

  // Parse images from JSON si c'est un tableau, sinon string unique
  const images = annonce.image_url
    ? typeof annonce.image_url === 'string' && annonce.image_url.startsWith('[')
      ? JSON.parse(annonce.image_url)
      : [annonce.image_url]
    : [];

  const nextImage = (e) => {
    e.preventDefault();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e) => {
    e.preventDefault();
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <Link
      to={`/annonce/${annonce.id}`}
      className="block hover:scale-[1.02] transition"
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer">
        {/* Image Gallery */}
        {images.length > 0 ? (
          <div className="relative h-48 bg-gray-200 overflow-hidden group">
            <img
              src={images[currentImageIndex]}
              alt=""
              className="h-48 w-full object-cover"
            />

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  ❮
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  ❯
                </button>

                {/* Image counter */}
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {currentImageIndex + 1}/{images.length}
                </div>

                {/* Dots indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 w-2 rounded-full ${
                        idx === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
            Pas d'image
          </div>
        )}

        <div className="p-4">
          <h3 className="font-semibold text-lg">{annonce.titre}</h3>
          <p className="text-gray-500 text-sm mb-2">{annonce.ville}</p>

          <div className="flex justify-between items-center mt-4 mb-3">
            <p className="font-bold text-blue-600">{annonce.prix} €</p>
            <p className="text-sm text-green-600">
              + {annonce.commission} € commission
            </p>
          </div>

          {/* Seller Name with Avatar */}
          <div className="pt-3 border-t border-gray-200 flex items-center gap-2">
            {sellerAvatar ? (
              <img
                src={sellerAvatar}
                alt={sellerName}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {sellerName?.charAt(0).toUpperCase() || "V"}
              </div>
            )}
            <p className="text-xs text-gray-600">Par <span className="font-semibold text-gray-800">{sellerName}</span></p>
          </div>
        </div>
      </div>
    </Link>
  );
}

