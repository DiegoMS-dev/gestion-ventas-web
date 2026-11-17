<script setup>
import { computed } from 'vue';
import { formatCurrency, parseISODate } from '../../utils/format';

// Gráfico de barras de ventas por día
const props = defineProps({
    // [{ date: 'YYYY-MM-DD', total, count }]
    days: { type: Array, default: () => [] }
});

const max = computed(() => Math.max(1, ...props.days.map(day => day.total)));

// Con muchos días solo se muestran algunas etiquetas para que no se amontonen
const labelEvery = computed(() => Math.max(1, Math.ceil(props.days.length / 12)));

function dayLabel(date) {
    return new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short' })
        .format(parseISODate(date));
}

const hasSales = computed(() => props.days.some(day => day.total > 0));
</script>

<template>
    <div v-if="hasSales" class="overflow-x-auto">
        <div class="flex h-56 min-w-full items-end gap-1 border-b border-border" :style="{ minWidth: `${days.length * 18}px` }">
            <div
                v-for="(day, index) in days"
                :key="day.date"
                class="group relative flex h-full min-w-0 flex-1 flex-col items-center justify-end"
            >
                <span
                    class="pointer-events-none absolute -top-1 z-10 hidden -translate-y-full whitespace-nowrap rounded-md bg-primary px-2 py-1 text-[11px] text-white group-hover:block"
                >
                    {{ dayLabel(day.date) }}: {{ formatCurrency(day.total) }} ({{ day.count }})
                </span>

                <div
                    class="w-full max-w-8 rounded-t-md bg-accent transition-all group-hover:opacity-75"
                    :style="{
                        height: `${(day.total / max) * 100}%`,
                        minHeight: day.total > 0 ? '4px' : '1px'
                    }"
                ></div>
            </div>
        </div>

        <div class="mt-2 flex gap-1" :style="{ minWidth: `${days.length * 18}px` }">
            <span
                v-for="(day, index) in days"
                :key="day.date"
                class="min-w-0 flex-1 text-center text-[10px] text-text-muted"
            >
                {{ index % labelEvery === 0 ? dayLabel(day.date) : '' }}
            </span>
        </div>
    </div>

    <p v-else class="rounded-lg bg-background p-8 text-center text-sm text-text-muted">
        No hay ventas completadas en este rango de fechas.
    </p>
</template>
