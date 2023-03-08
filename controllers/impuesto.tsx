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

export async function updateImpuesto(impuesto: nuevoImpuesto) {
    console.log(impuesto);
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
                deleteMany: {},
                createMany: {
                    data: impuesto.cuotas.map(cuota => { 
                        return {
                            number: cuota.number,
                            tax: impuesto.id,
                            fechas_presentacion: {
                                createMany: {
                                    data: cuota.fechas_presentacion.map(fecha_presentacion => {
                                        return {
                                            fecha: fecha_presentacion.fecha
                                        }
                                    })
                                }
                            }
                        }
                    }) 
                }
            }
        }
    })

    return updatedImpuesto;
}