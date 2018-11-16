import * as React from "react";
import { Avatar, Card, CardActions, CardHeader, CardMedia, CardContent, Divider, Grid, List, ListItem, Typography, Paper, IconButton } from "@material-ui/core";
import ShareIcon from '@material-ui/icons/Share';
import OpenInNew from '@material-ui/icons/OpenInNew';
import Comment from '@material-ui/icons/Comment';
import { Game, Player, Story } from "../core/models";
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
  players: Array<Player>,
  currentStory: Story
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
  issue: {
    maxWidth: 600,
    display: 'flex',
    flex: '1 1 0',
    margin: '8px'
  },
  acceptanceCriteria: {
    margin: '8px'
  },
  issueDetails: {
    maxWidth: 1600,
    maxHeight: 1000,
    flex: '1 1 0',
    margin: '8px'
  },
  pokerCard: {
    width: 60,
    height: 100,
    lineHeight: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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
      ],
      currentStory: {
        id: "",
        title: "",
        type: "",
        url: "n/a",
        description: "",
        acceptanceCriteria: "",
        storyPoints: "-666",
        iconUrl: "",
        priority: ""
      }
    };
  }

  handleStorySelected(story: Story): void {
    let newState = { ... this.state };
    newState.currentStory = story;
    this.setState(newState);
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
    let pokerCards = [<p></p>];
    if (isLoaded(this.props.game) && this.props.game) {
      stories = this.props.game.stories.map((story: any, i: number) => (
        <ListItem key={story.id} button onClick={() => this.handleStorySelected(story)}>
          <Card key={story.id} style={styles.issue}>
            <CardHeader avatar={<Avatar src={story.iconUrl} alt={`Priority: ${story.priority}`}><WhatshotIcon /></Avatar>} title={story.title} subheader={`Priority: ${story.priority}`} />
            <CardContent>
              <Typography gutterBottom={true} component="p">
                {story.description}
              </Typography>
            </CardContent>
            <CardActions disableActionSpacing>
              <IconButton aria-label="Open in new window">
                <OpenInNew />
              </IconButton>
              <IconButton aria-label="Share">
                <ShareIcon />
              </IconButton>
            </CardActions>
          </Card>
        </ListItem>
      ));

      pokerCards = this.props.game.cards.value.map((card: number) => (
        <ListItem key={card} button>
          <Paper style={styles.pokerCard}>
            <Typography variant="h5" component="h3">
              {card}
            </Typography>
          </Paper>
        </ListItem>
      ));
    }



    let issueDetails =
      <Grid item xs={8}>
        <Card key="issue-details" style={styles.issueDetails}>
          <CardHeader
            avatar={
              <Avatar src={this.state.currentStory.iconUrl}><WhatshotIcon /></Avatar>
            }
            title={this.state.currentStory.title ? this.state.currentStory.title : "Select a story."}
            subheader={this.state.currentStory.priority ? `Priority: ${this.state.currentStory.priority}` : ""}
          />
          <CardContent>
            <Typography gutterBottom variant="h6" component="h3">
              Description
            </Typography>
            <Typography gutterBottom={true} component="p">
              {this.state.currentStory ? this.state.currentStory.description : ""}
            </Typography>
            <Divider light={true} />
            <Typography gutterBottom variant="h6" component="h3">
              Acceptance Criteria
            </Typography>
            <pre>
              {this.state.currentStory.acceptanceCriteria}
            </pre>
          </CardContent>
          <CardActions>
            <IconButton aria-label="Add comment">
              <Comment />
            </IconButton>
          </CardActions>
          <CardActions>
            {pokerCards}
          </CardActions>
        </Card>
      </Grid>;

    return <div style={styles.layout}>
      <section>
        <Grid container justify="flex-start" alignItems="flex-start">
          <Grid item xs={4} style={styles.issuecontainer}>
            <List>
              {stories}
            </List>
          </Grid>
          {issueDetails}
        </Grid>
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
