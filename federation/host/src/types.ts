export type NavigationConfig = {
  menuEntries: Array<{
    path: string
    text: string
  }>
  pathPrefix: string
  routes: Array<{
    path: string
    component: React.ComponentType
  }>
}
