import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export default function CreateAnnonce() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    titre: "",
    description: "",
    ville: "",
    prix: "",
    commission: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState("");

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      setStatus("Vous devez être connecté pour créer une annonce.");
      return;
    }

    setStatus("Envoi en cours...");

    let imageURL = null;

    // 1️⃣ UPLOAD IMAGE
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      console.log("file name : ",fileName);

      const { data: uploaded, error: uploadError } = await supabase.storage
        .from("annonces")
        .upload(fileName, imageFile);

      if (uploadError) {
        setStatus("Erreur upload image : " + uploadError.message);
        return;
      }

      // URL publique
      const { data } = supabase.storage
        .from("annonces")
        .getPublicUrl(uploaded.path);

      imageURL = data.publicUrl;
    }
console.log("image url  : ",imageURL);
    // 2️⃣ INSERT DANS LA DB
    const { error } = await supabase.from("annonces").insert({
      ...form,
      prix: Number(form.prix),
      commission: Number(form.commission),
      image_url: imageURL,
      user_id: user.id,
    });

    if (error) {
      setStatus("Erreur d’enregistrement : " + error.message);
      return;
    }

    setStatus("Annonce créée avec succès !");
    setForm({
      titre: "",
      description: "",
      ville: "",
      prix: "",
      commission: "",
    });
    setImageFile(null);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Créer une annonce</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md space-y-4"
      >
        <input
          type="text"
          name="titre"
          value={form.titre}
          onChange={updateField}
          placeholder="Titre"
          className="w-full border p-3 rounded-lg"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={updateField}
          placeholder="Description"
          className="w-full border p-3 rounded-lg"
          rows={4}
          required
        />

        <input
          type="text"
          name="ville"
          value={form.ville}
          onChange={updateField}
          placeholder="Ville"
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="number"
          name="prix"
          value={form.prix}
          onChange={updateField}
          placeholder="Prix (€)"
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="number"
          name="commission"
          value={form.commission}
          onChange={updateField}
          placeholder="Commission (€)"
          className="w-full border p-3 rounded-lg"
          required
        />

        <div>
          <label className="font-semibold">Image (optionnel)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="w-full mt-2"
          />
        </div>

        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          type="submit"
        >
          Publier l’annonce
        </button>

        {status && (
          <p className="text-center text-gray-600 mt-2">{status}</p>
        )}
      </form>
    </div>
  );
}
