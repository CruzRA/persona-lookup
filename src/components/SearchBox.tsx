"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";

interface SearchBoxProps {
  initialUsers: User[];
}

export function SearchBox({ initialUsers }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const q = query.toLowerCase();
    const filtered = initialUsers.filter((user) => {
      const fullName = `${user.name.first_name} ${user.name.last_name}`.toLowerCase();
      return (
        user.user_id.toLowerCase().includes(q) ||
        fullName.includes(q) ||
        user.email.toLowerCase().includes(q)
      );
    }).slice(0, 10);

    setResults(filtered);
    setIsOpen(filtered.length > 0);
    setSelectedIndex(0);
  }, [query, initialUsers]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (results[selectedIndex]) {
          router.push(`/user/${results[selectedIndex].user_id}`);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search by name, email, or user ID..."
          className="w-full px-5 py-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg 
                     text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]
                     focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]
                     transition-all text-base"
          autoComplete="off"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-sm">
          <kbd className="px-2 py-1 bg-[var(--bg-tertiary)] rounded border border-[var(--border)] text-xs">
            ↵
          </kbd>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg shadow-2xl overflow-hidden">
          {results.map((user, index) => (
            <button
              key={user.user_id}
              onClick={() => router.push(`/user/${user.user_id}`)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full px-5 py-3 flex items-center gap-4 text-left transition-colors
                ${index === selectedIndex ? "bg-[var(--bg-tertiary)]" : ""}
                hover:bg-[var(--bg-tertiary)]`}
            >
              <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-medium">
                {user.name.first_name[0]}{user.name.last_name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {user.name.first_name} {user.name.last_name}
                </div>
                <div className="text-sm text-[var(--text-secondary)] truncate">
                  {user.email}
                </div>
              </div>
              <div className="text-xs text-[var(--text-secondary)] font-mono">
                {user.user_id}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
