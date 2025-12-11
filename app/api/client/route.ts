import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url = `${process.env.API_URL}/cliente`;
    const response = await axios.get(url);

    return NextResponse.json(response.data.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener los clientes", detail: error },
      { status: 500 }
    );
  }
}
