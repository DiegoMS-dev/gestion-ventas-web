<script setup>
// Indicador pequeño usado en los modales de estadísticas
defineProps({
    label: { type: String, required: true },
    value: { type: [String, Number], required: true },
    icon: { type: [Object, Function], default: null },
    tone: { type: String, default: 'primary' } // primary | warning | danger | accent | info
});

const tones = {
    primary: 'text-primary',
    warning: 'text-warning',
    danger: 'text-danger',
    accent: 'text-accent',
    info: 'text-info'
};
</script>

<template>
    <div class="rounded-xl border border-border bg-background p-4">
        <div class="flex items-center gap-2 text-text-muted">
            <component
                :is="icon"
                v-if="icon"
                :size="18"
                :class="tone !== 'primary' ? tones[tone] : ''"
            />
            <span class="text-xs">{{ label }}</span>
        </div>

        <p :class="['mt-3 text-2xl font-bold', tones[tone]]">
            {{ value }}
        </p>
    </div>
</template>
