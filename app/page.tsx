// /app/page.tsx
import Link from "next/link";
import { Card, CardContent } from "@/app/components/Card";

const TaskIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-blue-600">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    />
  </svg>
);

const TeamIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-purple-600">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const AnalyticsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-green-600">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

export default async function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Fond animé */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-10 -right-10 h-72 w-72 rounded-full bg-purple-200/30 blur-3xl animate-pulse-slow delay-200"></div>
        <div className="absolute -bottom-20 left-1/4 h-80 w-80 rounded-full bg-pink-200/30 blur-3xl animate-pulse-slow delay-400"></div>
      </div>

      {/* Contenu principal */}
      <section className="relative z-10 container mx-auto px-6 py-16 text-center">
        <div className="animate-fade-in-up">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
            Gestion de Projet{" "}
            <span className="block bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Simplifiée
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-lg text-gray-600 sm:text-xl md:text-2xl">
            Une plateforme SaaS intuitive pour optimiser vos workflows, assigner des tâches et coordonner vos équipes efficacement.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row justify-center mb-20">
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all duration-300 animate-slide-in-left"
            >
              Se Connecter
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center px-8 py-3 text-lg font-semibold text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 focus:ring-4 focus:ring-indigo-200 transition-all duration-300 animate-slide-in-right"
            >
              En Savoir Plus
            </Link>
          </div>
        </div>

        {/* Section des fonctionnalités */}
        <div id="features" className="grid max-w-6xl mx-auto gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            variant="glass"
            className="group bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-up"
            style={{ animationDelay: "100ms" }}
          >
            <CardContent className="flex flex-col items-center p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100/80 group-hover:bg-blue-200 transition-colors">
                <TaskIcon />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">Gestion des Tâches</h3>
              <p className="text-gray-600 text-center text-sm md:text-base">
                Planifiez, priorisez et suivez vos tâches avec une précision inégalée.
              </p>
            </CardContent>
          </Card>

          <Card
            variant="glass"
            className="group bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-up"
            style={{ animationDelay: "200ms" }}
          >
            <CardContent className="flex flex-col items-center p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100/80 group-hover:bg-purple-200 transition-colors">
                <TeamIcon />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">Collaboration d’Équipe</h3>
              <p className="text-gray-600 text-center text-sm md:text-base">
                Connectez vos équipes pour une exécution fluide et synchronisée.
              </p>
            </CardContent>
          </Card>

          <Card
            variant="glass"
            className="group bg-white/80 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-up sm:col-span-2 lg:col-span-1"
            style={{ animationDelay: "300ms" }}
          >
            <CardContent className="flex flex-col items-center p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-100/80 group-hover:bg-green-200 transition-colors">
                <AnalyticsIcon />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">Analyses de Performance</h3>
              <p className="text-gray-600 text-center text-sm md:text-base">
                Évaluez la productivité et optimisez vos ressources en temps réel.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

// CSS personnalisé pour les animations (à ajouter dans globals.css ou un fichier séparé)
const customStyles = `
  @keyframes pulse-slow {
    0%, 100% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.05); opacity: 1; }
  }
  .animate-pulse-slow {
    animation: pulse-slow 6s infinite ease-in-out;
  }
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out forwards;
  }
  @keyframes slide-in-left {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .animate-slide-in-left {
    animation: slide-in-left 0.6s ease-out forwards;
  }
  @keyframes slide-in-right {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .animate-slide-in-right {
    animation: slide-in-right 0.6s ease-out forwards;
  }
  @keyframes slide-in-up {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-slide-in-up {
    animation: slide-in-up 0.7s ease-out forwards;
  }
`;