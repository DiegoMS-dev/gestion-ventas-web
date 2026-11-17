
<script setup>
import { ref, watch } from 'vue';
import { X, Package } from 'lucide-vue-next';

const props = defineProps({
    product: {
        type: Object,
        default: null
    },
    categories: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['close', 'save']);

const emptyForm = () => ({
    code: '',
    name: '',
    category_id: '',
    price: '',
    stock: '',
    minStock: ''
});

const form = ref(emptyForm());
const errors = ref({});

watch(
    () => props.product,
    (product) => {
        form.value = product
            ? {
                code: product.code ?? '',
                name: product.name ?? '',
                category_id: product.category_id ?? '',
                price: product.price ?? '',
                stock: product.stock ?? '',
                minStock: product.minStock ?? product.min_stock ?? ''
            }
            : emptyForm();

        errors.value = {};
    },
    { immediate: true }
);

function validateForm() {
    errors.value = {};

    if (!form.value.code.trim()) {
        errors.value.code = 'El código es obligatorio.';
    }

    if (!form.value.name.trim()) {
        errors.value.name = 'El nombre es obligatorio.';
    }

    if (!form.value.category_id) {
        errors.value.category_id = 'Selecciona una categoría.';
    }

    if (form.value.price === '' || Number(form.value.price) <= 0) {
        errors.value.price = 'Ingresa un precio válido.';
    }

    if (
        form.value.stock === '' ||
        !Number.isInteger(Number(form.value.stock)) ||
        Number(form.value.stock) < 0
    ) {
        errors.value.stock = 'Ingresa un stock válido.';
    }

    if (
        form.value.minStock === '' ||
        !Number.isInteger(Number(form.value.minStock)) ||
        Number(form.value.minStock) < 0
    ) {
        errors.value.minStock = 'Ingresa un stock mínimo válido.';
    }

    return Object.keys(errors.value).length === 0;
}

function submitForm() {
    if (!validateForm()) return;

    emit('save', {
        code: form.value.code.trim(),
        name: form.value.name.trim(),
        category_id: Number(form.value.category_id),
        price: Number(form.value.price),
        stock: Number(form.value.stock),
        minStock: Number(form.value.minStock)
    });
}
</script>

<template>
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 p-4 backdrop-blur-sm"
        @click.self="emit('close')"
    >
        <section class="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-surface shadow-2xl">

            <!-- Encabezado -->
            <header class="flex items-center justify-between border-b border-border px-6 py-5">
                <div class="flex items-center gap-3">
                    <div class="rounded-xl bg-accent/10 p-2.5 text-accent">
                        <Package :size="22" />
                    </div>

                    <div>
                        <h2 class="font-semibold text-primary">
                            {{ product ? 'Editar producto' : 'Nuevo producto' }}
                        </h2>

                        <p class="mt-1 text-xs text-text-muted">
                            Completa la información del producto.
                        </p>
                    </div>
                </div>

                <button
                    @click="emit('close')"
                    class="rounded-lg p-2 text-text-muted transition hover:bg-background hover:text-primary"
                    title="Cerrar"
                >
                    <X :size="20" />
                </button>
            </header>

            <!-- Formulario -->
            <form @submit.prevent="submitForm" class="space-y-5 p-6">

                <!-- Código -->
                <div>
                    <label class="mb-2 block text-sm font-medium text-text-main">
                        Código del producto
                    </label>

                    <input
                        v-model="form.code"
                        type="text"
                        placeholder="Ej. PRD-006"
                        class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
                        :class="{ 'border-danger': errors.code }"
                    />

                    <p v-if="errors.code" class="mt-1 text-xs text-danger">
                        {{ errors.code }}
                    </p>
                </div>

                <!-- Nombre -->
                <div>
                    <label class="mb-2 block text-sm font-medium text-text-main">
                        Nombre del producto
                    </label>

                    <input
                        v-model="form.name"
                        type="text"
                        placeholder="Ej. Teclado mecánico"
                        class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
                        :class="{ 'border-danger': errors.name }"
                    />

                    <p v-if="errors.name" class="mt-1 text-xs text-danger">
                        {{ errors.name }}
                    </p>
                </div>

                <!-- Categoría -->
                <div>
                    <label class="mb-2 block text-sm font-medium text-text-main">
                        Categoría
                    </label>

                    <select
                        v-model="form.category_id"
                        class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
                        :class="{ 'border-danger': errors.category_id }"
                    >
                        <option value="" disabled>
                            Selecciona una categoría
                        </option>

                        <option
                            v-for="category in categories"
                            :key="category.id"
                            :value="category.id"
                        >
                            {{ category.name }}
                        </option>
                    </select>

                    <p v-if="errors.category_id" class="mt-1 text-xs text-danger">
                        {{ errors.category_id }}
                    </p>

                    <p v-if="categories.length === 0" class="mt-1 text-xs text-text-muted">
                        No hay categorías registradas. Primero crea una categoría.
                    </p>
                </div>

                <!-- Precio y stock -->
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <label class="mb-2 block text-sm font-medium text-text-main">
                            Precio (S/)
                        </label>

                        <input
                            v-model="form.price"
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                            class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
                            :class="{ 'border-danger': errors.price }"
                        />

                        <p v-if="errors.price" class="mt-1 text-xs text-danger">
                            {{ errors.price }}
                        </p>
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-medium text-text-main">
                            Stock
                        </label>

                        <input
                            v-model="form.stock"
                            type="number"
                            min="0"
                            step="1"
                            placeholder="0"
                            class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
                            :class="{ 'border-danger': errors.stock }"
                        />

                        <p v-if="errors.stock" class="mt-1 text-xs text-danger">
                            {{ errors.stock }}
                        </p>
                    </div>

                    <div>
                        <label class="mb-2 block text-sm font-medium text-text-main">
                            Stock mínimo
                        </label>

                        <input
                            v-model="form.minStock"
                            type="number"
                            min="0"
                            step="1"
                            placeholder="0"
                            class="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent"
                            :class="{ 'border-danger': errors.minStock }"
                        />

                        <p v-if="errors.minStock" class="mt-1 text-xs text-danger">
                            {{ errors.minStock }}
                        </p>
                    </div>
                </div>

                <!-- Botones -->
                <footer class="flex justify-end gap-3 border-t border-border pt-5">
                    <button
                        type="button"
                        @click="emit('close')"
                        class="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text-muted transition hover:bg-background"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        :disabled="categories.length === 0"
                        class="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {{ product ? 'Guardar cambios' : 'Registrar producto' }}
                    </button>
                </footer>
            </form>
        </section>
    </div>
</template>
