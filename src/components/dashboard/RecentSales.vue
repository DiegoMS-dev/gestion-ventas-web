
<script setup>
const sales = [
    { id: 'V-001', client: 'Carlos Mendoza', date: '16/11/2026', total: 'S/ 250.00', status: 'Completada' },
    { id: 'V-002', client: 'Ana Torres', date: '16/11/2026', total: 'S/ 180.00', status: 'Pendiente' },
    { id: 'V-003', client: 'Luis Ramírez', date: '15/11/2026', total: 'S/ 420.00', status: 'Completada' },
    { id: 'V-004', client: 'María López', date: '15/11/2026', total: 'S/ 95.00', status: 'Cancelada' }
];

const statusClasses = {
    Completada: 'bg-accent/10 text-accent',
    Pendiente: 'bg-warning/10 text-warning',
    Cancelada: 'bg-danger/10 text-danger'
};
</script>

<template>
    <section class="rounded-xl border border-border bg-surface p-5">
        <div class="mb-5 flex items-center justify-between gap-3">
            <div>
                <h3 class="font-semibold text-primary">
                    Últimas operaciones
                </h3>
                <p class="mt-1 text-sm text-text-muted">
                    Actividad comercial reciente
                </p>
            </div>

            <RouterLink
                to="/ventas"
                class="shrink-0 text-sm font-semibold text-accent hover:underline"
            >
                Ver todas →
            </RouterLink>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full min-w-[550px] text-left text-sm">
                <thead>
                    <tr class="border-b border-border text-xs text-text-muted">
                        <th class="px-3 py-3 font-medium">Código</th>
                        <th class="px-3 py-3 font-medium">Cliente</th>
                        <th class="px-3 py-3 font-medium">Fecha</th>
                        <th class="px-3 py-3 font-medium">Total</th>
                        <th class="px-3 py-3 font-medium">Estado</th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="sale in sales"
                        :key="sale.id"
                        class="border-b border-border last:border-0 hover:bg-background/60"
                    >
                        <td class="px-3 py-4 font-medium text-primary">
                            {{ sale.id }}
                        </td>

                        <td class="px-3 py-4 text-text-main">
                            {{ sale.client }}
                        </td>

                        <td class="px-3 py-4 text-text-muted">
                            {{ sale.date }}
                        </td>

                        <td class="px-3 py-4 font-semibold text-text-main">
                            {{ sale.total }}
                        </td>

                        <td class="px-3 py-4">
                            <span
                                :class="[
                                    'rounded-full px-2.5 py-1 text-xs font-semibold',
                                    statusClasses[sale.status]
                                ]"
                            >
                                {{ sale.status }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>
