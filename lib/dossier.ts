// /lib/dossier.ts
import { Dossier } from '@/app/interfaces';

export async function getAllDossier(): Promise<Dossier[]> {
    try {
        const response = await fetch('http://localhost:3000/api/dossier', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw API response:', data);
        
        if (!Array.isArray(data)) {
            console.error('API did not return an array:', data);
            return [];
        }

        return data;
    } catch (error) {
        console.error('Fetch error details:', {
            message: (error as Error).message,
            stack: (error as Error).stack
        });
        throw error;
    }
}

// export async function getDossierById(id: string): Promise<Dossier | null> {
//     try {
//         const response = await fetch(`http://localhost:3000/api/dossier/${id}`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             cache: 'no-store'
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log('Raw API response:', data);

//         if (typeof data !== 'object') {
//             console.error('API did not return an object:', data);
//             return null;
//         }

//         return data;
//     } catch (error) {
//         console.error('Fetch error details:', {
//             message: (error as Error).message,
//             stack: (error as Error).stack
//         });
//         throw error;
//     }
// }