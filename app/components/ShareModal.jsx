"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy } from "lucide-react";
import { FaFacebook, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";

const XIcon = ({ size = 24, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const Tooltip = ({ content, children }) => (
    <div className="group relative flex items-center">
        {children}
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-50">
            <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                {content}
            </div>
            <div className="w-2 h-2 -mb-1 bg-gray-800 rotate-45 mx-auto"></div>
        </div>
    </div>
);

export default function ShareModal({ isOpen, onClose }) {
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

    const shareOptions = [
        { name: "Copy Link", icon: Copy, color: "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300", action: () => console.log("Copy Link") },
        { name: "X", icon: XIcon, color: "bg-black text-white", action: () => console.log("X") },
        { name: "Facebook", icon: FaFacebook, color: "bg-blue-100 text-blue-600", action: () => console.log("Facebook") },
        { name: "LinkedIn", icon: FaLinkedin, color: "bg-indigo-100 text-indigo-600", action: () => console.log("LinkedIn") },
        { name: "Instagram", icon: FaInstagram, color: "bg-pink-100 text-pink-600", action: () => console.log("Instagram") },
        { name: "WhatsApp", icon: FaWhatsapp, color: "bg-green-100 text-green-600", action: () => console.log("WhatsApp") },
        { name: "Email", icon: SiGmail, color: "bg-red-100 text-red-600", action: () => console.log("Email") },
    ];

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
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-6">
                            <div className="w-full flex justify-between items-center">
                                <h3 className="text-xl font-bold text-fg">Share this note</h3>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {shareOptions.map((option) => (
                                    <motion.button
                                        key={option.name}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={option.action}
                                        className="flex flex-col items-center gap-2 p-2 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                        <div className={`p-4 rounded-full ${option.color}`}>
                                            <option.icon size={24} />
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                            {option.name}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="w-full p-2 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between border border-gray-200 dark:border-gray-700">
                                <span className="text-xs text-gray-500 truncate px-2">https://notespace.pw/notes/xyz...</span>
                                <Tooltip content="Copy">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => navigator.clipboard.writeText("https://notespace.pw/notes/xyz...")}
                                        className="p-2 text-accent hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                                    >
                                        <Copy size={16} />
                                    </motion.button>
                                </Tooltip>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
