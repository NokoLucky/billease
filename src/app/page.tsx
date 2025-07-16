import { AddBillSheet } from '@/components/add-bill-sheet';
import { DashboardOverview } from '@/components/dashboard-overview';
import { RecentBills } from '@/components/recent-bills';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8">
      <header className="flex items-center justify-between pb-4 border-b">
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <AddBillSheet>
          <Button>
            <PlusCircle className="mr-2" />
            Add Bill
          </Button>
        </AddBillSheet>
      </header>
      <main className="flex-1 py-8">
        <DashboardOverview />
        <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold font-headline">Recent Bills</h2>
            <RecentBills />
        </div>
      </main>
    </div>
  );
}
