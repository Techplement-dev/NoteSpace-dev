"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "./components/NavBar";
import NoteEditor from "./components/NoteEditor";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const createNote = async () => {
            try {
                const res = await fetch('/api/note', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: '',
                        content: '',
                        logoText: 'NoteSpace'
                    }),
                });

                const data = await res.json();

                if (data.success) {
                    router.push(`/note/${data.data._id}`);
                }
            } catch (error) {
                console.error('Error creating note:', error);
            }
        };

        createNote();
    }, []); // Run once on mount

    return (
        <main className="min-h-screen bg-bg flex items-center justify-center">
            <div className="animate-pulse text-xl text-fg">Initializing NoteSpace...</div>
        </main>
    );
}
