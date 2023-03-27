/* eslint-disable jsx-a11y/alt-text */
import { Document, Page, View, Text, Image, PDFViewer, StyleSheet, Font } from "@react-pdf/renderer";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react";
import { periods } from "../../config";

const styles = StyleSheet.create({
    body: {
        paddingHorizontal: 20,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        alignContent: 'center',
        alignItems: 'center',
    },

    titulo: {
        display: 'flex',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: -10
    },

    registro: {
        fontSize: 10,
    },

    table: {
        display: "flex",
        flexDirection: "column",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0
    },

    tableRow: {
        width: '100%',
        display: "flex",
        flexDirection: "row",
    },

    tableCol: {
        fontSize: 10,
        fontWeight: 700
    },

    tableCell: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignContent: 'center',
        fontSize: 9,
        fontWeight: 'normal',
        flex: 1,
        textAlign: 'center',
        borderStyle: "solid",
        borderBottomWidth: 1,
        borderRightWidth: 1,
    }
})

const PDFView = ({ ...props }) => {
    const formatoFecha: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    const mensajeFechaNula = 'No Reportada';
    return (
        <PDFViewer style={{ height: '100vh', width: '100vw' }}>
            <Document title="Informe Gestion tributaria">
                <Page style={styles.body}>
                    <View style={styles.header}>
                        <Image src="/images/logo.png" style={{ height: 100, width: 100, alignSelf: 'flex-start' }} />

                        <View style={styles.titulo}>
                            <Text style={{}}>
                                Informe De Gestión Tributaria
                            </Text>
                        </View>

                        <View style={styles.registro}>
                            <Text>
                                Código: F-PS-20
                            </Text>
                            <Text>
                                Versión: 02
                            </Text>
                            <Text>
                                Fecha: 17/11/2016
                            </Text>
                        </View>
                    </View>

                    <View style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
                        <Text style={{ fontSize: 10, alignSelf: 'flex-end' }}>
                            Santa Marta D.T.C.H, {new Date().toLocaleDateString()}
                        </Text>
                    </View>

                    <View style={{ ...styles.table, marginTop: 10 }} >
                        <View style={styles.tableRow}>
                            <Text style={{ ...styles.tableCell, flex: 0.5, fontWeight: 'bold', fontSize: 12 }}>
                                Cliente
                            </Text>
                            <Text style={{ ...styles.tableCell, flex: 2 }}>
                                {props.cliente.nombre_empresa}
                            </Text>
                            <Text style={{ ...styles.tableCell, flex: 0.5, fontWeight: 'bold', fontSize: 12 }}>
                                NIT
                            </Text>
                            <Text style={styles.tableCell}>
                                {props.cliente.nit}
                            </Text>
                        </View>
                    </View>

                    <View style={{ ...styles.table, marginTop: 20 }}>

                        <View style={{ ...styles.tableRow }}>
                            <Text style={{ ...styles.tableCell, ...styles.tableCol }}>
                                Impuesto
                            </Text>
                            <Text style={{ ...styles.tableCell, ...styles.tableCol }}>
                                Periodo
                            </Text>
                            <Text style={{ ...styles.tableCell, ...styles.tableCol }}>
                                Vigencia
                            </Text>
                            <Text style={{ ...styles.tableCell, ...styles.tableCol }}>
                                Fecha de Vencimiento
                            </Text>
                            <Text style={{ ...styles.tableCell, ...styles.tableCol }}>
                                Fecha de Presentación
                            </Text>
                            <Text style={{ ...styles.tableCell, ...styles.tableCol }}>
                                Fecha de Pago
                            </Text>
                            <Text style={{ ...styles.tableCell, ...styles.tableCol }}>
                                Estado
                            </Text>
                        </View>x


                        {   
                            props.impuestos.map((impuesto: { nombre: string ; frecuencia: number,  fecha_limite: Date | null ; fecha_presentacion: Date | null ; fecha_pago:  Date | null }, index: number) => {
                                return (
                                    <View wrap={false} style={{ ...styles.tableRow }}>
                                        <Text style={{ ...styles.tableCell }}>
                                            {impuesto.nombre}
                                        </Text>
                                        <Text style={{ ...styles.tableCell }}>
                                            { periods.find(periodo => periodo.value == impuesto.frecuencia)?.name }
                                        </Text>
                                        <Text style={{ ...styles.tableCell }}>
                                            {`${impuesto.vigencia}` }
                                        </Text>
                                        <Text style={{ ...styles.tableCell }}>
                                            {impuesto.fecha_limite?.toLocaleDateString('es-co', formatoFecha)} 
                                        </Text>
                                        <Text style={{ ...styles.tableCell }}>
                                            {impuesto.fecha_presentacion?.toLocaleDateString('es-co', formatoFecha) || mensajeFechaNula}
                                        </Text>
                                        <Text style={{ ...styles.tableCell }}>
                                            {impuesto.fecha_pago?.toLocaleDateString('es-co', formatoFecha) || mensajeFechaNula}
                                        </Text>
                                        <Text style={{ ...styles.tableCell }}>
                                        </Text>
                                    </View>
                                )
                            })
                        }
                    </View>

                </Page>
            </Document>
        </PDFViewer>
    )
}
export default PDFView