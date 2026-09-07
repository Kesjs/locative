"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, Globe } from "lucide-react";

export interface CountryOption {
  code: string;
  name: string;
  flag: string;
}

const COUNTRIES_LIST: CountryOption[] = [
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "TG", name: "Togo", flag: "🇹🇬" },
  { code: "SN", name: "Sénégal", flag: "🇸🇳" },
  { code: "US", name: "États-Unis", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "BE", name: "Belgique", flag: "🇧🇪" },
  { code: "GB", name: "Royaume-Uni", flag: "🇬🇧" },
  { code: "GA", name: "Gabon", flag: "🇬🇦" },
  { code: "CG", name: "Congo", flag: "🇨🇬" },
  { code: "CM", name: "Cameroun", flag: "🇨🇲" },
  { code: "ML", name: "Mali", flag: "🇲🇱" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "DE", name: "Allemagne", flag: "🇩🇪" },
  { code: "CH", name: "Suisse", flag: "🇨🇭" },
  { code: "IT", name: "Italie", flag: "🇮🇹" },
  { code: "AUTRE", name: "Autre pays", flag: "🌍" },
];

interface CustomCountrySelectProps {
  value: string;
  onChange: (countryName: string) => void;
}

export function CustomCountrySelect({ value, onChange }: CustomCountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCountry =
    COUNTRIES_LIST.find((c) => c.name.toLowerCase() === value?.toLowerCase()) ||
    COUNTRIES_LIST[0];

  const filtered = COUNTRIES_LIST.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-card hover:bg-slate-50 border border-border rounded-xl text-left shadow-2xs transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-[16px] leading-none shrink-0">{selectedCountry.flag}</span>
          <span className="text-[13.5px] font-medium text-foreground truncate">
            {selectedCountry.name}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-emerald-600" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Champ de recherche */}
          <div className="p-2 border-b border-border bg-slate-50/50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un pays..."
                className="w-full pl-8 pr-3 py-1.5 bg-card border border-border rounded-lg text-[12.5px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-600"
                autoFocus
              />
            </div>
          </div>

          {/* Liste déroulante */}
          <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5">
            {filtered.length === 0 ? (
              <div className="py-4 text-center text-[12px] text-muted-foreground">
                Aucun pays trouvé
              </div>
            ) : (
              filtered.map((country) => {
                const isSelected = selectedCountry.name === country.name;
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      onChange(country.name);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                      isSelected
                        ? "bg-emerald-50 text-emerald-950 font-semibold"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[15px] leading-none">{country.flag}</span>
                      <span className="truncate">{country.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
