import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

export function DashboardLayout() {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            {/* pb-16 on mobile to avoid content being hidden behind bottom nav */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
                <Outlet />
            </main>
        </div>
    );
}
