

export let handleVueError = (err, vm, info) => {
  console.error(...arguments);
}
export let handleVueWarning = (msg, vm, trace) => {
  console.warn(...arguments);
}
export let handleGlobalError = (message, source, lineno, colno, error) => {
  console.error(...arguments);
}
export let handleGlobalRejection = (e) => {
  console.error(...arguments);
}
