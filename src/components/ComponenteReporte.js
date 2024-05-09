import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import '../styles/apartado-reportes-style.css';
const ComponenteReporte = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [ventas, setVentas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCooperativaIdAndVentas = async () => {
    const usuarioId = localStorage.getItem("userId");
    if (!usuarioId) {
      setError("No se encontró el ID del usuario en localStorage");
      setIsLoading(false);
      return;
    }

    try {
      const responseCooperativa = await axios.get(`http://127.0.0.1:8000/api/cooperativa/${usuarioId}/`);
      if (responseCooperativa.data.id) {
        const startDate = `${year}-${month}-01`;
        const endDate = `${year}-${month}-${new Date(year, month, 0).getDate()}`;
        let url = `http://127.0.0.1:8000/api/cooperativas/${responseCooperativa.data.id}/ventas/?estado=entregado&fecha_inicio=${startDate}&fecha_fin=${endDate}`;

        const responseVentas = await axios.get(url);
        setVentas(responseVentas.data);
      } else {
        setError("No hay ID de cooperativa asociada con este usuario");
      }
    } catch (error) {
      console.error("Error al cargar la cooperativa y las ventas:", error);
      setError("Hubo un error al cargar las ventas de la cooperativa: " + error.message);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchCooperativaIdAndVentas();
  }, [month, year]);

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const generatePDF = () => {
    if (ventas.length === 0) {
      alert("No hay ventas para el periodo seleccionado.");
      return;
    }
  
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text(`Reporte de Ventas Mensual: ${month}/${year}`, 14, 15);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
  
    ventas.forEach((venta, index) => {
      const startY = index === 0 ? 25 : doc.lastAutoTable.finalY + 10;
  
      // Cabecera para cada venta
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(128, 0, 128); // Color Morado para los títulos de sección
      doc.text(`Detalles de la Venta ID: ${venta.id}`, 14, startY);
  
      const ventaDetails = [
        ["Fecha:", `${venta.fecha} ${venta.hora}`],
        ["Precio Venta:", `$${venta.precio_venta ? venta.precio_venta.toFixed(2) : '0.00'}`],
        ["Gasto Envío:", `$${venta.gasto_envio ? venta.gasto_envio.toFixed(2) : '0.00'}`],
        ["Subtotal:", `$${venta.subtotal ? venta.subtotal.toFixed(2) : '0.00'}`],
        ["Total SN:", `$${venta.total_sn ? venta.total_sn.toFixed(2) : '0.00'}`],
        ["Número Pago:", venta.numero_pago],
        ["Método Pago:", venta.metodo_pago],
      ];
  
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(0);
      doc.autoTable({
        startY: startY + 5,
        head: [['Campo', 'Valor']],
        body: ventaDetails,
        theme: 'plain',
        columnStyles: { 0: { fontStyle: 'bold', fillColor: false } },
        styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }
      });
  
      // Detalles de los productos en esta venta
      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(128, 0, 128); // Morado para los títulos
      doc.text('Productos Vendidos:', 14, doc.lastAutoTable.finalY + 10);
      const productDetails = venta.detalles.map(detalle => [
        detalle.producto.nombre,
        detalle.cantidad,
        `$${detalle.precio.toFixed(2)}`
      ]);
  
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(0);
      doc.autoTable({
        head: [['Producto', 'Cantidad', 'Precio']],
        body: productDetails,
        theme: 'striped',
        startY: doc.lastAutoTable.finalY + 5,
        styles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }
      });
    });
  
    doc.save(`reporte_ventas_${month}-${year}.pdf`);
  };
  
  const generateExcel = () => {
    if (ventas.length === 0) {
      alert("No hay ventas para el periodo seleccionado.");
      return;
    }
  
    const wb = XLSX.utils.book_new();
  
    ventas.forEach((venta, index) => {
      const ws = XLSX.utils.json_to_sheet([]);
  
      // Establecer encabezados para la hoja
      XLSX.utils.sheet_add_aoa(ws, [['Detalles de la Venta']], {origin: "A1"});
      XLSX.utils.sheet_add_aoa(ws, [[
        "Fecha", 
        "Precio Venta", 
        "Gasto Envío", 
        "Subtotal", 
        "Total SN", 
        "Estado", 
        "Número Seguimiento", 
        "Número Pago", 
        "Método Pago", 
        "Estado Pedido"
      ]], {origin: -1}); // Añade después de la última fila
  
      // Aplicar estilos a los encabezados
      const headerRange = XLSX.utils.decode_range(ws['!ref']);
      for(let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
        const address = XLSX.utils.encode_col(C) + "2"; // Row 2 is where headers are
        if(!ws[address]) ws[address] = {};
        ws[address].s = {
          fill: { fgColor: { rgb: "FFFF00" } }, // Yellow fill
          font: { bold: true },
          alignment: { horizontal: "center" }
        };
      }
  
      // Agregar datos de venta
      const data = [
        [
          venta.fecha + ' ' + venta.hora,
          `$${venta.precio_venta ? venta.precio_venta.toFixed(2) : '0.00'}`,
          `$${venta.gasto_envio ? venta.gasto_envio.toFixed(2) : '0.00'}`,
          `$${venta.subtotal ? venta.subtotal.toFixed(2) : '0.00'}`,
          `$${venta.total_sn ? venta.total_sn.toFixed(2) : '0.00'}`,
          venta.numero_pago,
          venta.metodo_pago,
        ]
      ];
  
      XLSX.utils.sheet_add_json(ws, data, {origin: -1, skipHeader: true});
  
      // Detalles de productos
      XLSX.utils.sheet_add_aoa(ws, [['Productos Vendidos']], {origin: -1});
      XLSX.utils.sheet_add_json(ws, venta.detalles.map(detalle => ({
        Producto: detalle.producto.nombre,
        Cantidad: detalle.cantidad,
        Precio: `$${detalle.precio.toFixed(2)}`
      })), {origin: -1});
  
      XLSX.utils.book_append_sheet(wb, ws, `Venta ID ${venta.id}`);
    });
  
    // Guardar el libro
    XLSX.writeFile(wb, `reporte_ventas_${month}-${year}.xlsx`);
  };
  
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="reportes-container">
      <h2>Generar Reporte de Ventas Mensual</h2>
      <div>
        <label>
          Mes:
          <select value={month} onChange={handleMonthChange}>
            {monthNames.map((name, index) => (
              <option key={index + 1} value={index + 1}>{name}</option>
            ))}
          </select>
        </label>
        <label>
          Año:
          <select value={year} onChange={handleYearChange}>
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ))}
          </select>
        </label>
        <div className="button-container">
          <button onClick={generatePDF}>Obtener PDF</button>
          <button onClick={generateExcel}>Obtener Excel</button>
          <button onClick={fetchCooperativaIdAndVentas}>Cargar Datos</button>
        </div>
      </div>
      {isLoading ? <p>Cargando...</p> : null}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default ComponenteReporte;