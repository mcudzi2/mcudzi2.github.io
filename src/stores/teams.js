import { defineStore } from "pinia";
import { uniq, groupBy } from 'lodash';

export const useTeams = defineStore('teams', {
  state: () => ({
    teams: [],
    countries: {
      euro: [
        {abbr: "DEU", name: "Germany", group: 'A'},
        {abbr: "SCO", name: "Scotland", group: 'A'},
        {abbr: "HUN", name: "Hungary", group: 'A'},
        {abbr: "CHE", name: "Switzerland", group: 'A'},
        {abbr: "ESP", name: "Spain", group: 'B'},
        {abbr: "HRV", name: "Croatia", group: 'B'},
        {abbr: "ITA", name: "Italy", group: 'B'},
        {abbr: "ALB", name: "Albania", group: 'B'},
        {abbr: "SVN", name: "Slovenia", group: 'C'},
        {abbr: "DNK", name: "Denmark", group: 'C'},
        {abbr: "SRB", name: "Serbia", group: 'C'},
        {abbr: "ENG", name: "England", group: 'C'},
        {abbr: "POL", name: "Poland", group: 'D'},
        {abbr: "NLD", name: "Netherlands", group: 'D'},
        {abbr: "AUT", name: "Austria", group: 'D'},
        {abbr: "FRA", name: "France", group: 'D'},
        {abbr: "BEL", name: "Belgium", group: 'E'},
        {abbr: "SVK", name: "Slovakia", group: 'E'},
        {abbr: "ROU", name: "Romania", group: 'E'},
        {abbr: "UKR", name: "Ukraine", group: 'E'},
        {abbr: "TUR", name: "Turkey", group: 'F'},
        {abbr: "GEO", name: "Georgia", group: 'F'},
        {abbr: "PRT", name: "Portugal", group: 'F'},
        {abbr: "CZE", name: "Czech Republic", group: 'F'},
      ],
      'copa-america': [],
    },
    matches: [],
  }),

  getters: {
    groups: (state) => uniq(state.teams.map(team => team.group)),
    teamsByGroup: (state) => groupBy(state.teams, 'group'),
  },

  actions: {
    initTeams(competition) {
      if (!['euro', 'copa-america'].includes(competition)) {
        console.error("Invalid competition for initializing teams");
        return;
      }

      this.teams = this.countries[competition].map(country => ({
        ...country,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      }));
    },
    initMatches() {
      if (!this.teams) {
        console.error("INITIALIZE TEAMS FIRST!");
        return;
      }

      this.matches = [];
      this.groups.forEach(group => {
        const teamsInGroup = this.teamsByGroup[group];
        for (let i = 0; i < teamsInGroup.length; i++) {
          for (let j = i + 1; j < teamsInGroup.length; j++) {
            this.matches.push({
              team1: teamsInGroup[i],
              team1Score: 0,
              team2: teamsInGroup[j],
              team2Score: 0,
            });
          }
        }
      })
    },
    updateMatchStats() {
      this.teams.forEach((team) => {
        team.wins = this.matches.filter(match =>
          (match.team1.abbr === team.abbr && match.team1Score > match.team2Score)
          || (match.team2.abbr === team.abbr && match.team2Score > match.team1Score)
        ).length;
        team.draws = this.matches.filter(match =>
          [match.team1.abbr, match.team2.abbr].includes(team.abbr) && match.team1Score === match.team2Score
        ).length;
        team.losses = this.matches.filter(match =>
          (match.team1.abbr === team.abbr && match.team1Score < match.team2Score)
          || (match.team2.abbr === team.abbr && match.team2Score < match.team1Score)
        ).length;
        team.goalsFor = this.matches.reduce((totalGoalsFor, match) => {
          if (match.team1.abbr === team.abbr) {
            return totalGoalsFor + match.team1Score;
          }
          if (match.team2.abbr === team.abbr) {
            return totalGoalsFor + match.team2Score;
          }
          return totalGoalsFor;
        }, 0);
        team.goalsAgainst = this.matches.reduce((totalGoalsAgainst, match) => {
          if (match.team1.abbr === team.abbr) {
            return totalGoalsAgainst + match.team2Score;
          }
          if (match.team2.abbr === team.abbr) {
            return totalGoalsAgainst + match.team1Score;
          }
          return totalGoalsAgainst;
        }, 0);
      });
    },
    calculatePoints(team) {
      return (3 * team.wins) + team.draws;
    },
    calculateGoalDiff(team) {
      return team.goalsFor - team.goalsAgainst;
    },
  }
})