<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ChartColumn, ArrowLeftRight } from 'lucide-vue-next';

import StockTable from '../components/inventory/StockTable.vue';
import MovementTable from '../components/inventory/MovementTable.vue';
import StockMovementModal from '../components/inventory/StockMovementModal.vue';
import InventoryStatsModal from '../components/inventory/InventoryStatsModal.vue';

import { getProducts } from '../services/productService';
import { getMovements, createMovement } from '../services/inventoryService';
import { getApiError, getStockStatus, movementTypes } from '../utils/format';

const route = useRoute();

const products = ref([]);
const movements = ref([]);

const tab = ref('stock');
const search = ref('');
const selectedStatus = ref('Todos');
const selectedType = ref('Todos');

const showModal = ref(false);
const showStatsModal = ref(false);
const modalProductId = ref('');

const loading = ref(false);
const saving = ref(false);
const errorMessage = ref('');
const modalError = ref('');

const statusOptions = ['Todos', 'Disponible', 'Stock bajo', 'Agotado'];

// Los productos más urgentes aparecen primero
const urgency = { 'Agotado': 0, 'Stock bajo': 1, 'Disponible': 2 };

const filteredProducts = computed(() => {
    const term = search.value.toLowerCase();

    return products.value
        .filter(product => {
            const matchesSearch =
                product.name.toLowerCase().includes(term) ||
                product.code.toLowerCase().includes(term);

            const matchesStatus =
                selectedStatus.value === 'Todos' ||
                getStockStatus(product).key === selectedStatus.value;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) =>
            urgency[getStockStatus(a).key] - urgency[getStockStatus(b).key] ||
            a.name.localeCompare(b.name)
        );
});

const filteredMovements = computed(() =>
    movements.value.filter(movement =>
        selectedType.value === 'Todos' || movement.type === selectedType.value
    )
);

async function loadProducts() {
    const data = await getProducts();

    products.value = data.map(product => ({
        ...product,
        categoryName: product.category?.name ?? 'Sin categoría'
    }));
}

async function loadMovements() {
    movements.value = await getMovements({ limit: 100 });
}

async function loadAll() {
    loading.value = true;
    errorMessage.value = '';

    try {
        await Promise.all([loadProducts(), loadMovements()]);
    } catch (error) {
        console.error('Error al cargar inventario:', error);
        errorMessage.value = 'No se pudo cargar el inventario.';
    } finally {
        loading.value = false;
    }
}

function openMovementModal(product = null) {
    modalProductId.value = product?.id ?? '';
    modalError.value = '';
    showModal.value = true;
}

async function saveMovement(data) {
    saving.value = true;
    modalError.value = '';

    try {
        await createMovement(data);
        showModal.value = false;
        await loadAll();
    } catch (error) {
        console.error('Error al registrar movimiento:', error);
        modalError.value = getApiError(error, 'No se pudo registrar el movimiento.');
    } finally {
        saving.value = false;
    }
}

onMounted(() => {
    // Filtro inicial desde el dashboard: /inventario?estado=Agotado
    if (statusOptions.includes(route.query.estado)) {
        selectedStatus.value = route.query.estado;
    }

    loadAll();
});

const tabClass = (name) => [
    'rounded-lg px-4 py-2 text-sm font-semibold transition',
    tab.value === name
        ? 'bg-primary text-white'
        : 'text-text-muted hover:bg-background hover:text-primary'
];
</script>

<template>
    <div class="space-y-6">
        <header class="flex flex-wrap items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-primary">Inventario</h1>
                <p class="mt-1 text-sm text-text-muted">
                    Controla las existencias y los movimientos de tus productos.
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
                    @click="openMovementModal()"
                    class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary"
                >
                    <ArrowLeftRight :size="17" />
                    Registrar movimiento
                </button>
            </div>
        </header>

        <div
            v-if="errorMessage"
            class="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
            {{ errorMessage }}
        </div>

        <!-- Pestañas -->
        <div class="inline-flex gap-1 rounded-xl border border-border bg-surface p-1">
            <button :class="tabClass('stock')" @click="tab = 'stock'">Existencias</button>
            <button :class="tabClass('movements')" @click="tab = 'movements'">Movimientos</button>
        </div>

        <!-- Filtros -->
        <section
            v-if="tab === 'stock'"
            class="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 md:flex-row"
        >
            <input
                v-model="search"
                type="text"
                placeholder="Buscar por nombre o código..."
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

        <section
            v-else
            class="rounded-xl border border-border bg-surface p-4"
        >
            <select
                v-model="selectedType"
                class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-main outline-none focus:border-accent md:w-64"
            >
                <option value="Todos">Todos los tipos</option>
                <option v-for="(type, key) in movementTypes" :key="key" :value="key">
                    {{ type.label }}
                </option>
            </select>
        </section>

        <div
            v-if="loading"
            class="rounded-xl border border-border bg-surface p-8 text-center text-sm text-text-muted"
        >
            Cargando inventario...
        </div>

        <template v-else>
            <StockTable
                v-if="tab === 'stock'"
                :products="filteredProducts"
                @move="openMovementModal"
            />

            <MovementTable v-else :movements="filteredMovements" />
        </template>

        <StockMovementModal
            v-if="showModal"
            :products="products"
            :product-id="modalProductId"
            :saving="saving"
            :server-error="modalError"
            @close="showModal = false"
            @save="saveMovement"
        />

        <InventoryStatsModal
            v-if="showStatsModal"
            :products="products"
            @close="showStatsModal = false"
        />
    </div>
</template>
