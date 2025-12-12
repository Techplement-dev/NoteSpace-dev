"use client";

import { useState } from "react";
import LinkIcon from "lucide-react/dist/esm/icons/link"; // Workaround if simple import fails, but simpler to use generic 'Link' if exported
import { Link, Cloud, Lock, Share2, Sun, Moon, Menu, X, Plus, Trash2 } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import dynamic from "next/dynamic";

const PasswordModal = dynamic(() => import("./PasswordModal"));
const ShareModal = dynamic(() => import("./ShareModal"));
const ChangeUrlModal = dynamic(() => import("./ChangeUrlModal"));
const DeleteModal = dynamic(() => import("./DeleteModal"));

export default function NavBar({ logoText = "NoteSpace", onLogoChange, isNoteEmpty = true, onDelete, isDisabled = false }) {
    const { theme, toggleTheme } = useTheme();
    const [isEditingLogo, setIsEditingLogo] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isChangeUrlModalOpen, setIsChangeUrlModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Tooltip component (internal for simplicity)
    const Tooltip = ({ text, children }) => (
        <div className="group relative flex flex-col items-center">
            {children}
            <div className="absolute top-10 hidden flex-col items-center group-hover:flex z-50">
                <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-gray-800 rounded shadow-lg">
                    {text}
                </span>
                <div className="w-3 h-3 -mt-2 rotate-45 bg-gray-800"></div>
            </div>
        </div>
    );

    const IconButton = ({ icon: Icon, onClick, tooltip }) => (
        <Tooltip text={tooltip}>
            <motion.button
                whileHover={!isDisabled ? { scale: 1.1 } : {}}
                whileTap={!isDisabled ? { scale: 0.95 } : {}}
                onClick={(e) => { if (!isDisabled) onClick(e); }}
                disabled={isDisabled}
                className={`p-2 rounded-full transition-colors text-fg ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
                <Icon size={20} />
            </motion.button>
        </Tooltip>
    );

    const handleAddPassword = (password) => {
        console.log("Password Added:", password);
        // Implement logic to actually save password here
    };

    const handleNewNote = () => {
        // Open homepage in new tab - note will be created when user starts typing
        window.open('/', '_blank');
    };

    const handleSaveUrl = (newUrl) => {
        console.log("New URL:", newUrl);
        // Implement logic to save new URL
    };

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 flex items-center justify-between px-4 md:px-8 transition-colors duration-300">
            {/* Left: Editable Logo */}

            <div className="flex-shrink-0">
                {isEditingLogo ? (
                    <input
                        type="text"
                        value={logoText}
                        onChange={(e) => onLogoChange && onLogoChange(e.target.value)}
                        onBlur={() => setIsEditingLogo(false)}
                        autoFocus
                        onFocus={(e) => e.target.setSelectionRange(e.target.value.length, e.target.value.length)}
                        className="text-lg font-bold px-3 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-fg shadow-sm"
                    />
                ) : (
                    <motion.h1
                        whileHover={!isDisabled ? { scale: 1.02 } : {}}
                        onClick={() => !isDisabled && setIsEditingLogo(true)}
                        className={`text-2xl font-bold cursor-pointer text-fg select-none ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                        {logoText}
                    </motion.h1>
                )}
            </div>

            {/* Desktop Toolbar */}
            <div className="hidden md:flex items-center space-x-2">
                <IconButton icon={Plus} tooltip="New note" onClick={handleNewNote} />
                <IconButton icon={Lock} tooltip="Password protection" onClick={() => setIsPasswordModalOpen(true)} />
                <IconButton icon={Link} tooltip="Change URL" onClick={() => setIsChangeUrlModalOpen(true)} />
                <IconButton icon={Share2} tooltip="Share note" onClick={() => setIsShareModalOpen(true)} />
                <Tooltip text="Delete note">
                    <motion.button
                        whileHover={!isNoteEmpty ? { scale: 1.1 } : {}}
                        whileTap={!isNoteEmpty ? { scale: 0.95 } : {}}
                        onClick={() => !isNoteEmpty && !isDisabled && setIsDeleteModalOpen(true)}
                        disabled={isNoteEmpty || isDisabled}
                        className={`p-2 rounded-full transition-colors ${isNoteEmpty || isDisabled
                            ? 'opacity-40 cursor-not-allowed text-fg'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-fg cursor-pointer'
                            }`}
                    >
                        <Trash2 size={20} />
                    </motion.button>
                </Tooltip>
                <IconButton
                    icon={theme === "dark" ? Sun : Moon}
                    tooltip={`Toggle ${theme === "dark" ? "Light" : "Dark"}`}
                    onClick={toggleTheme}
                />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-fg"
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </motion.button>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-16 left-0 right-0 bg-bg border-b border-gray-200 dark:border-gray-800 p-4 md:hidden shadow-lg flex flex-col space-y-4"
                    >
                        <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={handleNewNote}>
                            <span className="text-fg font-medium">New note</span>
                            <Plus size={20} className="text-fg" />
                        </div>
                        <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={() => { setIsPasswordModalOpen(true); setIsMobileMenuOpen(false); }}>
                            <span className="text-fg font-medium">Password protection</span>
                            <Lock size={20} className="text-fg" />
                        </div>
                        <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={() => { setIsChangeUrlModalOpen(true); setIsMobileMenuOpen(false); }}>
                            <span className="text-fg font-medium">Change URL</span>
                            <Link size={20} className="text-fg" />
                        </div>
                        <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={() => { setIsShareModalOpen(true); setIsMobileMenuOpen(false); }}>
                            <span className="text-fg font-medium">Share note</span>
                            <Share2 size={20} className="text-fg" />
                        </div>
                        <div
                            className={`flex items-center justify-between p-2 rounded ${isNoteEmpty
                                ? 'opacity-40 cursor-not-allowed'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'
                                }`}
                            onClick={() => { if (!isNoteEmpty) { setIsDeleteModalOpen(true); setIsMobileMenuOpen(false); } }}
                        >
                            <span className="text-fg font-medium">Delete note</span>
                            <Trash2 size={20} className="text-fg" />
                        </div>
                        <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={toggleTheme}>
                            <span className="text-fg font-medium">Theme ({theme})</span>
                            {theme === "dark" ? <Sun size={20} className="text-fg" /> : <Moon size={20} className="text-fg" />}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Password Modal */}
            <PasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onAdd={handleAddPassword}
            />

            {/* Share Modal */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
            />

            {/* Change URL Modal */}
            <ChangeUrlModal
                isOpen={isChangeUrlModalOpen}
                onClose={() => setIsChangeUrlModalOpen(false)}
                onSave={handleSaveUrl}
            />

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={onDelete}
            />
        </nav>
    );
}
