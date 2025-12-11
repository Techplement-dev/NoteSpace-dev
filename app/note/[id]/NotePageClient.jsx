"use client";

import { useState } from "react";
import NavBar from "@/app/components/NavBar";
import NoteEditor from "@/app/components/NoteEditor";

export default function NotePageClient({ noteId, initialNoteData }) {
    const [logoText, setLogoText] = useState(initialNoteData?.logoText || "NoteSpace");

    return (
        <main className="min-h-screen bg-bg transition-colors duration-300">
            <NavBar logoText={logoText} onLogoChange={setLogoText} />
            <NoteEditor noteId={noteId} initialData={initialNoteData} logoText={logoText} />
        </main>
    );
}
