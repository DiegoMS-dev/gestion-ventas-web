<script setup>
import { ref, watch } from 'vue';
import { UserRound } from 'lucide-vue-next';
import ModalShell from '../ui/ModalShell.vue';

const props = defineProps({
    client: { type: Object, default: null },
    saving: { type: Boolean, default: false },
    serverError: { type: String, default: '' }
});

const emit = defineEmits(['close', 'save']);

const emptyForm = () => ({ name: '', document: '', phone: '', email: '', address: '' });

const form = ref(emptyForm());
const errors = ref({});

watch(
    () => props.client,
    (client) => {
        form.value = client
            ? {
                name: client.name ?? '',
                document: client.document ?? '',
                phone: client.phone ?? '',
                email: client.email ?? '',
                address: client.address ?? ''
            }
            : emptyForm();

        errors.value = {};
    },
    { immediate: true }
);

function validateForm() {
    errors.value = {};

    if (!form.value.name.trim()) {
        errors.value.name = 'El nombre es obligatorio.';
    }

    const doc = form.value.document.trim();
    if (doc && !/^\d{8}$|^\d{11}$/.test(doc)) {
        errors.value.document = 'Ingresa un DNI (8 dígitos) o RUC (11 dígitos).';
    }

    const email = form.value.email.trim();
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
        errors.value.email = 'Ingresa un correo válido.';
    }

    return Object.keys(errors.value).length === 0;
}

function submitForm() {
    if (!validateForm()) return;

    emit('save', {
        name: form.value.name.trim(),
        document: form.value.document.trim() || null,
        phone: form.value.phone.trim() || null,
        email: form.value.email.trim() || null,
        address: form.value.address.trim() || null
    });
}

const inputClass = 'w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent';
</script>

<template>
    <ModalShell
        :title="client ? 'Editar cliente' : 'Nuevo cliente'"
        subtitle="Completa la información del cliente."
        :icon="UserRound"
        @close="emit('close')"
    >
        <form @submit.prevent="submitForm" class="space-y-5 p-6">
            <div
                v-if="serverError"
                class="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
            >
                {{ serverError }}
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-text-main">Nombre o razón social</label>
                <input v-model="form.name" type="text" placeholder="Ej. Carlos Mendoza"
                    :class="[inputClass, { 'border-danger': errors.name }]" />
                <p v-if="errors.name" class="mt-1 text-xs text-danger">{{ errors.name }}</p>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label class="mb-2 block text-sm font-medium text-text-main">DNI / RUC</label>
                    <input v-model="form.document" type="text" inputmode="numeric" placeholder="Opcional"
                        :class="[inputClass, { 'border-danger': errors.document }]" />
                    <p v-if="errors.document" class="mt-1 text-xs text-danger">{{ errors.document }}</p>
                </div>

                <div>
                    <label class="mb-2 block text-sm font-medium text-text-main">Teléfono</label>
                    <input v-model="form.phone" type="text" placeholder="Opcional" :class="inputClass" />
                </div>
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-text-main">Correo electrónico</label>
                <input v-model="form.email" type="email" placeholder="Opcional"
                    :class="[inputClass, { 'border-danger': errors.email }]" />
                <p v-if="errors.email" class="mt-1 text-xs text-danger">{{ errors.email }}</p>
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-text-main">Dirección</label>
                <input v-model="form.address" type="text" placeholder="Opcional" :class="inputClass" />
            </div>

            <footer class="flex justify-end gap-3 border-t border-border pt-5">
                <button type="button" @click="emit('close')"
                    class="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text-muted transition hover:bg-background">
                    Cancelar
                </button>

                <button type="submit" :disabled="saving"
                    class="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50">
                    {{ saving ? 'Guardando...' : client ? 'Guardar cambios' : 'Registrar cliente' }}
                </button>
            </footer>
        </form>
    </ModalShell>
</template>
