import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('session');

    // Si pas de session et que la route n'est pas / ou /login, rediriger vers /
    if (!sessionCookie && !request.nextUrl.pathname.startsWith('/') && !request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Si session existe, rediriger depuis / ou /login vers le dashboard
    if (sessionCookie && (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/login')) {
        try {
            const cookieValue = JSON.parse(sessionCookie.value);
            const userFunction = cookieValue.fonction;
            return NextResponse.redirect(new URL(`/dashboard/${userFunction}`, request.url));
        } catch (error) {
            // Si le cookie est invalide, le supprimer et rediriger vers /
            const response = NextResponse.redirect(new URL('/', request.url));
            response.cookies.delete('session');
            return response;
        }
    }

    // Laisser la requête continuer si aucune redirection n'est nécessaire
    return NextResponse.next();
}

// Appliquer le middleware à toutes les routes sauf les fichiers statiques et API
export const config = {
    matcher: ['/((?!_next/static|_next/image|api|favicon.ico).*)'],
};