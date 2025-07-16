import { AddBillSheet } from '@/components/add-bill-sheet';
import { DashboardOverview } from '@/components/dashboard-overview';
import { RecentBills } from '@/components/recent-bills';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Dashboard">
        <AddBillSheet>
          <Button>
            <PlusCircle className="mr-2" />
            Add Bill
          </Button>
        </AddBillSheet>
      </PageHeader>
      <main className="flex-1 py-8 px-4 md:px-8">
        <DashboardOverview />
        <div className="mt-8">
            <h2 className="mb-4 text-2xl font-bold font-headline">Recent Bills</h2>
            <RecentBills />
        </div>
      </main>
    </div>
  );
}
