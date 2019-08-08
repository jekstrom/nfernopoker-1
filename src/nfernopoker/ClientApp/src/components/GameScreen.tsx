import * as React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Card, CardMedia, CardContent, Typography, withStyles } from "@material-ui/core";
import { gameKeyHoc, IGameKeyHocProps } from "../core/components/gameKeyHoc";
import { firebaseConnect } from "react-redux-firebase";
import { Game, Story } from "../core/models";

interface IOwnProps {
  firebase: any;
  game: Game;
  history: any;
  classes: any;
}

interface ITempState {
  currentStory: Story
}

type IProps = IOwnProps & IGameKeyHocProps;

// https://gridbyexample.com/examples/
const styles = {
  layout: {
    display: 'grid',
    grid: `
            "cards    cards        cards"
            "storyList   story    story"
            "players   players   players"
            / 1fr 1fr 1fr
        `,
    gridColumnGap: 10,
    gridRowGap: 10,
    width: '100%',
    height: '70vh'
  },
  storylistcontainer: {
    gridArea: 'storyList',
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  storycontainer: {
    gridArea: 'story',
    minHeight: 300
  },
  playercontainer: {
    gridArea: 'players',
    display: 'flex'
  },
  cardcontainer: {
    gridArea: 'cards',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  cardflexbox: {
    display: 'flex',
    alignSelf: 'stretch',
    justifyContent: 'space-around'
  },
  card: {
    maxWidth: 80,
    margin: '8px'
  },
  image: {
    border: '1px solid #ddd', /* Gray border */
    borderRadius: '4px',  /* Rounded border */
    padding: '5px', /* Some padding */
    width: '100%',
    height: '100px'/* Set a small width */
  }
}


class GameScreenComponent extends React.Component<IProps, ITempState> {

  constructor(props: any) {
    super(props)
    this.state = {
      currentStory: null
    };
  }

  onCardSelected(cardValue: string): void {
    console.log(cardValue);
    //this.props.firebase.ref(`/games/${this.props.gameKey}`).update({ stories: stories });
  }

  onStorySelected(story: Story): void {
    this.setState({ currentStory: story });
    //let story = this.props.game.stories.find(x => x == story)
    console.log(story);
    //this.props.firebase.ref(`/games/${this.props.gameKey}`).update({ stories: stories });
  }

  render() {

    let { game } = this.props;
    let { currentStory } = this.state;

    let { cards } = game || {
      cards: { name: "", value: [] }
    };

    const cardList = cards && cards.value.map((p, i) => (
      <Card key={i} style={styles.card} onClick={() => this.onCardSelected(p)}>
        <CardContent>
          <Typography gutterBottom={true} component="p">
            {p}
          </Typography>
        </CardContent>
      </Card>
    ));

    const players = game && game.team.players.map((p, i) => (
      <Card key={i} style={styles.card}>
        <CardMedia
          style={styles.image}
          image="/public/img/playing_card.png"
        />
        <CardContent>
          <Typography gutterBottom={true} component="p">
            {p.name}
          </Typography>
        </CardContent>
      </Card>
    ));

    const storyList = game && game.stories.map((s, i) => (
      <Card key={i} onClick={() => this.onStorySelected(s)}>
        <CardContent>
          <Typography gutterBottom={true} component="p">
            {s.id} - {s.title}
          </Typography>
        </CardContent>
      </Card>
    ));

    return (
      <div style={styles.layout}>

        <section style={styles.storylistcontainer}>
          {storyList}
        </section>

        <section style={styles.storycontainer}>
          {!currentStory &&
            <h1>Select a story </h1>
          }
          {currentStory &&
            <React.Fragment>
              <h3> Story </h3>
              <h4>{currentStory.id} {currentStory.title}</h4>
              <div>DESCRIPTION</div>
              <div> {currentStory.description}</div>
              <div>ACCEPTANCE CRITERIA</div>
              <div> {currentStory.acceptanceCriteria}</div>
              <div> {currentStory.storyPoints}</div>
              <a href={currentStory.url} target="_blank">{currentStory.url}</a>

              <div style={styles.cardflexbox}>
                {cardList}
              </div>
            </React.Fragment>
          }
        </section>

        <section style={styles.playercontainer} >
          {players}
        </section>

      </div>
    )

  }
}

const currentGame: string = 'currentGame';

export const GameScreen: React.ComponentClass<any> = compose<React.ComponentClass<any>>(
  gameKeyHoc({ debug: true }),
  withStyles(styles),
  withRouter,
  firebaseConnect((props: IProps) => [
    { path: "/games/" + props.gameKey, storeAs: currentGame }
  ]),
  connect((state: any) => ({
    game: state.firebase.data[currentGame],
    profile: state.firebase.profile
  })
  )
)(GameScreenComponent);

//<section style={styles.cardcontainer}>
//  {cardList}
//</section>
