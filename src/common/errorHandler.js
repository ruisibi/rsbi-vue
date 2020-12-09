

export let handleVueError = (err, vm, info) => {
  console.error(err, vm, info);
}
export let handleVueWarning = (msg, vm, trace) => {
  console.warn(msg, vm, trace);
}
export let handleGlobalError = (message, source, lineno, colno, error) => {
  console.error(message, source, lineno, colno, error);
}
export let handleGlobalRejection = (e) => {
  console.error(e);
}
