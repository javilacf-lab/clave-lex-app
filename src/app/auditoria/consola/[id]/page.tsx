"use client";

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Check, X, Eye, FileText, ChevronRight, Download, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
export default function ConsolaValidacion() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [auditoria, setAuditoria] = useState<any>(null);
    const [hallazgos, setHallazgos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/auditorias/${id}`)
            .then(res => res.json())
            .then(data => {
                setAuditoria(data);
                setHallazgos(data.hallazgos || []);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <Loader2 className="w-10 h-10 animate-spin text-[var(--green-600)]" />
                <p className="text-gray-500 font-medium tracking-wide animate-pulse">Cargando resultados de auditoría...</p>
            </div>
        );
    }

    if (!auditoria) {
        return (
            <div className="text-center py-20 text-gray-500">
                Auditoría no encontrada.
            </div>
        );
    }

    // Calculate Progress
    const total = hallazgos.length;
    const processed = total === 0 ? 0 : hallazgos.filter(h => h.estadoAuditor !== 'Pendiente').length;
    const isComplete = total > 0 && total === processed;

    const handleAction = async (hallazgoId: string, action: 'Aceptado' | 'Rechazado' | 'Inmaterial') => {
        // Optimistic UI update
        setHallazgos(prev => prev.map(h => h.id === hallazgoId ? { ...h, estadoAuditor: action } : h));

        // Server update
        try {
            await fetch(`/api/hallazgos/${hallazgoId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estadoAuditor: action })
            });
        } catch (e) {
            console.error('Failed to update hallazgo', e);
        }
    };

    const handleCommentChange = (hallazgoId: string, comment: string) => {
        setHallazgos(prev => prev.map(h => h.id === hallazgoId ? { ...h, comentarioAuditor: comment } : h));
    };

    const handleCommentBlur = async (hallazgoId: string, comment: string) => {
        try {
            await fetch(`/api/hallazgos/${hallazgoId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comentarioAuditor: comment })
            });
        } catch (e) {
            console.error('Failed to update comment', e);
        }
    };

    const handleGeneratePdf = async () => {
        setIsGenerating(true);
        try {
            // 1. Prepare payload
            const payload = {
                auditoriaId: auditoria.id,
                cliente: auditoria.cliente,
                scoreRiesgo: auditoria.scoreRiesgo,
                fechaCreacion: auditoria.fechaCreacion,
                periodo: auditoria.periodo,
                resumen_ejecutivo: auditoria.resumenEjecutivo,
                hallazgos: hallazgos.map(h => ({
                    concepto: h.concepto,
                    valorDeclarado: h.valorDeclarado,
                    valorContabilidad: h.valorContabilidad,
                    diferencia: h.diferencia,
                    estadoIa: h.estadoIa,
                    estadoAuditor: h.estadoAuditor,
                    comentarioAuditor: h.comentarioAuditor || ''
                }))
            };

            // 2. Send to Webhook
            const webhookRes = await fetch('https://javila20.app.n8n.cloud/webhook/confirmar-auditoria', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!webhookRes.ok) {
                throw new Error('Error al generar el reporte en n8n');
            }

            // 3. Update Audit Status in DB to 'Completada'
            await fetch(`/api/auditorias/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: 'Completada' })
            });

            // 4. Show success and redirect
            alert('Reporte generado y enviado al cliente con éxito.');
            router.push('/');

        } catch (e) {
            console.error(e);
            alert('Hubo un error al generar el reporte.');
        } finally {
            setIsGenerating(false);
        }
    };

    const isRiesgoAlto = auditoria.scoreRiesgo?.toUpperCase() === 'ALTO' || auditoria.scoreRiesgo?.toUpperCase() === 'RECHAZADO';
    const isValidated = auditoria.scoreRiesgo?.toUpperCase() === 'APROBADO' || auditoria.scoreRiesgo?.toUpperCase() === 'BAJO';

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* Header and Context */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                        <a href="/" className="hover:text-[var(--green-600)]">Dashboard</a>
                        <ChevronRight className="w-4 h-4 mx-1" />
                        <span>Auditorías</span>
                        <ChevronRight className="w-4 h-4 mx-1" />
                        <span className="font-medium text-gray-900">Validación ({auditoria.cliente?.nombreEmpresa || 'Desconocido'})</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Consola de Validación AI</h1>
                </div>

                <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${isRiesgoAlto ? 'bg-red-50 text-red-700 border-red-100' : isValidated ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                    {isRiesgoAlto ? <ShieldAlert className="w-5 h-5" /> : <span className="w-5 h-5 flex items-center justify-center font-bold">ℹ️</span>}
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold uppercase tracking-wide opacity-80">Veredicto IA</span>
                        <span className="font-bold">{auditoria.scoreRiesgo || 'MEDIO'}</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="card !p-4">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Progreso de Validación</p>
                        <p className="text-lg font-bold text-gray-900">{processed} de {total} hallazgos revisados</p>
                    </div>
                    <span className="text-sm font-bold text-[var(--green-600)]">{total > 0 ? Math.round((processed / total) * 100) : 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className="bg-[var(--green-500)] h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${total > 0 ? (processed / total) * 100 : 0}%` }}
                    ></div>
                </div>
            </div>

            {/* Interactive Findings Table */}
            <div className="card !p-0 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        Detalle de Discrepancias
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    {hallazgos.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No se encontraron hallazgos en esta auditoría.</div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Concepto</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase text-right">Declarado ERP</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase text-right">Contabilidad</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase text-right">Diferencia</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase text-center">Auditor</th>
                                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Comentarios</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {hallazgos.map((hallazgo) => {
                                    const isDiferencia = hallazgo.estadoIa?.toUpperCase().includes('DIFERENCIA');
                                    const isSuccess = hallazgo.estadoIa?.toUpperCase().includes('COINCIDE') || hallazgo.estadoIa?.toUpperCase().includes('APROBADO');

                                    return (
                                        <tr key={hallazgo.id} className={`transition-colors hover:bg-gray-50 ${hallazgo.estadoAuditor !== 'Pendiente' ? 'bg-gray-50/50' : 'bg-white'}`}>
                                            <td className="py-4 px-4">
                                                <p className="font-medium text-gray-900">{hallazgo.concepto}</p>
                                                <span className={`inline-flex items-center px-2 py-0.5 mt-1 rounded text-[10px] font-medium uppercase
                          ${isDiferencia ? 'bg-red-100 text-red-700' : isSuccess ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    AI: {hallazgo.estadoIa}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-right text-sm text-gray-600 font-mono">{hallazgo.valorDeclarado}</td>
                                            <td className="py-4 px-4 text-right text-sm text-gray-600 font-mono">{hallazgo.valorContabilidad}</td>
                                            <td className="py-4 px-4 text-right">
                                                <span className={`text-sm font-bold font-mono ${hallazgo.diferencia && hallazgo.diferencia !== '$0' && hallazgo.diferencia !== '0' ? 'text-red-600' : 'text-gray-900'}`}>
                                                    {hallazgo.diferencia}
                                                </span>
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleAction(hallazgo.id, 'Aceptado')}
                                                        title="Aceptar (Error Real)"
                                                        className={`p-2 rounded-md transition-colors ${hallazgo.estadoAuditor === 'Aceptado'
                                                            ? 'bg-[var(--green-100)] text-[var(--green-700)] ring-1 ring-[var(--green-500)]'
                                                            : 'bg-white border border-gray-200 text-gray-400 hover:text-[var(--green-600)] hover:bg-[var(--green-50)]'
                                                            }`}
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(hallazgo.id, 'Rechazado')}
                                                        title="Rechazar (Falso Positivo AI)"
                                                        className={`p-2 rounded-md transition-colors ${hallazgo.estadoAuditor === 'Rechazado'
                                                            ? 'bg-red-100 text-red-700 ring-1 ring-red-500'
                                                            : 'bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:bg-red-50'
                                                            }`}
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(hallazgo.id, 'Inmaterial')}
                                                        title="Inmaterial (Ignorar)"
                                                        className={`p-2 rounded-md transition-colors ${hallazgo.estadoAuditor === 'Inmaterial'
                                                            ? 'bg-gray-200 text-gray-700 ring-1 ring-gray-400'
                                                            : 'bg-white border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>

                                            {/* Comments */}
                                            <td className="py-4 px-4">
                                                <input
                                                    type="text"
                                                    placeholder="Añadir nota..."
                                                    className="w-full text-sm bg-transparent border-b border-dashed border-gray-300 focus:border-[var(--green-500)] focus:outline-none py-1 transition-colors"
                                                    value={hallazgo.comentarioAuditor || ''}
                                                    onChange={(e) => handleCommentChange(hallazgo.id, e.target.value)}
                                                    onBlur={(e) => handleCommentBlur(hallazgo.id, e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Floating Action Button (Sticky Bottom) */}
            <div className={`sticky bottom-6 flex justify-end transition-opacity duration-300 ${isComplete ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <button
                    onClick={handleGeneratePdf}
                    disabled={isGenerating}
                    className={`flex items-center gap-2 px-6 py-4 rounded-xl shadow-lg font-bold text-lg transition-all ${isGenerating ? 'bg-gray-400 cursor-not-allowed opacity-80' : 'bg-[var(--green-600)] hover:bg-[var(--green-700)] hover:-translate-y-1 text-white'}`}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generando Reporte...
                        </>
                    ) : (
                        <>
                            <Download className="w-5 h-5" />
                            Generar Reporte Final PDF
                        </>
                    )}
                </button>
            </div>

        </div>
    );
}

