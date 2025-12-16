import React, { useState } from "react";

const CATEGORIES = [
  { id: "tous", label: "Tous", emoji: "🔍" },
  { id: "immobilier", label: "Immobilier", emoji: "🏠" },
  { id: "auto", label: "Auto", emoji: "🚗" },
  { id: "electronics", label: "Électronique", emoji: "📱" },
  { id: "vetements", label: "Vêtements", emoji: "👔" },
  { id: "meuble", label: "Meubles", emoji: "🛋️" },
  { id: "livre", label: "Livres", emoji: "📚" },
  { id: "sport", label: "Sport", emoji: "⚽" },
  { id: "autre", label: "Autre", emoji: "📦" },
];

export default function SearchBar({ value, onChange, selectedCategory, onCategoryChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const activeCategory = CATEGORIES.find(c => c.id === (selectedCategory || "tous")) || CATEGORIES[0];

  return (
    <div className="mb-6 space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="🔍 Rechercher une annonce..."
          className="w-full p-3 pl-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2">
        {/* Category Dropdown for Mobile */}
        <div className="md:hidden w-full">
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-50 transition"
            >
              <span>{activeCategory.emoji} {activeCategory.label}</span>
              <span className="text-gray-600">▼</span>
            </button>
            
            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onCategoryChange(cat.id === "tous" ? "" : cat.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-blue-100 transition ${
                      (cat.id === "tous" && !selectedCategory) || cat.id === selectedCategory
                        ? "bg-blue-200 font-semibold"
                        : ""
                    }`}
                  >
                    {cat.emoji} {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Buttons for Desktop */}
        <div className="hidden md:flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id === "tous" ? "" : cat.id)}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                (cat.id === "tous" && !selectedCategory) || cat.id === selectedCategory
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
