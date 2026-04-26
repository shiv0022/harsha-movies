"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GENRES, LANGUAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onGenreFilter: (genre: string | null) => void;
  onLanguageFilter: (language: string | null) => void;
  activeGenre: string | null;
  activeLanguage: string | null;
}

export function SearchFilter({
  onSearch,
  onGenreFilter,
  onLanguageFilter,
  activeGenre,
  activeLanguage,
}: SearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="container-app py-8">
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input
            placeholder="Search movies..."
            className="pl-10 bg-surface border-border"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 px-4 h-11 rounded-lg border border-border text-sm font-medium transition-colors",
            showFilters ? "bg-accent/20 text-accent border-accent/30" : "bg-surface-light text-muted hover:text-foreground"
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 space-y-4 glass rounded-xl p-4">
          <div>
            <p className="text-xs font-medium text-muted mb-2 uppercase tracking-wider">Genre</p>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!activeGenre ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onGenreFilter(null)}
              >
                All
              </Badge>
              {GENRES.slice(0, 10).map((g) => (
                <Badge
                  key={g}
                  variant={activeGenre === g ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onGenreFilter(g)}
                >
                  {g}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted mb-2 uppercase tracking-wider">Language</p>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={!activeLanguage ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onLanguageFilter(null)}
              >
                All
              </Badge>
              {LANGUAGES.slice(0, 6).map((l) => (
                <Badge
                  key={l}
                  variant={activeLanguage === l ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => onLanguageFilter(l)}
                >
                  {l}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
