<script setup>
import { ShoppingCart, PackagePlus, UserPlus } from 'lucide-vue-next';

// Cada vista lee el parámetro de la URL y abre su formulario de creación
const actions = [
    {
        title: 'Nueva venta',
        description: 'Registrar una operación',
        icon: ShoppingCart,
        link: '/ventas?nueva=1'
    },
    {
        title: 'Nuevo producto',
        description: 'Agregar al catálogo',
        icon: PackagePlus,
        link: '/productos?nuevo=1'
    },
    {
        title: 'Nuevo cliente',
        description: 'Registrar un cliente',
        icon: UserPlus,
        link: '/clientes?nuevo=1'
    }
];
</script>

<template>
    <section class="rounded-xl border border-border bg-surface p-5">
        <div class="mb-4">
            <h3 class="font-semibold text-primary">
                Accesos rápidos
            </h3>
            <p class="mt-1 text-sm text-text-muted">
                Acciones frecuentes
            </p>
        </div>

        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <RouterLink
                v-for="action in actions"
                :key="action.title"
                :to="action.link"
                class="group flex items-center gap-3 rounded-lg border border-border p-4 transition hover:border-accent hover:bg-accent/5"
            >
                <div class="grid size-11 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-white">
                    <component :is="action.icon" :size="21" />
                </div>

                <div>
                    <p class="text-sm font-semibold text-primary">
                        {{ action.title }}
                    </p>
                    <p class="mt-1 text-xs text-text-muted">
                        {{ action.description }}
                    </p>
                </div>
            </RouterLink>
        </div>
    </section>
</template>
