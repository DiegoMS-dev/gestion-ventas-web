<script setup>
import { ref, computed, onMounted } from 'vue';
import { ChartColumn, Wallet, Receipt, TrendingUp, Clock, Ban, Boxes } from 'lucide-vue-next';
import ModalShell from '../ui/ModalShell.vue';
import StatTile from '../ui/StatTile.vue';
import BarList from '../ui/BarList.vue';
import { getReportSummary } from '../../services/reportService';
import { formatCurrency, getPaymentLabel, toISODate, parseISODate } from '../../utils/format';

defineEmits(['close']);

const loading = ref(true);
const error = ref('');
const report = ref(null);

// Últimos 30 días
onMounted(async () => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 29);

    try {
        report.value = await getReportSummary({
            from: toISODate(from),
            to: toISODate(to)
        });
    } catch (e) {
        console.error('Error al cargar estadísticas de ventas:', e);
        error.value = 'No se pudieron cargar las estadísticas.';
    } finally {
        loading.value = false;
    }
});

const last7Days = computed(() =>
    (report.value?.by_day ?? []).slice(-7).map(day => ({
        label: new Intl.DateTimeFormat('es-PE', { weekday: 'short', day: 'numeric' })
            .format(parseISODate(day.date)),
        value: day.total,
        display: formatCurrency(day.total)
    }))
);

const methods = computed(() =>
    (report.value?.by_payment_method ?? []).map(item => ({
        label: getPaymentLabel(item.method),
        value: item.total,
        display: `${formatCurrency(item.total)} · ${item.count}`
    }))
);

const topProducts = computed(() =>
    (report.value?.top_products ?? []).map(item => ({
        label: item.name,
        value: item.quantity,
        display: `${item.quantity} uds.`
    }))
);
</script>

<template>
    <ModalShell
        title="Estadísticas de ventas"
        subtitle="Resumen de los últimos 30 días"
        :icon="ChartColumn"
        size="max-w-2xl"
        @close="$emit('close')"
    >
        <div v-if="loading" class="p-10 text-center text-sm text-text-muted">
            Cargando estadísticas...
        </div>

        <div v-else-if="error" class="p-6">
            <p class="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                {{ error }}
            </p>
        </div>

        <div v-else class="space-y-6 p-6">
            <div class="grid grid-cols-2 gap-3">
                <StatTile label="Ingresos" :value="formatCurrency(report.totals.revenue)" :icon="Wallet" tone="accent" />
                <StatTile label="Ventas completadas" :value="report.totals.sales_count" :icon="Receipt" />
                <StatTile label="Ticket promedio" :value="formatCurrency(report.totals.average_ticket)" :icon="TrendingUp" tone="info" />
                <StatTile label="Unidades vendidas" :value="report.totals.units_sold" :icon="Boxes" />
                <StatTile
                    label="Pendientes de pago"
                    :value="`${report.totals.pending_count} · ${formatCurrency(report.totals.pending_amount)}`"
                    :icon="Clock"
                    tone="warning"
                />
                <StatTile label="Canceladas" :value="report.totals.cancelled_count" :icon="Ban" tone="danger" />
            </div>

            <section>
                <h3 class="mb-4 font-semibold text-primary">Ventas de los últimos 7 días</h3>
                <BarList :items="last7Days" />
            </section>

            <section>
                <h3 class="mb-4 font-semibold text-primary">Ventas por método de pago</h3>
                <BarList :items="methods" color="bg-info" empty-text="Todavía no hay ventas completadas." />
            </section>

            <section>
                <h3 class="mb-4 font-semibold text-primary">Productos más vendidos</h3>
                <BarList :items="topProducts" color="bg-warning" empty-text="Todavía no hay ventas completadas." />
            </section>

            <div class="rounded-lg bg-background p-3">
                <p class="text-xs leading-relaxed text-text-muted">
                    Los ingresos consideran solo ventas completadas. Para un análisis por fechas usa el módulo de Reportes.
                </p>
            </div>
        </div>
    </ModalShell>
</template>
