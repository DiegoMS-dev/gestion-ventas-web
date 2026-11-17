<script setup>
import { ref, computed, onMounted } from 'vue';

import PendingTasks from '../components/dashboard/PendingTasks.vue';
import QuickActions from '../components/dashboard/QuickActions.vue';
import LowStock from '../components/dashboard/LowStock.vue';
import RecentSales from '../components/dashboard/RecentSales.vue';

import { getDashboard } from '../services/dashboardService';

const dashboard = ref(null);
const loading = ref(true);
const errorMessage = ref('');

const currentDate = computed(() => {
    return new Intl.DateTimeFormat('es-PE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date());
});

async function loadDashboard() {
    loading.value = true;
    errorMessage.value = '';

    try {
        dashboard.value = await getDashboard();
    } catch (error) {
        console.error('Error al cargar el panel:', error);
        errorMessage.value = 'No se pudo cargar la información del panel.';
    } finally {
        loading.value = false;
    }
}

onMounted(loadDashboard);
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

        <!-- Error -->
        <div
            v-if="errorMessage"
            class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
            {{ errorMessage }}

            <button
                @click="loadDashboard"
                class="font-semibold underline"
            >
                Reintentar
            </button>
        </div>

        <!-- Cargando -->
        <div
            v-else-if="loading"
            class="rounded-xl border border-border bg-surface p-8 text-center text-sm text-text-muted"
        >
            Cargando información...
        </div>

        <template v-else-if="dashboard">
            <!-- Pendientes y stock -->
            <section class="grid grid-cols-1 gap-5 xl:grid-cols-2">
                <PendingTasks :pending="dashboard.pending" />
                <LowStock :restock="dashboard.restock" />
            </section>

            <!-- Actividad reciente -->
            <RecentSales :sales="dashboard.recent_sales" />
        </template>
    </div>
</template>
