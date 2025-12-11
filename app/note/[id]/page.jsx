"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/NavBar";
import NoteEditor from "@/app/components/NoteEditor";

export default function NotePage({ params }) {
    const router = useRouter();
    const [noteId, setNoteId] = useState(null);
    const [initialData, setInitialData] = useState(null);
    const [logoText, setLogoText] = useState("NoteSpace");
    const [currentTitle, setCurrentTitle] = useState("");
    const [currentContent, setCurrentContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);

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
                const res = await fetch(`/api/note/${noteId}`);
                const data = await res.json();

                if (data.success) {
                    setInitialData(data.data);
                    setLogoText(data.data.logoText || "NoteSpace");
                    setCurrentTitle(data.data.title || "");
                    setCurrentContent(data.data.content || "");
                }
            } catch (error) {
                console.error("Failed to fetch note:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNote();
    }, [noteId]);

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
            />
            <NoteEditor
                noteId={noteId}
                initialData={initialData}
                logoText={logoText}
                onTitleChange={setCurrentTitle}
                onContentChange={setCurrentContent}
            />
        </main>
    );
}
