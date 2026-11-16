
<script setup>
import { ref, computed } from 'vue';

const period = ref('Semana');

const sales = [
    { day: 'Lun', amount: 450 },
    { day: 'Mar', amount: 680 },
    { day: 'Mié', amount: 520 },
    { day: 'Jue', amount: 900 },
    { day: 'Vie', amount: 750 },
    { day: 'Sáb', amount: 1100 },
    { day: 'Dom', amount: 600 }
];

const maxSales = computed(() =>
    Math.max(...sales.map(item => item.amount))
);
</script>

<template>
    <section class="rounded-xl border border-border bg-surface p-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
                <h3 class="font-semibold text-primary">
                    Evolución de ventas
                </h3>
                <p class="mt-1 text-sm text-text-muted">
                    Comportamiento de las ventas
                </p>
            </div>

            <select
                v-model="period"
                class="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-main outline-none focus:border-accent"
            >
                <option>Semana</option>
                <option>Mes</option>
                <option>Año</option>
            </select>
        </div>

        <div class="mt-8 flex h-56 items-end justify-around gap-3 border-b border-border">
            <div
                v-for="sale in sales"
                :key="sale.day"
                class="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
            >
                <span class="text-[10px] text-text-muted">
                    {{ sale.amount }}
                </span>

                <div
                    class="w-full max-w-10 rounded-t-md bg-accent transition-all hover:opacity-75"
                    :style="{
                        height: `${(sale.amount / maxSales) * 75}%`,
                        minHeight: '5px'
                    }"
                ></div>

                <span class="text-xs text-text-muted">
                    {{ sale.day }}
                </span>
            </div>
        </div>
    </section>
</template>
