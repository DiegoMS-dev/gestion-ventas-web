
<script setup>
import { ref, computed, onMounted } from 'vue';

import ProductFilters from '../components/products/ProductFilters.vue';
import ProductTable from '../components/products/ProductTable.vue';
import ProductModal from '../components/products/ProductModal.vue';
import ProductStatsModal from '../components/products/ProductStatsModal.vue';

import { getCategories } from '../services/categoryService';
import { ChartColumn } from 'lucide-vue-next';

import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct as deleteProductRequest
} from '../services/productService';

const products = ref([]);
const categories = ref([]);

const search = ref('');
const selectedCategory = ref('Todas');
const selectedStatus = ref('Todos');

const showModal = ref(false);
const showStatsModal = ref(false);
const editingProduct = ref(null);

const loading = ref(false);
const errorMessage = ref('');

// Categorías para los filtros
const categoryFilters = computed(() => [
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

// Obtener productos de Laravel
async function loadProducts() {
    loading.value = true;
    errorMessage.value = '';

    try {
        const data = await getProducts();

        products.value = data.map(product => ({
            ...product,
            category: product.category?.name ?? 'Sin categoría',
            minStock: product.min_stock
        }));

    } catch (error) {
        console.error('Error al cargar productos:', error);
        errorMessage.value = 'No se pudieron cargar los productos.';
    } finally {
        loading.value = false;
    }
}

// Obtener categorías de Laravel
async function loadCategories() {
    try {
        categories.value = await getCategories();
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        errorMessage.value = 'No se pudieron cargar las categorías.';
    }
}

function openCreateModal() {
    editingProduct.value = null;
    showModal.value = true;
}

function openEditModal(product) {
    editingProduct.value = { ...product };
    showModal.value = true;
}

// Crear o actualizar producto
async function saveProduct(productData) {
    errorMessage.value = '';

    try {
        const data = {
            ...productData,
            min_stock: productData.minStock
        };

        delete data.minStock;

        if (editingProduct.value) {
            await updateProduct(editingProduct.value.id, data);
        } else {
            await createProduct(data);
        }

        showModal.value = false;
        await loadProducts();

    } catch (error) {
        console.error('Error al guardar producto:', error);

        if (error.response?.status === 422) {
            errorMessage.value = 'Revisa los datos ingresados. Hay campos inválidos o una categoría o código no válido.';
        } else {
            errorMessage.value = 'No se pudo guardar el producto.';
        }
    }
}

// Eliminar producto
async function deleteProduct(product) {
    const confirmed = window.confirm(
        `¿Estás seguro de eliminar "${product.name}"?`
    );

    if (!confirmed) return;

    errorMessage.value = '';

    try {
        await deleteProductRequest(product.id);
        await loadProducts();
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        errorMessage.value = 'No se pudo eliminar el producto.';
    }
}

onMounted(async () => {
    await Promise.all([
        loadProducts(),
        loadCategories()
    ]);
});
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

        <!-- Mensajes -->
        <div
            v-if="errorMessage"
            class="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
            {{ errorMessage }}
        </div>

        <!-- Filtros -->
        <ProductFilters
            v-model:search="search"
            v-model:category="selectedCategory"
            v-model:status="selectedStatus"
            :categories="categoryFilters"
        />

        <!-- Cargando -->
        <div
            v-if="loading"
            class="rounded-xl border border-border bg-surface p-8 text-center text-sm text-text-muted"
        >
            Cargando productos...
        </div>

        <!-- Tabla -->
        <ProductTable
            v-else
            :products="filteredProducts"
            @edit="openEditModal"
            @delete="deleteProduct"
        />

        <!-- Modal -->
        <ProductModal
            v-if="showModal"
            :product="editingProduct"
            :categories="categories"
            @close="showModal = false"
            @save="saveProduct"
        />

        <!-- Estadísticas -->
        <ProductStatsModal
            v-if="showStatsModal"
            :products="products"
            @close="showStatsModal = false"
        />

    </div>
</template>
