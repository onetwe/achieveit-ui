import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Project from '../components/Project.vue'

import BasicInfo from '../components/BasicInfo.vue'
import ClientInfo from '../components/ClientInfo.vue'
import TeamInfo from '../components/TeamInfo.vue'
import BossPanel from '../components/BossPanel.vue'
import BossPending from '../components/BossPending.vue'

Vue.use(Router)

export default new Router({
    //mode:'hash',
    routes: [
        {
            path: '/',
            component: Login
        },
        {
            path: '/Login',
            component: Login
        },
        {
            path: '/Home',
            component: Home
        },
        {
            path: '/Boss',
            redirect: '/boss/pending',
            component: BossPanel,
            children: [
                {
                    path: 'Pending',
                    component: BossPending
                }
            ]
        },
        {
            path: '/Project',
            component: Project,
            redirect: 'project/basic',
            children: [
                {
                    path: 'Basic',
                    component: BasicInfo
                },
                {
                    path: 'Client',
                    component: ClientInfo
                },
                {
                    path: 'Team',
                    component: TeamInfo
                }
            ]
        }
    ]
})
