import * as React from "react";
import { ChangeEvent } from "react";
import { getWorkItemsByWiql } from "./actions";
import { TextField, Button, Modal, Paper, withStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { compose, bindActionCreators } from 'redux';

const styles = (theme: any) => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  issuesButton: {
    margin: theme.spacing.unit,
    right: '25px'
  }
});

const getModalStyle = () => {
  const top = 50;
  const left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

//TODO: Refactor passing of info to the actions
class TfsStoryImportComponent extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      modal: false,
      username: "",
      personalAccessToken: "",
      tfsServer: "",
      project: "",
      team: "",
      tfsQueryId: ""
    };
  }

  getTfsUrlProjectLevel(): string {
    return this.state.tfsServer + "/" + this.state.project;
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>, name: string) => {
    let newState = { ...this.state };
    newState[name] = event.target.value;
    this.setState(newState);
  }

  handleModalToggle(isOpen: boolean): void {
    this.setState({ modal: isOpen })
  }

  render(): JSX.Element {
    let state = this.state;
    const classes = this.props.classes;

    return (
      <div>
        <Button className={classes.issuesButton} onClick={() => this.handleModalToggle(true)}>TFS/Azure Import</Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.modal}
          onClose={() => this.handleModalToggle(false)}
        >
          <Paper style={getModalStyle()} className={classes.paper}>
            <form noValidate autoComplete="off">
              <legend>Enter your TFS server info below.</legend>

              <TextField id="tfs-server"
                fullWidth={true}
                label="TFS Server URL"
                value={state.tfsServer}
                onChange={(e: any) => this.handleChange(e, 'tfsServer')}
                margin="normal"
              />

              <TextField id="tfs-team"
                fullWidth={true}
                label="TFS Team"
                value={state.team}
                onChange={(e: any) => this.handleChange(e, 'team')}
                margin="normal"
              />

              <TextField id="tfs-project"
                fullWidth={true}
                label="TFS Project"
                value={state.project}
                onChange={(e: any) => this.handleChange(e, 'project')}
                helperText="TFS Project"
                margin="normal">
              </TextField>

              <TextField id="tfs-username"
                fullWidth={true}
                label="Username"
                value={state.username}
                onChange={(e: any) => this.handleChange(e, 'username')}
                helperText="Username"
                margin="normal">
              </TextField>

              <TextField id="tfs-personal-access-token"
                fullWidth={true}
                label="Personal Access Token"
                value={state.personalAccessToken}
                onChange={(e: any) => this.handleChange(e, 'personalAccessToken')}
                helperText="TFS (User Menu > Security > Add Personal Access Token)"
                margin="normal">
              </TextField>

              <TextField id="tfs-query-id"
                fullWidth={true}
                label=" TFS Query ID"
                value={state.tfsQueryId}
                onChange={(e: any) => this.handleChange(e, 'tfsQueryId')}
                helperText="GUID Query ID"
                margin="normal">
              </TextField>

              <Button color="primary" onClick={() => this.props.getWorkItemsByWiql(this.getTfsUrlProjectLevel(), this.state.team, this.state.tfsQueryId, this.state.username, this.state.personalAccessToken, this.props.gameKey)}>
                Load TFS WorkItems
              </Button>

            </form>

          </Paper>
        </Modal>
      </div>
    )
  }

}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    getWorkItemsByWiql: getWorkItemsByWiql
  }, dispatch);
}

export default compose(
  withStyles(styles as any),
  connect(null, mapDispatchToProps)
)(TfsStoryImportComponent) as React.ComponentClass<any>;
