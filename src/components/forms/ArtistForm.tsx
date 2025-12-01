
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { ArtistSchema, Artist } from "@/lib/schemas";
import { addArtist, updateArtist } from "@/lib/actions";
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

type ArtistFormProps = {
    onArtistAdded?: (newArtist: Artist) => void;
    onArtistUpdated?: (updatedArtist: Artist) => void;
    existingArtist?: Artist;
};

export function ArtistForm({ onArtistAdded, onArtistUpdated, existingArtist }: ArtistFormProps) {
    const [isPending, setIsPending] = useState(false);
    const { toast } = useToast();
    const { userId, isAdmin } = useAdmin();
    const { firestore } = useFirebase();
    const isEditMode = !!existingArtist;

    const form = useForm<z.infer<typeof ArtistSchema>>({
        resolver: zodResolver(ArtistSchema),
        defaultValues: {
            name: existingArtist?.name || "",
            link: existingArtist?.link || "",
        },
    });

    const onSubmit = async (values: z.infer<typeof ArtistSchema>) => {
        setIsPending(true);
        if (!firestore || !isAdmin) {
            toast({ variant: "destructive", title: "Error", description: "You must be logged in as an admin to perform this action." });
            setIsPending(false);
            return;
        }
        
        if (isEditMode && existingArtist) {
            const result = await updateArtist(firestore, existingArtist.id, values);
            if (result.success) {
                toast({ title: "Success", description: result.success });
                onArtistUpdated?.({ ...existingArtist, ...values });
            } else {
                toast({ variant: "destructive", title: "Error", description: result.error || "Update failed." });
            }
        } else {
            const result = await addArtist(firestore, values);
            if (result.success && result.id) {
                toast({ title: "Success", description: result.success });
                const newArtist: Artist = { ...values, id: result.id, createdAt: new Date().toISOString()};
                onArtistAdded?.(newArtist);
                form.reset();
            } else {
                toast({ variant: "destructive", title: "Error", description: result.error || "Failed to add artist." });
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
                            <FormLabel>Artist Name</FormLabel>
                            <FormControl>
                                <Input className="form-input" placeholder="Artist Name" {...field} />
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
                            <FormLabel>External Link</FormLabel>
                            <FormControl>
                                <Input className="form-input" placeholder="Spotify, YouTube, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="btn-style w-full" disabled={isPending}>
                    {isPending ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Artist" : "Add Artist")}
                </Button>
            </form>
        </Form>
    );
}
