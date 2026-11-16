
<script setup>
import { ref, computed } from 'vue';

import ProductFilters from '../components/products/ProductFilters.vue';
import ProductTable from '../components/products/ProductTable.vue';
import ProductModal from '../components/products/ProductModal.vue';
import { ChartColumn } from 'lucide-vue-next';
import ProductStatsModal from '../components/products/ProductStatsModal.vue';

const products = ref([
    {
        id: 1,
        code: 'PRD-001',
        name: 'Teclado mecánico',
        category: 'Periféricos',
        price: 150,
        stock: 12,
        minStock: 5
    },
    {
        id: 2,
        code: 'PRD-002',
        name: 'Mouse inalámbrico',
        category: 'Periféricos',
        price: 65,
        stock: 3,
        minStock: 5
    },
    {
        id: 3,
        code: 'PRD-003',
        name: 'Monitor 24 pulgadas',
        category: 'Monitores',
        price: 650,
        stock: 8,
        minStock: 3
    },
    {
        id: 4,
        code: 'PRD-004',
        name: 'Cable HDMI',
        category: 'Accesorios',
        price: 25,
        stock: 0,
        minStock: 10
    },
    {
        id: 5,
        code: 'PRD-005',
        name: 'Audífonos Bluetooth',
        category: 'Accesorios',
        price: 120,
        stock: 20,
        minStock: 5
    }
]);

const search = ref('');
const selectedCategory = ref('Todas');
const selectedStatus = ref('Todos');

const showModal = ref(false);
const showStatsModal = ref(false);
const editingProduct = ref(null);

const categories = computed(() => [
    'Todas',
    ...new Set(products.value.map(product => product.category))
]);

const filteredProducts = computed(() => {
    return products.value.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(search.value.toLowerCase()) ||
            product.code.toLowerCase().includes(search.value.toLowerCase());

        const matchesCategory =
            selectedCategory.value === 'Todas' ||
            product.category === selectedCategory.value;

        const matchesStatus =
            selectedStatus.value === 'Todos' ||
            (selectedStatus.value === 'Disponible' && product.stock > 0) ||
            (selectedStatus.value === 'Agotado' && product.stock === 0) ||
            (selectedStatus.value === 'Stock bajo' &&
                product.stock > 0 &&
                product.stock <= product.minStock);

        return matchesSearch && matchesCategory && matchesStatus;
    });
});

function openCreateModal() {
    editingProduct.value = null;
    showModal.value = true;
}

function openEditModal(product) {
    editingProduct.value = { ...product };
    showModal.value = true;
}

function saveProduct(productData) {
    if (editingProduct.value) {
        const index = products.value.findIndex(
            product => product.id === editingProduct.value.id
        );

        products.value[index] = {
            ...productData,
            id: editingProduct.value.id
        };
    } else {
        products.value.push({
            ...productData,
            id: Date.now()
        });
    }

    showModal.value = false;
}

function deleteProduct(product) {
    const confirmed = window.confirm(
        `¿Estás seguro de eliminar "${product.name}"?`
    );

    if (!confirmed) return;

    products.value = products.value.filter(
        item => item.id !== product.id
    );
}
</script>

<template>
    <div class="space-y-6">

        
        <!-- Encabezado -->
        <header class="flex flex-wrap items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-primary">
                    Productos
                </h1>

                <p class="mt-1 text-sm text-text-muted">
                    Administra los productos de tu negocio.
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
                    class="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary"
                >
                    + Nuevo producto
                </button>
            </div>
        </header>


        <!-- Filtros -->
        <ProductFilters
            v-model:search="search"
            v-model:category="selectedCategory"
            v-model:status="selectedStatus"
            :categories="categories"
        />

        <!-- Tabla -->
        <ProductTable
            :products="filteredProducts"
            @edit="openEditModal"
            @delete="deleteProduct"
        />

        <!-- Modal -->
        <ProductModal
            v-if="showModal"
            :product="editingProduct"
            @close="showModal = false"
            @save="saveProduct"
        />
        <!-- Estadísticas -->
        <ProductStatsModal
            v-if="showStatsModal"
            @close="showStatsModal = false"
        />

    </div>
</template>
