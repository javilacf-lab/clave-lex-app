-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombreEmpresa" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "totalAuditorias" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Auditoria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clienteId" TEXT NOT NULL,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'Procesando IA',
    "scoreRiesgo" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Auditoria_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Hallazgo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "auditoriaId" TEXT NOT NULL,
    "concepto" TEXT NOT NULL,
    "valorDeclarado" TEXT NOT NULL,
    "valorContabilidad" TEXT NOT NULL,
    "diferencia" TEXT NOT NULL,
    "estadoIa" TEXT NOT NULL,
    "estadoAuditor" TEXT NOT NULL DEFAULT 'Pendiente',
    "comentarioAuditor" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Hallazgo_auditoriaId_fkey" FOREIGN KEY ("auditoriaId") REFERENCES "Auditoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");
