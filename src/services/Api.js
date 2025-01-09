import axios from 'axios';
import { prependSlash, removeTrailingSlashes } from "@/services/Utils.js";

class Api {
    baseUrl = '';

    constructor() {
        if (new.target === Api) {
            throw new Error("Cannot instantiate base Api class directly.")
        }
    }

    #getUrl(uri) {
        if (!this.baseUrl?.length) {
            throw new Error("Base URL not provided for API.");
        }
        return removeTrailingSlashes(this.baseUrl) + prependSlash(uri);
    }

    #processConfig(config) {
        if (typeof config === 'function') {
            config = config();
        }
        return config;
    }

    #processRequest(httpRequest) {
        return new Promise((resolve, reject) => {
            // TODO: Implement global request tracking (e.g. for loaders, trackers, progress bars, etc.)
            httpRequest
                .then(response => {
                    resolve(response.data);
                })
                .catch(error => {
                    // TODO: Implement global error handling
                    reject(error);
                });
        });
    }

    get(uri, config) {
        const url = this.#getUrl(uri);
        config = this.#processConfig(config);
        return this.#processRequest(axios.get(url, config));
    }
}

export default Api;