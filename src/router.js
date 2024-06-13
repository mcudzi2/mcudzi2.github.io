import { createRouter, createWebHistory } from 'vue-router';
import Home from "@/pages/Home.vue";
import Competition from "@/pages/Competition.vue";
import CompetitionGroups from "@/pages/CompetitionGroups.vue";
import CompetitionKnockout from "@/pages/CompetitionKnockout.vue";

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: Home,
        },
        {
            path: '/:competition',
            component: Competition,
            redirect: { name: 'group-stage' },
            children: [
                {
                    path: 'groups',
                    name: 'group-stage',
                    component: CompetitionGroups,
                },
                {
                    path: 'knockout',
                    name: 'knockout-stage',
                    component: CompetitionKnockout,
                },
            ],
        },
    ],
})