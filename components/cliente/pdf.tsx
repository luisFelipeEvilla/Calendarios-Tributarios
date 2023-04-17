/* eslint-disable jsx-a11y/alt-text */
import { Document, Page, View, Text, Image, PDFViewer, StyleSheet, Font } from "@react-pdf/renderer";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal } from "react";
import { periods } from "../../config";

Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

const styles = StyleSheet.create({
    body: {
        margin: 0,
        paddingHorizontal: 20,
        paddingBottom: 55
    },

    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 10,
        alignContent: 'center',
        alignItems: 'center',
    },

    titulo: {
        display: 'flex',
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: -10,
        fontFamily: 'Oswald'
    },

    registroContainer: {
        fontSize: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    registro: {
        display: 'flex',
        flexDirection: 'column',
    },

    table: {
        display: "flex",
        flexDirection: "column",
        width: "auto",
        borderStyle: "solid",
    },

    tableRow: {
        width: '100%',
        display: "flex",
        flexDirection: "row",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0
    },

    tableCol: {
        fontSize: 10,
        fontFamily: 'Oswald',
        fontWeight: 700,
        verticalAlign: 'sub',
        borderTopWidth: 1,
    },

    tableCell: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 9,
        fontWeight: 'normal',
        flex: 1,
        textAlign: 'center',
        borderStyle: "solid",
        borderBottomWidth: 1,
        borderRightWidth: 1,
    },

    footer: {
        display: 'flex',
        flexDirection: 'column',
        fontSize: 10,
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        borderStyle: 'solid',
        borderWidth: 0,
        borderTop: 1,
        borderColor: '#29C5F6',
        marginHorizontal: 60,
    }
})

const PDFView = ({ ...props }) => {
    const formatoFecha: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    const mensajeFechaNula = 'Sin registrar';
    return (
        <PDFViewer style={{ height: '100vh', width: '100vw' }} >
            <Document title={`Informe de Gestión Tributaria ${props.cliente.nombre_empresa}`}>
                <Page style={styles.body}>
                    <View style={styles.header} fixed>
                        <Image src="/images/logo.png" style={{ height: 60, width: 80, alignSelf: 'flex-start' }} />

                        <View style={styles.titulo}>
                            <Text style={{}}>
                                Informe de Gestión Tributaria
                            </Text>
                        </View>

                        <View>
                            <Text style={{ fontSize: 10 }}>
                                Santa Marta D.T.C.H, {new Date().toLocaleDateString()}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.registroContainer}>
                        <View style={styles.registro}>
                            <Text>
                                Código: F-PS-20
                            </Text>
                            <Text>
                                Versión: 03
                            </Text>
                            <Text>
                                Fecha: 01/04/2023
                            </Text>
                        </View>
                    </View>

                    <View style={{ ...styles.table, marginTop: 10, borderTop: 1 }} >
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

                    <View style={{ ...styles.table, marginTop: 20, marginBottom: 100 }}>

                        <View style={{ ...styles.tableRow }} fixed>
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
                                {'Fecha de \n presentación'}
                            </Text>
                            <Text style={{ ...styles.tableCell, ...styles.tableCol }}>
                                Fecha de Pago
                            </Text>
                            <Text style={{ ...styles.tableCell, ...styles.tableCol }}>
                                Estado
                            </Text>
                        </View>x


                        {
                            props.impuestos.map((impuesto: { nombre: string; frecuencia: number, vigencia: string, fecha_limite: Date; fecha_presentacion: Date | null; fecha_pago: Date | null }, index: number) => {
                                let estado = 'Sin registrar';
                                let color = { color: 'black' };

                                /* if (impuesto.fecha_presentacion) {
                                    const oportuno = impuesto.fecha_presentacion <= impuesto.fecha_limite;

                                    if (oportuno) { 
                                        estado = 'Oportuno' 
                                        color.color = 'green';
                                    } else { 
                                        estado = 'Extemporáneo'
                                        color.color = 'red';
                                    };
                                } else {
                                    if (impuesto.fecha_limite < new Date()) {
                                        estado = 'Extemporáneo';
                                        color.color = 'red';
                                    }
                                } */

                                return (
                                    <View key={index} wrap={false} style={{ ...styles.tableRow }}>
                                        <Text style={{ ...styles.tableCell }}>
                                            {impuesto.nombre}
                                        </Text>
                                        <Text style={{ ...styles.tableCell }}>
                                            {periods.find(periodo => periodo.value == impuesto.frecuencia)?.name}
                                        </Text>
                                        <Text style={{ ...styles.tableCell }}>
                                            {`${impuesto.vigencia}`}
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
                                        <Text style={{ ...styles.tableCell, ...color }}>
                                            {
                                                estado
                                            }
                                        </Text>
                                    </View>
                                )
                            })
                        }
                    </View>

                    <View wrap={false} style={{ ...styles.footer }} fixed>
                        <View style={{ border: 1, borderColor: '#' }}>

                        </View>
                        <Text style={{ fontWeight: 'bold' }}>
                            R&R Consultorias Empresariales S.A.S
                        </Text>
                        <Text>
                            Correo Electrónico: gerencia@rrconsultorias.com
                        </Text>
                        <Text>
                            Avenida del Ferrocarril No. 29-200 - Edificio El Mayor Bussiness Center Oficina 101 Santa Marta D.T.C.H
                        </Text>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    )
}
export default PDFView