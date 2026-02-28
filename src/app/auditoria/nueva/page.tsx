"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileType, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NuevaAuditoria() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [declaracion, setDeclaracion] = useState<File | null>(null);
    const [contabilidad, setContabilidad] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const onDropDeclaracion = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) setDeclaracion(acceptedFiles[0]);
    }, []);

    const onDropContabilidad = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) setContabilidad(acceptedFiles[0]);
    }, []);

    const { getRootProps: getRootPropsDec, getInputProps: getInputPropsDec, isDragActive: isDragActiveDec } = useDropzone({
        onDrop: onDropDeclaracion,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1
    });

    const { getRootProps: getRootPropsCont, getInputProps: getInputPropsCont, isDragActive: isDragActiveCont } = useDropzone({
        onDrop: onDropContabilidad,
        accept: { 'application/pdf': ['.pdf'], 'application/vnd.ms-excel': ['.xls', '.xlsx'], 'text/csv': ['.csv'] },
        maxFiles: 1
    });

    const handleStartAudit = async () => {
        if (!email || !declaracion || !contabilidad) return;

        setIsProcessing(true);
        setError('');

        try {
            // 1. Create FormData for n8n Webhook
            const formData = new FormData();
            formData.append('declaracion', declaracion);
            formData.append('contabilidad', contabilidad);
            formData.append('email', email);

            // 2. POST to n8n Webhook
            const webhookResponse = await fetch('https://javila20.app.n8n.cloud/webhook-test/Fisco-IA-V2', {
                method: 'POST',
                body: formData
            });

            if (!webhookResponse.ok) {
                throw new Error(`Error en el servicio de IA: ${webhookResponse.statusText}`);
            }

            const webhookData = await webhookResponse.json();

            // 3. Save to local Database via API Route
            const dbResponse = await fetch('/api/auditorias', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, webhookData })
            });

            if (!dbResponse.ok) {
                throw new Error('Error al guardar en la base de datos local');
            }

            const dbResult = await dbResponse.json();

            // 4. Redirect to the real validation console
            if (dbResult.success && dbResult.auditoriaId) {
                router.push(`/auditoria/consola/${dbResult.auditoriaId}`);
            } else {
                throw new Error('No se pudo obtener el ID de auditoría');
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Ocurrió un error inesperado al procesar los documentos.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Nueva Auditoría</h1>
                <p className="text-gray-500 mt-1">Sube los documentos del cliente para su análisis con IA.</p>
            </div>

            <div className="card space-y-6">
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Cliente Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email del Cliente
                    </label>
                    <input
                        type="email"
                        className="input-field"
                        placeholder="ej. contacto@empresa.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* Drag & Drop Zones */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">

                    {/* Declaracion PDF */}
                    <div
                        {...getRootPropsDec()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
              ${isDragActiveDec ? 'border-[var(--green-500)] bg-[var(--green-50)]' :
                                declaracion ? 'border-[var(--green-500)] bg-[var(--green-50)]' : 'border-gray-300 hover:border-[var(--green-400)] hover:bg-gray-50'}`}
                    >
                        <input {...getInputPropsDec()} />
                        {declaracion ? (
                            <div className="flex flex-col items-center space-y-2">
                                <CheckCircle className="w-10 h-10 text-[var(--green-600)]" />
                                <p className="font-medium text-[var(--green-800)]">{declaracion.name}</p>
                                <p className="text-xs text-[var(--green-600)]">Declaración cargada</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center space-y-3">
                                <div className="p-3 bg-white shadow-sm rounded-full">
                                    <FileType className="w-8 h-8 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Declaración de Impuestos</p>
                                    <p className="text-xs text-gray-500 mt-1">Arrastra el PDF aquí o haz clic para subir</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contabilidad */}
                    <div
                        {...getRootPropsCont()}
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
              ${isDragActiveCont ? 'border-blue-500 bg-blue-50' :
                                contabilidad ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
                    >
                        <input {...getInputPropsCont()} />
                        {contabilidad ? (
                            <div className="flex flex-col items-center space-y-2">
                                <CheckCircle className="w-10 h-10 text-blue-600" />
                                <p className="font-medium text-blue-800">{contabilidad.name}</p>
                                <p className="text-xs text-blue-600">Contabilidad cargada</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center space-y-3">
                                <div className="p-3 bg-white shadow-sm rounded-full">
                                    <UploadCloud className="w-8 h-8 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Libros Contables / Reportes</p>
                                    <p className="text-xs text-gray-500 mt-1">Soporta PDF, Excel o CSV</p>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* Action Button */}
                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                        <AlertCircle className="w-4 h-4 mr-2 text-[var(--green-600)]" />
                        <span className="italic">Procesamiento con IA puede tardar 15-30 segundos...</span>
                    </div>
                    <button
                        onClick={handleStartAudit}
                        disabled={!email || !declaracion || !contabilidad || isProcessing}
                        className={`btn-primary ${(!email || !declaracion || !contabilidad || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analizando con IA...
                            </>
                        ) : (
                            'Iniciar Auditoría con IA'
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}
