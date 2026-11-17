
<script setup>
import { computed } from 'vue';
import { X, ChartColumn, Package, AlertTriangle, Ban, Boxes } from 'lucide-vue-next';

const props = defineProps({
    products: {
        type: Array,
        default: () => []
    }
});

defineEmits(['close']);

// Total de productos registrados
const totalProducts = computed(() => props.products.length);

// Unidades totales en inventario
const totalStock = computed(() =>
    props.products.reduce((total, product) => total + product.stock, 0)
);

// Productos agotados
const outOfStock = computed(() =>
    props.products.filter(product => product.stock === 0).length
);

// Productos con stock bajo
const lowStock = computed(() =>
    props.products.filter(product =>
        product.stock > 0 && product.stock <= product.minStock
    ).length
);

// Distribución por categoría
const categoryData = computed(() => {
    const categories = {};

    props.products.forEach(product => {
        categories[product.category] =
            (categories[product.category] || 0) + 1;
    });

    return Object.entries(categories)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity);
});

const maxCategory = computed(() =>
    Math.max(1, ...categoryData.value.map(item => item.quantity))
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
                            Estadísticas de productos
                        </h2>

                        <p class="mt-1 text-xs text-text-muted">
                            Resumen actual del inventario
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

                <!-- Indicadores -->
                <div class="grid grid-cols-2 gap-3">

                    <div class="rounded-xl border border-border bg-background p-4">
                        <div class="flex items-center gap-2 text-text-muted">
                            <Package :size="18" />
                            <span class="text-xs">Productos registrados</span>
                        </div>

                        <p class="mt-3 text-2xl font-bold text-primary">
                            {{ totalProducts }}
                        </p>
                    </div>

                    <div class="rounded-xl border border-border bg-background p-4">
                        <div class="flex items-center gap-2 text-text-muted">
                            <Boxes :size="18" />
                            <span class="text-xs">Unidades en inventario</span>
                        </div>

                        <p class="mt-3 text-2xl font-bold text-primary">
                            {{ totalStock }}
                        </p>
                    </div>

                    <div class="rounded-xl border border-border bg-background p-4">
                        <div class="flex items-center gap-2 text-text-muted">
                            <AlertTriangle :size="18" class="text-warning" />
                            <span class="text-xs">Stock bajo</span>
                        </div>

                        <p class="mt-3 text-2xl font-bold text-warning">
                            {{ lowStock }}
                        </p>
                    </div>

                    <div class="rounded-xl border border-border bg-background p-4">
                        <div class="flex items-center gap-2 text-text-muted">
                            <Ban :size="18" class="text-danger" />
                            <span class="text-xs">Agotados</span>
                        </div>

                        <p class="mt-3 text-2xl font-bold text-danger">
                            {{ outOfStock }}
                        </p>
                    </div>

                </div>

                <!-- Distribución por categoría -->
                <section>
                    <h3 class="mb-4 font-semibold text-primary">
                        Productos por categoría
                    </h3>

                    <div
                        v-if="categoryData.length"
                        class="space-y-5"
                    >
                        <div
                            v-for="(category, index) in categoryData"
                            :key="category.name"
                        >
                            <div class="mb-2 flex justify-between gap-3">
                                <span class="text-sm font-medium text-text-main">
                                    {{ category.name }}
                                </span>

                                <span class="text-sm font-semibold text-primary">
                                    {{ category.quantity }}
                                </span>
                            </div>

                            <div class="h-3 overflow-hidden rounded-full bg-background">
                                <div
                                    class="h-full rounded-full bg-accent transition-all duration-500"
                                    :style="{
                                        width: `${(category.quantity / maxCategory) * 100}%`
                                    }"
                                ></div>
                            </div>
                        </div>
                    </div>

                    <p
                        v-else
                        class="rounded-lg bg-background p-5 text-center text-sm text-text-muted"
                    >
                        Todavía no hay productos registrados.
                    </p>
                </section>

                <div class="rounded-lg bg-background p-3">
                    <p class="text-xs leading-relaxed text-text-muted">
                        Información calculada a partir de los productos registrados
                        actualmente en la base de datos.
                    </p>
                </div>

            </div>
        </section>
    </div>
</template>
