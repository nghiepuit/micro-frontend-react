import React from 'react'

const Detail = React.lazy(() => import('./components/Detail/Detail'))
const List = React.lazy(() => import('./components/List/List'))

const navigationConfig = {
  menuEntries: [{ path: '', text: 'Remote B' }],
  pathPrefix: '/b',
  routes: [
    { path: '', component: List },
    { path: '/details/:id', component: Detail },
  ],
}

export default navigationConfig
