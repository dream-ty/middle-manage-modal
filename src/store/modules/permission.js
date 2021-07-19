/* Layout */
import Layout from '@/layout'
const addNewRouter = [
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
export default {
  state: {
    routersData: []

  },
  mutations: {
    SET_ROUTERSDATA: (state, routersData) => {
      state.routersData = routersData || addNewRouter
    }
  },
  actions: {
    // getroutersData({commit, state}) {
    //   return new Promise((resolve, reject) => {

    //   })

    // }
  }

}
