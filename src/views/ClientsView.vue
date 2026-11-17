<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Search, Plus, ChartColumn } from 'lucide-vue-next';

import ClientTable from '../components/clients/ClientTable.vue';
import ClientModal from '../components/clients/ClientModal.vue';
import ClientStatsModal from '../components/clients/ClientStatsModal.vue';

import {
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer as deleteCustomerRequest
} from '../services/customerService';
import { getApiError } from '../utils/format';

const route = useRoute();
const router = useRouter();

const clients = ref([]);
const search = ref('');

const showModal = ref(false);
const showStatsModal = ref(false);
const editingClient = ref(null);

const loading = ref(false);
const saving = ref(false);
const errorMessage = ref('');
const modalError = ref('');

const filteredClients = computed(() => {
    const term = search.value.toLowerCase();

    return clients.value.filter(client =>
        client.name.toLowerCase().includes(term) ||
        (client.document ?? '').toLowerCase().includes(term) ||
        (client.phone ?? '').toLowerCase().includes(term)
    );
});

async function loadClients() {
    loading.value = true;
    errorMessage.value = '';

    try {
        clients.value = await getCustomers();
    } catch (error) {
        console.error('Error al cargar clientes:', error);
        errorMessage.value = 'No se pudieron cargar los clientes.';
    } finally {
        loading.value = false;
    }
}

function openCreateModal() {
    editingClient.value = null;
    modalError.value = '';
    showModal.value = true;
}

function openEditModal(client) {
    editingClient.value = { ...client };
    modalError.value = '';
    showModal.value = true;
}

async function saveClient(data) {
    saving.value = true;
    modalError.value = '';

    try {
        if (editingClient.value) {
            await updateCustomer(editingClient.value.id, data);
        } else {
            await createCustomer(data);
        }

        showModal.value = false;
        await loadClients();
    } catch (error) {
        console.error('Error al guardar cliente:', error);
        modalError.value = getApiError(error, 'No se pudo guardar el cliente.');
    } finally {
        saving.value = false;
    }
}

async function deleteClient(client) {
    const confirmed = window.confirm(`¿Estás seguro de eliminar a "${client.name}"?`);
    if (!confirmed) return;

    errorMessage.value = '';

    try {
        await deleteCustomerRequest(client.id);
        await loadClients();
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        errorMessage.value = getApiError(error, 'No se pudo eliminar el cliente.');
    }
}

onMounted(async () => {
    await loadClients();

    // Acceso rápido desde otros módulos: /clientes?nuevo=1
    if (route.query.nuevo) {
        openCreateModal();
        router.replace({ query: {} });
    }
});
</script>

<template>
    <div class="space-y-6">
        <header class="flex flex-wrap items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-primary">Clientes</h1>
                <p class="mt-1 text-sm text-text-muted">
                    Administra tu cartera de clientes.
                </p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <button
                    @click="showStatsModal = true"
                    class="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-background"
                >
                    <ChartColumn :size="17" />
                    Ver estadísticas
                </button>

                <button
                    @click="openCreateModal"
                    class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary"
                >
                    <Plus :size="18" />
                    Nuevo cliente
                </button>
            </div>
        </header>

        <div
            v-if="errorMessage"
            class="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
            {{ errorMessage }}
        </div>

        <section class="rounded-xl border border-border bg-surface p-4">
            <div class="relative">
                <Search
                    :size="18"
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                    v-model="search"
                    type="text"
                    placeholder="Buscar por nombre, documento o teléfono..."
                    class="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-text-main outline-none transition placeholder:text-text-muted focus:border-accent"
                />
            </div>
        </section>

        <div
            v-if="loading"
            class="rounded-xl border border-border bg-surface p-8 text-center text-sm text-text-muted"
        >
            Cargando clientes...
        </div>

        <ClientTable
            v-else
            :clients="filteredClients"
            @edit="openEditModal"
            @delete="deleteClient"
        />

        <ClientModal
            v-if="showModal"
            :client="editingClient"
            :saving="saving"
            :server-error="modalError"
            @close="showModal = false"
            @save="saveClient"
        />

        <ClientStatsModal
            v-if="showStatsModal"
            :clients="clients"
            @close="showStatsModal = false"
        />
    </div>
</template>
