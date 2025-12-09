"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function NoteEditor() {
    const textareaRef = useRef(null);
    const [value, setValue] = useState("");

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl mx-auto mt-24 p-4 md:p-8"
        >
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Start typing your note..."
                className="w-full bg-transparent text-lg md:text-xl text-fg focus:outline-none resize-none leading-relaxed overflow-hidden min-h-[50vh] placeholder:text-gray-400 dark:placeholder:text-gray-600 font-inter-regular"
                spellCheck="false"
            />
        </motion.div>
    );
}
