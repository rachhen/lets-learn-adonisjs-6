/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
const HealthChecksController = () => import('#controllers/health_checks_controller')
const AdminDashboardController = () => import('#controllers/admin/dashboard_controller')
const AdminMoviesController = () => import('#controllers/admin/movies_controller')
const StorageController = () => import('#controllers/storage_controller')
const ProfilesController = () => import('#controllers/profiles_controller')
const WatchlistsController = () => import('#controllers/watchlists_controller')
const MoviesController = () => import('#controllers/movies_controller')
const RedisController = () => import('#controllers/redis_controller')
const DirectorsController = () => import('#controllers/directors_controller')
const WritersController = () => import('#controllers/writers_controller')
const RegisterController = () => import('#controllers/auth/register_controller')
const LoginController = () => import('#controllers/auth/login_controller')
const HomeController = () => import('#controllers/home_controller')
const LogoutController = () => import('#controllers/auth/logout_controller')

router.get('/', [HomeController, 'index']).as('home')

router.get('/storage/*', [StorageController, 'show']).as('storage.show')
router.get('/health', [HealthChecksController]).as('health')

router.get('/movies', [MoviesController, 'index']).as('movies.index')
router
  .get('/movies/:slug', [MoviesController, 'show'])
  .as('movies.show')
  .where('slug', router.matchers.slug())

router
  .group(() => {
    router.get('/watchlist', [WatchlistsController, 'index']).as('index')
    router.post('/movies/:movieId/toggle', [WatchlistsController, 'toggle']).as('toggle')
    router
      .post('/movies/:movieId/toggle-watched', [WatchlistsController, 'toggleWatched'])
      .as('toggle.watched')
  })
  .as('watchlists')
  .use(middleware.auth())

router.get('/directors', [DirectorsController, 'index']).as('directors.index')
router.get('/directors/:id', [DirectorsController, 'show']).as('directors.show')

router.get('/writers', [WritersController, 'index']).as('writers.index')
router.get('/writers/:id', [WritersController, 'show']).as('writers.show')

router.delete('/redis/flash', [RedisController, 'flash']).as('redis.flash')
router.delete('/redis/:slug', [RedisController, 'destroy']).as('redis.destroy')

router.get('/profile/edit', [ProfilesController, 'edit']).as('profiles.edit').use(middleware.auth())
router.put('/profiles', [ProfilesController, 'update']).as('profiles.update').use(middleware.auth())
router.get('/profiles/:id', [ProfilesController, 'show']).as('profiles.show')

router
  .group(() => {
    router
      .get('/register', [RegisterController, 'show'])
      .as('register.show')
      .use(middleware.guest())
    router
      .post('/register', [RegisterController, 'store'])
      .as('register.store')
      .use(middleware.guest())
    router.get('/login', [LoginController, 'show']).as('login.show').use(middleware.guest())
    router.post('/login', [LoginController, 'store']).as('login.store').use(middleware.guest())

    router.post('/logout', [LogoutController, 'handle']).as('logout').use(middleware.auth())
  })
  .prefix('/auth')
  .as('auth')

router
  .group(() => {
    router.get('/', [AdminDashboardController, 'handle']).as('dashboard')
    router.resource('/movies', AdminMoviesController)
  })
  .prefix('/admin')
  .as('admin')
  .middleware(middleware.admin())
