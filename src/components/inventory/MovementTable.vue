<script setup>
import { History } from 'lucide-vue-next';
import { formatDateTime, getMovementType } from '../../utils/format';

defineProps({
    movements: { type: Array, default: () => [] }
});
</script>

<template>
    <section class="overflow-hidden rounded-xl border border-border bg-surface">
        <div class="border-b border-border px-5 py-4">
            <h2 class="font-semibold text-primary">Historial de movimientos</h2>
            <p class="mt-1 text-sm text-text-muted">
                Últimos {{ movements.length }} movimientos
            </p>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full min-w-[800px] text-left text-sm">
                <thead class="bg-background">
                    <tr class="text-xs text-text-muted">
                        <th class="px-5 py-3 font-semibold">Fecha</th>
                        <th class="px-5 py-3 font-semibold">Producto</th>
                        <th class="px-5 py-3 font-semibold">Tipo</th>
                        <th class="px-5 py-3 font-semibold">Cantidad</th>
                        <th class="px-5 py-3 font-semibold">Stock</th>
                        <th class="px-5 py-3 font-semibold">Motivo</th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="movement in movements"
                        :key="movement.id"
                        class="border-t border-border transition hover:bg-background/60"
                    >
                        <td class="px-5 py-4 text-text-muted">{{ formatDateTime(movement.created_at) }}</td>

                        <td class="px-5 py-4 font-medium text-text-main">
                            {{ movement.product?.name ?? 'Producto eliminado' }}
                        </td>

                        <td class="px-5 py-4">
                            <span :class="['rounded-full px-2.5 py-1 text-xs font-semibold', getMovementType(movement.type).classes]">
                                {{ getMovementType(movement.type).label }}
                            </span>
                        </td>

                        <td
                            :class="[
                                'px-5 py-4 font-semibold',
                                movement.quantity > 0 ? 'text-accent' : 'text-danger'
                            ]"
                        >
                            {{ movement.quantity > 0 ? '+' : '' }}{{ movement.quantity }}
                        </td>

                        <td class="px-5 py-4 text-text-muted">
                            {{ movement.stock_before }} → {{ movement.stock_after }}
                        </td>

                        <td class="px-5 py-4 text-text-muted">
                            {{ movement.reason || '—' }}
                            <span v-if="movement.reference" class="font-medium text-primary">
                                ({{ movement.reference }})
                            </span>
                        </td>
                    </tr>

                    <tr v-if="movements.length === 0">
                        <td colspan="6" class="px-5 py-12 text-center">
                            <History :size="36" class="mx-auto mb-3 text-text-muted" />
                            <p class="font-medium text-text-main">Aún no hay movimientos</p>
                            <p class="mt-1 text-sm text-text-muted">
                                Las ventas y los ajustes de stock aparecerán aquí.
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>
