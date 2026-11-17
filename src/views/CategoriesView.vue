
<script setup>
import { ref, computed, onMounted } from 'vue';
import { Search, Plus, Tags } from 'lucide-vue-next';

import CategoryTable from '../components/categories/CategoryTable.vue';
import CategoryModal from '../components/categories/CategoryModal.vue';

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory as deleteCategoryRequest
} from '../services/categoryService';

const categories = ref([]);

const search = ref('');
const showModal = ref(false);
const editingCategory = ref(null);

const loading = ref(false);
const errorMessage = ref('');

const filteredCategories = computed(() => {
    return categories.value.filter(category =>
        category.name.toLowerCase().includes(search.value.toLowerCase())
    );
});

// Cargar categorías
async function loadCategories() {
    loading.value = true;
    errorMessage.value = '';

    try {
        categories.value = await getCategories();
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        errorMessage.value = 'No se pudieron cargar las categorías.';
    } finally {
        loading.value = false;
    }
}

function openCreateModal() {
    editingCategory.value = null;
    showModal.value = true;
}

function openEditModal(category) {
    editingCategory.value = { ...category };
    showModal.value = true;
}

// Crear o actualizar
async function saveCategory(categoryData) {
    errorMessage.value = '';

    try {
        if (editingCategory.value) {
            await updateCategory(editingCategory.value.id, categoryData);
        } else {
            await createCategory(categoryData);
        }

        showModal.value = false;
        await loadCategories();

    } catch (error) {
        console.error('Error al guardar categoría:', error);

        if (error.response?.status === 422) {
            errorMessage.value =
                error.response.data.errors?.name?.[0] ||
                'Revisa los datos ingresados.';
        } else {
            errorMessage.value = 'No se pudo guardar la categoría.';
        }
    }
}

// Eliminar categoría
async function deleteCategory(category) {
    const confirmed = window.confirm(
        `¿Estás seguro de eliminar la categoría "${category.name}"?`
    );

    if (!confirmed) return;

    errorMessage.value = '';

    try {
        await deleteCategoryRequest(category.id);
        await loadCategories();

    } catch (error) {
        console.error('Error al eliminar categoría:', error);

        if (error.response?.status === 409) {
            errorMessage.value =
                'No puedes eliminar esta categoría porque tiene productos asociados.';
        } else {
            errorMessage.value = 'No se pudo eliminar la categoría.';
        }
    }
}

onMounted(() => {
    loadCategories();
});
</script>

<template>
    <div class="space-y-6">

        <!-- Encabezado -->
        <header class="flex flex-wrap items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-primary">
                    Categorías
                </h1>

                <p class="mt-1 text-sm text-text-muted">
                    Organiza los productos de tu negocio.
                </p>
            </div>

            <button
                @click="openCreateModal"
                class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary"
            >
                <Plus :size="18" />
                Nueva categoría
            </button>
        </header>

        <!-- Resumen -->
        <section class="rounded-xl border border-border bg-surface p-5">
            <div class="flex items-center gap-3">
                <div class="rounded-xl bg-accent/10 p-3 text-accent">
                    <Tags :size="22" />
                </div>

                <div>
                    <p class="text-sm text-text-muted">
                        Total de categorías
                    </p>

                    <p class="text-2xl font-bold text-primary">
                        {{ categories.length }}
                    </p>
                </div>
            </div>
        </section>

        <!-- Búsqueda -->
        <section class="rounded-xl border border-border bg-surface p-4">
            <div class="relative">
                <Search
                    :size="18"
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                    v-model="search"
                    type="text"
                    placeholder="Buscar categoría..."
                    class="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-text-main outline-none transition placeholder:text-text-muted focus:border-accent"
                />
            </div>
        </section>

        <!-- Mensaje de error -->
        <div
            v-if="errorMessage"
            class="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
            {{ errorMessage }}
        </div>

        <!-- Cargando -->
        <div
            v-if="loading"
            class="rounded-xl border border-border bg-surface p-8 text-center text-sm text-text-muted"
        >
            Cargando categorías...
        </div>

        <!-- Tabla -->
        <CategoryTable
            v-else
            :categories="filteredCategories"
            @edit="openEditModal"
            @delete="deleteCategory"
        />

        <!-- Modal -->
        <CategoryModal
            v-if="showModal"
            :category="editingCategory"
            @close="showModal = false"
            @save="saveCategory"
        />

    </div>
</template>
