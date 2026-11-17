<script setup>
import { computed } from 'vue';
import { ChartColumn, Package, Boxes, Wallet, AlertTriangle, Ban } from 'lucide-vue-next';
import ModalShell from '../ui/ModalShell.vue';
import StatTile from '../ui/StatTile.vue';
import BarList from '../ui/BarList.vue';
import { formatCurrency } from '../../utils/format';

const props = defineProps({
    products: { type: Array, default: () => [] }
});

defineEmits(['close']);

const totalUnits = computed(() =>
    props.products.reduce((sum, product) => sum + product.stock, 0)
);

const inventoryValue = computed(() =>
    props.products.reduce((sum, product) => sum + product.stock * Number(product.price), 0)
);

const outOfStock = computed(() =>
    props.products.filter(product => product.stock === 0).length
);

const lowStock = computed(() =>
    props.products.filter(product => product.stock > 0 && product.stock <= product.min_stock).length
);

const unitsByCategory = computed(() => {
    const map = {};

    props.products.forEach(product => {
        map[product.categoryName] = (map[product.categoryName] || 0) + product.stock;
    });

    return Object.entries(map)
        .map(([label, value]) => ({ label, value, display: `${value} uds.` }))
        .sort((a, b) => b.value - a.value);
});

// Productos con menos stock respecto a su mínimo
const lowestStock = computed(() =>
    [...props.products]
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5)
        .map(product => ({
            label: product.name,
            value: product.stock,
            display: `${product.stock} uds.`
        }))
);
</script>

<template>
    <ModalShell
        title="Estadísticas de inventario"
        subtitle="Resumen actual de existencias"
        :icon="ChartColumn"
        size="max-w-2xl"
        @close="$emit('close')"
    >
        <div class="space-y-6 p-6">
            <div class="grid grid-cols-2 gap-3">
                <StatTile label="Productos" :value="products.length" :icon="Package" />
                <StatTile label="Unidades en inventario" :value="totalUnits" :icon="Boxes" />
                <StatTile label="Valor del inventario" :value="formatCurrency(inventoryValue)" :icon="Wallet" tone="accent" />
                <StatTile label="Stock bajo" :value="lowStock" :icon="AlertTriangle" tone="warning" />
                <StatTile label="Agotados" :value="outOfStock" :icon="Ban" tone="danger" />
            </div>

            <section>
                <h3 class="mb-4 font-semibold text-primary">Unidades por categoría</h3>
                <BarList :items="unitsByCategory" empty-text="Todavía no hay productos registrados." />
            </section>

            <section>
                <h3 class="mb-4 font-semibold text-primary">Productos con menos stock</h3>
                <BarList :items="lowestStock" color="bg-warning" empty-text="Todavía no hay productos registrados." />
            </section>

            <div class="rounded-lg bg-background p-3">
                <p class="text-xs leading-relaxed text-text-muted">
                    El valor del inventario se calcula con el precio de venta de cada producto por su stock actual.
                </p>
            </div>
        </div>
    </ModalShell>
</template>
