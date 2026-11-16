
<script setup>
import { ref, computed } from 'vue';
import { X, ChartColumn } from 'lucide-vue-next';

defineEmits(['close']);

const period = ref('Mes');

const salesData = {
    Semana: [
        { name: 'Teclado mecánico', units: 18 },
        { name: 'Mouse inalámbrico', units: 15 },
        { name: 'Audífonos Bluetooth', units: 12 },
        { name: 'Monitor 24 pulgadas', units: 8 },
        { name: 'Cable HDMI', units: 5 }
    ],
    Mes: [
        { name: 'Teclado mecánico', units: 85 },
        { name: 'Mouse inalámbrico', units: 72 },
        { name: 'Audífonos Bluetooth', units: 58 },
        { name: 'Monitor 24 pulgadas', units: 34 },
        { name: 'Cable HDMI', units: 28 }
    ],
    Año: [
        { name: 'Teclado mecánico', units: 620 },
        { name: 'Mouse inalámbrico', units: 540 },
        { name: 'Audífonos Bluetooth', units: 430 },
        { name: 'Monitor 24 pulgadas', units: 280 },
        { name: 'Cable HDMI', units: 210 }
    ]
};

const products = computed(() => salesData[period.value]);

const maxUnits = computed(() =>
    Math.max(...products.value.map(product => product.units))
);

const totalUnits = computed(() =>
    products.value.reduce((total, product) => total + product.units, 0)
);
</script>

<template>
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 p-4 backdrop-blur-sm"
        @click.self="$emit('close')"
    >
        <section class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-surface shadow-2xl">

            <!-- Encabezado -->
            <header class="flex items-center justify-between border-b border-border px-6 py-5">
                <div class="flex items-center gap-3">
                    <div class="rounded-xl bg-accent/10 p-2.5 text-accent">
                        <ChartColumn :size="22" />
                    </div>

                    <div>
                        <h2 class="font-semibold text-primary">
                            Productos más vendidos
                        </h2>

                        <p class="mt-1 text-xs text-text-muted">
                            Ranking de productos por unidades vendidas
                        </p>
                    </div>
                </div>

                <button
                    @click="$emit('close')"
                    class="rounded-lg p-2 text-text-muted transition hover:bg-background hover:text-primary"
                    title="Cerrar"
                >
                    <X :size="20" />
                </button>
            </header>

            <div class="space-y-6 p-6">

                <!-- Resumen y periodo -->
                <div class="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p class="text-sm text-text-muted">
                            Unidades vendidas
                        </p>

                        <p class="mt-1 text-3xl font-bold text-primary">
                            {{ totalUnits }}
                        </p>
                    </div>

                    <select
                        v-model="period"
                        class="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-main outline-none focus:border-accent"
                    >
                        <option>Semana</option>
                        <option>Mes</option>
                        <option>Año</option>
                    </select>
                </div>

                <!-- Gráfico -->
                <div class="space-y-5">
                    <div
                        v-for="(product, index) in products"
                        :key="product.name"
                    >
                        <div class="mb-2 flex items-center justify-between gap-3">
                            <div class="flex min-w-0 items-center gap-3">
                                <span class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-background text-xs font-semibold text-text-muted">
                                    {{ index + 1 }}
                                </span>

                                <span class="truncate text-sm font-medium text-text-main">
                                    {{ product.name }}
                                </span>
                            </div>

                            <span class="shrink-0 text-sm font-semibold text-primary">
                                {{ product.units }} uds.
                            </span>
                        </div>

                        <div class="ml-10 h-3 overflow-hidden rounded-full bg-background">
                            <div
                                class="h-full rounded-full bg-accent transition-all duration-500"
                                :style="{
                                    width: `${(product.units / maxUnits) * 100}%`
                                }"
                            ></div>
                        </div>
                    </div>
                </div>

                <!-- Nota -->
                <div class="rounded-lg bg-background p-3">
                    <p class="text-xs leading-relaxed text-text-muted">
                        Los datos mostrados son ilustrativos. Las estadísticas
                        reales se calcularán a partir de los registros de ventas.
                    </p>
                </div>
            </div>
        </section>
    </div>
</template>
