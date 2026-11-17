<script setup>
import { ArrowLeftRight, PackageOpen } from 'lucide-vue-next';
import { getStockStatus, formatCurrency } from '../../utils/format';

defineProps({
    products: { type: Array, default: () => [] }
});

defineEmits(['move']);
</script>

<template>
    <section class="overflow-hidden rounded-xl border border-border bg-surface">
        <div class="border-b border-border px-5 py-4">
            <h2 class="font-semibold text-primary">Existencias</h2>
            <p class="mt-1 text-sm text-text-muted">
                {{ products.length }} productos encontrados
            </p>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full min-w-[800px] text-left text-sm">
                <thead class="bg-background">
                    <tr class="text-xs text-text-muted">
                        <th class="px-5 py-3 font-semibold">Código</th>
                        <th class="px-5 py-3 font-semibold">Producto</th>
                        <th class="px-5 py-3 font-semibold">Categoría</th>
                        <th class="px-5 py-3 font-semibold">Stock</th>
                        <th class="px-5 py-3 font-semibold">Mínimo</th>
                        <th class="px-5 py-3 font-semibold">Valor</th>
                        <th class="px-5 py-3 font-semibold">Estado</th>
                        <th class="px-5 py-3 text-center font-semibold">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="product in products"
                        :key="product.id"
                        class="border-t border-border transition hover:bg-background/60"
                    >
                        <td class="px-5 py-4 font-medium text-primary">{{ product.code }}</td>
                        <td class="px-5 py-4 font-medium text-text-main">{{ product.name }}</td>
                        <td class="px-5 py-4 text-text-muted">{{ product.categoryName }}</td>
                        <td class="px-5 py-4 font-semibold text-text-main">{{ product.stock }}</td>
                        <td class="px-5 py-4 text-text-muted">{{ product.min_stock }}</td>
                        <td class="px-5 py-4 text-text-muted">
                            {{ formatCurrency(product.stock * product.price) }}
                        </td>

                        <td class="px-5 py-4">
                            <span :class="['rounded-full px-2.5 py-1 text-xs font-semibold', getStockStatus(product).classes]">
                                {{ getStockStatus(product).label }}
                            </span>
                        </td>

                        <td class="px-5 py-4">
                            <div class="flex items-center justify-center">
                                <button
                                    @click="$emit('move', product)"
                                    title="Registrar movimiento"
                                    class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-accent transition hover:bg-accent/10"
                                >
                                    <ArrowLeftRight :size="15" />
                                    Movimiento
                                </button>
                            </div>
                        </td>
                    </tr>

                    <tr v-if="products.length === 0">
                        <td colspan="8" class="px-5 py-12 text-center">
                            <PackageOpen :size="36" class="mx-auto mb-3 text-text-muted" />
                            <p class="font-medium text-text-main">No se encontraron productos</p>
                            <p class="mt-1 text-sm text-text-muted">
                                Prueba modificando los filtros de búsqueda.
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>
