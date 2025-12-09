"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "lucide-react";

export default function ChangeUrlModal({ isOpen, onClose, onSave }) {
    const [url, setUrl] = useState("");
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Reset state when closed
    useEffect(() => {
        if (!isOpen) {
            setUrl("");
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-start justify-center pt-32 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
                        aria-hidden="true"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10 w-full max-w-sm mx-4 pointer-events-auto"
                        ref={modalRef}
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center gap-4">
                            <div className="w-full flex justify-between items-center">
                                <h3 className="text-xl font-bold text-fg">Change URL</h3>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                Choose a custom URL for your note.
                            </p>

                            <div className="w-full relative flex items-center">
                                <div className="absolute left-4 text-gray-400">
                                    <Link size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="my-custom-url"
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all text-fg text-sm"
                                    autoFocus
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { onSave(url); onClose(); }}
                                disabled={!url}
                                className="px-8 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
