import { SavingsManager } from '@/components/savings-manager';

export default function SavingsPage() {
    return (
        <div className="p-4 md:p-8">
            <header className="pb-4 border-b">
                <h1 className="text-3xl font-bold font-headline">Savings Goals & Tips</h1>
            </header>
            <main className="py-8">
                <SavingsManager />
            </main>
        </div>
    );
}
