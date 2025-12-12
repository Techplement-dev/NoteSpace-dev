"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "lucide-react";


export default function ChangeUrlModal({ isOpen, onClose, noteId, currentCustomUrl, onUrlChange }) {
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");
    const modalRef = useRef(null);
    const router = useRouter();

    // Initialize with current customUrl
    useEffect(() => {
        if (isOpen && currentCustomUrl) {
            setUrl(currentCustomUrl);
        }
    }, [isOpen, currentCustomUrl]);

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
            setError("");
        }
    }, [isOpen]);

    // Clear error after 6 seconds
    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => {
                setError("");
            }, 6000);
            return () => clearTimeout(timeout);
        }
    }, [error]);

    // Validation function
    const validateUrl = (value) => {
        if (value.length < 4 || value.length > 20) {
            return false;
        }

        const hasUppercase = /[A-Z]/.test(value);
        const hasLowercase = /[a-z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        // Modified regex to only allow safe special chars: ! @ $ ^ * _ -
        const hasSpecial = /[!@$^*_\-]/.test(value);
        // Strict alphanumeric + safe special chars check
        const isAlphanumericSpecial = /^[a-zA-Z0-9!@$^*_\-]+$/.test(value);

        return hasUppercase && hasLowercase && hasNumber && hasSpecial && isAlphanumericSpecial;
    };

    const handleSave = async () => {
        if (!validateUrl(url)) {
            setError("URL doesn't meet requirements");
            return;
        }

        try {
            const res = await fetch(`/api/note/${noteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customUrl: url }),
            });

            const data = await res.json();

            if (data.success) {
                // Update parent component state before navigation
                if (onUrlChange) {
                    onUrlChange(url);
                }
                // Close modal
                onClose();
                // Hard reload to new URL to ensure fresh data
                setTimeout(() => {
                    window.location.href = `/note/${url}`;
                }, 100);
            } else if (data.error === 'Already Taken') {
                setError("Already Taken");
            } else {
                setError(data.error || "Failed to update URL");
            }
        } catch (error) {
            setError("An error occurred");
        }
    };

    const isValid = validateUrl(url);

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
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-4">
                            <div className="w-full">
                                <h3 className="text-xl font-bold text-fg mb-2">Change URL</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Customize your note's URL
                                </p>
                            </div>

                            {/* Validation Rules */}
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">URL Requirements:</p>
                                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                    <li className="flex items-start gap-2">
                                        <span className="text-accent mt-0.5">•</span>
                                        <span>Length: 4-20 characters</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-accent mt-0.5">•</span>
                                        <span>Must include: 1 uppercase, 1 lowercase, 1 number, 1 special char (! @ $ ^ * _ -)</span>
                                    </li>

                                </ul>
                            </div>

                            {/* Input Field */}
                            <div className="w-full space-y-2">
                                <div className="relative flex items-center">
                                    <div className="absolute left-4 text-gray-400">
                                        <Link size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => {
                                            setUrl(e.target.value);
                                            setError(""); // Clear error on input
                                        }}
                                        placeholder="Enter custom URL"
                                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                                            } rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all text-fg text-sm`}
                                        autoFocus
                                    />
                                </div>

                                {/* Error Message */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="text-red-500 text-xs font-medium px-1"
                                        >
                                            {error}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Save Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSave}
                                disabled={!isValid}
                                className="w-full px-8 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
