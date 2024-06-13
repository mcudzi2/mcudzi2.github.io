import { defineStore } from "pinia";

export const useCompetitions = defineStore('competitions', {
  state: () => ({
    competitions: [
      { name: "EURO 2024", image: '', link: 'euro'},
      { name: "Copa Ámerica 2024", image: '', link: 'copa-america'},
    ],
  }),
});