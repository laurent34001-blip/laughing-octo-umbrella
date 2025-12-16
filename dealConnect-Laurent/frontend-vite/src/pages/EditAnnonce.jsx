import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export default function EditAnnonce() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    titre: "",
    description: "",
    ville: "",
    prix: "",
    commission: "",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnonce();
  }, [id]);

  async function fetchAnnonce() {
    const { data, error } = await supabase
      .from("annonces")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      setStatus("Annonce non trouvée");
      return;
    }

    // Vérifier que c'est l'annonce de l'utilisateur
    if (data.user_id !== user?.id) {
      navigate("/");
      return;
    }

    setForm({
      titre: data.titre,
      description: data.description,
      ville: data.ville,
      prix: data.prix,
      commission: data.commission,
    });

    // Parse les images existantes
    const images =
      typeof data.image_url === "string" && data.image_url.startsWith("[")
        ? JSON.parse(data.image_url)
        : data.image_url
          ? [data.image_url]
          : [];
    setExistingImages(images);
    setLoading(false);
  }

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImageSelection(e) {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
  }

  function removeExistingImage(index) {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  }

  function removeNewImage(index) {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("Envoi en cours...");

    const imageURLs = [...existingImages];

    // Upload nouvelles images
    if (imageFiles.length > 0) {
      for (const imageFile of imageFiles) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${user.id}_${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

        const { data: uploaded, error: uploadError } = await supabase.storage
          .from("annonces")
          .upload(fileName, imageFile);

        if (uploadError) {
          setStatus("Erreur upload image : " + uploadError.message);
          return;
        }

        const { data } = supabase.storage
          .from("annonces")
          .getPublicUrl(uploaded.path);

        imageURLs.push(data.publicUrl);
      }
    }

    // Update annonce
    const { error } = await supabase
      .from("annonces")
      .update({
        titre: form.titre,
        description: form.description,
        ville: form.ville,
        prix: Number(form.prix),
        commission: Number(form.commission),
        image_url: imageURLs.length > 0 ? JSON.stringify(imageURLs) : null,
      })
      .eq("id", id);

    if (error) {
      setStatus("Erreur d'enregistrement : " + error.message);
      return;
    }

    setStatus("Annonce mise à jour avec succès !");
    setTimeout(() => {
      navigate(`/annonce/${id}`);
    }, 1500);
  }

  if (loading) return <p className="p-6">Chargement...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Modifier l'annonce</h1>

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

        {/* Images existantes */}
        {existingImages.length > 0 && (
          <div>
            <label className="font-semibold block mb-2">
              Images actuelles ({existingImages.length})
            </label>
            <div className="grid grid-cols-2 gap-3">
              {existingImages.map((img, index) => (
                <div
                  key={index}
                  className="relative border rounded-lg overflow-hidden bg-gray-100"
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs hover:bg-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nouvelles images */}
        <div>
          <label className="font-semibold block mb-2">
            Ajouter des images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelection}
            className="w-full mt-2"
          />

          {imageFiles.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                {imageFiles.length} nouvelle(s) image(s)
              </p>
              <div className="grid grid-cols-2 gap-3">
                {imageFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative border rounded-lg overflow-hidden bg-gray-100"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs hover:bg-red-700"
                    >
                      ✕
                    </button>
                    <p className="text-xs text-gray-600 p-1 truncate">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            type="submit"
          >
            Mettre à jour l'annonce
          </button>
          <button
            className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 transition"
            type="button"
            onClick={() => navigate(`/annonce/${id}`)}
          >
            Annuler
          </button>
        </div>

        {status && (
          <p className={`text-center mt-2 ${status.includes("succès") ? "text-green-600" : "text-red-600"}`}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
}
