<script setup>
import { computed } from 'vue';
import { Smile } from 'lucide-vue-next';

const props = defineProps({
    // { total, products: [{ id, name, stock, min_stock }] }
    restock: {
        type: Object,
        default: () => ({ total: 0, products: [] })
    }
});

const hasProducts = computed(() => props.restock.products.length > 0);
const remaining = computed(() => props.restock.total - props.restock.products.length);

// Porcentaje del stock respecto al mínimo requerido
function percent(product) {
    if (!product.min_stock) return 0;
    return Math.min(100, Math.round((product.stock / product.min_stock) * 100));
}
</script>

<template>
    <section class="rounded-xl border border-border bg-surface p-5">
        <div class="mb-5 flex items-center justify-between">
            <div>
                <h3 class="font-semibold text-primary">
                    Stock por reponer
                </h3>
                <p class="mt-1 text-sm text-text-muted">
                    Productos que necesitan atención
                </p>
            </div>

            <span
                v-if="hasProducts"
                class="rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning"
            >
                {{ restock.total }} {{ restock.total === 1 ? 'producto' : 'productos' }}
            </span>

            <span
                v-else
                class="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent"
            >
                Al día
            </span>
        </div>

        <!-- Todo en orden -->
        <div
            v-if="!hasProducts"
            class="flex flex-col items-center rounded-lg bg-background px-4 py-8 text-center"
        >
            <div class="grid size-14 place-items-center rounded-full bg-accent/10 text-accent">
                <Smile :size="32" />
            </div>

            <p class="mt-3 text-sm font-semibold text-text-main">
                ¡Todo en orden!
            </p>
            <p class="mt-1 text-xs text-text-muted">
                Ningún producto necesita reposición por ahora.
            </p>
        </div>

        <!-- Productos por reponer -->
        <div v-else class="space-y-5">
            <div
                v-for="product in restock.products"
                :key="product.id"
            >
                <div class="mb-2 flex items-center justify-between gap-3">
                    <span class="min-w-0 truncate text-sm font-medium text-text-main">
                        {{ product.name }}
                    </span>

                    <span
                        :class="[
                            'shrink-0 text-sm font-semibold',
                            product.stock === 0 ? 'text-danger' : 'text-warning'
                        ]"
                    >
                        {{ product.stock === 0 ? 'Agotado' : `${product.stock} unidades` }}
                        <span class="text-xs font-normal text-text-muted">
                            · mín. {{ product.min_stock }}
                        </span>
                    </span>
                </div>

                <div class="h-1.5 overflow-hidden rounded-full bg-background">
                    <div
                        :class="[
                            'h-full rounded-full transition-all',
                            product.stock === 0 ? 'bg-danger' : 'bg-warning'
                        ]"
                        :style="{ width: `${percent(product)}%`, minWidth: product.stock > 0 ? '4px' : '0' }"
                    ></div>
                </div>
            </div>

            <p v-if="remaining > 0" class="text-xs text-text-muted">
                y {{ remaining }} {{ remaining === 1 ? 'producto más' : 'productos más' }}...
            </p>
        </div>

        <RouterLink
            to="/inventario"
            class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
        >
            Revisar inventario
            <span>→</span>
        </RouterLink>
    </section>
</template>
