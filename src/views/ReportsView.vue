<script setup>
import { ref, computed, onMounted } from 'vue';
import { Wallet, Receipt, TrendingUp, Boxes, Clock, Ban, Download } from 'lucide-vue-next';

import StatTile from '../components/ui/StatTile.vue';
import BarList from '../components/ui/BarList.vue';
import DailySalesChart from '../components/reports/DailySalesChart.vue';

import { getReportSummary } from '../services/reportService';
import { formatCurrency, getPaymentLabel, getApiError, toISODate } from '../utils/format';

const today = new Date();
const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

const from = ref(toISODate(monthStart));
const to = ref(toISODate(today));
const activePreset = ref('month');

const report = ref(null);
const loading = ref(false);
const errorMessage = ref('');

const presets = [
    { key: 'today', label: 'Hoy' },
    { key: '7days', label: 'Últimos 7 días' },
    { key: 'month', label: 'Este mes' },
    { key: '30days', label: 'Últimos 30 días' },
    { key: 'lastMonth', label: 'Mes anterior' }
];

function applyPreset(key) {
    const now = new Date();
    let start = new Date(now);
    let end = new Date(now);

    if (key === '7days') start.setDate(now.getDate() - 6);
    if (key === '30days') start.setDate(now.getDate() - 29);
    if (key === 'month') start = new Date(now.getFullYear(), now.getMonth(), 1);
    if (key === 'lastMonth') {
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
    }

    from.value = toISODate(start);
    to.value = toISODate(end);
    activePreset.value = key;

    loadReport();
}

function onCustomRange() {
    activePreset.value = '';
    loadReport();
}

async function loadReport() {
    if (!from.value || !to.value) return;

    loading.value = true;
    errorMessage.value = '';

    try {
        report.value = await getReportSummary({ from: from.value, to: to.value });
    } catch (error) {
        console.error('Error al cargar reporte:', error);
        errorMessage.value = getApiError(error, 'No se pudo cargar el reporte.');
    } finally {
        loading.value = false;
    }
}

const topProducts = computed(() =>
    (report.value?.top_products ?? []).map(item => ({
        label: item.name,
        value: item.quantity,
        display: `${item.quantity} uds. · ${formatCurrency(item.revenue)}`
    }))
);

const categories = computed(() =>
    (report.value?.by_category ?? []).map(item => ({
        label: item.name,
        value: item.revenue,
        display: formatCurrency(item.revenue)
    }))
);

const methods = computed(() =>
    (report.value?.by_payment_method ?? []).map(item => ({
        label: getPaymentLabel(item.method),
        value: item.total,
        display: `${formatCurrency(item.total)} · ${item.count}`
    }))
);

const customers = computed(() =>
    (report.value?.top_customers ?? []).map(item => ({
        label: item.name,
        value: item.total,
        display: `${formatCurrency(item.total)} · ${item.count}`
    }))
);

// Exporta las ventas por día a un archivo CSV (abre bien en Excel)
function exportCsv() {
    if (!report.value) return;

    const rows = [
        ['Fecha', 'Ventas completadas', 'Total (S/)'],
        ...report.value.by_day.map(day => [day.date, day.count, day.total.toFixed(2)])
    ];

    const csv = '\uFEFF' + rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `ventas_${from.value}_a_${to.value}.csv`;
    link.click();

    URL.revokeObjectURL(url);
}

onMounted(loadReport);

const dateInputClass = 'rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-main outline-none focus:border-accent';
</script>

<template>
    <div class="space-y-6">
        <header class="flex flex-wrap items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-primary">Reportes</h1>
                <p class="mt-1 text-sm text-text-muted">
                    Analiza el desempeño de tus ventas por rango de fechas.
                </p>
            </div>

            <button
                @click="exportCsv"
                :disabled="!report"
                class="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-background disabled:opacity-50"
            >
                <Download :size="17" />
                Exportar CSV
            </button>
        </header>

        <!-- Filtros de fecha -->
        <section class="space-y-4 rounded-xl border border-border bg-surface p-4">
            <div class="flex flex-wrap gap-2">
                <button
                    v-for="preset in presets"
                    :key="preset.key"
                    @click="applyPreset(preset.key)"
                    :class="[
                        'rounded-full border px-4 py-1.5 text-xs font-semibold transition',
                        activePreset === preset.key
                            ? 'border-accent bg-accent text-white'
                            : 'border-border text-text-muted hover:border-accent hover:text-accent'
                    ]"
                >
                    {{ preset.label }}
                </button>
            </div>

            <div class="flex flex-wrap items-center gap-3 text-sm text-text-muted">
                <label class="flex items-center gap-2">
                    Desde
                    <input v-model="from" type="date" :max="to" :class="dateInputClass" @change="onCustomRange" />
                </label>

                <label class="flex items-center gap-2">
                    Hasta
                    <input v-model="to" type="date" :min="from" :class="dateInputClass" @change="onCustomRange" />
                </label>
            </div>
        </section>

        <div
            v-if="errorMessage"
            class="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
            {{ errorMessage }}
        </div>

        <div
            v-if="loading && !report"
            class="rounded-xl border border-border bg-surface p-8 text-center text-sm text-text-muted"
        >
            Cargando reporte...
        </div>

        <template v-if="report">
            <div :class="{ 'opacity-60 transition': loading }" class="space-y-6">
                <!-- Indicadores -->
                <section class="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
                    <StatTile label="Ingresos" :value="formatCurrency(report.totals.revenue)" :icon="Wallet" tone="accent" />
                    <StatTile label="Ventas completadas" :value="report.totals.sales_count" :icon="Receipt" />
                    <StatTile label="Ticket promedio" :value="formatCurrency(report.totals.average_ticket)" :icon="TrendingUp" tone="info" />
                    <StatTile label="Unidades vendidas" :value="report.totals.units_sold" :icon="Boxes" />
                    <StatTile label="Pendientes" :value="report.totals.pending_count" :icon="Clock" tone="warning" />
                    <StatTile label="Canceladas" :value="report.totals.cancelled_count" :icon="Ban" tone="danger" />
                </section>

                <!-- Evolución -->
                <section class="rounded-xl border border-border bg-surface p-5">
                    <h3 class="font-semibold text-primary">Evolución de ventas</h3>
                    <p class="mb-6 mt-1 text-sm text-text-muted">
                        Ingresos por día (solo ventas completadas)
                    </p>

                    <DailySalesChart :days="report.by_day" />
                </section>

                <section class="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    <div class="rounded-xl border border-border bg-surface p-5">
                        <h3 class="mb-5 font-semibold text-primary">Productos más vendidos</h3>
                        <BarList :items="topProducts" color="bg-warning" empty-text="Sin ventas en este rango." />
                    </div>

                    <div class="rounded-xl border border-border bg-surface p-5">
                        <h3 class="mb-5 font-semibold text-primary">Ingresos por categoría</h3>
                        <BarList :items="categories" empty-text="Sin ventas en este rango." />
                    </div>

                    <div class="rounded-xl border border-border bg-surface p-5">
                        <h3 class="mb-5 font-semibold text-primary">Método de pago</h3>
                        <BarList :items="methods" color="bg-info" empty-text="Sin ventas en este rango." />
                    </div>

                    <div class="rounded-xl border border-border bg-surface p-5">
                        <h3 class="mb-5 font-semibold text-primary">Mejores clientes</h3>
                        <BarList :items="customers" color="bg-primary" empty-text="Sin ventas a clientes registrados en este rango." />
                    </div>
                </section>
            </div>
        </template>
    </div>
</template>
