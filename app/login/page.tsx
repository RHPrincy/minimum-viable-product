"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/Card";
import { Button } from "@/app/components/Button";
import Link from "next/link";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Réinitialiser l'erreur avant la tentative

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                const { fonction } = await res.json();
                router.push(`/dashboard/${fonction}`);
            } else {
                const data = await res.json();
                setError(data.message || "Erreur de connexion");
            }
        } catch (err) {
            setError("Une erreur inattendue est survenue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 px-4 py-12">
            {/* Fond animé */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-blue-200 opacity-30 blur-3xl animate-pulse"></div>
                <div className="absolute top-10 -right-10 h-72 w-72 rounded-full bg-purple-200 opacity-30 blur-3xl animate-pulse delay-200"></div>
                <div className="absolute -bottom-20 left-1/4 h-80 w-80 rounded-full bg-pink-200 opacity-30 blur-3xl animate-pulse delay-400"></div>
            </div>

            {/* Contenu */}
            <div className="relative z-10 w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link href="/">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                        Gestion{" "}
                        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            Projet
                        </span>
                    </h1>
                    </Link>
                    <p className="mt-2 text-lg text-gray-600">Connectez-vous pour accéder à votre compte</p>
                </div>

                <Card
                    variant="glass"
                    padding="lg"
                    animate="fade"
                    className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl"
                >
                    <CardHeader align="center">
                        <CardTitle size="lg">Connexion</CardTitle>
                        <CardDescription size="md">
                            Entrez vos identifiants pour accéder à votre espace
                        </CardDescription>
                    </CardHeader>

                    <CardContent gap="lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Champ Username */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Nom d'utilisateur
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Nom d'utilisateur"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Champ Password */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Mot de passe
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder="Mot de passe"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                className="h-5 w-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                className="h-5 w-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Message d'erreur */}
                            {error && (
                                <div className="rounded-md bg-red-100 px-4 py-2 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {/* Bouton de soumission */}
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                rounded="lg"
                                isLoading={loading}
                                disabled={loading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                Se connecter
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}