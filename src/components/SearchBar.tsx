import { Search, ArrowUpRight } from "lucide-react";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useCallback } from "react";
import type { Suggestion } from "@/hooks/useSearchSuggestions";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  showHint?: boolean | string;
  // Autocomplete props
  suggestions?: Suggestion[];
  suggestionsOpen?: boolean;
  activeIndex?: number;
  onSuggestionSelect?: (text: string) => void;
  onSuggestionsKeyDown?: (e: React.KeyboardEvent) => string | null | undefined;
  onFocus?: () => void;
  onBlur?: () => void;
  onActiveIndexChange?: (index: number) => void;
}

const categoryColors: Record<string, string> = {
  Subject: "bg-primary/10 text-primary",
  Code: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Faculty: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

const SearchBar = ({
  value,
  onChange,
  onKeyPress,
  placeholder = "Search by subject or subject:semester (e.g., 'cyber security', 'dsa:3')...",
  showHint = false,
  suggestions = [],
  suggestionsOpen = false,
  activeIndex = -1,
  onSuggestionSelect,
  onSuggestionsKeyDown,
  onFocus,
  onBlur,
  onActiveIndexChange,
}: SearchBarProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBlur]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && dropdownRef.current) {
      const item = dropdownRef.current.children[activeIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (onSuggestionsKeyDown) {
        const selected = onSuggestionsKeyDown(e);
        if (selected && onSuggestionSelect) {
          onSuggestionSelect(selected);
          return;
        }
      }
      onKeyPress?.(e);
    },
    [onSuggestionsKeyDown, onSuggestionSelect, onKeyPress]
  );

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="relative w-full"
      ref={wrapperRef}
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10 flex items-center justify-center" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          placeholder={placeholder}
          className="pl-12 h-14 text-base bg-background border-border focus-visible:ring-primary rounded-xl shadow-sm"
          autoComplete="off"
          role="combobox"
          aria-expanded={suggestionsOpen}
          aria-autocomplete="list"
          aria-controls="search-suggestions-list"
        />
      </div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {suggestionsOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <div
              ref={dropdownRef}
              id="search-suggestions-list"
              role="listbox"
              className="bg-background/95 backdrop-blur-xl border border-border rounded-xl shadow-lg overflow-hidden max-h-[360px] overflow-y-auto"
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.category}-${suggestion.text}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-100
                    ${index === activeIndex
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50 text-foreground"
                    }
                    ${index < suggestions.length - 1 ? "border-b border-border/50" : ""}
                  `}
                  onMouseEnter={() => onActiveIndexChange?.(index)}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent input blur
                    onSuggestionSelect?.(suggestion.text);
                  }}
                >
                  <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="truncate flex-1 text-sm">
                    {suggestion.text}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${categoryColors[suggestion.category] || ""
                      }`}
                  >
                    {suggestion.category}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showHint && !suggestionsOpen && (
        <div className="mt-2 text-xs text-muted-foreground italic">
          <strong>Examples:</strong>{" "}
          {typeof showHint === "string"
            ? showHint
            : `"dsa:3" | "data structures" | "cyber security"`}
        </div>
      )}
    </motion.div>
  );
};

export default SearchBar;
