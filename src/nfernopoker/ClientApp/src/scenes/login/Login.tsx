import * as React from "react";
import { Button, TextField, CardContent, CardActions, Typography } from '@material-ui/core';
import { Component, MouseEvent, ChangeEvent } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { withFirebase } from "react-redux-firebase";
import { sendMessageAction } from "./actions";

interface ILoginProps {
  classes: any;
  secondaryButtonText: string;
  onSecondaryButton: () => void;
}

interface ISnackMessageProps {
  sendMessage: (message: string) => void;
}

interface ILoginState {
  email: string;
  password: string;
}
interface IFirebase {
  firebase: any;
}
type IProps = ILoginProps & ISnackMessageProps & IFirebase & RouteComponentProps<any>;

class LoginComponent extends Component<IProps, ILoginState> {

  public state: ILoginState

  constructor(
    public props: IProps
  ) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  public handleFormChanged(event: ChangeEvent<HTMLInputElement>, name: string): void {
    let newState = { ...this.state };
    newState[name] = event.target.value;
    this.setState(newState);
  }

  public login = (event: MouseEvent<any>) => {
    event.preventDefault();
    event.stopPropagation();

    this.props.firebase.login({
      email: this.state.email,
      password: this.state.password
    }).then(() => {
      this.props.history.push('/games');
    }).catch((ex: any) => {
      this.props.sendMessage(ex.message);
    });
  }

  public render() {
    const { classes } = this.props;
    let isDisabled = !(this.state.email && this.state.password);
    return (
      <form id="login-form" onSubmit={this.login}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary">
            Log in to feel the burn
          </Typography>
          <TextField
            id="email"
            autoComplete="current-user"
            fullWidth={true}
            label="Email"
            onChange={(event: ChangeEvent<HTMLInputElement>) => this.handleFormChanged(event, "email")}
            className={classes.button}
          />
          <TextField
            id="password"
            fullWidth={true}
            type="password"
            label="Password"
            onChange={(event: ChangeEvent<HTMLInputElement>) => this.handleFormChanged(event, "password")}
            className={classes.button}
          />
        </CardContent>
        <CardActions>
          <Button
            id="submit"
            type="submit"
            disabled={isDisabled}
            className={classes.button}
            variant="contained"
            style={{ marginLeft: '16px' }} title="Login" color="primary">Login</Button>
          <Button
            id="secondary-btn"
            onClick={this.props.onSecondaryButton}
            size="small">
            {this.props.secondaryButtonText}
          </Button>
        </CardActions>
      </form>
    );
  }
}

export const LoginTestComp = LoginComponent;

export const Login: React.ComponentClass<ILoginProps> = compose<React.ComponentClass<ILoginProps>>(
  withFirebase,
  withRouter,
  connect(null, { sendMessage: sendMessageAction })
)(LoginComponent)
