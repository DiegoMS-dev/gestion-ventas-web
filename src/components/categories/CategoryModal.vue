
<script setup>
import { ref, watch } from 'vue';
import { X, Tags } from 'lucide-vue-next';

const props = defineProps({
    category: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['close', 'save']);

const form = ref({
    name: '',
    description: ''
});

const errors = ref({});

watch(
    () => props.category,
    (category) => {
        form.value = category
            ? {
                name: category.name,
                description: category.description || ''
            }
            : {
                name: '',
                description: ''
            };

        errors.value = {};
    },
    { immediate: true }
);

function submitForm() {
    errors.value = {};

    if (!form.value.name.trim()) {
        errors.value.name = 'El nombre es obligatorio.';
        return;
    }

    emit('save', {
        name: form.value.name.trim(),
        description: form.value.description.trim() || null
    });
}
</script>

<template>
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-primary/50 p-4 backdrop-blur-sm"
        @click.self="emit('close')"
    >
        <section class="w-full max-w-lg overflow-hidden rounded-2xl bg-surface shadow-2xl">

            <header class="flex items-center justify-between border-b border-border px-6 py-5">
                <div class="flex items-center gap-3">
                    <div class="rounded-xl bg-accent/10 p-2.5 text-accent">
                        <Tags :size="22" />
                    </div>

                    <div>
                        <h2 class="font-semibold text-primary">
                            {{ category ? 'Editar categoría' : 'Nueva categoría' }}
                        </h2>

                        <p class="mt-1 text-xs text-text-muted">
                            Completa la información de la categoría.
                        </p>
                    </div>
                </div>

                <button
                    @click="emit('close')"
                    class="rounded-lg p-2 text-text-muted transition hover:bg-background hover:text-primary"
                >
                    <X :size="20" />
                </button>
            </header>

            <form @submit.prevent="submitForm" class="space-y-5 p-6">

                <div>
                    <label class="mb-2 block text-sm font-medium text-text-main">
                        Nombre
                    </label>

                    <input
                        v-model="form.name"
                        type="text"
                        maxlength="255"
                        placeholder="Ej. Periféricos"
                        class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-main outline-none transition placeholder:text-text-muted focus:border-accent"
                    />

                    <p v-if="errors.name" class="mt-1 text-xs text-danger">
                        {{ errors.name }}
                    </p>
                </div>

                <div>
                    <label class="mb-2 block text-sm font-medium text-text-main">
                        Descripción
                    </label>

                    <textarea
                        v-model="form.description"
                        rows="4"
                        placeholder="Describe brevemente esta categoría..."
                        class="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-main outline-none transition placeholder:text-text-muted focus:border-accent"
                    ></textarea>
                </div>

                <div class="flex justify-end gap-3 border-t border-border pt-5">
                    <button
                        type="button"
                        @click="emit('close')"
                        class="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text-main transition hover:bg-background"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        class="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary"
                    >
                        {{ category ? 'Guardar cambios' : 'Registrar categoría' }}
                    </button>
                </div>

            </form>
        </section>
    </div>
</template>
