import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getImpuestos() {
    const impuestos = await prisma.nuevo_impuesto.findMany({ 
        include: {
            cuotas: {
                include: {
                    fechas_presentacion: true
                }
            }
    }});

    return impuestos;
}

export async function getImpuesto(id: number) {
    const impuesto = await prisma.nuevo_impuesto.findUnique({
        where: {
            id: id
        },
        include: {
            cuotas: {
                include: {
                    fechas_presentacion: true
                }
            }
        }
    });

    return impuesto;
}