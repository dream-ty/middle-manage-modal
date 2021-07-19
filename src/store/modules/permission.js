/* Layout */
// import Layout from '@/layout'
const addNewRouter = [

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
