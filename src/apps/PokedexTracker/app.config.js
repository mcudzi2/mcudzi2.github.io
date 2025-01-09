import PokedexTracker from "@/apps/PokedexTracker/PokedexTracker.vue";

const appName = "My First App";
const basePath = '/my-first-app';
const baseComponent = PokedexTracker;
const routes = [

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