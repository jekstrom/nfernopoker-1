import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from "react-redux";
import { firebaseConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux';
import { withRouter } from "react-router";
import Layout from './core/components/Layout';
import LoginScreen from './scenes/login/LoginScreen';
import { GameScreen } from './components/GameScreen';
import GamesPageContainer  from './scenes/game/GamesPageContainer';
import TeamsList from './scenes/teams/TeamsList';
import TeamFormDialog from './scenes/teams/TeamFormDialog';
import HomePageComponent from './scenes/home/Home';
import NewGame from './scenes/new-game/NewGame';
import StoryPage from './scenes/new-game/StoryPage';
import ChatPage from './scenes/chat/ChatPage';
import PageNotFound from './core/components/PageNotFound';

const LoggedInRoutes = [
  <Route key={0} exact path='/' component={HomePageComponent} />,
  <Route key={1} exact path='/teams' component={TeamsList} />,
  <Route key={1} exact path='/teams/add' component={TeamFormDialog} />,
  <Route key={1} exact path='/teams/edit/:key' component={TeamFormDialog} />,
  <Route key={2} exact path='/games' component={GamesPageContainer} />,
  <Route key={4} exact path='/games/new' component={NewGame} />,
  <Route key={3} exact path='/games/:key' component={GameScreen} />,
  <Route key={5} exact path='/games/:key/stories' component={StoryPage} />,
  <Route key={6} exact path='/games/:key/chat' component={ChatPage} />
];

const LoggedOutRoutes = [
  <Route key={6} exact path='/' component={LoginScreen} />
];

class App extends React.Component<any> {

  constructor(props: any) {
    super(props);
  }

  public render() {
    let loggedIn = !isEmpty(this.props.auth);
    return (
      <Layout>
        <Switch>
          {[
            !loggedIn && LoggedOutRoutes,
            loggedIn && LoggedInRoutes,
            loggedIn && <Route path='*' key={99} component={PageNotFound} />
          ]}
        </Switch>
      </Layout>
    );
  }
}

const mapStateToProps = (state: any) => ({
  auth: state.firebase.auth
});

export default compose(
  withRouter,
  firebaseConnect(() => [
    'auth'
  ]),
  connect(mapStateToProps)
)(App) as React.ComponentClass<any>;
