"use client"; // Nécessaire pour les hooks côté client
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Importer usePathname
import { cn } from "@/lib/utils";
import {
    ChevronLeft,
    ChevronRight,
    Home,
    FolderOpen,
    CheckSquare,
    BarChart2,
    Users,
    Menu,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    isOpen?: boolean;
    toggleSidebar?: () => void;
    user: { username: string; fonction: string } | null;
}

const Sidebar = ({ className, isOpen = true, toggleSidebar, user, ...props }: SidebarProps) => {
    if (!user) return null;

    const pathname = usePathname(); // Récupérer le chemin actuel

    const navItems = [
        { name: "Dashboard", href: "/dashboard/manager", icon: Home },
        { name: "Analytics", href: "/dashboard/manager/performance", icon: BarChart2 },
        { name: "Team", href: "/dashboard/manager/team", icon: Users },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* Bouton de menu hamburger pour les petits écrans */}
            <div className="md:hidden">
                <button
                    onClick={handleMobileMenuToggle}
                    className="fixed top-2 left-2 z-40 bg-white p-2 rounded-md shadow-md"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Menu déroulant pour les petits écrans (en bas) */}
            {isMobileMenuOpen && (
                <div className="fixed bottom-0 left-0 w-full bg-white z-50 p-4 md:hidden shadow-md">
                    <button
                        onClick={handleMobileMenuToggle}
                        className="absolute top-3 right-4 bg-gray-300 p-2 rounded-md"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <nav className="flex flex-col gap-2">
                        {navItems.map(({ name, href, icon: Icon }) => (
                            <Link
                                key={name}
                                href={href}
                                className={cn(
                                    "flex items-center rounded-md px-3 py-2 text-gray-700 transition-all duration-200 ease-out group",
                                    pathname === href
                                        ? "bg-indigo-50 text-indigo-700 font-medium shadow-sm"
                                        : "hover:bg-gray-50 hover:text-indigo-600"
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "h-5 w-5 shrink-0 transition-colors duration-200",
                                        pathname === href
                                            ? "text-indigo-600"
                                            : "text-gray-600 group-hover:text-indigo-600"
                                    )}
                                />
                                <span className="text-sm font-medium truncate">{name}</span>
                            </Link>
                        ))}
                    </nav>
                </div>
            )}

            {/* Barre latérale pour les écrans md et plus grands */}
            <aside
                className={cn(
                    "fixed left-0 top-10 z-30 h-[calc(100vh-2.5rem)] bg-white border-r border-gray-200/70 shadow-md transition-all duration-300 ease-in-out",
                    isOpen ? "w-64" : "w-16",
                    "hidden md:block",
                    className
                )}
                {...props}
            >
                {/* Bouton de toggle */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-2.5 top-16 h-6 w-6 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-indigo-50 hover:border-indigo-300 shadow-sm hover:shadow-md transform transition-all duration-200 ease-out hover:scale-105"
                    aria-label={isOpen ? "Réduire la sidebar" : "Étendre la sidebar"}
                >
                    {isOpen ? (
                        <ChevronLeft className="h-4 w-4 text-gray-600 hover:text-indigo-600 transition-colors duration-200" />
                    ) : (
                        <ChevronRight className="h-4 w-4 text-gray-600 hover:text-indigo-600 transition-colors duration-200" />
                    )}
                </button>

                {/* Navigation */}
                <nav className="mt-16 flex flex-col gap-2 px-2">
                    {navItems.map(({ name, href, icon: Icon }) => (
                        <Link
                            key={name}
                            href={href}
                            className={cn(
                                "flex items-center rounded-md px-3 py-2 text-gray-700 transition-all duration-200 ease-out group",
                                isOpen ? "gap-3" : "justify-center",
                                pathname === href
                                    ? "bg-indigo-50 text-indigo-700 font-medium shadow-sm"
                                    : "hover:bg-gray-50 hover:text-indigo-600"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "h-5 w-5 shrink-0 transition-colors duration-200",
                                    pathname === href
                                        ? "text-indigo-600"
                                        : "text-gray-600 group-hover:text-indigo-600"
                                )}
                            />
                            {isOpen && (
                                <span className="text-sm font-medium truncate">{name}</span>
                            )}
                        </Link>
                    ))}
                </nav>

                {/* Infos utilisateur */}
                {isOpen && (
                    <div className="absolute bottom-0 w-full p-3">
                        <div className="rounded-md bg-gray-50/80 px-3 py-2 text-xs text-gray-600 shadow-sm transition-all duration-200">
                            <p className="font-medium text-gray-700">Connecté :</p>
                            <p className="mt-1 capitalize truncate">
                                {user.username}{" "}
                                <span className="text-indigo-600">({user.fonction})</span>
                            </p>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
};

export { Sidebar };