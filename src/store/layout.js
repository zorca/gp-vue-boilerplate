export const state = () => ({
  userSelect: true
});

export const mutations = {
  userSelect (state, value) {
    state.userSelect = value;
  }
};
