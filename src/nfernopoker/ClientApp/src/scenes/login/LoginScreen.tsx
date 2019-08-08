import * as React from "react";
import { Component } from 'react';
import { Login } from './Login';
import { Register } from './Register';
import { Grid, withStyles, Card } from "@material-ui/core";

interface ILoginScreenState {
  isLogin: boolean;
}

interface ILoginScreenProps {
  classes: any;
}

const styles: any = (theme: any) => ({
  button: { margin: theme.spacing.unit },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
  login: {
    minWidth: "300px",
  },
  root: {
    height: "100%",
    backgroundColor: theme.palette.background.default,
    backgroundImage: "url(" + require('../../../public/img/inferno.jpg') + ")",
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
  }
});

class LoginScreen extends Component<ILoginScreenProps, ILoginScreenState> {

  public state: ILoginScreenState;

  constructor(
    public props: ILoginScreenProps
  ) {
    super(props);
    this.state = { isLogin: true };
  }

  public render() {
    const classes = this.props.classes;
    const loginScreen =
      this.state.isLogin ?
        <Login classes={classes} secondaryButtonText='No account?' onSecondaryButton={this.toggleState} /> :
        <Register classes={classes} secondaryButtonText='Log in instead' onSecondaryButton={this.toggleState} />
    return (
      <Grid className={classes.root} container={true} alignItems="center" alignContent="center" justify="center" direction="row">
        <Grid item={true} className={classes.login}>
          <Card>
            {loginScreen}
          </Card>
        </Grid>
      </Grid>
    );
  }

  private toggleState = () => {
    this.setState({
      isLogin: !this.state.isLogin
    });
  }

}

export const LoginScreenTestComp = LoginScreen;

export default withStyles(styles)(LoginScreen);
