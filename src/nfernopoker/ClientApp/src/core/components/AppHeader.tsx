import * as React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Button, Typography, Theme, withStyles } from '@material-ui/core';
import { AccountCircle, Menu} from '@material-ui/icons';
import classNames from 'classnames';
import { firebaseConnect, isEmpty } from 'react-redux-firebase';
import { withRouter } from "react-router";

const drawerWidth = 240;

const styles = (theme: Theme) => ({
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  appTitle: {
    flex: 1
  },
  hide: {
    display: 'none',
  },
});

class AppHeaderComponent extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
  }

  logout = () => {
    this.props.firebase.logout();
    this.props.history.push("/");
  };

  handleMenuClick(): void {
    this.props.onMenuClick();
  }

  render() {
    const { classes } = this.props;
    let { firstName, lastName } = this.props.profile;
    let title = "N-Ferno Poker";
    let open = this.props.drawerOpen;

    return (
      <AppBar
        position="fixed"
        className={classNames(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar disableGutters={!open}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={() => this.handleMenuClick()}
            className={classNames(classes.menuButton, open && classes.hide)}
          >
            <Menu />
          </IconButton>
          <Typography className={classes.appTitle} variant="h6" color="inherit" noWrap={true}>
            {title}
          </Typography>
          {
            !isEmpty(this.props.auth) &&
            <div>
              <Button variant="text" onClick={this.logout}>Logout</Button>
              <IconButton
                aria-owns='menu-appbar'
                aria-haspopup="true"
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <span>{firstName} {lastName}</span>
            </div>
          }
          {
            isEmpty(this.props.auth) && <Link to={'/login'}>Login</Link>
          }
        </Toolbar>
      </AppBar>
    );
  }

}


export default compose<React.ComponentClass<any>>(
  withRouter,
  withStyles(styles),
  firebaseConnect((props: any) => {
    return [
      'auth',
      'profile'
    ]
  }),
  connect((state: any) => ({
    auth: state.firebase.auth,
    profile: state.firebase.profile
  }))
)(AppHeaderComponent)
