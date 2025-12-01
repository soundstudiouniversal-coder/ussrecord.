
"use client";

import { useState } from "react";
import { useAdmin } from "@/hooks/use-admin";
import type { Artist } from "@/lib/schemas";
import { ArtistForm } from "../forms/ArtistForm";
import Link from "next/link";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteArtist } from "@/lib/actions";
import { Trash2, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from 'firebase/firestore';

function getPublicDataPath(collectionName: string) {
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'default-app-id';
    return `artifacts/${appId}/public/data/${collectionName}`;
}

export function ArtistClientPage() {
    const { isAdmin, userId } = useAdmin();
    const { firestore } = useFirebase();
    const { toast } = useToast();

    const artistsQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, getPublicDataPath('roster')), orderBy('createdAt', 'desc')) : null
    , [firestore]);

    const { data: artists, isLoading: artistsLoading } = useCollection<Artist>(artistsQuery);

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingArtist, setEditingArtist] = useState<Artist | null>(null);

    const handleUpdateArtist = () => {
        setIsEditDialogOpen(false);
        setEditingArtist(null);
    }
    
    const handleAddArtist = () => {
        // Real-time update will handle this
    }

    const handleDelete = (id: string) => {
        if (!firestore || !userId) return;
        deleteArtist(firestore, id);
        toast({ title: "Success", description: "Artist deleted successfully!" });
    }

    const openEditDialog = (artist: Artist) => {
        setEditingArtist(artist);
        setIsEditDialogOpen(true);
    }

    return (
        <>
            <div id="artist-list" className="relative">
                {artistsLoading && <p className="text-center">Loading artists...</p>}
                {!artistsLoading && artists && artists.length === 0 ? (
                     <p className="col-span-full text-center text-muted-foreground">No artists on the roster yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {artists?.map((artist, index) => (
                            <div 
                                key={artist.id}
                                className="group relative w-full aspect-square animate-pop-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <Link href={artist.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                     <div className="w-full h-full flex items-center justify-center p-4 border-2 border-primary rounded-xl transition-all duration-300 group-hover:shadow-[0_0_20px_var(--primary-color)] group-hover:scale-105">
                                        <h3 className="text-3xl font-bold uppercase text-center transition-all duration-300 group-hover:glitch-text-loop" data-text={artist.name}>
                                            {artist.name}
                                        </h3>
                                    </div>
                                </Link>
                                {isAdmin && (
                                    <div className="absolute top-2 right-2 z-10 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openEditDialog(artist)}>
                                            <Pencil size={14}/>
                                        </Button>
                                        <Button onClick={() => handleDelete(artist.id)} variant="destructive" size="icon" className="h-8 w-8">
                                            <Trash2 size={14}/>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => { setIsEditDialogOpen(isOpen); if (!isOpen) setEditingArtist(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Artist</DialogTitle>
                    </DialogHeader>
                    {editingArtist && <ArtistForm onArtistUpdated={handleUpdateArtist} existingArtist={editingArtist} />}
                </DialogContent>
            </Dialog>

            {isAdmin && (
                <div className="mt-12 pt-8 border-t border-primary">
                    <h3 className="text-xl font-bold mb-4 uppercase">Admin: Add New Artist</h3>
                    <ArtistForm onArtistAdded={handleAddArtist} />
                </div>
            )}
        </>
    );
}
