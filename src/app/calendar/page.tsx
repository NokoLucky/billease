import { CalendarView } from "@/components/calendar-view";

export default function CalendarPage() {
    return (
        <div className="p-4 md:p-8">
            <header className="pb-4 border-b">
                <h1 className="text-3xl font-bold font-headline">Bills Calendar</h1>
            </header>
            <main className="py-8">
                <CalendarView />
            </main>
        </div>
    );
}
