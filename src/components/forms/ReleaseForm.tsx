
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

import { ReleaseSchema, Release } from "@/lib/schemas";
import { addRelease, updateRelease } from "@/lib/actions";
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

type ReleaseFormProps = {
    onReleaseAdded?: (newRelease: Release) => void;
    onReleaseUpdated?: (updatedRelease: Release) => void;
    existingRelease?: Release;
};

export function ReleaseForm({ onReleaseAdded, onReleaseUpdated, existingRelease }: ReleaseFormProps) {
    const [isPending, setIsPending] = useState(false);
    const { toast } = useToast();
    const { isAdmin } = useAdmin();
    const { firestore } = useFirebase();
    const isEditMode = !!existingRelease;

    const form = useForm<z.infer<typeof ReleaseSchema>>({
        resolver: zodResolver(ReleaseSchema),
        defaultValues: {
            title: existingRelease?.title || "",
            artist: existingRelease?.artist || "",
            link: existingRelease?.link || "",
        },
    });

    const onSubmit = async (values: z.infer<typeof ReleaseSchema>) => {
        setIsPending(true);
        if (!firestore || !isAdmin) {
            toast({ variant: "destructive", title: "Error", description: "You must be logged in as an admin to perform this action." });
            setIsPending(false);
            return;
        }

        if (isEditMode && existingRelease) {
            const result = await updateRelease(firestore, existingRelease.id, values);
            if (result.success) {
                toast({ title: "Success", description: result.success });
                onReleaseUpdated?.({ ...existingRelease, ...values });
            } else {
                toast({ variant: "destructive", title: "Error", description: result.error || "Update failed." });
            }
        } else {
            const result = await addRelease(firestore, values);
            if (result.success && result.id) {
                toast({ title: "Success", description: result.success });
                const newRelease: Release = { ...values, id: result.id, createdAt: new Date().toISOString() };
                onReleaseAdded?.(newRelease);
                form.reset();
            } else {
                toast({ variant: "destructive", title: "Error", description: result.error || "Failed to add release." });
            }
        }
        setIsPending(false);
    };
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 border border-primary rounded-lg max-w-2xl">
                 <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Song/EP Title</FormLabel>
                            <FormControl>
                                <Input className="form-input" placeholder="Song/EP Title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="artist"
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
                            <FormLabel>Streaming Link</FormLabel>
                            <FormControl>
                                <Input className="form-input" placeholder="Spotify, SoundCloud, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="btn-style w-full" disabled={isPending}>
                    {isPending ? (isEditMode ? "Updating..." : "Adding...") : (isEditMode ? "Update Release" : "Add Release")}
                </Button>
            </form>
        </Form>
    );
}
