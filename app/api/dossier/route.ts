// 📁 app/api/dossier/route.ts
import { NextResponse } from 'next/server'
import dossier from '@/data/Dossier.json'

export async function GET() {
    return NextResponse.json(dossier) // Return the array directly
}