<script setup>
import { Receipt, CheckCircle2, XCircle } from 'lucide-vue-next';
import ModalShell from '../ui/ModalShell.vue';
import {
    formatCurrency,
    formatDateTime,
    getSaleStatus,
    getPaymentLabel
} from '../../utils/format';

defineProps({
    sale: { type: Object, required: true },
    updating: { type: Boolean, default: false },
    serverError: { type: String, default: '' }
});

defineEmits(['close', 'change-status']);
</script>

<template>
    <ModalShell
        :title="`Venta ${sale.code}`"
        :subtitle="formatDateTime(sale.sold_at)"
        :icon="Receipt"
        size="max-w-2xl"
        @close="$emit('close')"
    >
        <div class="space-y-5 p-6">
            <div
                v-if="serverError"
                class="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
            >
                {{ serverError }}
            </div>

            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div class="rounded-xl border border-border bg-background p-3">
                    <p class="text-xs text-text-muted">Cliente</p>
                    <p class="mt-1 text-sm font-semibold text-text-main">
                        {{ sale.customer?.name ?? 'Cliente general' }}
                    </p>
                </div>

                <div class="rounded-xl border border-border bg-background p-3">
                    <p class="text-xs text-text-muted">Pago</p>
                    <p class="mt-1 text-sm font-semibold text-text-main">
                        {{ getPaymentLabel(sale.payment_method) }}
                    </p>
                </div>

                <div class="rounded-xl border border-border bg-background p-3">
                    <p class="text-xs text-text-muted">Estado</p>
                    <span :class="['mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold', getSaleStatus(sale.status).classes]">
                        {{ getSaleStatus(sale.status).label }}
                    </span>
                </div>

                <div class="rounded-xl border border-border bg-background p-3">
                    <p class="text-xs text-text-muted">Total</p>
                    <p class="mt-1 text-sm font-bold text-primary">{{ formatCurrency(sale.total) }}</p>
                </div>
            </div>

            <div class="overflow-x-auto rounded-xl border border-border">
                <table class="w-full min-w-[450px] text-left text-sm">
                    <thead class="bg-background text-xs text-text-muted">
                        <tr>
                            <th class="px-4 py-3 font-semibold">Producto</th>
                            <th class="px-4 py-3 text-center font-semibold">Cant.</th>
                            <th class="px-4 py-3 text-right font-semibold">Precio</th>
                            <th class="px-4 py-3 text-right font-semibold">Subtotal</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="item in sale.items" :key="item.id" class="border-t border-border">
                            <td class="px-4 py-3 text-text-main">{{ item.product_name }}</td>
                            <td class="px-4 py-3 text-center text-text-main">{{ item.quantity }}</td>
                            <td class="px-4 py-3 text-right text-text-muted">{{ formatCurrency(item.unit_price) }}</td>
                            <td class="px-4 py-3 text-right font-semibold text-text-main">{{ formatCurrency(item.subtotal) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p v-if="sale.notes" class="rounded-lg bg-background p-3 text-sm text-text-muted">
                <span class="font-medium text-text-main">Notas:</span> {{ sale.notes }}
            </p>

            <footer
                v-if="sale.status !== 'cancelled'"
                class="flex flex-wrap justify-end gap-3 border-t border-border pt-5"
            >
                <button
                    @click="$emit('change-status', 'cancelled')"
                    :disabled="updating"
                    class="inline-flex items-center gap-2 rounded-lg border border-danger/40 px-4 py-2.5 text-sm font-semibold text-danger transition hover:bg-danger/10 disabled:opacity-50"
                >
                    <XCircle :size="17" />
                    Cancelar venta
                </button>

                <button
                    v-if="sale.status === 'pending'"
                    @click="$emit('change-status', 'completed')"
                    :disabled="updating"
                    class="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                    <CheckCircle2 :size="17" />
                    Marcar como pagada
                </button>
            </footer>

            <p v-else class="text-xs text-text-muted">
                Esta venta fue cancelada y el stock de sus productos fue devuelto al inventario.
            </p>
        </div>
    </ModalShell>
</template>
