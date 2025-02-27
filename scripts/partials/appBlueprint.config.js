import __APP_COMPONENT_NAME from "@/apps/__APP_DIR_NAME/__APP_COMPONENT_NAME.vue";
import __APP_HOME_COMPONENT_NAME from "@/apps/__APP_DIR_NAME/pages/__APP_HOME_COMPONENT_NAME.vue";

const appName = "__APP_NAME";
const basePath = '/__APP_ROUTE';
const baseComponent = __APP_COMPONENT_NAME;
const routes = [
    {
        path: '',
        component: __APP_HOME_COMPONENT_NAME,
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