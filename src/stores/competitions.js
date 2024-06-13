import { defineStore } from "pinia";
import {useRoute} from "vue-router";

export const useCompetitions = defineStore('competitions', {
  state: () => ({
    competitions: [
      { name: "EURO 2024", image: '', link: 'euro', hasBestOfThirds: true, knockoutStart: 'round-of-16', hasThirdPlace: false },
      { name: "Copa Ámerica 2024", image: '', link: 'copa-america', hasBestOfThirds: false, knockoutStart: 'quarterfinals', hasThirdPlace: true },
    ],
  }),
  getters: {
    currentCompetition: (state) => {
      const route = useRoute();
      return route?.params?.competition
        ? state.competitions.find(competition => competition.link === route.params.competition)
        : null;
    }
  },
});