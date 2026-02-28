import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const { email, webhookData } = data;

        if (!email) {
            return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
        }

        // Normalize payload: n8n often returns an array [ { ... } ] or nests in .body
        let payload = webhookData;
        if (Array.isArray(payload) && payload.length > 0) {
            payload = payload[0];
        }
        if (payload?.body && typeof payload.body === 'object') {
            payload = payload.body;
        } else if (payload?.data && typeof payload.data === 'object') {
            payload = payload.data;
        }

        console.log("--- PAYLOAD NORMALIZADO ---", JSON.stringify(payload, null, 2));

        // 1. Upsert Cliente
        const cliente = await prisma.cliente.upsert({
            where: { email },
            update: {
                totalAuditorias: { increment: 1 }
            },
            create: {
                email,
                nombreEmpresa: String(payload.cliente || email),
                totalAuditorias: 1
            }
        });

        // 2. Create Auditoria
        const auditoria = await prisma.auditoria.create({
            data: {
                clienteId: cliente.id,
                scoreRiesgo: payload.veredicto || 'Medio',
                estado: 'Pendiente Validación',
                periodo: payload.periodo || null,
                resumenEjecutivo: payload.resumen_ejecutivo || null
            }
        });

        // 3. Create Hallazgos
        if (payload.cifras_clave && Array.isArray(payload.cifras_clave)) {
            console.log(`--- SE ENCONTRARON ${payload.cifras_clave.length} CIFRAS CLAVE ---`);
            const hallazgosData = payload.cifras_clave.map((c: any) => ({
                auditoriaId: auditoria.id,
                concepto: String(c.concepto || ''),
                valorDeclarado: String(c.valor_declarado ?? ''),
                valorContabilidad: String(c.valor_contabilidad ?? ''),
                diferencia: String(c.diferencia ?? ''),
                estadoIa: String(c.estado || 'Diferencia'),
            }));

            await prisma.hallazgo.createMany({
                data: hallazgosData
            });
        } else {
            console.log("--- NO SE ENCONTRO EL ARRAY cifras_clave EN EL PAYLOAD ---", Object.keys(payload));
        }

        return NextResponse.json({ success: true, auditoriaId: auditoria.id });
    } catch (error) {
        console.log('--- ERROR EXACTO DE PRISMA ---', error);
        return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 });
    }
}
