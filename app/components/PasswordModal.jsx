"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, X } from "lucide-react";

export default function PasswordModal({ isOpen, onClose, onAdd }) {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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
            setPassword("");
            setShowPassword(false);
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
                                <h3 className="text-xl font-bold text-fg">Add Password</h3>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                Protect your note with a secure password.
                            </p>

                            <div className="w-full relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all text-fg pr-12 text-sm"
                                    autoFocus
                                />
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-fg transition-colors p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                                    type="button"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { onAdd(password); onClose(); }}
                                disabled={!password}
                                className="px-8 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
