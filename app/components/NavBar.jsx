"use client";

import { useState, useEffect } from "react";
import { Link, Lock, Share2, Sun, Moon, Menu, X, Plus, Trash2 } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

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

const IconButton = ({ icon: Icon, onClick, tooltip, isDisabled, theme }) => (
    <Tooltip text={tooltip}>
        <motion.button
            whileHover={!isDisabled ? { scale: 1.1 } : {}}
            whileTap={!isDisabled ? { scale: 0.95 } : {}}
            onClick={(e) => { if (!isDisabled) onClick(e); }}
            disabled={isDisabled}
            className={`p-2 rounded-full transition-colors text-fg ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                } ${theme === 'dark' ? 'icon-glow' : ''
                }`}
        >
            <Icon size={20} />
        </motion.button>
    </Tooltip>
);

const PasswordModal = dynamic(() => import("./PasswordModal"));
const PasswordStatusModal = dynamic(() => import("./PasswordStatusModal"));
const ShareModal = dynamic(() => import("./ShareModal"));
const ChangeUrlModal = dynamic(() => import("./ChangeUrlModal"));
const DeleteModal = dynamic(() => import("./DeleteModal"));

export default function NavBar({ logoText = "NoteSpace", onLogoChange, isNoteEmpty = true, onDelete, isDisabled = false, noteId, customUrl, onUrlChange, isPasswordProtected = false, onPasswordChange }) {
    const { theme, toggleTheme } = useTheme();
    const [isEditingLogo, setIsEditingLogo] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isPasswordStatusModalOpen, setIsPasswordStatusModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isChangeUrlModalOpen, setIsChangeUrlModalOpen] = useState(false);
    const [origin, setOrigin] = useState('');

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleAddPassword = async (password) => {
        if (!password || password.length > 8) return;
        try {
            const res = await fetch(`/api/note/${noteId}/password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (data.success) {
                onPasswordChange && onPasswordChange(true);
                setIsPasswordStatusModalOpen(true);
            }
        } catch (e) {
            // swallow to avoid UI changes
        }
    };

    const handleNewNote = () => {
        // Open homepage in new tab - note will be created when user starts typing
        window.open('/', '_blank');
    };

    const handlePasswordIconClick = () => {
        if (isPasswordProtected) {
            setIsPasswordStatusModalOpen(true);
        } else {
            setIsPasswordModalOpen(true);
        }
    };

    const handleRemovePassword = async () => {
        try {
            const res = await fetch(`/api/note/${noteId}/password`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                onPasswordChange && onPasswordChange(false);
                setIsPasswordStatusModalOpen(false);
            }
        } catch (e) {
            setIsPasswordStatusModalOpen(false);
        }
    };

    const handleLogout = () => {
        try {
            if (customUrl) {
                localStorage.removeItem(`note_unlocked_${customUrl}`);
                window.location.href = `/note/login/${customUrl}`;
            }
        } catch {
            if (customUrl) {
                window.location.href = `/note/login/${customUrl}`;
            }
        }
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50 flex items-center justify-between px-4 md:px-8 transition-all duration-300 ${theme === 'dark' ? 'orange-glow' : ''
                    }`}
            >
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
                    <IconButton icon={Plus} tooltip="New note" onClick={handleNewNote} isDisabled={isDisabled} theme={theme} />
                    <IconButton icon={Lock} tooltip="Password protection" onClick={handlePasswordIconClick} isDisabled={isDisabled} theme={theme} />
                    <IconButton icon={Link} tooltip="Change URL" onClick={() => setIsChangeUrlModalOpen(true)} isDisabled={isDisabled} theme={theme} />
                    <IconButton icon={Share2} tooltip="Share note" onClick={() => setIsShareModalOpen(true)} isDisabled={isDisabled} theme={theme} />
                    <Tooltip text="Delete note">
                        <motion.button
                            whileHover={!isNoteEmpty ? { scale: 1.1 } : {}}
                            whileTap={!isNoteEmpty ? { scale: 0.95 } : {}}
                            onClick={() => !isNoteEmpty && !isDisabled && setIsDeleteModalOpen(true)}
                            disabled={isNoteEmpty || isDisabled}
                            className={`p-2 rounded-full transition-colors ${isNoteEmpty || isDisabled
                                ? 'opacity-40 cursor-not-allowed text-fg'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-fg cursor-pointer'
                                } ${theme === 'dark' ? 'icon-glow' : ''}`}
                        >
                            <Trash2 size={20} />
                        </motion.button>
                    </Tooltip>
                    <IconButton
                        icon={theme === "dark" ? Sun : Moon}
                        tooltip={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        onClick={toggleTheme}
                        isDisabled={false}
                        theme={theme}
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
                            className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 md:hidden shadow-lg flex flex-col space-y-4"
                        >
                            <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={handleNewNote}>
                                <span className="text-fg font-medium">New note</span>
                                <Plus size={20} className="text-fg" />
                            </div>

                            <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={handlePasswordIconClick}>
                                <span className="text-fg font-medium">Password protection</span>
                                <Lock size={20} className="text-fg" />
                            </div>

                            <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={() => setIsShareModalOpen(true)}>
                                <span className="text-fg font-medium">Share</span>
                                <Share2 size={20} className="text-fg" />
                            </div>
                            <div
                                className={`flex items-center justify-between p-2 rounded ${isNoteEmpty
                                    ? 'opacity-40 cursor-not-allowed'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-red-500'
                                    } ${theme === 'dark' ? 'icon-glow' : ''}`}
                                onClick={() => { if (!isNoteEmpty) setIsDeleteModalOpen(true); }}
                            >
                                <span className="font-medium">Delete note</span>
                                <Trash2 size={20} />
                            </div>

                            <div className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" onClick={toggleTheme}>
                                <span className="text-fg font-medium">Switch to {theme === "dark" ? "Light" : "Dark"} Mode</span>
                                {theme === "dark" ? <Sun size={20} className="text-fg" /> : <Moon size={20} className="text-fg" />}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Password Modal */}
            <PasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onAdd={handleAddPassword}
            />
            <PasswordStatusModal
                isOpen={isPasswordStatusModalOpen}
                onClose={() => setIsPasswordStatusModalOpen(false)}
                onRemove={handleRemovePassword}
                onLogout={handleLogout}
            />

            {/* Share Modal */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                shareUrl={`${origin}/note/${customUrl || noteId}`}
            />

            {/* Change URL Modal */}
            <ChangeUrlModal
                isOpen={isChangeUrlModalOpen}
                onClose={() => setIsChangeUrlModalOpen(false)}
                noteId={noteId}
                currentCustomUrl={customUrl}
                onUrlChange={onUrlChange}
            />

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={onDelete}
            />
        </>
    );
}
