import Vue from 'vue'
import Vuex from 'vuex'
// import actions from './actions'
// import getters from './getters'
// import mutations from './mutations'
// import state from './state'
// Vue.use(Vuex)

// // 创建 store 实例
// export default new Vuex.Store({
//     actions,
//     getters,
//     state,
//     mutations
// })


import homeModule from "./home/homeModule";

Vue.use(Vuex)

// 创建 store 实例
export default new Vuex.Store({
  modules:{

        home:homeModule,

    }
})