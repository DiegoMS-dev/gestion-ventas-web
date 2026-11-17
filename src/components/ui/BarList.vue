<script setup>
import { computed } from 'vue';

// Lista de barras horizontales (mismo estilo que "Productos por categoría")
const props = defineProps({
    // [{ label, value, display? }]
    items: { type: Array, default: () => [] },
    color: { type: String, default: 'bg-accent' },
    emptyText: { type: String, default: 'Sin datos para mostrar.' }
});

const max = computed(() =>
    Math.max(1, ...props.items.map(item => Number(item.value)))
);
</script>

<template>
    <div v-if="items.length" class="space-y-5">
        <div v-for="item in items" :key="item.label">
            <div class="mb-2 flex justify-between gap-3">
                <span class="text-sm font-medium text-text-main">
                    {{ item.label }}
                </span>

                <span class="shrink-0 text-sm font-semibold text-primary">
                    {{ item.display ?? item.value }}
                </span>
            </div>

            <div class="h-3 overflow-hidden rounded-full bg-background">
                <div
                    :class="['h-full rounded-full transition-all duration-500', color]"
                    :style="{ width: `${(Number(item.value) / max) * 100}%` }"
                ></div>
            </div>
        </div>
    </div>

    <p
        v-else
        class="rounded-lg bg-background p-5 text-center text-sm text-text-muted"
    >
        {{ emptyText }}
    </p>
</template>
