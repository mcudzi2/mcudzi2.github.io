import { defineStore } from "pinia";
import { uniq, groupBy } from 'lodash';
import {useCompetitions} from "@/stores/competitions.js";

export const useGroups = defineStore('groups', {
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
      'copa-america': [
        {abbr: "ARG", name: "Argentina", group: 'A'},
        {abbr: "PER", name: "Peru", group: 'A'},
        {abbr: "CHL", name: "Chile", group: 'A'},
        {abbr: "CAN", name: "Canada", group: 'A'},
        {abbr: "MEX", name: "Mexico", group: 'B'},
        {abbr: "ECU", name: "Ecuador", group: 'B'},
        {abbr: "VEN", name: "Venezuela", group: 'B'},
        {abbr: "JAM", name: "Jamaica", group: 'B'},
        {abbr: "USA", name: "United States", group: 'C'},
        {abbr: "URY", name: "Uruguay", group: 'C'},
        {abbr: "PAN", name: "Panama", group: 'C'},
        {abbr: "BOL", name: "Bolivia", group: 'C'},
        {abbr: "BRA", name: "Brazil", group: 'D'},
        {abbr: "COL", name: "Colombia", group: 'D'},
        {abbr: "PRY", name: "Paraguay", group: 'D'},
        {abbr: "CRI", name: "Costa Rica", group: 'D'},
      ],
    },
    matches: [],
  }),

  getters: {
    groups: (state) => uniq(state.teams.map(team => team.group)),
    teamsByGroup: (state) => groupBy(state.teams, 'group'),
    sortedTeamsByGroup: (state) => {
      const sortedTeams = {};
      state.groups.forEach(group => {
        sortedTeams[group] = state.teamsByGroup[group].concat().sort((teamA, teamB) => {
          return (state.calculatePoints(teamB) - state.calculatePoints(teamA))
              || (state.calculateGoalDiff(teamB) - state.calculateGoalDiff(teamA))
              || (teamB.goalsFor - teamA.goalsFor);
        });
      });
      return sortedTeams;
    },
    thirdPlaceGroup: (state) => Object.values(state.sortedTeamsByGroup)
        .map(group => group[2])
        .sort((teamA, teamB) => {
          return (state.calculatePoints(teamB) - state.calculatePoints(teamA))
              || (state.calculateGoalDiff(teamB) - state.calculateGoalDiff(teamA))
              || (teamB.goalsFor - teamA.goalsFor)
              || (teamB.wins - teamA.wins);
        }),
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
    initMatches(forceNew = false) {
      if (!this.teams) {
        console.error("INITIALIZE TEAMS FIRST!");
        return;
      }

      this.matches = [];
      const competitionsStore = useCompetitions();
      const savedMatches = localStorage.getItem(competitionsStore.currentCompetition.link + '-group-matches');
      if (savedMatches && !forceNew) {
        this.matches = JSON.parse(savedMatches);
        return;
      }

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
    save() {
      if (!this.matches?.length) {
        return false;
      }

      const competitionsStore = useCompetitions();
      localStorage.setItem(competitionsStore.currentCompetition.link + '-group-matches', JSON.stringify(this.matches));
      return true;
    },
    clear() {
      this.initMatches(true);
      this.updateMatchStats();
    }
  }
})