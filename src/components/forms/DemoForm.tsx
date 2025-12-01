
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdmin } from "@/hooks/use-admin";

import { DemoSchema } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useFirebase } from "@/firebase";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { collection } from "firebase/firestore";

function getPublicDataPath(collectionName: string) {
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'default-app-id';
    return `artifacts/${appId}/public/data/${collectionName}`;
}

export function DemoForm() {
    const { toast } = useToast();
    const { userId } = useAdmin();
    const [isPending, setIsPending] = useState(false);
    const { firestore } = useFirebase();

    const form = useForm<z.infer<typeof DemoSchema>>({
        resolver: zodResolver(DemoSchema),
        defaultValues: {
            artistName: "",
            soundcloudLink: "",
            message: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof DemoSchema>) => {
        setIsPending(true);
        if (!firestore) {
            toast({ variant: "destructive", title: "Error", description: "Database not available." });
            setIsPending(false);
            return;
        }

        const collectionRef = collection(firestore, getPublicDataPath('demo_submissions'));
        const data = {
            ...values,
            submittedAt: new Date().toISOString(),
            submitterId: userId,
        };

        addDocumentNonBlocking(collectionRef, data);
        
        toast({ title: "Success", description: "Demo submitted successfully!" });
        form.reset();
        setIsPending(false);
    };
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-6 border border-primary rounded-lg">
                <FormField
                    control={form.control}
                    name="artistName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="glow-on-hover">Artist Name</FormLabel>
                            <FormControl>
                                <Input className="form-input" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="soundcloudLink"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="glow-on-hover">SoundCloud Demo Link (Private Link Preferred)</FormLabel>
                            <FormControl>
                                <Input className="form-input" placeholder="e.g., https://soundcloud.com/..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="glow-on-hover">Message About The Song (Genre, Story, Context)</FormLabel>
                            <FormControl>
                                <Textarea className="form-textarea" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="btn-style w-full mt-4" disabled={isPending}>
                    {isPending ? "Submitting..." : "Submit Demo"}
                </Button>
            </form>
        </Form>
    );
}
