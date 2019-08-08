import * as React from "react";
import { Component } from "react";
import { ChangeEvent } from "react";
import { compose } from "redux";
import { connect } from 'react-redux';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, withMobileDialog, withStyles
} from "@material-ui/core";
import { firebaseConnect } from "react-redux-firebase";
import { Team, Player } from '../../core/models';
import TeamForm from "./TeamForm";

interface IOwnProps {
  classes: any;
  firebase: any;
  history: any;
  location: any;
  match: any;
  team: Team;
  fullScreen: boolean;
}

interface ITempState {
  isModalOpen: boolean;
  team: Team;
}

type IProps = IOwnProps;

const styles: any = (theme: any) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    margin: theme.spacing.unit
  }
});

class TeamFormDialog extends Component<IProps, ITempState> {

  constructor(props: any) {
    super(props);
    this.state = {
      isModalOpen: true,
      team: props.team ? props.team : new Team()
    }
  }

  handleTeamInputsChange = (event: ChangeEvent<HTMLInputElement>, name: string) => {
    let newState = { ...this.state.team };
    newState[name] = event.target.value
    this.setState({ team: newState });
  }

  handlePlayerAdded(player: Player): void {
    let newState = { ...this.state.team };
    newState.players.push(player);
    this.setState({ team: newState });
  }

  handlePlayerRemoved(player: Player): void {
    let newState = { ...this.state.team };
    newState.players = newState.players.filter(p => p.email !== player.email);
    this.setState({ team: newState });
  }

  handleClose(): void {
    this.setState({ isModalOpen: false });
    this.props.history.push("/teams")
  }

  handleSave(): void {
    if (this.props.location.pathname.includes("edit")) {
      let key = this.props.match.params.key;
      let teamRef = this.props.firebase.ref(`/teams/${key}`)
      teamRef.update(this.state.team);
    } else {
      let newteam = { ...this.state.team };
      this.props.firebase.push('teams', newteam);
    }
    this.handleClose();
  }

  componentDidUpdate(prevProps: IProps) {
    if (this.props.team !== prevProps.team) {
      this.setState({ team: this.props.team });
    }
  }

  render() {

    let { team, isModalOpen } = this.state;
    let { fullScreen } = this.props;

    return (
      <Dialog
        fullScreen={fullScreen}
        open={isModalOpen}
        onClose={() => this.handleClose()}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Team Info"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter team information below.
					</DialogContentText>
          <form>
            <TeamForm
              team={team}
              onSave={() => this.handleSave()}
              onFormChange={(e: any, name: string) => this.handleTeamInputsChange(e, name)}
              onPlayerAdded={(player: Player) => this.handlePlayerAdded(player)}
              onPlayerRemoved={(player: Player) => this.handlePlayerRemoved(player)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleClose()} color="secondary">
            Cancle
					</Button>
          <Button onClick={() => this.handleSave()} color="primary" autoFocus>
            Save
					</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const currentteam: string = 'currentTeam';

export default compose(
  withStyles(styles as any),
  withMobileDialog() as any,
  firebaseConnect((props: IProps) => {
    if (props.location.pathname.includes("edit")) {
      let key = props.match.params.key;
      return [
        { path: "/teams/" + key, storeAs: currentteam }
      ];
    }
    return [];
  }),
  connect((state: any) => ({
    team: state.firebase.data[currentteam],
  })
  ))(TeamFormDialog);
