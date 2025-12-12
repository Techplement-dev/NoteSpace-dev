"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/NavBar";
import NoteEditor from "@/app/components/NoteEditor";

export default function NotePage({ params }) {
    const router = useRouter();
    const [noteId, setNoteId] = useState(null);
    const [customUrl, setCustomUrl] = useState(null);
    const [initialData, setInitialData] = useState(null);
    const [logoText, setLogoText] = useState("NoteSpace");
    const [currentTitle, setCurrentTitle] = useState("");
    const [currentContent, setCurrentContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);
    const [updatedAt, setUpdatedAt] = useState(null);
    const isRenaming = useRef(false);

    useEffect(() => {
        // Unwrap params
        (async () => {
            const unwrappedParams = await params;
            setNoteId(unwrappedParams.id);
        })();
    }, [params]);

    useEffect(() => {
        if (!noteId) return;

        // Fetch note data
        const fetchNote = async () => {
            try {
                // If we are in the middle of renaming, don't fetch or create new notes
                if (isRenaming.current) return;

                const res = await fetch(`/api/note/${noteId}`);
                if (res.status === 404) {
                    // Check again if renaming started while fetching
                    if (isRenaming.current) return;

                    // Note deleted (likely expired). Create a new note and redirect to it.
                    try {
                        const createRes = await fetch('/api/note', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ title: '', content: '', logoText: 'NoteSpace' }),
                        });

                        const created = await createRes.json();
                        if (created.success && created.data && created.data.customUrl) {
                            // Replace current URL with new customUrl
                            router.replace(`/note/${created.data.customUrl}`);
                            return;
                        } else {
                            // If note creation failed, mark disabled to show expired UI message
                            setIsDisabled(true);
                            setIsLoading(false);
                            return;
                        }
                    } catch (err) {
                        console.error('Failed to create new note after expiry:', err);
                        setIsDisabled(true);
                        setIsLoading(false);
                        return;
                    }
                }
                const data = await res.json();

                if (data.success) {
                    setInitialData(data.data);
                    setCustomUrl(data.data.customUrl);
                    setLogoText(data.data.logoText || "NoteSpace");
                    setCurrentTitle(data.data.title || "");
                    setCurrentContent(data.data.content || "");
                    setUpdatedAt(data.data.updatedAt);
                }
            } catch (error) {
                console.error("Failed to fetch note:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNote();
    }, [noteId]);

    // Check for expiry every minute
    useEffect(() => {
        if (!updatedAt || isDisabled) return;

        const checkExpiry = () => {
            const now = new Date();
            const lastUpdate = new Date(updatedAt);
            const diff = now - lastUpdate;
            const isEmpty =
                (!currentTitle || currentTitle.trim() === "") &&
                (!currentContent || currentContent.trim() === "") &&
                (logoText === "NoteSpace");

            if (diff > 5 * 60 * 1000 && isEmpty) {
                setIsDisabled(true);
            }
        };

        const interval = setInterval(checkExpiry, 10000); // Check every 10 seconds
        checkExpiry(); // Check immediately

        return () => clearInterval(interval);
    }, [updatedAt, currentTitle, currentContent, logoText, isDisabled]);

    // Check if note is empty (current values, not initial)
    const isNoteEmpty =
        (!currentTitle || currentTitle.trim() === "") &&
        (!currentContent || currentContent.trim() === "") &&
        (logoText === "NoteSpace");

    const handleDelete = async () => {
        if (!noteId) return;

        try {
            const res = await fetch(`/api/note/${noteId}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (data.success) {
                // Redirect to homepage
                router.push('/');
                // Force page refresh
                router.refresh();
            } else {
                console.error('Failed to delete note:', data.error);
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const handleUrlChange = (newUrl) => {
        // Set renaming flag to prevent 404 handler from creating a new note
        isRenaming.current = true;
        // Update state to prevent fetch with old URL
        setNoteId(newUrl);
        setCustomUrl(newUrl);
    };

    if (isLoading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return (
        <main className="min-h-screen bg-bg transition-colors duration-300">
            <NavBar
                logoText={logoText}
                onLogoChange={setLogoText}
                isNoteEmpty={isNoteEmpty}
                onDelete={handleDelete}
                isDisabled={isDisabled}
                noteId={noteId}
                customUrl={customUrl}
                onUrlChange={handleUrlChange}
            />
            <NoteEditor
                noteId={noteId}
                initialData={initialData}
                logoText={logoText}
                onTitleChange={setCurrentTitle}
                onContentChange={setCurrentContent}
                isDisabled={isDisabled}
            />
        </main>
    );
}
