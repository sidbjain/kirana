import { LayoutDashboard, Package, LogOut, Calculator, Receipt } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

const links = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Inventory", href: "/products", icon: Package },
    { name: "Billing", href: "/billing", icon: Receipt },
];

export function Sidebar() {
    const location = useLocation();

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:flex h-screen w-64 flex-col border-r bg-white print:hidden flex-shrink-0">
                <div className="flex items-center gap-2 border-b px-6 py-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-500 text-white">
                        <Calculator size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Kirana Flow</h1>
                        <p className="text-xs text-gray-500">admin</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 px-3 py-4">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-orange-100 text-orange-600"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                )}
                            >
                                <Icon size={20} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t p-3">
                    <div className="rounded-lg border bg-white p-3 shadow-none hover:bg-yellow-50 mb-2 cursor-pointer transition-colors flex items-center gap-2">
                        <span className="text-sm font-medium">हिंदी</span>
                    </div>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex print:hidden">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            to={link.href}
                            className={cn(
                                "flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium transition-colors",
                                isActive
                                    ? "text-orange-600"
                                    : "text-gray-500 hover:text-gray-900"
                            )}
                        >
                            <Icon size={22} />
                            <span>{link.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
