<script setup>
import { ref, computed } from 'vue';
import { ArrowLeftRight } from 'lucide-vue-next';
import ModalShell from '../ui/ModalShell.vue';

const props = defineProps({
    products: { type: Array, default: () => [] },
    productId: { type: [Number, String], default: '' },
    saving: { type: Boolean, default: false },
    serverError: { type: String, default: '' }
});

const emit = defineEmits(['close', 'save']);

const form = ref({
    product_id: props.productId || '',
    type: 'entry',
    quantity: '',
    reason: ''
});

const errors = ref({});

const selectedProduct = computed(() =>
    props.products.find(product => product.id === form.value.product_id)
);

const types = [
    { value: 'entry', label: 'Entrada (compra / reposición)', reasonHint: 'Ej. Compra a proveedor' },
    { value: 'exit', label: 'Salida (merma / pérdida)', reasonHint: 'Ej. Producto dañado' },
    { value: 'adjustment', label: 'Ajuste (conteo físico)', reasonHint: 'Ej. Inventario del mes' }
];

const currentType = computed(() => types.find(type => type.value === form.value.type));

const quantityLabel = computed(() =>
    form.value.type === 'adjustment' ? 'Stock real contado' : 'Cantidad'
);

// Vista previa del stock resultante
const resultingStock = computed(() => {
    const product = selectedProduct.value;
    const qty = Number(form.value.quantity);

    if (!product || form.value.quantity === '' || Number.isNaN(qty)) return null;

    if (form.value.type === 'entry') return product.stock + qty;
    if (form.value.type === 'exit') return product.stock - qty;
    return qty;
});

function validateForm() {
    errors.value = {};

    if (!form.value.product_id) {
        errors.value.product_id = 'Selecciona un producto.';
    }

    const qty = Number(form.value.quantity);
    const min = form.value.type === 'adjustment' ? 0 : 1;

    if (form.value.quantity === '' || !Number.isInteger(qty) || qty < min) {
        errors.value.quantity = form.value.type === 'adjustment'
            ? 'Ingresa un stock válido (0 o más).'
            : 'Ingresa una cantidad entera mayor a 0.';
    } else if (form.value.type === 'exit' && selectedProduct.value && qty > selectedProduct.value.stock) {
        errors.value.quantity = `No puedes sacar más de ${selectedProduct.value.stock} unidades.`;
    }

    return Object.keys(errors.value).length === 0;
}

function submitForm() {
    if (!validateForm()) return;

    emit('save', {
        product_id: form.value.product_id,
        type: form.value.type,
        quantity: Number(form.value.quantity),
        reason: form.value.reason.trim() || null
    });
}

const inputClass = 'w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent';
</script>

<template>
    <ModalShell
        title="Registrar movimiento"
        subtitle="Entradas, salidas y ajustes de inventario."
        :icon="ArrowLeftRight"
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
                <label class="mb-2 block text-sm font-medium text-text-main">Producto</label>
                <select v-model="form.product_id" :class="[inputClass, { 'border-danger': errors.product_id }]">
                    <option value="" disabled>Selecciona un producto</option>
                    <option v-for="product in products" :key="product.id" :value="product.id">
                        {{ product.name }} (stock {{ product.stock }})
                    </option>
                </select>
                <p v-if="errors.product_id" class="mt-1 text-xs text-danger">{{ errors.product_id }}</p>
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-text-main">Tipo de movimiento</label>
                <select v-model="form.type" :class="inputClass">
                    <option v-for="type in types" :key="type.value" :value="type.value">
                        {{ type.label }}
                    </option>
                </select>
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-text-main">{{ quantityLabel }}</label>
                <input v-model="form.quantity" type="number" min="0" step="1" placeholder="0"
                    :class="[inputClass, { 'border-danger': errors.quantity }]" />
                <p v-if="errors.quantity" class="mt-1 text-xs text-danger">{{ errors.quantity }}</p>

                <p v-else-if="resultingStock !== null" class="mt-1 text-xs text-text-muted">
                    Stock actual: {{ selectedProduct.stock }} → quedará en
                    <span class="font-semibold text-primary">{{ resultingStock }}</span>
                </p>
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-text-main">Motivo</label>
                <input v-model="form.reason" type="text" :placeholder="currentType.reasonHint" :class="inputClass" />
            </div>

            <footer class="flex justify-end gap-3 border-t border-border pt-5">
                <button type="button" @click="emit('close')"
                    class="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text-muted transition hover:bg-background">
                    Cancelar
                </button>

                <button type="submit" :disabled="saving"
                    class="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50">
                    {{ saving ? 'Guardando...' : 'Registrar movimiento' }}
                </button>
            </footer>
        </form>
    </ModalShell>
</template>
