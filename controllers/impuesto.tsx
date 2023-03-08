import { PrismaClient } from "@prisma/client";
import { nuevoImpuesto } from "../types";

const prisma = new PrismaClient();

export async function getImpuestos() {
    const impuestos = await prisma.nuevo_impuesto.findMany({
        include: {
            cuotas: {
                include: {
                    fechas_presentacion: true
                }
            }
        }
    });

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

export async function createImpuesto(impuesto: nuevoImpuesto) {
    const newImpuesto = await prisma.nuevo_impuesto.create({
        data: {
            nombre: impuesto.nombre,
            numero_digitos: impuesto.numero_digitos,
            departamento: impuesto.departamento,
            municipio: impuesto.municipio,
            persona: impuesto.persona,
            tipo: impuesto.tipo,
            frecuencia: impuesto.frecuencia,
        }
    });

    impuesto.cuotas.forEach(async (cuota, index) => {
        await prisma.cuotas.create({
            data: {
                number: index,
                nuevo_impuesto: {
                    connect: {
                        id: newImpuesto.id
                    }
                },
                fechas_presentacion: {
                    createMany: {
                        data: cuota.fechas_presentacion.map(fecha => {
                            return {
                                fecha: fecha.fecha,
                                nit: fecha.nit
                            }
                        })
                    }
                }
            }
        })
    })

    return newImpuesto;
}

export async function deleteImpuesto(id: number) {
    const deletedImpuesto = await prisma.nuevo_impuesto.delete({
        where: {
            id: id
        }
    });

    return deletedImpuesto;
}
export async function updateImpuesto(impuesto: nuevoImpuesto) {
    const updatedImpuesto = await prisma.nuevo_impuesto.update({
        where: {
            id: impuesto.id
        },
        data: {
            nombre: impuesto.nombre,
            numero_digitos: impuesto.numero_digitos,
            departamento: impuesto.departamento,
            municipio: impuesto.municipio,
            persona: impuesto.persona,
            tipo: impuesto.tipo,
            frecuencia: impuesto.frecuencia,
            cuotas: {
                deleteMany: {
                    tax: impuesto.id
                }
            }
        }
    })

    // update fechas_presentacion
    impuesto.cuotas.forEach(async (cuota, index) => {
        await prisma.cuotas.create({
            data: {
                number: index,
                nuevo_impuesto: {
                    connect: {
                        id: updatedImpuesto.id
                    }
                },
                fechas_presentacion: {
                    createMany: {
                        data: cuota.fechas_presentacion.map(fecha => {
                            return {
                                fecha: fecha.fecha,
                                nit: fecha.nit
                            }
                        })
                    }
                }
            }
        })
    }
    )

    return updatedImpuesto;
}