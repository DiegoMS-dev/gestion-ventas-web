
<script setup>
import { Pencil, Trash2, Tags } from 'lucide-vue-next';

defineProps({
    categories: {
        type: Array,
        default: () => []
    }
});

defineEmits(['edit', 'delete']);
</script>

<template>
    <section class="overflow-hidden rounded-xl border border-border bg-surface">

        <div class="border-b border-border px-5 py-4">
            <h2 class="font-semibold text-primary">
                Listado de categorías
            </h2>
            <p class="mt-1 text-xs text-text-muted">
                Categorías registradas en el sistema.
            </p>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
                <thead class="bg-background text-xs uppercase text-text-muted">
                    <tr>
                        <th class="px-5 py-4">Categoría</th>
                        <th class="px-5 py-4">Descripción</th>
                        <th class="px-5 py-4 text-center">Productos</th>
                        <th class="px-5 py-4 text-right">Acciones</th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-border">
                    <tr
                        v-for="category in categories"
                        :key="category.id"
                        class="transition hover:bg-background/70"
                    >
                        <td class="px-5 py-4">
                            <div class="flex items-center gap-3">
                                <div class="rounded-lg bg-accent/10 p-2 text-accent">
                                    <Tags :size="18" />
                                </div>

                                <span class="font-medium text-text-main">
                                    {{ category.name }}
                                </span>
                            </div>
                        </td>

                        <td class="px-5 py-4 text-text-muted">
                            {{ category.description || 'Sin descripción' }}
                        </td>

                        <td class="px-5 py-4 text-center">
                            <span class="rounded-full bg-background px-3 py-1 text-xs font-semibold text-primary">
                                {{ category.products_count ?? 0 }}
                            </span>
                        </td>

                        <td class="px-5 py-4">
                            <div class="flex justify-end gap-2">
                                <button
                                    @click="$emit('edit', category)"
                                    class="rounded-lg p-2 text-text-muted transition hover:bg-accent/10 hover:text-accent"
                                    title="Editar"
                                >
                                    <Pencil :size="17" />
                                </button>

                                <button
                                    @click="$emit('delete', category)"
                                    class="rounded-lg p-2 text-text-muted transition hover:bg-danger/10 hover:text-danger"
                                    title="Eliminar"
                                >
                                    <Trash2 :size="17" />
                                </button>
                            </div>
                        </td>
                    </tr>

                    <tr v-if="categories.length === 0">
                        <td colspan="4" class="px-5 py-12 text-center">
                            <Tags :size="32" class="mx-auto mb-3 text-text-muted" />

                            <p class="font-medium text-text-main">
                                No hay categorías registradas
                            </p>

                            <p class="mt-1 text-xs text-text-muted">
                                Registra una categoría para comenzar.
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>
