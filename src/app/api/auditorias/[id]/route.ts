import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const auditoria = await prisma.auditoria.findUnique({
            where: { id },
            include: {
                cliente: true,
                hallazgos: true
            }
        });

        if (!auditoria) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(auditoria);
    } catch (error) {
        console.error('Error fetching auditoria:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        const updated = await prisma.auditoria.update({
            where: { id },
            data: { estado: body.estado }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating auditoria:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
