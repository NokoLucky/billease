import { SettingsForm } from "@/components/settings-form";

export default function SettingsPage() {
    return (
        <div className="p-4 md:p-8">
            <header className="pb-4 border-b">
                <h1 className="text-3xl font-bold font-headline">Settings</h1>
            </header>
            <main className="py-8 max-w-2xl">
                <SettingsForm />
            </main>
        </div>
    );
}
