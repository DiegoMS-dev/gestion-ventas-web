<script setup>
import { Eye, ShoppingCart } from 'lucide-vue-next';
import {
    formatCurrency,
    formatDateTime,
    getSaleStatus,
    getPaymentLabel
} from '../../utils/format';

defineProps({
    sales: { type: Array, default: () => [] }
});

defineEmits(['view']);
</script>

<template>
    <section class="overflow-hidden rounded-xl border border-border bg-surface">
        <div class="border-b border-border px-5 py-4">
            <h2 class="font-semibold text-primary">Historial de ventas</h2>
            <p class="mt-1 text-sm text-text-muted">
                {{ sales.length }} ventas encontradas
            </p>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full min-w-[800px] text-left text-sm">
                <thead class="bg-background">
                    <tr class="text-xs text-text-muted">
                        <th class="px-5 py-3 font-semibold">Código</th>
                        <th class="px-5 py-3 font-semibold">Cliente</th>
                        <th class="px-5 py-3 font-semibold">Fecha</th>
                        <th class="px-5 py-3 font-semibold">Pago</th>
                        <th class="px-5 py-3 text-center font-semibold">Productos</th>
                        <th class="px-5 py-3 font-semibold">Total</th>
                        <th class="px-5 py-3 font-semibold">Estado</th>
                        <th class="px-5 py-3 text-center font-semibold">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="sale in sales"
                        :key="sale.id"
                        class="border-t border-border transition hover:bg-background/60"
                    >
                        <td class="px-5 py-4 font-medium text-primary">{{ sale.code }}</td>

                        <td class="px-5 py-4 text-text-main">
                            {{ sale.customer?.name ?? 'Cliente general' }}
                        </td>

                        <td class="px-5 py-4 text-text-muted">{{ formatDateTime(sale.sold_at) }}</td>

                        <td class="px-5 py-4 text-text-muted">{{ getPaymentLabel(sale.payment_method) }}</td>

                        <td class="px-5 py-4 text-center text-text-main">{{ sale.items_count }}</td>

                        <td class="px-5 py-4 font-semibold text-text-main">
                            {{ formatCurrency(sale.total) }}
                        </td>

                        <td class="px-5 py-4">
                            <span :class="['rounded-full px-2.5 py-1 text-xs font-semibold', getSaleStatus(sale.status).classes]">
                                {{ getSaleStatus(sale.status).label }}
                            </span>
                        </td>

                        <td class="px-5 py-4">
                            <div class="flex items-center justify-center">
                                <button
                                    @click="$emit('view', sale)"
                                    title="Ver detalle"
                                    class="rounded-lg p-2 text-info transition hover:bg-info/10"
                                >
                                    <Eye :size="17" />
                                </button>
                            </div>
                        </td>
                    </tr>

                    <tr v-if="sales.length === 0">
                        <td colspan="8" class="px-5 py-12 text-center">
                            <ShoppingCart :size="36" class="mx-auto mb-3 text-text-muted" />
                            <p class="font-medium text-text-main">No se encontraron ventas</p>
                            <p class="mt-1 text-sm text-text-muted">
                                Registra una venta o prueba modificando los filtros.
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>
