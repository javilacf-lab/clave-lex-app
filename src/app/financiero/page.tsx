"use client";

import React from "react";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend,
} from "recharts";
import {
    TrendingUp,
    DollarSign,
    Users,
    Briefcase,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";

// --- Mock Data ---

const kpiData = [
    {
        title: "Ingresos Operacionales",
        value: "$1,250M",
        change: "+12%",
        isPositive: true,
        icon: DollarSign,
    },
    {
        title: "Margen EBITDA",
        value: "24.5%",
        change: "+2.1%",
        isPositive: true,
        icon: TrendingUp,
    },
    {
        title: "Flujo de Caja Libre (FCF)",
        value: "$320M",
        change: "-5%",
        isPositive: false,
        icon: Briefcase,
    },
    {
        title: "Ingreso por Empleado",
        value: "$45M",
        change: "+8%",
        isPositive: true,
        icon: Users,
        subtitle: "Basado en 28 personas",
    },
];

const trendData = [
    { month: "Ene", ingresos: 800, gastos: 600 },
    { month: "Feb", ingresos: 950, gastos: 650 },
    { month: "Mar", ingresos: 1100, gastos: 700 },
    { month: "Abr", ingresos: 1050, gastos: 750 },
    { month: "May", ingresos: 1200, gastos: 800 },
    { month: "Jun", ingresos: 1350, gastos: 850 },
    { month: "Jul", ingresos: 1300, gastos: 820 },
    { month: "Ago", ingresos: 1450, gastos: 880 },
    { month: "Sep", ingresos: 1550, gastos: 900 },
    { month: "Oct", ingresos: 1600, gastos: 950 },
    { month: "Nov", ingresos: 1500, gastos: 920 },
    { month: "Dic", ingresos: 1750, gastos: 1000 },
];

const expenseCompositionData = [
    { name: "Nómina", value: 45 },
    { name: "Impuestos", value: 20 },
    { name: "Tecnología", value: 15 },
    { name: "Otros", value: 20 },
];

const COLORS = ["#0ea5e9", "#10b981", "#6366f1", "#f59e0b"]; // Blue, Emerald, Indigo, Amber
const PIE_COLORS = ["#1e40af", "#047857", "#4338ca", "#64748b"]; // Darker professional colors

const budgetExecutionData = [
    { category: "Marketing", real: 120, presupuestado: 100 },
    { category: "Operaciones", real: 450, presupuestado: 480 },
    { category: "Ventas", real: 300, presupuestado: 280 },
    { category: "I+D", real: 150, presupuestado: 160 },
    { category: "Admin", real: 200, presupuestado: 190 },
];

const topVariations = [
    { concepto: "Licencias Software", variacion: "+$25M", tipo: "Gasto", porcentaje: "+15%" },
    { concepto: "Viáticos Comerciales", variacion: "+$18M", tipo: "Gasto", porcentaje: "+12%" },
    { concepto: "Asesoría Legal", variacion: "-$10M", tipo: "Ahorro", porcentaje: "-8%" },
];

// --- Components ---

export default function DashboardFinanciero() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Financiero</h1>
                <div className="text-sm text-gray-500">
                    Cifras en Millones de COP (YTD)
                </div>
            </div>

            {/* A. Fila Superior (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, idx) => (
                    <div
                        key={idx}
                        className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500">{kpi.title}</h3>
                            <div className="p-2 bg-gray-50 rounded-lg">
                                <kpi.icon className="w-5 h-5 text-gray-600" />
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                            <div className="flex items-center mt-2">
                                {kpi.isPositive ? (
                                    <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
                                ) : (
                                    <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                                )}
                                <span
                                    className={`text-sm font-medium ${kpi.isPositive ? "text-emerald-500" : "text-red-500"
                                        }`}
                                >
                                    {kpi.change}
                                </span>
                                <span className="text-sm text-gray-400 ml-2">vs mes ant.</span>
                            </div>
                            {kpi.subtitle && (
                                <div className="text-xs text-gray-400 mt-1">{kpi.subtitle}</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* B. Sección Media (Gráficos Principales) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gráfico 1: Evolución */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                        Evolución Ingresos vs. Gastos Operativos
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#64748b" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#64748b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="top" height={36} iconType="circle" />
                                <Area
                                    type="monotone"
                                    dataKey="ingresos"
                                    stroke="#0ea5e9"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorIngresos)"
                                    name="Ingresos"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="gastos"
                                    stroke="#64748b"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorGastos)"
                                    name="Gastos"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gráfico 2: Composición del Gasto */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Composición del Gasto</h3>
                    <div className="flex-1 min-h-[300px] relative flex flex-col items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseCompositionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {expenseCompositionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => `${value}%`}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Custom Legend */}
                        <div className="w-full mt-4 grid grid-cols-2 gap-2">
                            {expenseCompositionData.map((entry, index) => (
                                <div key={index} className="flex items-center text-sm">
                                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></div>
                                    <span className="text-gray-600 flex-1">{entry.name}</span>
                                    <span className="font-semibold text-gray-900">{entry.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* C. Sección Inferior (Análisis Comparativo) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Gráfico 3: Ejecución Presupuestal */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Ejecución Presupuestal: Real vs. Presupuestado</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={budgetExecutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="top" height={36} iconType="circle" />
                                <Bar dataKey="real" fill="#10b981" name="Real" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                <Bar dataKey="presupuestado" fill="#cbd5e1" name="Presupuestado" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tabla: Top Variaciones */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 3 Variaciones de Gasto</h3>
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 bg-gray-50/50 rounded-t-lg">
                                <tr>
                                    <th className="px-4 py-3 font-medium rounded-tl-lg">Concepto</th>
                                    <th className="px-4 py-3 font-medium text-right">Var.</th>
                                    <th className="px-4 py-3 font-medium text-right rounded-tr-lg">%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topVariations.map((item, idx) => (
                                    <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-800">{item.concepto}</td>
                                        <td className={`px-4 py-3 text-right font-semibold ${item.tipo === 'Gasto' ? 'text-red-500' : 'text-emerald-500'}`}>
                                            {item.variacion}
                                        </td>
                                        <td className={`px-4 py-3 text-right font-medium ${item.tipo === 'Gasto' ? 'text-red-500' : 'text-emerald-500'}`}>
                                            {item.porcentaje}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 text-center">
                        Desviaciones correspondientes al mes actual.
                    </div>
                </div>
            </div>
        </div>
    );
}
