
"use client";

import { useState } from "react";
import { useAdmin } from "@/hooks/use-admin";
import type { Release } from "@/lib/schemas";
import { ReleaseForm } from "../forms/ReleaseForm";
import Link from "next/link";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteRelease } from "@/lib/actions";
import { Trash2, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from 'firebase/firestore';


function getPublicDataPath(collectionName: string) {
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'default-app-id';
    return `artifacts/${appId}/public/data/${collectionName}`;
}

export function ReleasesClientPage() {
    const { isAdmin, userId } = useAdmin();
    const { firestore } = useFirebase();
    const { toast } = useToast();

    const releasesQuery = useMemoFirebase(() => 
        firestore ? query(collection(firestore, getPublicDataPath('releases')), orderBy('createdAt', 'desc')) : null
    , [firestore]);
    
    const { data: releases, isLoading: releasesLoading } = useCollection<Release>(releasesQuery);

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingRelease, setEditingRelease] = useState<Release | null>(null);

    const handleUpdateRelease = () => {
        setIsEditDialogOpen(false);
        setEditingRelease(null);
    }

    const handleAddRelease = () => {
       // Real-time update will handle this
    }

    const handleDelete = (id: string) => {
        if (!firestore || !userId) return;
        deleteRelease(firestore, id);
        toast({ title: "Success", description: "Release deleted successfully!" });
    }

    const openEditDialog = (release: Release) => {
        setEditingRelease(release);
        setIsEditDialogOpen(true);
    }

    return (
        <>
            <div id="releases-list" className="relative">
                {releasesLoading && <p className="text-center">Loading releases...</p>}
                {!releasesLoading && releases && releases.length === 0 ? (
                     <p className="col-span-full text-center text-muted-foreground">No releases posted yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {releases?.map((release, index) => (
                            <div 
                                key={release.id}
                                className="group relative w-full aspect-square animate-pop-in"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <Link href={release.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                    <div className="w-full h-full flex items-center justify-center p-4 border-2 border-primary rounded-xl transition-all duration-300 group-hover:shadow-[0_0_20px_var(--primary-color)] group-hover:scale-105 overflow-hidden">
                                        <div className="relative text-center">
                                            <h3 
                                                className="text-2xl font-bold uppercase transition-all duration-300 group-hover:opacity-0 group-hover:scale-75"
                                                data-text={release.artist}
                                            >
                                                {release.artist}
                                            </h3>
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                                                <p className="text-2xl font-bold uppercase glitch-text-loop" data-text={release.title}>
                                                    {release.title}
                                                </p>
                                                <div className="absolute w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                 {isAdmin && (
                                    <div className="absolute top-2 right-2 z-10 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openEditDialog(release)}>
                                            <Pencil size={14}/>
                                        </Button>
                                        <Button onClick={() => handleDelete(release.id)} variant="destructive" size="icon" className="h-8 w-8">
                                            <Trash2 size={14}/>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => { setIsEditDialogOpen(isOpen); if (!isOpen) setEditingRelease(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Release</DialogTitle>
                    </DialogHeader>
                    {editingRelease && <ReleaseForm onReleaseUpdated={handleUpdateRelease} existingRelease={editingRelease} />}
                </DialogContent>
            </Dialog>

            {isAdmin && (
                <div className="mt-12 pt-8 border-t border-primary">
                    <h3 className="text-xl font-bold mb-4 uppercase">Admin: Add New Release</h3>
                    <ReleaseForm onReleaseAdded={handleAddRelease} />
                </div>
            )}
        </>
    );
}
