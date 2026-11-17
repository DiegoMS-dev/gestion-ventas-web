<script setup>
import { Pencil, Trash2, Users } from 'lucide-vue-next';
import { formatCurrency, formatDate } from '../../utils/format';

defineProps({
    clients: { type: Array, default: () => [] }
});

defineEmits(['edit', 'delete']);
</script>

<template>
    <section class="overflow-hidden rounded-xl border border-border bg-surface">
        <div class="border-b border-border px-5 py-4">
            <h2 class="font-semibold text-primary">Lista de clientes</h2>
            <p class="mt-1 text-sm text-text-muted">
                {{ clients.length }} clientes encontrados
            </p>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full min-w-[850px] text-left text-sm">
                <thead class="bg-background">
                    <tr class="text-xs text-text-muted">
                        <th class="px-5 py-3 font-semibold">Cliente</th>
                        <th class="px-5 py-3 font-semibold">Documento</th>
                        <th class="px-5 py-3 font-semibold">Contacto</th>
                        <th class="px-5 py-3 text-center font-semibold">Compras</th>
                        <th class="px-5 py-3 font-semibold">Total comprado</th>
                        <th class="px-5 py-3 font-semibold">Última compra</th>
                        <th class="px-5 py-3 text-center font-semibold">Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="client in clients"
                        :key="client.id"
                        class="border-t border-border transition hover:bg-background/60"
                    >
                        <td class="px-5 py-4">
                            <div class="flex items-center gap-3">
                                <div class="grid size-9 shrink-0 place-items-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                                    {{ client.name.slice(0, 2).toUpperCase() }}
                                </div>
                                <span class="font-medium text-text-main">{{ client.name }}</span>
                            </div>
                        </td>

                        <td class="px-5 py-4 text-text-muted">
                            {{ client.document || '—' }}
                        </td>

                        <td class="px-5 py-4 text-text-muted">
                            <p>{{ client.phone || '—' }}</p>
                            <p class="text-xs">{{ client.email || '' }}</p>
                        </td>

                        <td class="px-5 py-4 text-center">
                            <span class="rounded-full bg-background px-3 py-1 text-xs font-semibold text-primary">
                                {{ client.sales_count ?? 0 }}
                            </span>
                        </td>

                        <td class="px-5 py-4 font-semibold text-text-main">
                            {{ formatCurrency(client.total_spent) }}
                        </td>

                        <td class="px-5 py-4 text-text-muted">
                            {{ formatDate(client.last_purchase_at) }}
                        </td>

                        <td class="px-5 py-4">
                            <div class="flex items-center justify-center gap-2">
                                <button
                                    @click="$emit('edit', client)"
                                    title="Editar cliente"
                                    class="rounded-lg p-2 text-info transition hover:bg-info/10"
                                >
                                    <Pencil :size="17" />
                                </button>

                                <button
                                    @click="$emit('delete', client)"
                                    title="Eliminar cliente"
                                    class="rounded-lg p-2 text-danger transition hover:bg-danger/10"
                                >
                                    <Trash2 :size="17" />
                                </button>
                            </div>
                        </td>
                    </tr>

                    <tr v-if="clients.length === 0">
                        <td colspan="7" class="px-5 py-12 text-center">
                            <Users :size="36" class="mx-auto mb-3 text-text-muted" />
                            <p class="font-medium text-text-main">No se encontraron clientes</p>
                            <p class="mt-1 text-sm text-text-muted">
                                Registra un cliente o prueba otra búsqueda.
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>
