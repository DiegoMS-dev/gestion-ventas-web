
<template>
    <header class="navbar">
        <div>
            <h3>Panel administrativo</h3>
            <p>Bienvenido a Gestión de Ventas</p>
        </div>

        <div class="navbar-actions">
            <button class="notification">♧</button>

            <div class="user">
                <div class="avatar">DM</div>
                <div class="user-info">
                    <strong>Administrador</strong>
                    <span>Usuario</span>
                </div>
            </div>
        </div>
    </header>
</template>

<style scoped>
.navbar {
    height: 85px;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
}

.navbar h3 {
    color: var(--color-text);
    font-size: 17px;
}

.navbar p {
    color: var(--color-text-muted);
    font-size: 12px;
    margin-top: 5px;
}

.navbar-actions {
    display: flex;
    align-items: center;
    gap: 25px;
}

.notification {
    border: none;
    background: transparent;
    font-size: 22px;
    cursor: pointer;
    color: var(--color-text);
}

.user {
    display: flex;
    align-items: center;
    gap: 10px;
}

.avatar {
    width: 38px;
    height: 38px;
    background: var(--color-accent);
    color: white;
    display: grid;
    place-items: center;
    border-radius: 50%;
    font-size: 12px;
    font-weight: bold;
}

.user-info strong,
.user-info span {
    display: block;
}

.user-info strong {
    font-size: 12px;
    color: var(--color-text);
}

.user-info span {
    font-size: 11px;
    color: var(--color-text-muted);
}
</style>
