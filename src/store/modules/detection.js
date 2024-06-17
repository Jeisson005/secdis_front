export default {
  namespaced: true,
  state: {
    isActive: true
  },
  mutations: {
    setActive(state, active) {
      state.isActive = active;
    }
  },
  actions: {
    activeDetection({ commit }, active) {
      commit("setActive", active);
    }
  },
  getters: {}
};
