import * as React from "react";
import { Avatar, Card, CardActions, CardHeader, CardMedia, CardContent, Typography, IconButton } from "@material-ui/core";
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import { Game, Player } from "../core/models";
import { withRouter } from "react-router";
import { withStyles } from '@material-ui/core/styles';
import { firebaseConnect, isLoaded } from "react-redux-firebase";
import { connect } from "react-redux";
import { compose } from "redux";
import WhatshotIcon from '@material-ui/icons/Whatshot';

interface IOwnProps {
  game: Game;
  location: any;
}

interface ITempState {
  players: Array<Player>
}

type IProps = IOwnProps;

const styles = {
  layout: {
    display: 'grid',
    grid: `
            [issuerow-start] "issue-view" 1fr [issuerow-end]
            [cardrow-start] "card-view" auto [cardrow-end]
            / 100%
        `,
    width: '100%',
    height: '100%'
  },
  issuecontainer: {
    gridArea: 'issue-view',
    alignSelf: 'stretch',
    maxHeight: 700,
    overflow: 'auto'
  },
  cardcontainer: {
    gridArea: 'card-view',
    alignSelf: 'stretch',
    display: 'flex',
    justifyContent: 'space-around'
  },
  card: {
    maxWidth: 400,
    flex: '1 1 0',
    margin: '8px'
  },
  image: {
    height: 0,
    paddingTop: `${9.0 / 16.0 * 100}%`
  }
}

class GameScreenComponent extends React.Component<IProps, ITempState> {
  constructor(props: any) {
    super(props);

    this.state = {
      players: [
        { name: 'George', email: "" },
        { name: 'Michael', email: "" },
        { name: 'George Michael', email: "" },
        { name: 'GOB', email: "" },
        { name: 'Lucille', email: "" },
        { name: 'Lucille 2', email: "" },
        { name: 'Maeby', email: "" },
        { name: 'Tobias', email: "" },
        { name: 'Lindsay', email: "" },
        { name: 'Buster', email: "" },
      ]
    };
  }

  // TODO
  // Show stories in this game
  // allow user to click on story to see more details
  // Allow a user to vote on each story
  // allow moderator user to update the story with story points
  //     this needs some sort of authz and generic 'story' backend thing to post new story points

  render() {
    const cards = this.state.players.map(p => (
      <Card key={p.name} style={styles.card}>
        <CardMedia
          style={styles.image}
          image="http://www.fillmurray.com/400/300"
        />
        <CardContent>
          <Typography gutterBottom={true} component="p">
            {p.name}
          </Typography>
        </CardContent>
      </Card>
    ));

    let stories = [<div>Loading...</div>]
    if (isLoaded(this.props.game) && this.props.game) {
      stories = this.props.game.stories.map((story: any, i: number) => (
        <Card key={story.id} style={styles.card}>
          <CardHeader avatar={<Avatar src={story.iconUrl}><WhatshotIcon /></Avatar>} title={story.title} subheader="subheader" />
          <CardContent>
            <Typography gutterBottom={true} component="p">
              {story.description}
            </Typography>
          </CardContent>
          <CardActions disableActionSpacing>
            <IconButton aria-label="Add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="Share">
              <ShareIcon />
            </IconButton>
          </CardActions>
        </Card>
      ));
    }

    return <div style={styles.layout}>
      <section style={styles.issuecontainer}>
        {stories}
      </section>
      <section style={styles.cardcontainer} >
        {cards}
      </section>
    </div>
  }
}

const mapStateToProps = (state: any, props: any) => {
  return ({
    game: state.firebase.data.games ? state.firebase.data.games[props.match.params.key] : null
  });
};

//export const GameScreen = GameScreenComponent;
export const GameScreen: React.ComponentClass<any> = compose<React.ComponentClass<any>>(
  withStyles(styles),
  withRouter,
  firebaseConnect((props: IProps) => {
    let key = props.location.pathname.substring(7, 27);
    return [
      "/games/" + key
    ]
  }),
  connect(mapStateToProps)
)(GameScreenComponent);
