import * as React from "react";
import { ChangeEvent } from "react";
import { getJiraTickets } from "./jiraActions";
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
class JiraStoryImportComponent extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      modal: false,
      username: "",
      project: "",
      team: ""
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
        <Button className={classes.issuesButton} onClick={() => this.handleModalToggle(true)}>Jira Import</Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.modal}
          onClose={() => this.handleModalToggle(false)}
        >
          <Paper style={getModalStyle()} className={classes.paper}>
            <form noValidate autoComplete="off">
              <TextField id="jql"
                fullWidth={true}
                label="JQL"
                value={state.jql}
                onChange={(e: any) => this.handleChange(e, 'jql')}
                margin="normal"
              />

              <Button color="primary" onClick={() => this.props.getJiraTickets(this.props.gameKey, this.state.jql)}>
                Load Jira tickets
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
    getJiraTickets: getJiraTickets
  }, dispatch);
}

export default compose(
  withStyles(styles as any),
  connect(null, mapDispatchToProps)
)(JiraStoryImportComponent) as React.ComponentClass<any>;
