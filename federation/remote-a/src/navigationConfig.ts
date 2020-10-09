import React from 'react'

const Content = React.lazy(() => import('./components/Content/Content'))

const navigationConfig = {
  menuEntries: [{ path: '', text: 'Remote A' }],
  pathPrefix: '/a',
  routes: [{ path: '', component: Content }],
}

export default navigationConfig
