
<script setup>
import { AlertTriangle, Clock, ClipboardList } from 'lucide-vue-next';

const tasks = [
    {
        title: 'Productos agotados',
        description: 'Hay 2 productos sin existencias.',
        count: 2,
        icon: AlertTriangle,
        color: 'text-danger',
        background: 'bg-danger/10',
        link: '/inventario'
    },
    {
        title: 'Stock bajo',
        description: '5 productos necesitan reposición.',
        count: 5,
        icon: AlertTriangle,
        color: 'text-warning',
        background: 'bg-warning/10',
        link: '/inventario'
    },
    {
        title: 'Operaciones pendientes',
        description: 'Hay ventas que requieren revisión.',
        count: 3,
        icon: Clock,
        color: 'text-info',
        background: 'bg-info/10',
        link: '/ventas'
    }
];
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
                        task.background,
                        task.color
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
                        task.background,
                        task.color
                    ]"
                >
                    {{ task.count }}
                </span>
            </RouterLink>
        </div>
    </section>
</template>
