class AppManager {
    static #instance = null;
    #apps = {};

    constructor() {
        if (AppManager.#instance) {
            return AppManager.#instance;
        }
        AppManager.#instance = this;
    }

    #generateAppID(appConfig) {
        return appConfig.basePath.toLowerCase().replace(/[^a-z\-]/g, '');
    }

    registerApp(appConfig) {
        const appID = this.#generateAppID(appConfig);
        if (this.#apps[appID] !== undefined) {
            console.error("ERROR: App has already been registered.");
            return;
        }
        this.#apps[appID] = { ...appConfig, id: appID };
    }

    registerAppRoutes(routerConfig, app) {
        let config = null;
        if (typeof app === 'string') {
            config = Object.values(this.#apps).find(registeredApp => registeredApp.appName === app || registeredApp.basePath === app);
            if (!config) {
                console.log("ERROR: Please register app matching identifier before registering routes.");
                return;
            }
        } else {
            const appID = this.#generateAppID(app);
            if (!this.#apps[appID]) {
                console.log("ERROR: Please register app before registering routes.");
                return;
            }
            config = app;
        }

        const appRouteConfig = {
            path: config.basePath,
            component: config.baseComponent,
        };

        if (config.routes?.length) {
            appRouteConfig.children = config.routes;
        }

        routerConfig.routes.push(appRouteConfig);
    }

    getAppCards() {
        return Object.values(this.#apps).map(registeredApp => ({
            ...registeredApp.appCardConfig,
            id: registeredApp.id,
            link: registeredApp.basePath,
        }));
    }
}

export default new AppManager();