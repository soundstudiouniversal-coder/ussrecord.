
import { ContactForm } from "@/components/forms/ContactForm";

export default function ContactPage() {
    return (
        <main>
            <h2 className="text-3xl font-bold mb-8 uppercase border-b pb-2 border-primary">
                COMMUNICATION // Get In Touch
            </h2>
            <p className="mb-6 max-w-2xl mx-auto text-muted-foreground">
                Your message details (Name, Email, and Message) will be sent to the label admin.
            </p>
            <ContactForm />
        </main>
    );
}
