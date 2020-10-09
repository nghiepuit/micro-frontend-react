import React from 'react'
import SuspenseErrorBoundary from '../SuspenseErrorBoundary/SuspenseErrorBoundary'
import {
  BrowserRouter,
  NavLink,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import { NavigationConfig } from '../../types'
import styled from 'styled-components'

const MenuLink = styled(NavLink)`
  &.active {
    color: red;
  }
`

const App: React.FC = ({ children }) => {
  const [routes, setRoutes] = React.useState<NavigationConfig['routes']>([])
  const [menuEntries, setMenuEntries] = React.useState<
    NavigationConfig['menuEntries']
  >([])

  React.useEffect(() => {
    const loadNavigationConfigurations = async () => {
      const results = await Promise.allSettled([
        import('remoteA/navigationConfig'),
        import('remoteB/navigationConfig'),
      ])

      const menuEntries: NavigationConfig['menuEntries'] = []
      const routes: NavigationConfig['routes'] = []

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          menuEntries.push(
            ...result.value.default.menuEntries.map((menuEntry) => ({
              ...menuEntry,
              path: `${result.value.default.pathPrefix}${menuEntry.path}`,
            }))
          )
          routes.push(
            ...result.value.default.routes.map((route) => ({
              ...route,
              path: `${result.value.default.pathPrefix}${route.path}`,
            }))
          )
        } else {
          console.error(result.reason)
        }
      })

      setRoutes(routes)
      setMenuEntries(menuEntries)
    }
    loadNavigationConfigurations()
  }, [])

  return (
    <BrowserRouter>
      {/* menu */}
      {menuEntries.length > 0 && (
        <ul>
          {menuEntries.map((menuEntry) => (
            <li key={menuEntry.path}>
              <MenuLink to={menuEntry.path}>{menuEntry.text}</MenuLink>
            </li>
          ))}
        </ul>
      )}
      {/* routing config */}
      {routes.length > 0 && (
        <Switch>
          <Route path="/" exact>
            <Redirect to={routes[0].path} />
          </Route>
          {routes.map((route) => (
            <Route path={route.path} exact key={route.path}>
              <SuspenseErrorBoundary
                error={(error) =>
                  `${error} Loading remote module at path "${route.path}" failed`
                }
              >
                <route.component />
              </SuspenseErrorBoundary>
            </Route>
          ))}
          <Route>not found :(</Route>
        </Switch>
      )}
    </BrowserRouter>
  )
}

export default App
