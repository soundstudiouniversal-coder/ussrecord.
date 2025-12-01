
import { DashboardClientPage } from "@/components/dashboard/DashboardClientPage";

export default function DashboardPage() {
    return (
        <main>
             <h2 className="text-3xl font-bold mb-8 uppercase border-b pb-2 border-primary">
                ADMIN // Dashboard
            </h2>
            <DashboardClientPage />
        </main>
    );
}
