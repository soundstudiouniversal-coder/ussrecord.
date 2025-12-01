
import { PlaylistClientPage } from "@/components/playlist/PlaylistClientPage";

export default function PlaylistPage() {
    return (
        <main>
             <h2 className="text-3xl font-bold mb-12 uppercase border-b pb-2 border-primary">
                PLAYLISTS // Curated Sounds
            </h2>
            <PlaylistClientPage />
        </main>
    );
}
