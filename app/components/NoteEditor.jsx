"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

// Simple debounce utility
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export default function NoteEditor({ noteId, initialData, logoText = "NoteSpace", onContentChange, onTitleChange, onContentChange: onHomepageContentChange }) {
    const textareaRef = useRef(null);
    const [value, setValue] = useState(initialData?.content || "");
    const [title, setTitle] = useState(initialData?.title || "");
    const [isLoading, setIsLoading] = useState(!initialData && !!noteId);
    const [isSaving, setIsSaving] = useState(false);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    // Load initial data if not provided (fallback)
    useEffect(() => {
        if (!noteId || initialData) return;

        const loadNote = async () => {
            setIsLoading(true);
            try {
                // Now using cookie, so no need for userId param
                const res = await fetch(`/api/note/${noteId}`);
                const data = await res.json();

                if (data.success) {
                    setValue(data.data.content || "");
                    setTitle(data.data.title || "");
                }
            } catch (error) {
                console.error("Failed to load note:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadNote();
    }, [noteId, initialData]);

    // Save function
    const saveNote = async (newContent, newTitle, newLogo) => {
        if (!noteId) return;
        setIsSaving(true);
        try {
            await fetch(`/api/note/${noteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newContent,
                    title: newTitle,
                    logoText: newLogo
                }),
            });
        } catch (error) {
            console.error("Failed to save:", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Debounced save
    const debouncedSave = useCallback(debounce((content, title, logo) => saveNote(content, title, logo), 1000), [noteId]);

    // Debounced content change callback for homepage
    const debouncedContentChange = useCallback(debounce((content, title) => {
        if (onContentChange) {
            onContentChange(content, title);
        }
    }, 500), [onContentChange]);

    useEffect(() => {
        adjustHeight();

        // Notify parent of title/content changes immediately (for delete icon state)
        if (onTitleChange) {
            onTitleChange(title);
        }
        if (onContentChange && noteId) {
            onContentChange(value);
        }

        // If we have a noteId, save to database
        if (noteId && !isLoading) {
            debouncedSave(value, title, logoText);
        }

        // If we DON'T have a noteId but have onHomepageContentChange (homepage), trigger callback
        if (!noteId && onHomepageContentChange) {
            debouncedContentChange(value, title);
        }
    }, [value, title, logoText]);

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading...</div>;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mx-auto mt-24 p-4 md:p-8"
        >
            {/* Simple Title Input */}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title"
                className="w-full bg-transparent text-3xl font-bold text-fg mb-4 focus:outline-none"
            />

            <div className="relative">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Start typing your note..."
                    className="w-full bg-transparent text-lg md:text-xl text-fg focus:outline-none resize-none leading-relaxed overflow-hidden min-h-[50vh] placeholder:text-gray-400 dark:placeholder:text-gray-600 font-inter-regular"
                    spellCheck="false"
                />
                {isSaving && (
                    <div className="absolute top-0 right-0 text-xs text-gray-400">
                        Saving...
                    </div>
                )}
            </div>
        </motion.div>
    );
}
