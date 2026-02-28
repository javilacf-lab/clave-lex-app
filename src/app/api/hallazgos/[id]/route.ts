import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { estadoAuditor, comentarioAuditor } = body;

        const dataToUpdate: any = {};
        if (estadoAuditor) dataToUpdate.estadoAuditor = estadoAuditor;
        if (comentarioAuditor !== undefined) dataToUpdate.comentarioAuditor = comentarioAuditor;

        const hallazgo = await prisma.hallazgo.update({
            where: { id },
            data: dataToUpdate
        });

        return NextResponse.json(hallazgo);
    } catch (error) {
        console.error('Error updating hallazgo:', error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
