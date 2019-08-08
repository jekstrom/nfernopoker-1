import * as React from "react";
import { ChangeEvent } from "react";
import {
  Avatar, Grid, IconButton, TextField,
  List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction,
  Typography, withStyles
} from "@material-ui/core";
import { Delete, Add, Person } from "@material-ui/icons";
import { Team, Player } from "../../core/models"

interface IOwnProps {
  team: Team;
  classes: any;
  onFormChange: (event: any, field: string) => void;
  onPlayerAdded: (player: Player) => void;
  onPlayerRemoved: (player: Player) => void;
  onSave: () => void;
}

interface ITempState {
  player: Player
}

type IProps = IOwnProps;

const styles = (theme: any) => ({
  playerList: {
    overflow: 'auto',
    maxHeight: 300,
    position: 'relative'
  }
});

class TeamFormInputs extends React.Component<IProps, any> {

  public state: ITempState;

  constructor(props: IProps) {
    super(props);
    this.state = {
      player: { name: "", email: "" }
    };
  }

  handleFormChange = (event: ChangeEvent<HTMLInputElement>, name: string) => {
    this.props.onFormChange(event, name);
  }

  handlePlayerChanged(event: ChangeEvent<HTMLInputElement>, name: string): void {
    let newState = { ...this.state.player };
    newState[name] = event.target.value;
    this.setState({ player: newState });
  }

  handlePlayerAdded(): void {
    this.props.onPlayerAdded(this.state.player);
    // Reset form input
    let newState = { ...this.state.player };
    newState.name = newState.email = "";
    this.setState({ player: newState });
  }

  handlePlayerRemoved(player: Player): void {
    this.props.onPlayerRemoved(player);
  }

  render(): JSX.Element {
    let { classes, team } = this.props;
    let addDisabled = this.state.player.name == "" || this.state.player.email == "";

    return (
      <Grid container spacing={24}>

        <TextField
          id="name"
          fullWidth={true}
          value={team.name}
          label="Team Name"
          margin="normal"
          onChange={(e: any) => this.handleFormChange(e, 'name')}
        />

        <Grid item xs={12}>
          <Typography color="secondary" variant="subtitle2"> Add Players to Team </Typography>
        </Grid>

        <Grid item xs={5}>
          <TextField
            id="player-name"
            fullWidth={true}
            value={this.state.player.name}
            label="Full Name"
            margin="dense"
            onChange={(event: ChangeEvent<HTMLInputElement>) => this.handlePlayerChanged(event, "name")}
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            id="player-email"
            fullWidth={true}
            value={this.state.player.email}
            label="Email"
            margin="dense"
            onChange={(event: ChangeEvent<HTMLInputElement>) => this.handlePlayerChanged(event, "email")}
          />
        </Grid>

        <Grid item xs={2}>
          <IconButton color="secondary" disabled={addDisabled} onClick={() => this.handlePlayerAdded()}>
            <Add />
          </IconButton>
        </Grid>

        <Grid item xs={12} >
          <List dense={true} className={classes.playerList}>
            {
              team.players.map(player => {
                return <ListItem key={player.email}>
                  <ListItemAvatar>
                    <Avatar>
                      <Person />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={player.name}
                    secondary={player.email}
                  />
                  <ListItemSecondaryAction>
                    <IconButton aria-label="Delete" onClick={() => this.handlePlayerRemoved(player)}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              })
            }
          </List>
        </Grid>

      </Grid>
    );
  }
}

export default withStyles(styles as any)(TeamFormInputs)
