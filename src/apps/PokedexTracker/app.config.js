import PokedexTracker from "@/apps/PokedexTracker/PokedexTracker.vue";
import Pokedex from "@/apps/PokedexTracker/pages/Pokedex.vue";

const appName = "Pokedex Tracker";
const basePath = '/pokedex-tracker';
const baseComponent = PokedexTracker;
const routes = [
    {
        path: '',
        component: Pokedex,
    },
];

const appCardConfig = {
    name: appName,
    classes: 'bg-red-700',
    textColor: 'text-neutral-200',
};

export const appConfig = {
    appName,
    basePath,
    baseComponent,
    routes,
    appCardConfig,
};