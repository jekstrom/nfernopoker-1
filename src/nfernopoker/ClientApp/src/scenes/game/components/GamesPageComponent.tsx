import * as React from "react";
import { Card, CardMedia, CardContent, Typography, Button, Grid } from "@material-ui/core";
import { isLoaded, isEmpty } from "react-redux-firebase";
import { withStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";

interface IOwnProps {
  firebase: any
  games: Array<any>,
  history: any,
  classes: any,
  onRemoveItem(key: string): void,
  onPlayGame(key: string): void
}

type IProps = IOwnProps;

const styles = {
  root: {
    flexGrow: 1,
  },
  button: {
    background: 'white',
    width: '100px'
  },
  card: {
    width: 245
  },
  image: {
    height: 180,
  }
}


class GamesPage extends React.Component<IProps> {

  constructor(props: IProps) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    if (!isLoaded(this.props.games)) {
      return <p>Loading... </p>
    }

    let cards = new Array<any>();

    if (!isEmpty(this.props.games) && isLoaded(this.props.games)) {
      cards = Object.keys(this.props.games).map((key, index) => {
        let game = this.props.games[key];
        return (<Grid key={index} item className={classes.card}>
          <Card>
            <CardMedia component="img"
              style={styles.image}
              src="/public/img/planning_game.jpg"
            />
            <CardContent>
              <Typography gutterBottom={true}>
                {game.title}
              </Typography>
              <Button color="secondary" onClick={() => this.props.onRemoveItem(key)}>
                Delete
              </Button>
              <Button color="primary" onClick={() => this.props.onPlayGame(key)}>
                Play
              </Button>
         
              <Link to={`games/${key}/stories`}> STORIES </Link>

            </CardContent>
          </Card>
        </Grid>)
      });
    }
    return (<Grid container
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
      className={classes.root} spacing={24}>
      {cards}
    </Grid>)
  }
}

export default withStyles(styles)(GamesPage)
