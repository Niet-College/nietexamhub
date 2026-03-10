import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import type { DisplayPaper } from "@/types/examPaper";

export interface Suggestion {
    text: string;
    category: "Subject" | "Code" | "Faculty";
}

export function useSearchSuggestions(
    papers: DisplayPaper[],
    query: string,
    maxResults = 8
) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();

    // Build a deduplicated pool of searchable terms (only once per paper set)
    const pool = useMemo(() => {
        const subjectNames = new Map<string, string>(); // normalized key -> display text
        const subjectCodes = new Map<string, string>();
        const facultyNames = new Map<string, string>();

        // Collapse whitespace + trim for robust dedup
        const norm = (s: string) => s.replace(/\s+/g, " ").trim();

        for (const p of papers) {
            const name = norm(p.subject_name || "");
            if (name) subjectNames.set(name.toLowerCase(), name);

            const code = norm(p.subject_code || "");
            if (code) subjectCodes.set(code.toLowerCase(), code);

            const faculty = norm(p.faculty_name || "");
            if (faculty) facultyNames.set(faculty.toLowerCase(), faculty);
        }

        // Remove codes that duplicate a subject name (same text, different category)
        for (const key of subjectCodes.keys()) {
            if (subjectNames.has(key)) subjectCodes.delete(key);
        }

        return {
            subjects: Array.from(subjectNames.entries()), // [lowercase, original][]
            codes: Array.from(subjectCodes.entries()),
            faculty: Array.from(facultyNames.entries()),
        };
    }, [papers]);

    // Debounced query
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setDebouncedQuery(query);
        }, 150);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query]);

    // Generate suggestions based on debounced query
    const suggestions = useMemo(() => {
        const q = debouncedQuery.trim().toLowerCase();
        if (q.length < 1) return [];

        const results: Suggestion[] = [];
        const seen = new Set<string>();

        const addMatch = (
            text: string,
            category: Suggestion["category"]
        ) => {
            const key = text.toLowerCase();
            if (seen.has(key)) return;
            seen.add(key);
            results.push({ text, category });
        };

        // 1. Prefix matches first (starts with query)
        for (const [lower, original] of pool.subjects) {
            if (results.length >= maxResults) break;
            if (lower.startsWith(q)) addMatch(original, "Subject");
        }
        for (const [lower, original] of pool.codes) {
            if (results.length >= maxResults) break;
            if (lower.startsWith(q)) addMatch(original, "Code");
        }
        for (const [lower, original] of pool.faculty) {
            if (results.length >= maxResults) break;
            if (lower.startsWith(q)) addMatch(original, "Faculty");
        }

        // 2. Substring / word matches (contains query)
        if (results.length < maxResults) {
            for (const [lower, original] of pool.subjects) {
                if (results.length >= maxResults) break;
                if (!lower.startsWith(q) && lower.includes(q)) addMatch(original, "Subject");
            }
        }
        if (results.length < maxResults) {
            for (const [lower, original] of pool.codes) {
                if (results.length >= maxResults) break;
                if (!lower.startsWith(q) && lower.includes(q)) addMatch(original, "Code");
            }
        }
        if (results.length < maxResults) {
            for (const [lower, original] of pool.faculty) {
                if (results.length >= maxResults) break;
                if (!lower.startsWith(q) && lower.includes(q)) addMatch(original, "Faculty");
            }
        }

        // 3. Word-start matches (any word in the name starts with query)
        if (results.length < maxResults) {
            const qWords = q.split(/\s+/);
            for (const [lower, original] of pool.subjects) {
                if (results.length >= maxResults) break;
                if (seen.has(lower)) continue;
                const words = lower.split(/\s+/);
                const allMatch = qWords.every((qw) =>
                    words.some((w) => w.startsWith(qw))
                );
                if (allMatch) addMatch(original, "Subject");
            }
        }

        return results;
    }, [debouncedQuery, pool, maxResults]);

    // Reset active index when suggestions change
    useEffect(() => {
        setActiveIndex(-1);
    }, [suggestions]);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => {
        setIsOpen(false);
        setActiveIndex(-1);
    }, []);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (!isOpen || suggestions.length === 0) return null;

            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setActiveIndex((prev) =>
                        prev < suggestions.length - 1 ? prev + 1 : 0
                    );
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setActiveIndex((prev) =>
                        prev > 0 ? prev - 1 : suggestions.length - 1
                    );
                    break;
                case "Enter":
                    if (activeIndex >= 0 && activeIndex < suggestions.length) {
                        e.preventDefault();
                        return suggestions[activeIndex].text;
                    }
                    break;
                case "Escape":
                    e.preventDefault();
                    close();
                    break;
            }
            return null;
        },
        [isOpen, suggestions, activeIndex, close]
    );

    return {
        suggestions: isOpen ? suggestions : [],
        isOpen: isOpen && suggestions.length > 0,
        activeIndex,
        open,
        close,
        handleKeyDown,
        setActiveIndex,
    };
}
