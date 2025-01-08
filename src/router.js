import { createRouter, createWebHistory } from 'vue-router';
import Home from "@/apps/Homepage/Home.vue";
import AppManager from "@/services/AppManager.js";

export function configureRouter() {
    const routerConfig = {
        history: createWebHistory(),
        routes: [
            {
                path: '/',
                name: 'homepage',
                component: Home,
            },
        ],
    };

    AppManager.registerAppRoutes(routerConfig, 'Pokedex Tracker');

    return createRouter(routerConfig);
}