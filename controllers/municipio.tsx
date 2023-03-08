import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function getMunicipios() {
    const municipios = prisma.municipios.findMany();

    return municipios;
}