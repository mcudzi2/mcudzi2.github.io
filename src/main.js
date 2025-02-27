import VueTippy from 'vue-tippy';
import 'tippy.js/dist/tippy.css';

import './assets/main.scss';
import { createPinia } from "pinia";
import { configureRouter } from './router.js';

import { createApp } from 'vue';
import App from './App.vue';
import AppManager from "@/services/AppManager.js";

// @appRegistration - comment used by script - DO NOT REMOVE
import { appConfig as pokedexTracker } from "@/apps/PokedexTracker/app.config.js";

AppManager.registerApp(pokedexTracker);

const pinia = createPinia();
const router = configureRouter();

const mainApp = createApp(App);
mainApp.use(VueTippy, { directive: 'tippy' })
mainApp.use(pinia);
mainApp.use(router);
mainApp.mount('#app');
