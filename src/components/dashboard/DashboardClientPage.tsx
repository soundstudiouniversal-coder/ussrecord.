
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/use-admin';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, writeBatch, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { DemoSubmission, ContactMessage } from '@/lib/schemas';

function getPublicDataPath(collectionName: string) {
    const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'default-app-id';
    return `artifacts/${appId}/public/data/${collectionName}`;
}

const MAX_DOCS = 100;
const DOCS_TO_DELETE = 5;

export function DashboardClientPage() {
    const { isAdmin } = useAdmin();
    const router = useRouter();
    const { firestore } = useFirebase();
    const { toast } = useToast();

    const demoSubmissionsQuery = useMemoFirebase(() => 
        isAdmin && firestore ? query(collection(firestore, getPublicDataPath('demo_submissions')), orderBy('submittedAt', 'desc')) : null
    , [firestore, isAdmin]);
    const contactMessagesQuery = useMemoFirebase(() => 
        isAdmin && firestore ? query(collection(firestore, getPublicDataPath('contact_messages')), orderBy('submittedAt', 'desc')) : null
    , [firestore, isAdmin]);

    const { data: demos, isLoading: demosLoading } = useCollection<DemoSubmission>(demoSubmissionsQuery);
    const { data: contacts, isLoading: contactsLoading } = useCollection<ContactMessage>(contactMessagesQuery);
    
    useEffect(() => {
        if (!isAdmin) {
            router.push('/login');
        }
    }, [isAdmin, router]);

    const cleanupCollection = async (collectionName: string, currentCount: number) => {
        if (firestore && currentCount > MAX_DOCS) {
            try {
                const collectionPath = getPublicDataPath(collectionName);
                const q = query(collection(firestore, collectionPath), orderBy('submittedAt', 'asc'), limit(DOCS_TO_DELETE));
                const snapshot = await getDocs(q);
                
                if (!snapshot.empty) {
                    const batch = writeBatch(firestore);
                    snapshot.docs.forEach(doc => {
                        batch.delete(doc.ref);
                    });
                    await batch.commit();
                    toast({
                        title: "Auto-Cleanup Successful",
                        description: `Removed ${snapshot.docs.length} oldest ${collectionName.replace('_', ' ')}.`,
                    });
                }
            } catch (error) {
                console.error(`Error cleaning up ${collectionName}:`, error);
                toast({
                    variant: "destructive",
                    title: "Cleanup Failed",
                    description: `Could not remove old ${collectionName.replace('_', ' ')}.`,
                });
            }
        }
    };

    useEffect(() => {
        if (demos && demos.length > MAX_DOCS) {
            cleanupCollection('demo_submissions', demos.length);
        }
    }, [demos]);

    useEffect(() => {
        if (contacts && contacts.length > MAX_DOCS) {
            cleanupCollection('contact_messages', contacts.length);
        }
    }, [contacts]);


    if (!isAdmin) {
        return <p className="text-center">Redirecting to login...</p>;
    }
    
    const formatDate = (isoString: string) => {
        if (!isoString) return 'No date';
        try {
            return new Date(isoString).toLocaleString();
        } catch (e) {
            return 'Invalid date';
        }
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Demo Submissions ({demos?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    {demosLoading && <p>Loading submissions...</p>}
                    {demos && demos.length === 0 && <p>No demo submissions yet.</p>}
                    <Accordion type="single" collapsible className="w-full">
                        {demos?.map(demo => (
                            <AccordionItem value={demo.id} key={demo.id}>
                                <AccordionTrigger>{demo.artistName}</AccordionTrigger>
                                <AccordionContent>
                                    {demo.soundcloudLink && <p><strong>SoundCloud:</strong> <a href={demo.soundcloudLink} target="_blank" rel="noopener noreferrer" className="underline">{demo.soundcloudLink}</a></p>}
                                    <p><strong>Message:</strong> {demo.message}</p>
                                    <p className="text-xs text-muted-foreground mt-2">Submitted: {formatDate(demo.submittedAt)}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Submitter ID: {demo.submitterId}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Contact Messages ({contacts?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    {contactsLoading && <p>Loading messages...</p>}
                    {contacts && contacts.length === 0 && <p>No contact messages yet.</p>}
                     <Accordion type="single" collapsible className="w-full">
                        {contacts?.map(contact => (
                            <AccordionItem value={contact.id} key={contact.id}>
                                <AccordionTrigger>{contact.name} - {contact.email}</AccordionTrigger>
                                <AccordionContent>
                                    <p>{contact.message}</p>
                                     <p className="text-xs text-muted-foreground mt-2">Submitted: {formatDate(contact.submittedAt)}</p>
                                     <p className="text-xs text-muted-foreground mt-1">Submitter ID: {contact.submitterId}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    )
}
