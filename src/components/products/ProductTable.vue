
<script setup>
import { Pencil, Trash2, PackageOpen } from 'lucide-vue-next';

defineProps({
    products: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['edit', 'delete']);

function getStockStatus(product) {
    if (product.stock === 0) {
        return {
            label: 'Agotado',
            classes: 'bg-danger/10 text-danger'
        };
    }

    if (product.stock <= product.minStock) {
        return {
            label: 'Stock bajo',
            classes: 'bg-warning/10 text-warning'
        };
    }

    return {
        label: 'Disponible',
        classes: 'bg-accent/10 text-accent'
    };
}
</script>

<template>
    <section class="overflow-hidden rounded-xl border border-border bg-surface">

        <!-- Encabezado -->
        <div class="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
                <h2 class="font-semibold text-primary">
                    Lista de productos
                </h2>

                <p class="mt-1 text-sm text-text-muted">
                    {{ products.length }} productos encontrados
                </p>
            </div>
        </div>

        <!-- Tabla -->
        <div class="overflow-x-auto">
            <table class="w-full min-w-[750px] text-left text-sm">
                <thead class="bg-background">
                    <tr class="text-xs text-text-muted">
                        <th class="px-5 py-3 font-semibold">Código</th>
                        <th class="px-5 py-3 font-semibold">Producto</th>
                        <th class="px-5 py-3 font-semibold">Categoría</th>
                        <th class="px-5 py-3 font-semibold">Precio</th>
                        <th class="px-5 py-3 font-semibold">Stock</th>
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
                        <td class="px-5 py-4 font-medium text-primary">
                            {{ product.code }}
                        </td>

                        <td class="px-5 py-4 font-medium text-text-main">
                            {{ product.name }}
                        </td>

                        <td class="px-5 py-4 text-text-muted">
                            {{ product.category }}
                        </td>

                        <td class="px-5 py-4 font-semibold text-text-main">
                            S/ {{ Number(product.price).toFixed(2) }}
                        </td>

                        <td class="px-5 py-4 text-text-main">
                            {{ product.stock }} unidades
                        </td>

                        <td class="px-5 py-4">
                            <span
                                :class="[
                                    'rounded-full px-2.5 py-1 text-xs font-semibold',
                                    getStockStatus(product).classes
                                ]"
                            >
                                {{ getStockStatus(product).label }}
                            </span>
                        </td>

                        <td class="px-5 py-4">
                            <div class="flex items-center justify-center gap-2">
                                <button
                                    @click="emit('edit', product)"
                                    title="Editar producto"
                                    class="rounded-lg p-2 text-info transition hover:bg-info/10"
                                >
                                    <Pencil :size="17" />
                                </button>

                                <button
                                    @click="emit('delete', product)"
                                    title="Eliminar producto"
                                    class="rounded-lg p-2 text-danger transition hover:bg-danger/10"
                                >
                                    <Trash2 :size="17" />
                                </button>
                            </div>
                        </td>
                    </tr>

                    <!-- Sin resultados -->
                    <tr v-if="products.length === 0">
                        <td colspan="7" class="px-5 py-12 text-center">
                            <PackageOpen
                                :size="36"
                                class="mx-auto mb-3 text-text-muted"
                            />

                            <p class="font-medium text-text-main">
                                No se encontraron productos
                            </p>

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
