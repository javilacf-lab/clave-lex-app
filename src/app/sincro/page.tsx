"use client";

import React from "react";
import { RefreshCw, Download, FileText, CheckCircle2, AlertCircle, Clock } from "lucide-react";

// Mock Data
const INVOICES = [
    { id: "FE-1045", proveedor: "Papelería Panamericana SAS", nit: "860.002.580-0", fecha: "2026-03-01", valor: 1250000, estado: "Sincronizado" },
    { id: "FE-1046", proveedor: "Software Solutions LTDA", nit: "900.123.456-7", fecha: "2026-03-02", valor: 4500000, estado: "Sincronizado" },
    { id: "FE-1047", proveedor: "Muebles Jamar S.A.", nit: "890.987.654-3", fecha: "2026-03-05", valor: 8900000, estado: "Pendiente" },
    { id: "FE-1048", proveedor: "Claro Colombia", nit: "800.153.993-7", fecha: "2026-03-08", valor: 650000, estado: "Sincronizado" },
    { id: "FE-1049", proveedor: "Consultorías y Asesorías ABC", nit: "901.234.567-8", fecha: "2026-03-09", valor: 2100000, estado: "Error" },
    { id: "FE-1050", proveedor: "Transportes Gómez", nit: "860.555.444-1", fecha: "2026-03-10", valor: 350000, estado: "Sincronizado" },
];

export default function SincroDianPage() {
    const handleDownload = () => {
        alert("Descargando archivo plano estructurado para Siesa...");
    };

    const getStatusBadge = (estado: string) => {
        switch (estado) {
            case "Sincronizado":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Sincronizado
                    </span>
                );
            case "Pendiente":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3.5 h-3.5" />
                        Pendiente
                    </span>
                );
            case "Error":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Error
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {estado}
                    </span>
                );
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="space-y-6">
            {/* Header and Action */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-[#e4e7ed]">
                <div>
                    <h1 className="text-2xl font-bold text-[#111827]">Sincronización DIAN - ERP</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Gestiona la recepción de facturas electrónicas y su sincronización con Siesa.
                    </p>
                </div>
                <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--green-600)] hover:bg-[var(--green-700)] text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                >
                    <Download className="w-4 h-4" />
                    Descargar Archivo Plano (Siesa)
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e4e7ed] flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <FileText className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-500">Facturas Recibidas (Mes)</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 mt-2">142</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e4e7ed] flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <RefreshCw className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-500">Sincronizadas con ERP</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-600 mt-2">138</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e4e7ed] flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-500">Pendientes / Errores</h3>
                    </div>
                    <p className="text-3xl font-bold text-orange-600 mt-2">4</p>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-[#e4e7ed] overflow-hidden">
                <div className="px-6 py-4 border-b border-[#e4e7ed]">
                    <h2 className="text-lg font-semibold text-[#111827]">Registro de Sincronización</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 border-b border-[#e4e7ed]">
                                <th className="px-6 py-3 font-medium">ID Factura</th>
                                <th className="px-6 py-3 font-medium">Proveedor</th>
                                <th className="px-6 py-3 font-medium">NIT</th>
                                <th className="px-6 py-3 font-medium">Fecha</th>
                                <th className="px-6 py-3 font-medium text-right">Valor Total</th>
                                <th className="px-6 py-3 font-medium text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e4e7ed]">
                            {INVOICES.map((invoice, index) => (
                                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {invoice.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {invoice.proveedor}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {invoice.nit}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {invoice.fecha}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                        {formatCurrency(invoice.valor)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {getStatusBadge(invoice.estado)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
