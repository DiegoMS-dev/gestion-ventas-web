<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChartColumn, Plus } from 'lucide-vue-next';

import SaleTable from '../components/sales/SaleTable.vue';
import SaleModal from '../components/sales/SaleModal.vue';
import SaleDetailModal from '../components/sales/SaleDetailModal.vue';
import SaleStatsModal from '../components/sales/SaleStatsModal.vue';

import { getSales, getSale, createSale, updateSaleStatus } from '../services/saleService';
import { getProducts } from '../services/productService';
import { getCustomers } from '../services/customerService';
import { getApiError, getSaleStatus } from '../utils/format';

const route = useRoute();
const router = useRouter();

const sales = ref([]);
const products = ref([]);
const customers = ref([]);

const search = ref('');
const selectedStatus = ref('Todos');

const showModal = ref(false);
const showStatsModal = ref(false);
const selectedSale = ref(null);

const loading = ref(false);
const saving = ref(false);
const updating = ref(false);
const errorMessage = ref('');
const modalError = ref('');
const detailError = ref('');

const statusOptions = ['Todos', 'Completada', 'Pendiente', 'Cancelada'];

const filteredSales = computed(() => {
    const term = search.value.toLowerCase();

    return sales.value.filter(sale => {
        const matchesSearch =
            sale.code.toLowerCase().includes(term) ||
            (sale.customer?.name ?? 'cliente general').toLowerCase().includes(term);

        const matchesStatus =
            selectedStatus.value === 'Todos' ||
            getSaleStatus(sale.status).label === selectedStatus.value;

        return matchesSearch && matchesStatus;
    });
});

async function loadSales() {
    loading.value = true;
    errorMessage.value = '';

    try {
        sales.value = await getSales();
    } catch (error) {
        console.error('Error al cargar ventas:', error);
        errorMessage.value = 'No se pudieron cargar las ventas.';
    } finally {
        loading.value = false;
    }
}

// Productos y clientes se recargan al abrir el formulario (stock actualizado)
async function loadFormData() {
    try {
        const [productList, customerList] = await Promise.all([
            getProducts(),
            getCustomers()
        ]);

        products.value = productList;
        customers.value = customerList;
    } catch (error) {
        console.error('Error al cargar datos del formulario:', error);
        errorMessage.value = 'No se pudieron cargar los productos o clientes.';
    }
}

async function openCreateModal() {
    modalError.value = '';
    await loadFormData();
    showModal.value = true;
}

async function saveSale(data) {
    saving.value = true;
    modalError.value = '';

    try {
        await createSale(data);
        showModal.value = false;
        await loadSales();
    } catch (error) {
        console.error('Error al registrar venta:', error);
        modalError.value = getApiError(error, 'No se pudo registrar la venta.');
    } finally {
        saving.value = false;
    }
}

async function openDetail(sale) {
    detailError.value = '';

    try {
        selectedSale.value = await getSale(sale.id);
    } catch (error) {
        console.error('Error al cargar la venta:', error);
        errorMessage.value = 'No se pudo cargar el detalle de la venta.';
    }
}

async function changeStatus(status) {
    if (status === 'cancelled') {
        const confirmed = window.confirm(
            `¿Cancelar la venta ${selectedSale.value.code}? El stock de los productos será devuelto al inventario.`
        );

        if (!confirmed) return;
    }

    updating.value = true;
    detailError.value = '';

    try {
        await updateSaleStatus(selectedSale.value.id, status);
        selectedSale.value = await getSale(selectedSale.value.id);
        await loadSales();
    } catch (error) {
        console.error('Error al cambiar el estado:', error);
        detailError.value = getApiError(error, 'No se pudo cambiar el estado de la venta.');
    } finally {
        updating.value = false;
    }
}

onMounted(async () => {
    // Filtro inicial desde el dashboard: /ventas?estado=Pendiente
    if (statusOptions.includes(route.query.estado)) {
        selectedStatus.value = route.query.estado;
    }

    await loadSales();

    // Acceso rápido desde el dashboard: /ventas?nueva=1
    if (route.query.nueva) {
        await openCreateModal();
        router.replace({ query: {} });
    }
});
</script>

<template>
    <div class="space-y-6">
        <header class="flex flex-wrap items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-primary">Ventas</h1>
                <p class="mt-1 text-sm text-text-muted">
                    Registra y consulta las ventas de tu negocio.
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
                    Nueva venta
                </button>
            </div>
        </header>

        <div
            v-if="errorMessage"
            class="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
            {{ errorMessage }}
        </div>

        <section class="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 md:flex-row">
            <input
                v-model="search"
                type="text"
                placeholder="Buscar por código o cliente..."
                class="w-full flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-main outline-none transition placeholder:text-text-muted focus:border-accent"
            />

            <select
                v-model="selectedStatus"
                class="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-main outline-none focus:border-accent"
            >
                <option v-for="status in statusOptions" :key="status" :value="status">
                    {{ status === 'Todos' ? 'Todos los estados' : status }}
                </option>
            </select>
        </section>

        <div
            v-if="loading"
            class="rounded-xl border border-border bg-surface p-8 text-center text-sm text-text-muted"
        >
            Cargando ventas...
        </div>

        <SaleTable v-else :sales="filteredSales" @view="openDetail" />

        <SaleModal
            v-if="showModal"
            :products="products"
            :customers="customers"
            :saving="saving"
            :server-error="modalError"
            @close="showModal = false"
            @save="saveSale"
        />

        <SaleDetailModal
            v-if="selectedSale"
            :sale="selectedSale"
            :updating="updating"
            :server-error="detailError"
            @close="selectedSale = null"
            @change-status="changeStatus"
        />

        <SaleStatsModal v-if="showStatsModal" @close="showStatsModal = false" />
    </div>
</template>
