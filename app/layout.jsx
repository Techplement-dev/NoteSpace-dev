import "./globals.css";

/** @type {import('next').Metadata} */
export const metadata = {
    title: "NoteSpace",
    description: "A collaborative note-taking app",
};

export default function RootLayout({
    children,
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased min-h-screen bg-bg text-fg transition-colors duration-300">
                {children}
            </body>
        </html>
    );
}
