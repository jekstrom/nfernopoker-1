import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { Divider, Drawer, MenuItem, IconButton, MuiThemeProvider, Theme, createMuiTheme, withStyles } from '@material-ui/core';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import orange from '@material-ui/core/colors/orange';
import { firebaseConnect, isEmpty } from 'react-redux-firebase';
import classNames from 'classnames';
import AppHeader from './AppHeader';
import { SnackWrapper } from './SnackWrapper';

export interface IOwnProps {
  classes: any;
  children: any;
  auth: any;
}

interface ITempState {
  open: boolean
}

type IProps = IOwnProps;

const theme = createMuiTheme({
  palette: {
    primary: orange,
  },
  typography: {
    useNextVariants: true,
  },
});

const drawerWidth = 240;

const styles = (theme: Theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    top: 56,
    position: 'relative',
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
});

class Layout extends React.Component<IProps, ITempState> {

  constructor(
    public props: IOwnProps
  ) {
    super(props)
    this.state = {
      open: false,
    };
  }

  handleDrawerToggle() {
    this.setState((state: any) => ({ open: !state.open }));
  }

  render() {
    let { auth, classes } = this.props;
    let { open } = this.state;

    let drawerContent = (
      <div>
        <div className={classes.drawerHeader}>
          <IconButton onClick={() => this.handleDrawerToggle()}>
            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>
        <Divider />
        <Link to={'/'}><MenuItem selected={window.location.pathname === '/'}>Home</MenuItem></Link>
        {isEmpty(auth) &&
          <Link to={'/'}><MenuItem selected={window.location.pathname === '/'}>Login</MenuItem></Link>
        }
        <Divider />
        {
          !isEmpty(auth) &&
          <React.Fragment>
            <Link to={'/teams'}><MenuItem selected={window.location.pathname === '/teams'}>Teams</MenuItem></Link>
            <Link to={'/games/new'}><MenuItem selected={window.location.pathname === '/game/new'}>New Game</MenuItem></Link>
            <Link to={'/games'}><MenuItem selected={window.location.pathname === '/games'}>All Games</MenuItem></Link>
          </React.Fragment>
        }
      </div>
    );

    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <AppHeader drawerOpen={open} onMenuClick={() => this.handleDrawerToggle()} />
          <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawerContent}
          </Drawer>
          <main
            className={classNames(classes.content, {
              [classes.contentShift]: open,
            })}
          >
            {this.props.children}
          </main>
        </div>
        <SnackWrapper classes={classes} />
      </MuiThemeProvider>
    );
  }
}

export default compose(
  withStyles(styles),
  firebaseConnect(),
  connect((state: any, props: any) => ({
    auth: state.firebase.auth
  }))
)(Layout);
