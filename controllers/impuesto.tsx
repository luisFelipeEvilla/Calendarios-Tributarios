import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getImpuestos() {
    const impuestos = await prisma.nuevo_impuesto.findMany({
        include: {
            cuotas: true
        }
    });

    return impuestos;
}