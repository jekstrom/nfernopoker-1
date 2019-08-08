import * as React from "react";
import { connect } from "react-redux";
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router";
import { gameKeyHoc, IGameKeyHocProps } from "../../core/components/gameKeyHoc";
import { ChatMessage, Game } from "../../core/models";
import Chat from "../../core/components/Chat";

interface IOwnProps {
  firebase: any;
  classes: any;
  location: any;
  game: Game;
  profile: any;
}

interface ITempState {
  message: string;
}

type IProps = IOwnProps & IGameKeyHocProps;

const styles: any = (theme: any) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    margin: theme.spacing.unit
  }
});

//TODO: This won't be its own page, parking here for now.
class ChatPageComponent extends React.Component<IProps, ITempState> {

  constructor(props: any) {
    super(props);
  }

  onMessageChange(name: string, value: string): void {
    let newState = { ...this.state };
    newState[name] = value
    this.setState(newState);
  }

  addMessage(): void {
    let message: ChatMessage = {
      user: this.props.profile.firstName + " " + this.props.profile.lastName,
      message: this.state.message,
      time: Date.now().toString()
    };
    let chatThread = this.props.game.chat ? [...this.props.game.chat.thread, message] : [message];
    this.props.firebase.ref(`/games/${this.props.gameKey}/chat`).update({ thread: chatThread });
    this.setState({ message: "" });
  }

  render(): JSX.Element {
    let classes = this.props.classes;
    // TODO: This will need tweaking once its parked in a game... Also might be cool to leave a route in the router for it.
    if (!isLoaded(this.props.game)) {
      return <p>Loading...</p>
    }

    return (
      <div className={classes.container}>
        <Chat chat={this.props.game.chat}
          onSend={() => this.addMessage()}
          onFormChange={(name: string, value: string) => this.onMessageChange(name, value)} />
      </div>
    )
  }
}

const currentGame: string = 'currentGame';

const mapStateToProps = (state: any) => ({
  game: state.firebase.data[currentGame],
  profile: state.firebase.profile
});

export default compose(
  gameKeyHoc({ debug: true }),
  withStyles(styles),
  withRouter,
  firebaseConnect((props: IProps) => {
    return [
      "profile",
      { path: "/games/" + props.gameKey, storeAs: currentGame }
    ]
  }),
  connect(mapStateToProps)
)(ChatPageComponent) as React.ComponentClass<any>;
