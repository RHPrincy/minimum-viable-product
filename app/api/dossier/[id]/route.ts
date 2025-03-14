// app/api/dossier/[id]/route.ts
import { NextResponse } from "next/server";
import dossiers from "@/data/Dossier.json";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // dossiers is already an array, so find the item directly
    const dossier = dossiers.find((item) => item.id === params.id);

    if (!dossier) {
      return new NextResponse("Dossier not found", { status: 404 });
    }

    return NextResponse.json(dossier);
  } catch (error) {
    console.error("Error fetching dossier:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
