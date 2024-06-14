import { defineStore } from "pinia";

export const useKnockout = defineStore('knockout', {
    state: () => ({
        'round-of-16': {},
        quarterfinals: {},
        semifinals: {},
        finals: {},
    }),
    
    getters:{
        champion: (state) => {
            if (state.finals?.team1Score > state.finals?.team2Score) {
                return state.finals.team1;
            }
            if (state.finals?.team1Score < state.finals?.team2Score) {
                return state.finals.team2;
            }
            return null;
        },
    },
    
    actions: {
        initKnockoutRound(forceNew = false) {
            this['round-of-16'] = {};
            this.quarterfinals = {};
            this.semifinals = {};
            this.finals = {}
        },
        clear() {
            this.initKnockoutRound(true);
        }
    },
});