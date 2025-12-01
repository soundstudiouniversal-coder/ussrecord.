
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ContactSchema } from "@/lib/schemas";
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
import { useAdmin } from "@/hooks/use-admin";
import { useState } from "react";
import { useFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";

function getPublicDataPath(collectionName: string) {
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'default-app-id';
    return `artifacts/${appId}/public/data/${collectionName}`;
}

export function ContactForm() {
    const { toast } = useToast();
    const { userId } = useAdmin();
    const [isPending, setIsPending] = useState(false);
    const { firestore } = useFirebase();

    const form = useForm<z.infer<typeof ContactSchema>>({
        resolver: zodResolver(ContactSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof ContactSchema>) => {
        setIsPending(true);
        if (!firestore) {
            toast({ variant: "destructive", title: "Error", description: "Database not available." });
            setIsPending(false);
            return;
        }

        const collectionRef = collection(firestore, getPublicDataPath('contact_messages'));
        const data = {
            ...values,
            submittedAt: new Date().toISOString(),
            submitterId: userId,
        };
        
        addDocumentNonBlocking(collectionRef, data);

        toast({ title: "Success", description: "Message sent successfully!" });
        form.reset();
        setIsPending(false);
    };
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-6 border border-primary rounded-lg">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="glow-on-hover">Your Name</FormLabel>
                            <FormControl>
                                <Input className="form-input" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="glow-on-hover">Your Email</FormLabel>
                            <FormControl>
                                <Input type="email" className="form-input" {...field} />
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
                            <FormLabel className="glow-on-hover">Your Message</FormLabel>
                            <FormControl>
                                <Textarea className="form-textarea" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="btn-style w-full mt-4" disabled={isPending}>
                    {isPending ? "Sending..." : "Send Message"}
                </Button>
            </form>
        </Form>
    );
}
