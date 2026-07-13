import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UsersView from '../views/UsersView.vue'
import UserDetailsView from '../views/UserDetailsView.vue'
import VehiclesView from '../views/VehiclesView.vue'
import ParkingSpotsView from '../views/ParkingSpotsView.vue'
import ReservationsView from '../views/ReservationsView.vue'
import SubscriptionsView from '../views/SubscriptionsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
    },
    {
      path: '/users/:id',
      name: 'user-details',
      component: UserDetailsView,
    },
    {
      path: '/vehicles',
      name: 'vehicles',
      component: VehiclesView,
    },
    {
      path: '/parking-spots',
      name: 'parking-spots',
      component: ParkingSpotsView,
    },
    {
      path: '/reservations',
      name: 'reservations',
      component: ReservationsView,
    },
    {
      path: '/subscriptions',
      name: 'subscriptions',
      component: SubscriptionsView,
    },
  ],
})

export default router
