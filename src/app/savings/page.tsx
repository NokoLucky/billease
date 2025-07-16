import { SavingsManager } from '@/components/savings-manager';
import { PageHeader } from '@/components/page-header';

export default function SavingsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title="Savings Goals & Tips" />
            <main className="flex-1 py-8 px-4 md:px-8">
                <SavingsManager />
            </main>
        </div>
    );
}
