// src/components/AuthForm.jsx
import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthForm({ type }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();

    if (type === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setMsg(error.message);
      else {
        setMsg("");
        const destination = location.state?.from?.pathname || "/";
        navigate(destination, { replace: true });
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) setMsg(error.message);
      else setMsg("Compte créé ! Vérifie ton email.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md"
    >
      <h2 className="text-xl font-semibold mb-4">
        {type === "login" ? "Connexion" : "Créer un compte"}
      </h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 border rounded-lg mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Mot de passe"
        className="w-full p-3 border rounded-lg mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {msg && <p className="text-red-500 mb-3">{msg}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
      >
        Continuer
      </button>
    </form>
  );
}
