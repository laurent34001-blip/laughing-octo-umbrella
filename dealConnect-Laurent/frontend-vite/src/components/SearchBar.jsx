import React from "react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="🔍 Rechercher une annonce..."
        className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
