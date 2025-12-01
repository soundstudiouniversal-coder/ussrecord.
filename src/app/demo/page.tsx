
import { DemoForm } from "@/components/forms/DemoForm";

export default function DemoPage() {
    return (
        <main>
            <h2 className="text-3xl font-bold mb-8 uppercase border-b pb-2 border-primary">
                DEMO TIME // Submit Your Track
            </h2>
            <p className="mb-6 max-w-2xl mx-auto text-muted-foreground">
                Please submit your track using either a file upload **OR** a streaming link below.
            </p>
            <DemoForm />
        </main>
    );
}
