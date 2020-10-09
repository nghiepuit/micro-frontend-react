declare module 'remoteA/navigationConfig' {
  const navigationConfig: import('./types').NavigationConfig
  export default navigationConfig
}

declare module 'remoteB/navigationConfig' {
  const navigationConfig: import('./types').NavigationConfig
  export default navigationConfig
}
