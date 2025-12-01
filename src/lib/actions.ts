
'use client';

import {
    collection,
    doc,
    addDoc,
    Firestore,
} from 'firebase/firestore';
import { z } from 'zod';
import { ArtistSchema, ReleaseSchema, PlaylistSchema } from './schemas';
import { updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';

function getPublicDataPath(collectionName: string) {
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'default-app-id';
    return `artifacts/${appId}/public/data/${collectionName}`;
}

// Artist Actions
export async function addArtist(firestore: Firestore, values: z.infer<typeof ArtistSchema>) {
    const validatedFields = ArtistSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid fields." };
    }
    const collectionRef = collection(firestore, getPublicDataPath('roster'));
    const docRef = await addDoc(collectionRef, {
        ...validatedFields.data,
        createdAt: new Date().toISOString(),
    });
    return { success: "Artist added successfully!", id: docRef.id };
}

export async function updateArtist(firestore: Firestore, artistId: string, values: z.infer<typeof ArtistSchema>) {
    const validatedFields = ArtistSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid fields." };
    }
    const docRef = doc(firestore, getPublicDataPath('roster'), artistId);
    updateDocumentNonBlocking(docRef, validatedFields.data);
    return { success: "Artist updated successfully!" };
}

export function deleteArtist(firestore: Firestore, artistId: string) {
    const docRef = doc(firestore, getPublicDataPath('roster'), artistId);
    deleteDocumentNonBlocking(docRef);
}

// Release Actions
export async function addRelease(firestore: Firestore, values: z.infer<typeof ReleaseSchema>) {
    const validatedFields = ReleaseSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid fields." };
    }
    const collectionRef = collection(firestore, getPublicDataPath('releases'));
    const docRef = await addDoc(collectionRef, {
        ...validatedFields.data,
        createdAt: new Date().toISOString(),
    });
    return { success: "Release added successfully!", id: docRef.id };
}

export async function updateRelease(firestore: Firestore, releaseId: string, values: z.infer<typeof ReleaseSchema>) {
    const validatedFields = ReleaseSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid fields." };
    }
    const docRef = doc(firestore, getPublicDataPath('releases'), releaseId);
    updateDocumentNonBlocking(docRef, validatedFields.data);
    return { success: "Release updated successfully!" };
}

export function deleteRelease(firestore: Firestore, releaseId: string) {
    const docRef = doc(firestore, getPublicDataPath('releases'), releaseId);
    deleteDocumentNonBlocking(docRef);
}

// Playlist Actions
export async function addPlaylist(firestore: Firestore, values: z.infer<typeof PlaylistSchema>) {
    const validatedFields = PlaylistSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid fields." };
    }
    const collectionRef = collection(firestore, getPublicDataPath('playlists'));
    const docRef = await addDoc(collectionRef, {
        ...validatedFields.data,
        createdAt: new Date().toISOString(),
    });
    return { success: "Playlist added successfully!", id: docRef.id };
}

export async function updatePlaylist(firestore: Firestore, playlistId: string, values: z.infer<typeof PlaylistSchema>) {
    const validatedFields = PlaylistSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid fields." };
    }
    const docRef = doc(firestore, getPublicDataPath('playlists'), playlistId);
    updateDocumentNonBlocking(docRef, validatedFields.data);
    return { success: "Playlist updated successfully!" };
}

export function deletePlaylist(firestore: Firestore, playlistId: string) {
    const docRef = doc(firestore, getPublicDataPath('playlists'), playlistId);
    deleteDocumentNonBlocking(docRef);
}
