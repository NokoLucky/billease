import { ReportsCharts } from "@/components/reports-charts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ReportsPage() {
    return (
        <div className="p-4 md:p-8">
            <header className="flex items-center justify-between pb-4 border-b">
                <h1 className="text-3xl font-bold font-headline">Reports & History</h1>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="mr-2" />
                        Export CSV
                    </Button>
                    <Button variant="outline">
                        <Download className="mr-2" />
                        Export PDF
                    </Button>
                </div>
            </header>
            <main className="py-8">
                <ReportsCharts />
            </main>
        </div>
    );
}
