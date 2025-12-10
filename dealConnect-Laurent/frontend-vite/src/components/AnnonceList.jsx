import React from "react";
import AnnonceCard from "./AnnonceCard";

export default function AnnonceList({ annonces }) {
  if (annonces.length === 0) {
    return (
      <p className="text-gray-500 text-center mt-10">
        Aucune annonce trouvée…
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
      {annonces.map((a) => (
        <AnnonceCard key={a.id} annonce={a} />
      ))}
    </div>
  );
}
