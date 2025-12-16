// src/pages/Dashboard.jsx
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [annonces, setAnnonces] = useState([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [formData, setFormData] = useState({ nom: "", prenom: "", telephone: "", ville: "", avatar_url: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchAnnonces();
    }
  }, [user]);

  const fetchProfile = async () => {
    // Récupérer data de profiles et user_profiles
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    const { data: userProfileData } = await supabase
      .from("user_profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();
    
    const merged = {
      nom: profileData?.nom || "",
      prenom: profileData?.prenom || "",
      telephone: profileData?.telephone || "",
      ville: profileData?.ville || "",
      avatar_url: userProfileData?.avatar_url || ""
    };
    
    setProfile(merged);
    setFormData(merged);
  };

  const fetchAnnonces = async () => {
    const { data } = await supabase
      .from("annonces")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    setAnnonces(data || []);
    setLoading(false);
  };

  const handleAvatarUpload = async (file) => {
    if (!file) return;
    
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}_avatar.${fileExt}`;
      
      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(fileName, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from("profiles")
        .getPublicUrl(fileName);
      
      // Update user_profiles with avatar URL
      await supabase
        .from("user_profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("id", user.id);
      
      // Update form data with avatar URL
      setFormData({ ...formData, avatar_url: data.publicUrl });
      setAvatarFile(null);
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
    } finally {
      setUploading(false);
    }
  };

  const updateProfile = async () => {
    setError(null);
    setSuccess(null);
    setSavingProfile(true);
    
    try {
      // Mettre à jour profiles table
      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({ 
          id: user.id, 
          nom: formData.nom,
          prenom: formData.prenom,
          telephone: formData.telephone,
          ville: formData.ville
        });
      
      if (updateError) {
        setError(updateError.message || "Erreur lors de la mise à jour");
        console.error("Erreur Supabase:", updateError);
        setSavingProfile(false);
        return;
      }
      
      await fetchProfile();
      setEditingProfile(false);
      setSuccess("Profil mis à jour avec succès!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour");
      console.error("Erreur:", err);
    } finally {
      setSavingProfile(false);
    }
  };

  const deleteAnnonce = async (id) => {
    await supabase.from("annonces").delete().eq("id", id);
    await fetchAnnonces();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-slate-900">Tableau de Bord</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section Profil - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-32">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Mon Profil</h2>
              
              {!editingProfile ? (
                <div className="space-y-4">
                  <div className="relative group">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.nom}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {profile?.nom?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Nom et Prénom</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {profile?.nom && profile?.prenom ? `${profile.nom} ${profile.prenom}` : "Non renseigné"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Email</p>
                    <p className="text-lg font-semibold text-slate-900">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Téléphone</p>
                    <p className="text-lg font-semibold text-slate-900">{profile?.telephone || "Non renseigné"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Ville</p>
                    <p className="text-lg font-semibold text-slate-900">{profile?.ville || "Non renseigné"}</p>
                  </div>
                  <button
                    onClick={() => setEditingProfile(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    ✏️ Modifier
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                      {success}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Photo de profil</label>
                    <div className="flex items-center gap-4">
                      {avatarFile ? (
                        <img
                          src={URL.createObjectURL(avatarFile)}
                          alt="Preview"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : formData.avatar_url ? (
                        <img
                          src={formData.avatar_url}
                          alt={formData.nom}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                          📷
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAvatarFile(file);
                            handleAvatarUpload(file);
                          }
                        }}
                        disabled={uploading}
                        className="flex-1"
                      />
                    </div>
                    {uploading && <p className="text-sm text-blue-600 mt-1">⏳ Téléchargement en cours...</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                    <input
                      type="text"
                      value={formData.nom || ""}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                    <input
                      type="text"
                      value={formData.prenom || ""}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.telephone || ""}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ville</label>
                    <input
                      type="text"
                      value={formData.ville || ""}
                      onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={updateProfile}
                      disabled={savingProfile || uploading}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      {savingProfile ? (
                        <>⏳ Enregistrement...</>
                      ) : (
                        <>✅ Enregistrer</>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingProfile(false);
                        setError(null);
                        setSuccess(null);
                      }}
                      disabled={savingProfile || uploading}
                      className="flex-1 bg-slate-300 hover:bg-slate-400 disabled:bg-gray-300 disabled:cursor-not-allowed text-slate-900 font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section Annonces - Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Mes Annonces</h2>
                <button
                  onClick={() => navigate("/creer-annonce")}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition"
                >
                  ➕ Nouvelle annonce
                </button>
              </div>

              {loading ? (
                <p className="text-center text-slate-600 py-12">Chargement...</p>
              ) : annonces.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-600 text-lg mb-4">Vous n'avez pas encore publié d'annonce</p>
                  <button
                    onClick={() => navigate("/creer-annonce")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                  >
                    Créer votre première annonce
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {annonces.map((annonce) => {
                    const images = typeof annonce.image_url === "string" && annonce.image_url.startsWith("[")
                      ? JSON.parse(annonce.image_url)
                      : annonce.image_url ? [annonce.image_url] : [];
                    
                    return (
                      <div key={annonce.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-lg transition flex gap-4">
                        {images[0] && (
                          <img
                            src={images[0]}
                            alt={annonce.titre}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-900">{annonce.titre}</h3>
                          <p className="text-slate-600 text-sm mb-2">{annonce.description?.substring(0, 100)}...</p>
                          <p className="text-blue-600 font-bold">{annonce.prix} €</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Publié le {new Date(annonce.created_at).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/annonce/${annonce.id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
                            title="Voir"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => deleteAnnonce(annonce.id)}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer avec Déconnexion */}
        <div className="mt-12 text-center pb-8">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg flex items-center gap-2 mx-auto transition"
          >
            🚪 Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
