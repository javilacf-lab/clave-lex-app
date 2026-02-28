"use client";

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { FileSearch, AlertCircle, Users } from 'lucide-react';

const ejecucionesData = [
  { name: 'Ene', auditorias: 4 },
  { name: 'Feb', auditorias: 7 },
  { name: 'Mar', auditorias: 5 },
  { name: 'Abr', auditorias: 12 },
  { name: 'May', auditorias: 8 },
  { name: 'Jun', auditorias: 15 },
];

const hallazgosData = [
  { name: 'Coincidencias', value: 65 },
  { name: 'Discrepancias', value: 35 },
];
const COLORS = ['#22c55e', '#ef4444'];

const topClientes = [
  { id: 1, nombre: 'TechCorp SA', auditorias: 24, riesgo: 'Alto' },
  { id: 2, nombre: 'Innovate SRL', auditorias: 18, riesgo: 'Bajo' },
  { id: 3, nombre: 'Global Logistics', auditorias: 15, riesgo: 'Medio' },
  { id: 4, nombre: 'Mega Retail', auditorias: 12, riesgo: 'Bajo' },
  { id: 5, nombre: 'Fintech Solutions', auditorias: 8, riesgo: 'Alto' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Resumen general de auditorías y hallazgos</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card flex items-center p-6 border-l-4 border-l-[var(--green-500)]">
          <div className="p-3 rounded-full bg-[var(--green-50)] text-[var(--green-600)] mr-4">
            <FileSearch size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Auditorías</p>
            <p className="text-3xl font-bold text-gray-900">142</p>
          </div>
        </div>

        <div className="card flex items-center p-6 border-l-4 border-l-red-500">
          <div className="p-3 rounded-full bg-red-50 text-red-600 mr-4">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Discrepancias Detectadas</p>
            <p className="text-3xl font-bold text-gray-900">854</p>
          </div>
        </div>

        <div className="card flex items-center p-6 border-l-4 border-l-blue-500">
          <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Clientes Activos</p>
            <p className="text-3xl font-bold text-gray-900">38</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Histórico (Bar Chart) */}
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Ejecuciones</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ejecucionesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                <Tooltip
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="auditorias" fill="var(--green-500)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico Doughnut */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Proporción de Hallazgos</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={hallazgosData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {hallazgosData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--green-500)]"></div>
              <span className="text-sm text-gray-600">Coincidencias</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">Discrepancias</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Clientes Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Clientes por Volumen de Auditorías</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Cliente</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Total Auditorías</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-600">Nivel de Riesgo Promedio</th>
              </tr>
            </thead>
            <tbody>
              {topClientes.map((cliente) => (
                <tr key={cliente.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{cliente.nombre}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{cliente.auditorias}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${cliente.riesgo === 'Alto' ? 'bg-red-100 text-red-800' :
                        cliente.riesgo === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'}`}>
                      {cliente.riesgo}
                    </span>
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
