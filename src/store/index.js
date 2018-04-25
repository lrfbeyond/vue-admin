import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

export default new vuex.Store({
    state: {
        isCollapse: false,
        left: 'left:200px'
    },
    mutations: {
        switch_menu(state) {
            state.isCollapse = state.isCollapse ? false : true;
            state.left = state.left == 'left:200px' ? 'left:50px' : 'left:200px';
        }
    }
})
