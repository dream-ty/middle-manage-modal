import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
/* Layout */
import Layout from '@/layout'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        // 没有角色信息走这里，去拿信息增加路由
        try {
          console.log('获取角色')
          // get user info
          await store.dispatch('user/getInfo')
          const addNewRouter = [
            {
              path: '/advert',
              component: Layout,
              children: [{
                path: 'index',
                name: 'Advert',
                component: () =>
                  import ('@/views/advert/index'),
                meta: { title: '广告管理', icon: 'el-icon-bangzhu' }
              }]
            },

            {
              path: '/system',
              redirect: '/system/user',
              component: Layout,
              name: 'System',
              meta: { title: '系统管理', icon: 'el-icon-s-tools' },
              children: [{
                path: 'user',
                name: 'User',
                component: () =>
                  import ('@/views/user/index'),
                meta: { title: '用户管理', icon: 'el-icon-user' }
              },
              {
                path: 'role',
                name: 'Role',
                component: () =>
                  import ('@/views/role/index'),
                meta: {
                  title: '角色管理',
                  icon: 'el-icon-s-custom'
                }
              }, {
                path: 'menu',
                name: 'Menu',
                component: () =>
                  import ('@/views/menu/index'),
                meta: { title: '菜单管理', icon: 'el-icon-menu' }
              }
              ]

            }
          ]
          router.options.routes = [...router.options.routes, ...addNewRouter]
          router.addRoutes([...addNewRouter]
          )

          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
