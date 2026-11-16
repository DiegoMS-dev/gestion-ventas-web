
<script setup>
import Sidebar from '../components/Sidebar.vue';
import Navbar from '../components/Navbar.vue';
</script>

<template>
    <div class="admin-layout">
        <Sidebar />

        <div class="main-container">
            <Navbar />

            <main class="page-content">
                <RouterView />
            </main>
        </div>
    </div>
</template>

<style scoped>
.admin-layout {
    display: flex;
    min-height: 100vh;
    background: var(--color-background);
}

.main-container {
    flex: 1;
    min-width: 0;
}

.page-content {
    padding: 30px;
}
</style>
