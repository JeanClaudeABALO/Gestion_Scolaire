import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/inscription',
    name: 'Inscription',
    component: () => import('../views/Inscription.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/professeur',
    name: 'Professeur',
    component: () => import('../views/Professeur.vue'),
    meta: { requiresAuth: true, role: 'PROF' }
  },
  {
    path: '/responsable',
    name: 'Responsable',
    component: () => import('../views/Responsable.vue'),
    meta: { requiresAuth: true, role: 'ADMIN' }
  },
  {
    path: '/parent',
    name: 'Parent',
    component: () => import('../views/Parent.vue'),
    meta: { requiresAuth: true, type: 'PARENT' }
  },
  {
    path: '/parent-access',
    name: 'ParentAccess',
    component: () => import('../views/ParentAccess.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Pages publiques - toujours accessibles (inscription, login, accueil, parent-access)
  if (to.path === '/inscription' || to.path === '/login' || to.path === '/' || to.path === '/parent-access') {
    next()
    return
  }
  if (to.meta && !to.meta.requiresAuth) {
    next()
    return
  }

  // Pages protégées - vérifier l'authentification
  if (!authStore.isAuthenticated) {
    console.log('Router: Non authentifié, redirection vers login')
    next({ name: 'Login' })
    return
  }

  // Vérifier les rôles pour les pages protégées
  if (to.meta.role === 'ADMIN') {
    // Pour ADMIN : vérifier que le rôle est ADMIN
    const isAdmin = (authStore.user && authStore.user.role === 'ADMIN') || authStore.userType === 'ADMIN'
    console.log('Router: Vérification ADMIN', {
      user: authStore.user,
      userType: authStore.userType,
      isAdmin: isAdmin,
      path: to.path
    })
    if (!isAdmin) {
      console.log('Router: Accès refusé - pas admin')
      next({ name: 'Login' })
      return
    }
  } else if (to.meta.role === 'PROF') {
    // Pour PROF : accepter PROF ou ADMIN
    if (authStore.userType !== 'PROF' && authStore.userType !== 'ADMIN') {
      next({ name: 'Login' })
      return
    }
  }

  if (to.meta.type && authStore.userType !== to.meta.type) {
    next({ name: 'Login' })
    return
  }

  // Tout est OK, autoriser l'accès
  console.log('Router: Accès autorisé à', to.path)
  next()
})

export default router
