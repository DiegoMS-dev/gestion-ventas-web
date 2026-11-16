
import { createRouter, createWebHistory } from 'vue-router';

import AdminLayout from '../layouts/AdminLayout.vue';

import DashboardView from '../views/DashboardView.vue';
import ProductsView from '../views/ProductsView.vue';
import CategoriesView from '../views/CategoriesView.vue';
import ClientsView from '../views/ClientsView.vue';
import SalesView from '../views/SalesView.vue';
import InventoryView from '../views/InventoryView.vue';
import ReportsView from '../views/ReportsView.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AdminLayout,
            children: [
                { path: '', component: DashboardView },
                { path: 'productos', component: ProductsView },
                { path: 'categorias', component: CategoriesView },
                { path: 'clientes', component: ClientsView },
                { path: 'ventas', component: SalesView },
                { path: 'inventario', component: InventoryView },
                { path: 'reportes', component: ReportsView }
            ]
        }
    ]
});

export default router;
