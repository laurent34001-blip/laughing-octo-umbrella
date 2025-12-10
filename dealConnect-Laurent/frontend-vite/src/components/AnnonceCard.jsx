import React from "react";
import { Link } from "react-router-dom";

export default function AnnonceCard({ annonce }) {
  return (
    <Link
      to={`/annonce/${annonce.id}`}
      className="block hover:scale-[1.02] transition"
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer">
        {annonce.image_url && (
          <img
            src={annonce.image_url}
            alt=""
            className="h-48 w-full object-cover"
          />
        )}

        <div className="p-4">
          <h3 className="font-semibold text-lg">{annonce.titre}</h3>
          <p className="text-gray-500 text-sm mb-2">{annonce.ville}</p>

          <div className="flex justify-between items-center mt-4">
            <p className="font-bold text-blue-600">{annonce.prix} €</p>
            <p className="text-sm text-green-600">
              + {annonce.commission} € commission
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
//console.log("IMAGE URL:", annonce.image_url)
}

