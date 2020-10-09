import React from 'react'

type SuspenseErrorBoundaryProps = {
  error?: (error: Error) => React.ReactNode
  fallback?: React.ReactNode
}

type SuspenseErrorBoundaryState = {
  error: Error | null
}

class SuspenseErrorBoundary extends React.Component<
  SuspenseErrorBoundaryProps,
  SuspenseErrorBoundaryState
> {
  constructor(props: SuspenseErrorBoundaryProps) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log(error, errorInfo)
  }

  render() {
    if (this.state.error !== null) {
      return this.props.error
        ? this.props.error(this.state.error)
        : 'Loading chunk failed'
    }

    return (
      <React.Suspense fallback={this.props.fallback || 'Loading chunk...'}>
        {this.props.children}
      </React.Suspense>
    )
  }
}

export default SuspenseErrorBoundary
