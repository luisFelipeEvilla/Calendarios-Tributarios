"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { periods } from "../../config";

interface Impuesto {
  id: number;
  nombre: string;
  frecuencia: number;
  vigencia: string;
  fecha_limite: Date;
  fecha_presentacion: Date | null;
  fecha_pago: Date | null;
}

interface PDFViewProps {
  cliente: {
    nombre_empresa: string;
    nit: string;
  };
  impuestos: Impuesto[];
}

const formatoFecha: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

function formatearFecha(fecha: Date | null): string {
  if (!fecha) return "Sin registrar";
  return fecha.toLocaleDateString("es-CO", formatoFecha);
}

function getPeriodoNombre(frecuencia: number): string {
  return periods.find((p) => p.value === frecuencia)?.name || "-";
}

function parseVigencia(vigencia: string): { año: string; periodo: string } {
  const parts = vigencia.split(" - ");
  return {
    año: parts[0] || "-",
    periodo: parts[1] || "-",
  };
}

function sortImpuestos(impuestos: Impuesto[]): Impuesto[] {
  return [...impuestos].sort((a, b) => {
    const parsedA = parseVigencia(a.vigencia);
    const parsedB = parseVigencia(b.vigencia);

    // 1. Ordenar por periodo (número)
    const periodoA = parseInt(parsedA.periodo) || 0;
    const periodoB = parseInt(parsedB.periodo) || 0;
    if (periodoA !== periodoB) return periodoA - periodoB;

    // 2. Ordenar por vigencia (año)
    const añoA = parseInt(parsedA.año) || 0;
    const añoB = parseInt(parsedB.año) || 0;
    if (añoA !== añoB) return añoA - añoB;

    // 3. Ordenar por nombre del impuesto (alfabético)
    return a.nombre.localeCompare(b.nombre);
  });
}

function calcularEstado(fechaLimite: Date | null, fechaPresentacion: Date | null): string {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Si no hay fecha límite, no podemos determinar el estado
  if (!fechaLimite) return "Sin registrar";

  const limite = new Date(fechaLimite);
  limite.setHours(0, 0, 0, 0);

  // Si todavía no ha llegado la fecha de vencimiento → Oportuno (aún tiene tiempo)
  if (limite >= hoy && !fechaPresentacion) {
    return "Pendiente";
  }

  // Si hay fecha de presentación
  if (fechaPresentacion) {
    const presentacion = new Date(fechaPresentacion);
    presentacion.setHours(0, 0, 0, 0);

    // Si la fecha de presentación es posterior a la fecha límite → Extemporáneo
    if (presentacion > limite) {
      return "Extemporáneo";
    }
    // Si la fecha de presentación es anterior o igual a la fecha límite → Oportuno
    return "Oportuno";
  }

  // Si ya pasó la fecha límite y no hay presentación → Extemporáneo
  if (limite < hoy) {
    return "Extemporáneo";
  }

  return "Pendiente";
}

