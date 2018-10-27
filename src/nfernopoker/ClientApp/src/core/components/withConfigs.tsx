// higher order component that adds configs to props
import * as React from 'react'
const Config = require('Config')

interface ConfigProps {
  config: {
    serverUrl: string
  };
}
export function WithConfigs<T extends ConfigProps>(WrappedComponent: React.ComponentType<T>) {
  return class withConfigs extends React.Component<T> {
    public render() {
      return <WrappedComponent {...this.props} config={Config} />
    }
  }
}

export default WithConfigs;
