
<script setup>
defineProps({
    categories: {
        type: Array,
        default: () => []
    }
});

const search = defineModel('search');
const category = defineModel('category');
const status = defineModel('status');
</script>

<template>
    <section class="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 md:flex-row">
        <!-- Buscador -->
        <div class="relative flex-1">
            <input
                v-model="search"
                type="text"
                placeholder="Buscar por nombre o código..."
                class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-main outline-none transition placeholder:text-text-muted focus:border-accent"
            />
        </div>

        <!-- Categoría -->
        <select
            v-model="category"
            class="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-main outline-none focus:border-accent"
        >
            <option
                v-for="item in categories"
                :key="item"
                :value="item"
            >
                {{ item === 'Todas' ? 'Todas las categorías' : item }}
            </option>
        </select>

        <!-- Estado -->
        <select
            v-model="status"
            class="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-main outline-none focus:border-accent"
        >
            <option value="Todos">Todos los estados</option>
            <option value="Disponible">Disponible</option>
            <option value="Stock bajo">Stock bajo</option>
            <option value="Agotado">Agotado</option>
        </select>
    </section>
</template>
