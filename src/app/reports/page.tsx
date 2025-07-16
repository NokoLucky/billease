import { ReportsCharts } from "@/components/reports-charts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export default function ReportsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title="Reports & History">
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
            </PageHeader>
            <main className="flex-1 py-8 px-4 md:px-8">
                <ReportsCharts />
            </main>
        </div>
    );
}
