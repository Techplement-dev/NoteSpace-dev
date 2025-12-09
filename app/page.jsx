import NavBar from "./components/NavBar";
import NoteEditor from "./components/NoteEditor";

export default function Home() {
    return (
        <main className="min-h-screen bg-bg transition-colors duration-300">
            <NavBar />
            <NoteEditor />
        </main>
    );
}
