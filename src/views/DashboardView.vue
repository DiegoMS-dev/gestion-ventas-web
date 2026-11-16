
<script setup>
import { computed } from 'vue';

import PendingTasks from '../components/dashboard/PendingTasks.vue';
import QuickActions from '../components/dashboard/QuickActions.vue';
import LowStock from '../components/dashboard/LowStock.vue';
import RecentSales from '../components/dashboard/RecentSales.vue';

const currentDate = computed(() => {
    return new Intl.DateTimeFormat('es-PE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date());
});
</script>

<template>
    <div class="space-y-6">
        <!-- Encabezado -->
        <header class="flex flex-wrap items-center justify-between gap-3">
            <div>
                <h1 class="text-2xl font-bold text-primary">
                    Panel principal
                </h1>

                <p class="mt-1 text-sm text-text-muted">
                    Aquí tienes lo que necesita tu atención hoy.
                </p>
            </div>

            <span class="text-sm text-text-muted">
                {{ currentDate }}
            </span>
        </header>

        <!-- Acciones rápidas -->
        <QuickActions />

        <!-- Pendientes y stock -->
        <section class="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <PendingTasks />
            <LowStock />
        </section>

        <!-- Actividad reciente -->
        <RecentSales />
    </div>
</template>
