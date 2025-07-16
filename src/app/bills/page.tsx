import { BillsTable } from "@/components/bills-table";
import { AddBillSheet } from "@/components/add-bill-sheet";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export default function BillsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title="My Bills">
                 <AddBillSheet>
                    <Button>
                        <PlusCircle className="mr-2" />
                        Add Bill
                    </Button>
                </AddBillSheet>
            </PageHeader>
            <main className="flex-1 py-8 px-4 md:px-8">
                <BillsTable />
            </main>
        </div>
    );
}
