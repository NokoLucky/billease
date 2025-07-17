
'use client';
import { ReportsCharts } from "@/components/reports-charts";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { useBills } from "@/lib/firestore";

export default function ReportsPage() {
    const { bills, loading } = useBills();
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
                {loading ? (
                     <div className="flex h-64 w-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : (
                    <ReportsCharts bills={bills} />
                )}
            </main>
        </div>
    );
}
