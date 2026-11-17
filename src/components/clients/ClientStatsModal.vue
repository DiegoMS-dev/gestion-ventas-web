<script setup>
import { computed } from 'vue';
import { ChartColumn, Users, UserCheck, UserPlus, Wallet } from 'lucide-vue-next';
import ModalShell from '../ui/ModalShell.vue';
import StatTile from '../ui/StatTile.vue';
import BarList from '../ui/BarList.vue';
import { formatCurrency } from '../../utils/format';

const props = defineProps({
    clients: { type: Array, default: () => [] }
});

defineEmits(['close']);

const total = computed(() => props.clients.length);

const withPurchases = computed(() =>
    props.clients.filter(client => Number(client.sales_count) > 0).length
);

const newThisMonth = computed(() => {
    const now = new Date();

    return props.clients.filter(client => {
        const created = new Date(client.created_at);
        return created.getMonth() === now.getMonth() &&
            created.getFullYear() === now.getFullYear();
    }).length;
});

const totalSpent = computed(() =>
    props.clients.reduce((sum, client) => sum + Number(client.total_spent || 0), 0)
);

const topClients = computed(() =>
    [...props.clients]
        .filter(client => Number(client.total_spent) > 0)
        .sort((a, b) => Number(b.total_spent) - Number(a.total_spent))
        .slice(0, 5)
        .map(client => ({
            label: client.name,
            value: Number(client.total_spent),
            display: formatCurrency(client.total_spent)
        }))
);
</script>

<template>
    <ModalShell
        title="Estadísticas de clientes"
        subtitle="Resumen actual de tu cartera de clientes"
        :icon="ChartColumn"
        size="max-w-2xl"
        @close="$emit('close')"
    >
        <div class="space-y-6 p-6">
            <div class="grid grid-cols-2 gap-3">
                <StatTile label="Clientes registrados" :value="total" :icon="Users" />
                <StatTile label="Con compras" :value="withPurchases" :icon="UserCheck" tone="accent" />
                <StatTile label="Nuevos este mes" :value="newThisMonth" :icon="UserPlus" tone="info" />
                <StatTile label="Total comprado" :value="formatCurrency(totalSpent)" :icon="Wallet" />
            </div>

            <section>
                <h3 class="mb-4 font-semibold text-primary">Mejores clientes</h3>
                <BarList :items="topClients" empty-text="Todavía no hay compras completadas." />
            </section>

            <div class="rounded-lg bg-background p-3">
                <p class="text-xs leading-relaxed text-text-muted">
                    El total comprado considera solo las ventas completadas.
                </p>
            </div>
        </div>
    </ModalShell>
</template>
