<script setup>
import { X } from 'lucide-vue-next';

// Estructura común de los modales (mismo diseño que los de Productos)
defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    icon: { type: [Object, Function], default: null },
    size: { type: String, default: 'max-w-xl' }
});

defineEmits(['close']);
</script>

<template>
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 p-4 backdrop-blur-sm"
        @click.self="$emit('close')"
    >
        <section
            :class="['max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-surface shadow-2xl', size]"
        >
            <header class="flex items-center justify-between border-b border-border px-6 py-5">
                <div class="flex items-center gap-3">
                    <div v-if="icon" class="rounded-xl bg-accent/10 p-2.5 text-accent">
                        <component :is="icon" :size="22" />
                    </div>

                    <div>
                        <h2 class="font-semibold text-primary">{{ title }}</h2>

                        <p v-if="subtitle" class="mt-1 text-xs text-text-muted">
                            {{ subtitle }}
                        </p>
                    </div>
                </div>

                <button
                    @click="$emit('close')"
                    class="rounded-lg p-2 text-text-muted transition hover:bg-background hover:text-primary"
                    title="Cerrar"
                >
                    <X :size="20" />
                </button>
            </header>

            <slot />
        </section>
    </div>
</template>
