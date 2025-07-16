import { CalendarView } from "@/components/calendar-view";
import { PageHeader } from "@/components/page-header";

export default function CalendarPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <PageHeader title="Bills Calendar" />
            <main className="flex-1 py-8 px-4 md:px-8">
                <CalendarView />
            </main>
        </div>
    );
}
