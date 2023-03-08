import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getDepartamentos() {
    const departamentos = await prisma.departamentos.findMany();

    return departamentos;
}