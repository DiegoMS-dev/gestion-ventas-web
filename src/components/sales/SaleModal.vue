<script setup>
import { ref, computed } from 'vue';
import { ShoppingCart, Plus, Trash2 } from 'lucide-vue-next';
import ModalShell from '../ui/ModalShell.vue';
import { formatCurrency, paymentMethods } from '../../utils/format';

const props = defineProps({
    products: { type: Array, default: () => [] },
    customers: { type: Array, default: () => [] },
    saving: { type: Boolean, default: false },
    serverError: { type: String, default: '' }
});

const emit = defineEmits(['close', 'save']);

const form = ref({
    customer_id: '',
    payment_method: 'efectivo',
    status: 'completed',
    notes: ''
});

const items = ref([{ product_id: '', quantity: 1 }]);
const errors = ref({});

// Solo se pueden vender productos con stock
const availableProducts = computed(() =>
    props.products.filter(product => product.stock > 0)
);

function productOf(item) {
    return props.products.find(product => product.id === item.product_id);
}

function subtotal(item) {
    const product = productOf(item);
    return product ? Number(product.price) * Number(item.quantity || 0) : 0;
}

const total = computed(() =>
    items.value.reduce((sum, item) => sum + subtotal(item), 0)
);

function addItem() {
    items.value.push({ product_id: '', quantity: 1 });
}

function removeItem(index) {
    items.value.splice(index, 1);
}

function validateForm() {
    errors.value = {};

    if (items.value.length === 0) {
        errors.value.items = 'Agrega al menos un producto.';
        return false;
    }

    const used = new Set();

    for (const item of items.value) {
        const product = productOf(item);

        if (!product) {
            errors.value.items = 'Selecciona un producto en cada fila.';
            break;
        }

        if (used.has(product.id)) {
            errors.value.items = `"${product.name}" está repetido. Suma las cantidades en una sola fila.`;
            break;
        }
        used.add(product.id);

        const qty = Number(item.quantity);

        if (!Number.isInteger(qty) || qty < 1) {
            errors.value.items = 'Las cantidades deben ser números enteros mayores a 0.';
            break;
        }

        if (qty > product.stock) {
            errors.value.items = `Stock insuficiente para "${product.name}". Disponible: ${product.stock}.`;
            break;
        }
    }

    return Object.keys(errors.value).length === 0;
}

function submitForm() {
    if (!validateForm()) return;

    emit('save', {
        customer_id: form.value.customer_id || null,
        payment_method: form.value.payment_method,
        status: form.value.status,
        notes: form.value.notes.trim() || null,
        items: items.value.map(item => ({
            product_id: item.product_id,
            quantity: Number(item.quantity)
        }))
    });
}

const inputClass = 'w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent';
</script>

<template>
    <ModalShell
        title="Nueva venta"
        subtitle="El stock se descuenta automáticamente al registrar."
        :icon="ShoppingCart"
        size="max-w-3xl"
        @close="emit('close')"
    >
        <form @submit.prevent="submitForm" class="space-y-5 p-6">
            <div
                v-if="serverError"
                class="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
            >
                {{ serverError }}
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                    <label class="mb-2 block text-sm font-medium text-text-main">Cliente</label>
                    <select v-model="form.customer_id" :class="inputClass">
                        <option value="">Cliente general</option>
                        <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                            {{ customer.name }}
                        </option>
                    </select>
                </div>

                <div>
                    <label class="mb-2 block text-sm font-medium text-text-main">Método de pago</label>
                    <select v-model="form.payment_method" :class="inputClass">
                        <option v-for="(label, key) in paymentMethods" :key="key" :value="key">
                            {{ label }}
                        </option>
                    </select>
                </div>

                <div>
                    <label class="mb-2 block text-sm font-medium text-text-main">Estado</label>
                    <select v-model="form.status" :class="inputClass">
                        <option value="completed">Completada (pagada)</option>
                        <option value="pending">Pendiente de pago</option>
                    </select>
                </div>
            </div>

            <!-- Productos -->
            <section>
                <div class="mb-3 flex items-center justify-between">
                    <h3 class="text-sm font-semibold text-primary">Productos</h3>

                    <button
                        type="button"
                        @click="addItem"
                        class="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
                    >
                        <Plus :size="16" /> Agregar producto
                    </button>
                </div>

                <div class="space-y-3">
                    <div
                        v-for="(item, index) in items"
                        :key="index"
                        class="grid grid-cols-12 items-center gap-2"
                    >
                        <select v-model="item.product_id" :class="[inputClass, 'col-span-12 sm:col-span-6']">
                            <option value="" disabled>Selecciona un producto</option>
                            <option v-for="product in availableProducts" :key="product.id" :value="product.id">
                                {{ product.name }} — {{ formatCurrency(product.price) }} (stock {{ product.stock }})
                            </option>
                        </select>

                        <input
                            v-model.number="item.quantity"
                            type="number"
                            min="1"
                            step="1"
                            :class="[inputClass, 'col-span-4 sm:col-span-2']"
                        />

                        <p class="col-span-6 text-right text-sm font-semibold text-text-main sm:col-span-3">
                            {{ formatCurrency(subtotal(item)) }}
                        </p>

                        <button
                            type="button"
                            @click="removeItem(index)"
                            :disabled="items.length === 1"
                            title="Quitar"
                            class="col-span-2 justify-self-end rounded-lg p-2 text-danger transition hover:bg-danger/10 disabled:opacity-30 sm:col-span-1"
                        >
                            <Trash2 :size="17" />
                        </button>
                    </div>
                </div>

                <p v-if="errors.items" class="mt-2 text-xs text-danger">{{ errors.items }}</p>

                <p v-if="availableProducts.length === 0" class="mt-2 text-xs text-text-muted">
                    No hay productos con stock disponible.
                </p>
            </section>

            <div>
                <label class="mb-2 block text-sm font-medium text-text-main">Notas</label>
                <input v-model="form.notes" type="text" placeholder="Opcional" :class="inputClass" />
            </div>

            <div class="flex items-center justify-between rounded-lg bg-background px-4 py-3">
                <span class="text-sm font-medium text-text-muted">Total de la venta</span>
                <span class="text-xl font-bold text-primary">{{ formatCurrency(total) }}</span>
            </div>

            <footer class="flex justify-end gap-3 border-t border-border pt-5">
                <button type="button" @click="emit('close')"
                    class="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text-muted transition hover:bg-background">
                    Cancelar
                </button>

                <button type="submit" :disabled="saving || availableProducts.length === 0"
                    class="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50">
                    {{ saving ? 'Registrando...' : 'Registrar venta' }}
                </button>
            </footer>
        </form>
    </ModalShell>
</template>
