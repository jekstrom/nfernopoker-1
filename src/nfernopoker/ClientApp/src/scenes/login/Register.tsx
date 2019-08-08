import * as React from "react";
import { Component, ChangeEvent } from 'react';
import { compose } from "redux";
import { connect } from "react-redux";
import { withFirebase } from "react-redux-firebase";
import { withRouter, RouteComponentProps } from "react-router";
import { Button, TextField, CardContent, CardActions, Typography } from "@material-ui/core";
import { sendMessageAction } from "./actions";

interface ILocalProps {
  classes: any;
  secondaryButtonText: string;
  onSecondaryButton: () => void;
}
interface ILocalState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
interface IFirebase {
  firebase: any;
}
interface IConnectedDispatch {
  sendMessage: (message: string) => void
}
type IProps = ILocalProps & IConnectedDispatch & RouteComponentProps<any> & IFirebase;

class RegisterComponent extends Component<IProps, ILocalState> {

  constructor(
    public props: IProps
  ) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    };
  }

  public handleFormChanged(event: ChangeEvent<HTMLInputElement>, name: string): void {
    let newState = { ...this.state };
    newState[name] = event.target.value;
    this.setState(newState);
  }

  public handleSubmit = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.firebase.createUser(
      { email: this.state.email, password: this.state.password },
      { firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email }
    ).then((r: any) => {
      this.props.history.push("/games");
    }).catch((ex: any) => this.props.sendMessage(ex.message));
  }

  public render() {
    let isDisabled = !(this.state.firstName && this.state.lastName && this.state.email && this.state.password);
    return (
      <React.Fragment>
        <form id="register-form" onSubmit={(event: any) => this.handleSubmit(event)}>
          <CardContent>
            <Typography className={this.props.classes.title} color="textSecondary">
              Create a new account
          </Typography>
            <TextField
              id="first-name"
              required={true}
              fullWidth={true}
              label="First Name"
              onChange={(event: ChangeEvent<HTMLInputElement>) => this.handleFormChanged(event, "firstName")}
              className={this.props.classes.button}
            />
            <TextField
              id="last-name"
              required={true}
              fullWidth={true}
              label="Last Name"
              onChange={(event: ChangeEvent<HTMLInputElement>) => this.handleFormChanged(event, "lastName")}
              className={this.props.classes.button}
            />
            <TextField
              id="email"
              required={true}
              fullWidth={true}
              type="email"
              label="Email"
              onChange={(event: ChangeEvent<HTMLInputElement>) => this.handleFormChanged(event, "email")}
              className={this.props.classes.button}
            />
            <TextField
              id="password"
              required={true}
              fullWidth={true}
              type="password"
              label="Password"
              onChange={(event: ChangeEvent<HTMLInputElement>) => this.handleFormChanged(event, "password")}
              className={this.props.classes.button}
            />
          </CardContent>
          <CardActions>
            <Button
              id="submit"
              form="register-form"
              type="submit"
              className={this.props.classes.button}
              disabled={isDisabled}
              variant="contained"
              style={{ marginLeft: '16px' }}
              title="Register"
              color="primary">
              Register
            </Button>
            <Button
              id="secondary-btn"
              onClick={this.props.onSecondaryButton}
              size="small">
              {this.props.secondaryButtonText}
            </Button>
          </CardActions>
        </form>
      </React.Fragment>
    );
  }
}

export const RegisterTestComp = RegisterComponent;

export const Register: React.ComponentClass<ILocalProps> = compose<React.ComponentClass<ILocalProps>>(
  connect(null, { sendMessage: sendMessageAction }),
  withRouter,
  withFirebase
)(RegisterComponent)
