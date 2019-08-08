import * as React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect } from "react-redux-firebase";
import { withRouter } from "react-router";
import GamesPage from "./components/GamesPageComponent";

interface IOwnProps {
  firebase: any;
  games: Array<any>;
  history: any;
  classes: any;
}

type IProps = IOwnProps;



class GamesPageContainer extends React.Component<IProps, any> {

  constructor(props: IProps) {
    super(props);
  }

  playGame(key: string) {
    this.props.history.push(`/games/${key}`);
  }

  removeItem(key: string) {
    this.props.firebase.remove(`/games/${key}`);
  }

  render() {
    return (
      <GamesPage
        onPlayGame={(k: string) => this.playGame(k)}
        onRemoveItem={(k: string) => this.removeItem(k)}
        {...this.props} />
    )
  }
}

export default compose(
  withRouter,
  firebaseConnect((props: IProps) => [
    'games'
  ]),
  connect((state: any) => ({
    games: state.firebase.data.games,
    profile: state.firebase.profile
  })
  ))(GamesPageContainer)
