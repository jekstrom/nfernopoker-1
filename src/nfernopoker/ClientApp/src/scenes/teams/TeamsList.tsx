import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";
import {
  Avatar, Button, List, ListItem, ListItemAvatar, ListItemText,
  ListItemSecondaryAction, IconButton, CircularProgress, Theme, withStyles
} from '@material-ui/core';
import { Add, Edit, Delete, Group } from '@material-ui/icons';
import DialogConfirmation from '../../core/components/DialogConfirmation';
import { Team } from '../../core/models';
import "./teams.css";

interface IOwnProps {
  firebase: any;
  profile: any;
  teams: Array<Team>;
  classes: any;
  history: any;
}

interface ITempState {
  isModalOpen: boolean;
  selectedKey: string;
}

type IProps = IOwnProps;

const styles = (theme: Theme) => ({
  fab: {
    position: 'absolute',
    right: theme.spacing.unit * 2,
  },
  loadIcon: {
    left: '50%',
    top: '50%',
    position: 'absolute'
  }
});

class TeamsList extends React.Component<IProps, ITempState> {

  constructor(props: any) {
    super(props);
    this.state = {
      isModalOpen: false,
      selectedKey: ""
    };
  }

  handleDeleteConfirmation(key: string) {
    this.setState({ isModalOpen: true, selectedKey: key });
  }

  handleDelete(confirmed: boolean) {
    if (confirmed) {
      this.props.firebase.remove(`/teams/${this.state.selectedKey}`)
    }
    this.setState({ isModalOpen: false });
  }

  render() {

    let classes = this.props.classes;
    if (!isLoaded(this.props.teams)) {
      return <div className={classes.loadIcon}>
        <CircularProgress size={68} color="secondary" />
      </div>
    }

    let teams = new Array<any>();
    if (!isEmpty(this.props.teams) && isLoaded(this.props.teams)) {
      teams = Object.keys(this.props.teams).map((key: string, i: number) => {
        let team = this.props.teams[key];
        let playerCount = team.players ? team.players.length : 0;
        return (
          <ListItem key={i} button>
            <ListItemAvatar>
              <Avatar>
                <Group />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={team.name}
              secondary={playerCount + ' team members'} 
            />
            <ListItemSecondaryAction>
              <Link to={'/teams/edit/' + key}>
                <IconButton aria-label="Edit">
                  <Edit />
                </IconButton>
              </Link>
              <IconButton aria-label="Delete" onClick={() => this.handleDeleteConfirmation(key)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      });
    }

    return (
      <div>
        <Link to={'/teams/add'}>
          <Button className={classes.fab} variant="fab" color="primary" aria-label="Add New Track">
            <Add />
          </Button>
        </Link>
        <List className="teams-list">
          {teams}
        </List>

        <DialogConfirmation isOpen={this.state.isModalOpen} onConfirm={(e: boolean) => this.handleDelete(e)}
          body="Are you sure you want to delete this team?" />
      </div>
    );
  }
}

export default compose<React.ComponentClass<IProps>>(
  withStyles(styles as any),
  firebaseConnect((props: IProps) => [
    'teams',
  ]),
  connect((state: any) => ({
    teams: state.firebase.data.teams
  })
  )
)(TeamsList);
