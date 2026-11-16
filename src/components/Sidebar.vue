
<template>
    <aside class="sidebar">
        <div class="brand">
            <div class="brand-icon">GV</div>
            <div>
                <h2>Gestión</h2>
                <span>DE VENTAS</span>
            </div>
        </div>

        <div class="menu-label">MENÚ PRINCIPAL</div>

        <nav class="menu">
            <RouterLink to="/" class="menu-item">
                <span>▦</span>
                Dashboard
            </RouterLink>

            <RouterLink to="/productos" class="menu-item">
                <span>▣</span>
                Productos
            </RouterLink>

            <RouterLink to="/categorias" class="menu-item">
                <span>▤</span>
                Categorías
            </RouterLink>

            <RouterLink to="/clientes" class="menu-item">
                <span>♙</span>
                Clientes
            </RouterLink>

            <RouterLink to="/ventas" class="menu-item">
                <span>🛒</span>
                Ventas
            </RouterLink>

            <RouterLink to="/inventario" class="menu-item">
                <span>▥</span>
                Inventario
            </RouterLink>

            <RouterLink to="/reportes" class="menu-item">
                <span>▧</span>
                Reportes
            </RouterLink>
        </nav>

        <div class="sidebar-footer">
            Sistema de Gestión de Ventas
            <span>Versión 1.0</span>
        </div>
    </aside>
</template>

<style scoped>
.sidebar {
    width: 250px;
    min-height: 100vh;
    background: var(--color-primary);
    color: white;
    padding: 25px 16px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
}

.brand {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 10px 35px;
}

.brand-icon {
    background: var(--color-accent);
    color: white;
    width: 42px;
    height: 42px;
    border-radius: 10px;
    display: grid;
    place-items: center;
    font-weight: bold;
}

.brand h2 {
    font-size: 18px;
}

.brand span {
    font-size: 10px;
    color: #AABBC8;
    letter-spacing: 2px;
}

.menu-label {
    color: #91A5B5;
    font-size: 11px;
    padding: 0 12px;
    margin-bottom: 12px;
}

.menu {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    color: #D5DFE7;
    text-decoration: none;
    border-radius: 7px;
    font-size: 14px;
    transition: 0.2s;
}

.menu-item span {
    width: 20px;
    text-align: center;
    font-size: 17px;
}

.menu-item:hover {
    background: var(--color-secondary);
    color: white;
}

.menu-item.router-link-active {
    background: var(--color-accent);
    color: white;
}

.sidebar-footer {
    margin-top: auto;
    padding: 20px 10px 0;
    color: #AABBC8;
    font-size: 11px;
    line-height: 1.8;
    border-top: 1px solid #344958;
}

.sidebar-footer span {
    display: block;
    color: #718797;
}
</style>
