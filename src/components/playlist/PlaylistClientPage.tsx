
"use client";

import { useState } from "react";
import { useAdmin } from "@/hooks/use-admin";
import type { Playlist } from "@/lib/schemas";
import { PlaylistForm } from "../forms/PlaylistForm";
import Link from "next/link";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { deletePlaylist } from "@/lib/actions";
import { Trash2, Pencil, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from 'firebase/firestore';

function getPublicDataPath(collectionName: string) {
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'default-app-id';
    return `artifacts/${appId}/public/data/${collectionName}`;
}

export function PlaylistClientPage() {
    const { isAdmin, userId } = useAdmin();
    const { firestore } = useFirebase();
    const { toast } = useToast();

    const playlistsQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, getPublicDataPath('playlists')), orderBy('createdAt', 'desc')) : null
    , [firestore]);
    
    const { data: playlists, isLoading: playlistsLoading } = useCollection<Playlist>(playlistsQuery);

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);

    const handleUpdatePlaylist = () => {
        setIsEditDialogOpen(false);
        setEditingPlaylist(null);
    }

    const handleAddPlaylist = () => {
       // Real-time update will handle this
    }

    const handleDelete = (id: string) => {
        if (!firestore || !userId) return;
        deletePlaylist(firestore, id);
        toast({ title: "Success", description: "Playlist deleted successfully!" });
    }

    const openEditDialog = (playlist: Playlist) => {
        setEditingPlaylist(playlist);
        setIsEditDialogOpen(true);
    }

    return (
        <>
            <div id="playlists-list" className="relative">
                {playlistsLoading && <p className="text-center">Loading playlists...</p>}
                {!playlistsLoading && playlists && playlists.length === 0 ? (
                     <p className="col-span-full text-center text-muted-foreground">No playlists posted yet.</p>
                ) : (
                    <div className="flex flex-col space-y-4">
                        {playlists?.map((playlist, index) => (
                           <div 
                                key={playlist.id}
                                className="group relative animate-pop-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <Link href={playlist.link} target="_blank" rel="noopener noreferrer" className="block w-full">
                                    <div className="flex items-center justify-between p-6 border-2 border-primary rounded-xl transition-all duration-300 group-hover:shadow-[0_0_20px_var(--primary-color)] group-hover:scale-105 overflow-hidden">
                                        <h3 
                                            className="text-2xl font-bold uppercase transition-all duration-300 group-hover:glitch-text-loop"
                                            data-text={playlist.name}
                                        >
                                            {playlist.name}
                                        </h3>
                                        <div className="flex items-center space-x-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                                            <span className="text-sm uppercase">Listen Now</span>
                                            <ArrowRight className="w-5 h-5"/>
                                        </div>
                                    </div>
                                </Link>
                                 {isAdmin && (
                                    <div className="absolute top-1/2 -translate-y-1/2 right-4 z-10 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openEditDialog(playlist)}>
                                            <Pencil size={14}/>
                                        </Button>
                                        <Button onClick={() => handleDelete(playlist.id)} variant="destructive" size="icon" className="h-8 w-8">
                                            <Trash2 size={14}/>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => { setIsEditDialogOpen(isOpen); if (!isOpen) setEditingPlaylist(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Playlist</DialogTitle>
                    </DialogHeader>
                    {editingPlaylist && <PlaylistForm onPlaylistUpdated={handleUpdatePlaylist} existingPlaylist={editingPlaylist} />}
                </DialogContent>
            </Dialog>

            {isAdmin && (
                <div className="mt-12 pt-8 border-t border-primary">
                    <h3 className="text-xl font-bold mb-4 uppercase">Admin: Add New Playlist</h3>
                    <PlaylistForm onPlaylistAdded={handleAddPlaylist} />
                </div>
            )}
        </>
    );
}
