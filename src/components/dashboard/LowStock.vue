
<script setup>
const products = [
    { name: 'Teclado mecánico', stock: 3 },
    { name: 'Mouse inalámbrico', stock: 5 },
    { name: 'Monitor 24 pulgadas', stock: 2 },
    { name: 'Cable HDMI', stock: 4 }
];
</script>

<template>
    <section class="rounded-xl border border-border bg-surface p-5">
        <div class="mb-5 flex items-center justify-between">
            <div>
                <h3 class="font-semibold text-primary">
                    Stock por reponer
                </h3>
                <p class="mt-1 text-sm text-text-muted">
                    Productos que necesitan atención
                </p>
            </div>

            <span class="rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
                {{ products.length }} productos
            </span>
        </div>

        <div class="space-y-5">
            <div
                v-for="product in products"
                :key="product.name"
            >
                <div class="mb-2 flex items-center justify-between gap-3">
                    <span class="text-sm font-medium text-text-main">
                        {{ product.name }}
                    </span>

                    <span class="shrink-0 text-sm font-semibold text-danger">
                        {{ product.stock }} unidades
                    </span>
                </div>

                <div class="h-1.5 overflow-hidden rounded-full bg-background">
                    <div
                        class="h-full rounded-full bg-warning transition-all"
                        :style="{ width: `${Math.min(product.stock * 10, 100)}%` }"
                    ></div>
                </div>
            </div>
        </div>

        <RouterLink
            to="/inventario"
            class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
        >
            Revisar inventario
            <span>→</span>
        </RouterLink>
    </section>
</template>
