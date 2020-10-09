import React from 'react'
import { NavLink } from 'react-router-dom'

const List: React.FC = () => {
  return (
    <ul>
      <li>
        <NavLink to={`/b/details/1337`}>Item 1337</NavLink>
      </li>
      <li>
        <NavLink to={`/b/details/4711`}>Item 4711</NavLink>
      </li>
    </ul>
  )
}

export default List
