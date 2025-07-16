import { BillsTable } from "@/components/bills-table";
import { AddBillSheet } from "@/components/add-bill-sheet";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function BillsPage() {
    return (
        <div className="p-4 md:p-8">
            <header className="flex items-center justify-between pb-4 border-b">
                <h1 className="text-3xl font-bold font-headline">My Bills</h1>
                 <AddBillSheet>
                    <Button>
                        <PlusCircle className="mr-2" />
                        Add Bill
                    </Button>
                </AddBillSheet>
            </header>
            <main className="py-8">
                <BillsTable />
            </main>
        </div>
    );
}
