import { defineStore } from "pinia";
import {useRoute} from "vue-router"
import euroImage from "../assets/images/UEFA_Euro_2024_Logo.svg.webp";
import copaAmericaImage from "../assets/images/2024_Copa_America_logo.svg.webp";

export const useCompetitions = defineStore('competitions', {
  state: () => ({
    competitions: [
      {
        name: "EURO 2024",
        image: euroImage,
        link: 'euro',
        hasBestOfThirds: true,
        knockoutStart: 'round-of-16',
        hasThirdPlace: false,
      },
      {
        name: "Copa América 2024",
        image: copaAmericaImage,
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