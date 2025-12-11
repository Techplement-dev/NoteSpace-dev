"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "./components/NavBar";
import NoteEditor from "./components/NoteEditor";

export default function Home() {
    const router = useRouter();
    const [logoText, setLogoText] = useState("NoteSpace");
    const [hasCreatedNote, setHasCreatedNote] = useState(false);

    const handleContentChange = async (content, title) => {
        // Auto-create a note when user starts typing on homepage
        if (hasCreatedNote) return;
        if (!content && !title) return; // Don't create for empty content

        setHasCreatedNote(true);

        try {
            const res = await fetch('/api/note', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title || '',
                    content: content || '',
                    logoText: logoText
                }),
            });

            const data = await res.json();

            if (data.success) {
                // Redirect to the note page
                router.push(`/note/${data.data._id}`);
            }
        } catch (error) {
            console.error('Error creating note:', error);
            setHasCreatedNote(false); // Allow retry
        }
    };

    return (
        <main className="min-h-screen bg-bg transition-colors duration-300">
            <NavBar logoText={logoText} onLogoChange={setLogoText} />
            <NoteEditor
                onContentChange={handleContentChange}
                logoText={logoText}
            />
        </main>
    );
}
