
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

import { PlaylistSchema, Playlist } from "@/lib/schemas";
import { addPlaylist, updatePlaylist } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAdmin } from "@/hooks/use-admin";
import { useFirebase } from "@/firebase";

type PlaylistFormProps = {
    onPlaylistAdded?: (newPlaylist: Playlist) => void;
    onPlaylistUpdated?: (updatedPlaylist: Playlist) => void;
    existingPlaylist?: Playlist;
};

export function PlaylistForm({ onPlaylistAdded, onPlaylistUpdated, existingPlaylist }: PlaylistFormProps) {
    const [isPending, setIsPending] = useState(false);
    const { toast } = useToast();
    const { isAdmin } = useAdmin();
    const { firestore } = useFirebase();
    const isEditMode = !!existingPlaylist;

    const form = useForm<z.infer<typeof PlaylistSchema>>({
        resolver: zodResolver(PlaylistSchema),
        defaultValues: {
            name: existingPlaylist?.name || "",
            link: existingPlaylist?.link || "",
        },
    });

    const onSubmit = async (values: z.infer<typeof PlaylistSchema>) => {
        setIsPending(true);
        if (!firestore || !isAdmin) {
            toast({ variant: "destructive", title: "Error", description: "You must be logged in as an admin to perform this action." });
            setIsPending(false);
            return;
        }

        if (isEditMode && existingPlaylist) {
            const result = await updatePlaylist(firestore, existingPlaylist.id, values);
            if (result.success) {
                toast({ title: "Success", description: result.success });
                onPlaylistUpdated?.({ ...existingPlaylist, ...values });
            } else {
                toast({ variant: "destructive", title: "Error", description: result.error || "Update failed." });
            }
        } else {
            const result = await addPlaylist(firestore, values);
            if (result.success && result.id) {
                toast({ title: "Success", description: result.success });
                const newPlaylist: Playlist = { ...values, id: result.id, createdAt: new Date().toISOString() };
                onPlaylistAdded?.(newPlaylist);
                form.reset();
            } else {
                toast({ variant: "destructive", title: "Error", description: result.error || "Failed to add playlist." });
            }
        }
        setIsPending(false);
    };
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 border border-primary rounded-lg max-w-2xl">
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Playlist Name</FormLabel>
                            <FormControl>
                                <Input className="form-input" placeholder="Playlist Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Streaming Link</FormLabel>
                            <FormControl>
                                <Input className="form-input" placeholder="Spotify, SoundCloud, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="btn-style w-full" disabled={isPending}>
                    {isPending ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Playlist" : "Add Playlist")}
                </Button>
            </form>
        </Form>
    );
}
