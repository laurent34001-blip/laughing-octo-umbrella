import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import AnnonceList from "../components/AnnonceList";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [annonces, setAnnonces] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnonces();
  }, [search]);

  async function fetchAnnonces() {
    setLoading(true);

    let query = supabase
      .from("annonces")
      .select("*")
      .order("created_at", { ascending: false });

    if (search.trim()) {
      query = query.ilike("titre", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Erreur chargement annonces :", error);
    } else {
      setAnnonces(data);
    }

    setLoading(false);
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Toutes les annonces</h1>

      <SearchBar value={search} onChange={setSearch} />

      {loading ? (
        <p className="text-center text-gray-400">Chargement...</p>
      ) : (
        <AnnonceList annonces={annonces} />
      )}
    </div>
  );
}
