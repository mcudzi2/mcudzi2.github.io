import { defineStore } from "pinia";
import {useRoute} from "vue-router";

export const useCompetitions = defineStore('competitions', {
  state: () => ({
    competitions: [
      {
        name: "EURO 2024",
        image: './assets/images/UEFA_Euro_2024_Logo.svg.webp',
        link: 'euro',
        hasBestOfThirds: true,
        knockoutStart: 'round-of-16',
        hasThirdPlace: false,
      },
      {
        name: "Copa América 2024",
        image: './assets/images/2024_Copa_America_logo.svg.webp',
        link: 'copa-america',
        hasBestOfThirds: false,
        knockoutStart: 'quarterfinals',
        hasThirdPlace: true,
      },
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