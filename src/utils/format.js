// Utilidades de formato compartidas por todos los módulos

export function formatCurrency(value) {
    return `S/ ${Number(value || 0).toLocaleString('es-PE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

export function formatDate(value) {
    if (!value) return '—';

    return new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(value));
}

export function formatDateTime(value) {
    if (!value) return '—';

    return new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(value));
}

// Fecha local en formato YYYY-MM-DD (lo que espera la API)
export function toISODate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');

    return `${y}-${m}-${d}`;
}

// Convierte 'YYYY-MM-DD' en Date local (evita el desfase de zona horaria)
export function parseISODate(value) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
}

// Estados de venta
export const saleStatuses = {
    completed: { label: 'Completada', classes: 'bg-accent/10 text-accent' },
    pending: { label: 'Pendiente', classes: 'bg-warning/10 text-warning' },
    cancelled: { label: 'Cancelada', classes: 'bg-danger/10 text-danger' }
};

export function getSaleStatus(status) {
    return saleStatuses[status] ?? { label: status, classes: 'bg-background text-text-muted' };
}

// Métodos de pago
export const paymentMethods = {
    efectivo: 'Efectivo',
    yape: 'Yape',
    plin: 'Plin',
    tarjeta: 'Tarjeta',
    transferencia: 'Transferencia'
};

export function getPaymentLabel(method) {
    return paymentMethods[method] ?? method;
}

// Movimientos de inventario
export const movementTypes = {
    entry: { label: 'Entrada', classes: 'bg-accent/10 text-accent' },
    exit: { label: 'Salida', classes: 'bg-danger/10 text-danger' },
    adjustment: { label: 'Ajuste', classes: 'bg-info/10 text-info' },
    sale: { label: 'Venta', classes: 'bg-warning/10 text-warning' },
    return: { label: 'Devolución', classes: 'bg-accent/10 text-accent' }
};

export function getMovementType(type) {
    return movementTypes[type] ?? { label: type, classes: 'bg-background text-text-muted' };
}

// Estado de stock de un producto
export function getStockStatus(product) {
    const stock = Number(product.stock);
    const min = Number(product.min_stock ?? product.minStock ?? 0);

    if (stock === 0) {
        return { key: 'Agotado', label: 'Agotado', classes: 'bg-danger/10 text-danger' };
    }

    if (stock <= min) {
        return { key: 'Stock bajo', label: 'Stock bajo', classes: 'bg-warning/10 text-warning' };
    }

    return { key: 'Disponible', label: 'Disponible', classes: 'bg-accent/10 text-accent' };
}

// Mensaje de error amigable a partir de una respuesta de Laravel
export function getApiError(error, fallback = 'Ocurrió un error. Inténtalo nuevamente.') {
    const data = error.response?.data;

    if (data?.errors) {
        const first = Object.values(data.errors)[0];
        if (first?.[0]) return first[0];
    }

    return data?.message || fallback;
}
