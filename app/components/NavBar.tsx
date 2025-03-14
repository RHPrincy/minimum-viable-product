// /app/components/NavBar.tsx
import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import { Button } from "./Button";

interface NavBarProps extends React.HTMLAttributes<HTMLElement> {
    toggleSidebar?: () => void;
    user: { username: string; fonction: string } | null;
    logout: () => void;
}

const NavBar = ({
    className,
    toggleSidebar,
    user,
    logout,
    ...props
}: NavBarProps) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    return (
        <header
            className={cn(
                "fixed left-0 right-0 top-0 z-40 h-16 border-b border-gray-200 bg-white bg-opacity-80 backdrop-blur-md",
                className
            )}
            {...props}
        >
            <div className="flex h-full items-center justify-between px-4 md:px-6">
                {/* Section gauche : Menu et Logo */}
                <div className="flex items-center gap-3">
                    {toggleSidebar && (
                        <Button
                            variant="ghost"
                            size="sm"
                            rounded="md"
                            className="text-gray-600 hover:bg-gray-100 md:hidden"
                            onClick={toggleSidebar}
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Ouvrir/Fermer la barre latérale</span>
                        </Button>
                    )}

                    <Link href="/" className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white font-bold">
                            P
                        </span>
                        <span className="hidden text-lg font-semibold text-gray-900 md:inline-block">
                            Project
                        </span>
                    </Link>
                </div>

                {/* Section droite : Recherche, Notifications, Profil */}
                {user && (
                    <div className="flex items-center gap-4">
                        {/* Barre de recherche (visible sur md+) */}
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-500 -translate-y-1/2" />
                            <input
                                type="search"
                                placeholder="Rechercher..."
                                className="h-9 w-64 rounded-md border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                            />
                        </div>

                        {/* Bouton de notification */}
                        <Button
                            variant="ghost"
                            size="sm"
                            rounded="md"
                            className="relative text-gray-600 hover:bg-gray-100"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                        </Button>

                        {/* Menu utilisateur */}
                        <div className="relative">
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center gap-2 focus:outline-none border border-black p-2 rounded-md p-1"
                            >
                                
                                <span className="hidden text-sm font-medium text-gray-900 md:inline-block">
                                    {user.username}
                                </span>
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-md bg-white bg-opacity-90 backdrop-blur-md shadow-lg border border-gray-200/50">
                                    <div className="p-3 border-b border-gray-200 text-gray-700">
                                        Connecté en tant que{" "}
                                        <span className="font-semibold">{user.username}</span>
                                        <div className="text-xs text-gray-500 capitalize">
                                            {user.fonction}
                                        </div>
                                    </div>
                                    <div className="py-1">
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Profil
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            Paramètres
                                        </Link>
                                        <button
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            onClick={() => {
                                                logout();
                                                setDropdownOpen(false);
                                            }}
                                        >
                                            Déconnexion
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export { NavBar };