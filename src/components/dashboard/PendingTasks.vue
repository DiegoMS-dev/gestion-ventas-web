<script setup>
import { computed } from 'vue';
import { AlertTriangle, Clock } from 'lucide-vue-next';

const props = defineProps({
    // { out_of_stock, low_stock, pending_sales }
    pending: {
        type: Object,
        default: () => ({ out_of_stock: 0, low_stock: 0, pending_sales: 0 })
    }
});

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

const tasks = computed(() => [
    {
        title: 'Productos agotados',
        description: props.pending.out_of_stock > 0
            ? `Hay ${plural(props.pending.out_of_stock, 'producto', 'productos')} sin existencias.`
            : 'Ningún producto agotado.',
        count: props.pending.out_of_stock,
        icon: AlertTriangle,
        color: 'text-danger',
        background: 'bg-danger/10',
        link: '/inventario?estado=Agotado'
    },
    {
        title: 'Stock bajo',
        description: props.pending.low_stock > 0
            ? `${plural(props.pending.low_stock, 'producto necesita', 'productos necesitan')} reposición.`
            : 'Ningún producto con stock bajo.',
        count: props.pending.low_stock,
        icon: AlertTriangle,
        color: 'text-warning',
        background: 'bg-warning/10',
        link: '/inventario?estado=Stock bajo'
    },
    {
        title: 'Ventas pendientes',
        description: props.pending.pending_sales > 0
            ? `${plural(props.pending.pending_sales, 'venta espera', 'ventas esperan')} confirmación de pago.`
            : 'No hay ventas pendientes de pago.',
        count: props.pending.pending_sales,
        icon: Clock,
        color: 'text-info',
        background: 'bg-info/10',
        link: '/ventas?estado=Pendiente'
    }
]);
</script>

<template>
    <section class="rounded-xl border border-border bg-surface p-5">
        <div class="mb-5">
            <h3 class="font-semibold text-primary">
                Necesita tu atención
            </h3>
            <p class="mt-1 text-sm text-text-muted">
                Situaciones pendientes del negocio
            </p>
        </div>

        <div class="divide-y divide-border">
            <RouterLink
                v-for="task in tasks"
                :key="task.title"
                :to="task.link"
                class="flex items-center gap-3 py-4 first:pt-0 last:pb-0 hover:bg-background/50"
            >
                <div
                    :class="[
                        'grid size-10 shrink-0 place-items-center rounded-lg',
                        task.count > 0 ? task.background : 'bg-background',
                        task.count > 0 ? task.color : 'text-text-muted'
                    ]"
                >
                    <component :is="task.icon" :size="19" />
                </div>

                <div class="min-w-0 flex-1">
                    <p class="text-sm font-semibold text-text-main">
                        {{ task.title }}
                    </p>
                    <p class="mt-1 text-xs text-text-muted">
                        {{ task.description }}
                    </p>
                </div>

                <span
                    :class="[
                        'rounded-full px-2.5 py-1 text-xs font-bold',
                        task.count > 0 ? task.background : 'bg-background',
                        task.count > 0 ? task.color : 'text-text-muted'
                    ]"
                >
                    {{ task.count }}
                </span>
            </RouterLink>
        </div>
    </section>
</template>
