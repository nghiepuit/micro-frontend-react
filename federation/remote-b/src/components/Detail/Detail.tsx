import React from 'react'
import { useParams } from 'react-router-dom'

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  return <>Detail of {id}</>
}

export default Detail
