import { createRouter, createWebHistory } from 'vue-router';
import Home from "@/pages/Home.vue";
import Competition from "@/pages/Competition.vue";
import CompetitionGroupStage from "@/pages/CompetitionGroupStage.vue";
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
            redirect: { name: 'group' },
            children: [
                {
                    path: 'groups',
                    name: 'group',
                    component: CompetitionGroupStage,
                },
                {
                    path: 'knockout',
                    name: 'knockout',
                    component: CompetitionKnockout,
                },
            ],
        },
    ],
})