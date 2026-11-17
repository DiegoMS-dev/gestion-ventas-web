<script setup>
import { ShoppingCart } from 'lucide-vue-next';
import { formatCurrency, formatDate, getSaleStatus } from '../../utils/format';

defineProps({
    sales: { type: Array, default: () => [] }
});
</script>

<template>
    <section class="rounded-xl border border-border bg-surface p-5">
        <div class="mb-5 flex items-center justify-between gap-3">
            <div>
                <h3 class="font-semibold text-primary">
                    Últimas operaciones
                </h3>
                <p class="mt-1 text-sm text-text-muted">
                    Actividad comercial reciente
                </p>
            </div>

            <RouterLink
                to="/ventas"
                class="shrink-0 text-sm font-semibold text-accent hover:underline"
            >
                Ver todas →
            </RouterLink>
        </div>

        <div
            v-if="sales.length === 0"
            class="flex flex-col items-center rounded-lg bg-background px-4 py-8 text-center"
        >
            <ShoppingCart :size="30" class="text-text-muted" />
            <p class="mt-3 text-sm font-semibold text-text-main">
                Aún no hay ventas registradas
            </p>
            <RouterLink
                to="/ventas?nueva=1"
                class="mt-2 text-xs font-semibold text-accent hover:underline"
            >
                Registrar la primera venta →
            </RouterLink>
        </div>

        <div v-else class="overflow-x-auto">
            <table class="w-full min-w-[550px] text-left text-sm">
                <thead>
                    <tr class="border-b border-border text-xs text-text-muted">
                        <th class="px-3 py-3 font-medium">Código</th>
                        <th class="px-3 py-3 font-medium">Cliente</th>
                        <th class="px-3 py-3 font-medium">Fecha</th>
                        <th class="px-3 py-3 font-medium">Total</th>
                        <th class="px-3 py-3 font-medium">Estado</th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="sale in sales"
                        :key="sale.id"
                        class="border-b border-border last:border-0 hover:bg-background/60"
                    >
                        <td class="px-3 py-4 font-medium text-primary">
                            {{ sale.code }}
                        </td>

                        <td class="px-3 py-4 text-text-main">
                            {{ sale.customer?.name ?? 'Cliente general' }}
                        </td>

                        <td class="px-3 py-4 text-text-muted">
                            {{ formatDate(sale.sold_at) }}
                        </td>

                        <td class="px-3 py-4 font-semibold text-text-main">
                            {{ formatCurrency(sale.total) }}
                        </td>

                        <td class="px-3 py-4">
                            <span
                                :class="[
                                    'rounded-full px-2.5 py-1 text-xs font-semibold',
                                    getSaleStatus(sale.status).classes
                                ]"
                            >
                                {{ getSaleStatus(sale.status).label }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>
