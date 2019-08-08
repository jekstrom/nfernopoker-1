import * as React from 'react'

interface ExternalProps {
  location: any;
  match: any;
}

export interface IGameKeyHocProps {
  gameKey: string;
}

interface State {
  gameKey: string;
}

interface Options {
  debug?: boolean;
}

// Higher order component (HOC) to provide the gameKey by parsing the it from the URL.
// As the type definitions apear mildly nutty, read this. https://codeburst.io/react-higher-order-components-in-typescript-made-simple-6f9b55691af1
export const gameKeyHoc = ({ debug = false }: Options = {}) =>
  <TOriginalProps extends {}>(
    Component: (React.ComponentClass<TOriginalProps & IGameKeyHocProps>
      | React.StatelessComponent<TOriginalProps & IGameKeyHocProps>)
  ) => {
    type ResultProps = TOriginalProps & ExternalProps;
    const result = class GameKeyHoc extends React.Component<ResultProps, State> {
      static displayName = `GameKeyHoc(${Component.displayName || Component.name})`;

      constructor(props: ResultProps) {
        super(props);
        this.state = {
          gameKey: this.props.match.params.key
        };
        if (debug) {
          console.log(this.state.gameKey);
        }
      }

      render(): JSX.Element {
        return <Component gameKey={this.state.gameKey} {...this.props} />;
      }

    }
    return result;
  }