export default function PDFView({ cliente, impuestos }: PDFViewProps) {
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "letter",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    // Header - Logo placeholder y título
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Informe de Gestión Tributaria", pageWidth / 2, 20, { align: "center" });

    // Fecha
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Santa Marta D.T.C.H, ${new Date().toLocaleDateString("es-CO")}`, pageWidth - margin, 20, { align: "right" });

    // Registro
    doc.setFontSize(8);
    doc.text("Código: F-PS-20", pageWidth - margin, 28, { align: "right" });
    doc.text("Versión: 03", pageWidth - margin, 32, { align: "right" });
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-CO")}`, pageWidth - margin, 36, { align: "right" });

    // Tabla de información del cliente
    autoTable(doc, {
      startY: 42,
      head: [],
      body: [
        [
          { content: "Cliente", styles: { fontStyle: "bold", fillColor: [249, 250, 251] } },
          { content: cliente.nombre_empresa },
          { content: "NIT", styles: { fontStyle: "bold", fillColor: [249, 250, 251] } },
          { content: cliente.nit },
        ],
      ],
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [156, 163, 175],
        lineWidth: 0.2,
      },
      columnStyles: {
        0: { cellWidth: 20 },
        2: { cellWidth: 15 },
        3: { cellWidth: 35 },
      },
      margin: { left: margin, right: margin },
    });

    // Preparar datos de la tabla de impuestos (ordenados)
    const impuestosOrdenados = sortImpuestos(impuestos);
    const tableData = impuestosOrdenados.map((impuesto) => {
      const { año, periodo } = parseVigencia(impuesto.vigencia);
      const estado = calcularEstado(impuesto.fecha_limite, impuesto.fecha_presentacion);
      return [
        impuesto.nombre,
        año,
        periodo,
        formatearFecha(impuesto.fecha_limite),
        formatearFecha(impuesto.fecha_presentacion),
        formatearFecha(impuesto.fecha_pago),
        estado,
      ];
    });

    // Si no hay impuestos, mostrar mensaje
    if (tableData.length === 0) {
      tableData.push(["No hay impuestos registrados", "", "", "", "", "", ""]);
    }

    // Tabla de impuestos
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 10,
      head: [
        [
          "Impuesto",
          "Vigencia",
          "Periodo",
          "Fecha de Vencimiento",
          "Fecha de Presentación",
          "Fecha de Pago",
          "Estado",
        ],
      ],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [243, 244, 246],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        fontSize: 8,
        halign: "center",
      },
      styles: {
        fontSize: 7,
        cellPadding: 2,
        lineColor: [156, 163, 175],
        lineWidth: 0.2,
        halign: "center",
        valign: "middle",
      },
      margin: { left: margin, right: margin },
      didParseCell: (data) => {
        // Colorear la columna de estado (índice 6)
        if (data.section === "body" && data.column.index === 6) {
          const estado = data.cell.raw as string;
          if (estado === "Extemporáneo") {
            data.cell.styles.textColor = [220, 38, 38]; // red-600
            data.cell.styles.fontStyle = "bold";
          } else if (estado === "Oportuno") {
            data.cell.styles.textColor = [22, 163, 74]; // green-600
            data.cell.styles.fontStyle = "bold";
          } else {
            data.cell.styles.textColor = [107, 114, 128]; // gray-500
          }
        }
      },
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    
    // Línea decorativa
    doc.setDrawColor(34, 211, 238); // cyan-400
    doc.setLineWidth(0.5);
    doc.line(margin, finalY, pageWidth - margin, finalY);

    // Texto del footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("R&R Consultorias Empresariales S.A.S", pageWidth / 2, finalY + 6, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99); // gray-600
    doc.text("Correo Electrónico: gerencia@rrconsultorias.com", pageWidth / 2, finalY + 11, { align: "center" });
    doc.text(
      "Avenida del Ferrocarril No. 29-200 - Edificio El Mayor Bussiness Center Oficina 101 Santa Marta D.T.C.H",
      pageWidth / 2,
      finalY + 16,
      { align: "center" }
    );

    // Guardar PDF
    doc.save(`Informe-Gestion-Tributaria-${cliente.nombre_empresa}.pdf`);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "16px" }}>
      {/* Botón de descarga */}
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "center" }}>
        <button
          onClick={generatePDF}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          📥 Descargar PDF
        </button>
      </div>

      {/* Previsualización */}
      <div
        style={{
          width: "816px",
          minHeight: "1056px",
          padding: "40px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <img
            src="/images/logo.png"
            alt="Logo"
            style={{ height: "64px", width: "80px", objectFit: "contain" }}
          />
          <h1 style={{ fontSize: "18px", fontWeight: "bold", textAlign: "center", margin: 0, color: "#000" }}>
            Informe de Gestión Tributaria
          </h1>
          <p style={{ fontSize: "12px", color: "#4b5563", margin: 0 }}>
            Santa Marta D.T.C.H, {new Date().toLocaleDateString("es-CO")}
          </p>
        </div>

        {/* Registro */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
          <div style={{ fontSize: "10px", color: "#4b5563", textAlign: "right" }}>
            <p style={{ margin: "2px 0" }}>Código: F-PS-20</p>
            <p style={{ margin: "2px 0" }}>Versión: 03</p>
            <p style={{ margin: "2px 0" }}>Fecha: {new Date().toLocaleDateString("es-CO")}</p>
          </div>
        </div>

        {/* Info Cliente */}
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px" }}>
          <tbody>
            <tr>
              <td style={{ border: "1px solid #9ca3af", padding: "8px 12px", fontWeight: "bold", fontSize: "12px", backgroundColor: "#f9fafb", width: "80px" }}>
                Cliente
              </td>
              <td style={{ border: "1px solid #9ca3af", padding: "8px 12px", fontSize: "12px" }}>
                {cliente.nombre_empresa}
              </td>
              <td style={{ border: "1px solid #9ca3af", padding: "8px 12px", fontWeight: "bold", fontSize: "12px", backgroundColor: "#f9fafb", width: "64px" }}>
                NIT
              </td>
              <td style={{ border: "1px solid #9ca3af", padding: "8px 12px", fontSize: "12px", width: "128px" }}>
                {cliente.nit}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Tabla de Impuestos */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
          <thead>
            <tr style={{ backgroundColor: "#f3f4f6" }}>
              <th style={{ border: "1px solid #9ca3af", padding: "8px", fontWeight: "bold" }}>Impuesto</th>
              <th style={{ border: "1px solid #9ca3af", padding: "8px", fontWeight: "bold" }}>Vigencia</th>
              <th style={{ border: "1px solid #9ca3af", padding: "8px", fontWeight: "bold" }}>Periodo</th>
              <th style={{ border: "1px solid #9ca3af", padding: "8px", fontWeight: "bold" }}>Fecha de Vencimiento</th>
              <th style={{ border: "1px solid #9ca3af", padding: "8px", fontWeight: "bold" }}>Fecha de Presentación</th>
              <th style={{ border: "1px solid #9ca3af", padding: "8px", fontWeight: "bold" }}>Fecha de Pago</th>
              <th style={{ border: "1px solid #9ca3af", padding: "8px", fontWeight: "bold" }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {impuestos.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ border: "1px solid #9ca3af", padding: "16px 8px", textAlign: "center", color: "#6b7280" }}>
                  No hay impuestos registrados
                </td>
              </tr>
            ) : (
              sortImpuestos(impuestos).map((impuesto, index) => {
                const { año, periodo } = parseVigencia(impuesto.vigencia);
                const estado = calcularEstado(impuesto.fecha_limite, impuesto.fecha_presentacion);
                const estadoColor = estado === "Extemporáneo" ? "#dc2626" : estado === "Oportuno" ? "#16a34a" : "#6b7280";
                return (
                  <tr key={index}>
                    <td style={{ border: "1px solid #9ca3af", padding: "6px 8px", textAlign: "center" }}>{impuesto.nombre}</td>
                    <td style={{ border: "1px solid #9ca3af", padding: "6px 8px", textAlign: "center" }}>{año}</td>
                    <td style={{ border: "1px solid #9ca3af", padding: "6px 8px", textAlign: "center" }}>{periodo}</td>
                    <td style={{ border: "1px solid #9ca3af", padding: "6px 8px", textAlign: "center" }}>{formatearFecha(impuesto.fecha_limite)}</td>
                    <td style={{ border: "1px solid #9ca3af", padding: "6px 8px", textAlign: "center" }}>{formatearFecha(impuesto.fecha_presentacion)}</td>
                    <td style={{ border: "1px solid #9ca3af", padding: "6px 8px", textAlign: "center" }}>{formatearFecha(impuesto.fecha_pago)}</td>
                    <td style={{ border: "1px solid #9ca3af", padding: "6px 8px", textAlign: "center", color: estadoColor, fontWeight: "bold" }}>{estado}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{ borderTop: "2px solid #22d3ee", paddingTop: "12px", textAlign: "center", fontSize: "10px", marginTop: "40px" }}>
          <p style={{ fontWeight: "bold", margin: "4px 0", color: "#000000" }}>
            R&R Consultorias Empresariales S.A.S
          </p>
          <p style={{ color: "#4b5563", margin: "2px 0" }}>
            Correo Electrónico: gerencia@rrconsultorias.com.co
          </p>
          <p style={{ color: "#4b5563", margin: "2px 0" }}>
            Avenida del Ferrocarril No. 29-200 - Edificio El Mayor Bussiness Center Oficina 101 Santa Marta D.T.C.H
          </p>
        </div>
      </div>
    </div>
  );
}
