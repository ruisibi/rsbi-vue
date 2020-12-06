export const plugin = store => {
  store.subscribe((mutation, state) => {
    localStorage.setItem("state",JSON.stringify(state));
  })
}
