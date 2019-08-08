import * as React from "react";
import { ChangeEvent } from "react";
import { TextField, Button } from "@material-ui/core";
import { Card, CardContent, Paper, Typography, withStyles } from '@material-ui/core';
import { Chat } from "../../core/models";

interface IOwnProps {
  classes: any;
  chat: Chat;
  onFormChange: (field: string, value: string) => {};
  onSend: () => {};
}

interface ITempState {
  message: string
}

type IProps = IOwnProps;

const styles: any = (theme: any) => ({
  textField: {
    margin: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
    width: '100px'
  },
  paper: {
    maxHeight: 300,
    overflow: 'auto'
  },
  card: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

class ChatForm extends React.Component<IProps, ITempState> {

  messagesEnd: any = React.createRef()

  constructor(props: any) {
    super(props);
    this.state = {
      message: ""
    };
  }

  handleOnFormChange = (event: ChangeEvent<HTMLInputElement>, name: string) => {
    this.setState({ message: event.target.value });
    this.props.onFormChange(name, event.target.value);
  }

  handleSend(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    event.stopPropagation();
    this.props.onSend();
    this.setState({ message: "" });
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render(): JSX.Element {
    let classes = this.props.classes;
    let thread = this.props.chat && this.props.chat.thread ? this.props.chat.thread : [];

    let messageCards = thread.map((m, i) =>
      <Card key={i} className={classes.card}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            {m.user} - {new Date(Number(m.time)).toLocaleDateString()} - {new Date(Number(m.time)).toLocaleTimeString()}
          </Typography>
          <Typography component="p">
            {m.message}
          </Typography>
        </CardContent>
      </Card>
    );

    return (
      <div>
        <Paper className={classes.paper}>
          {messageCards}
          <div style={{ float: "left", clear: "both" }}
            ref={(el) => { this.messagesEnd = el; }}>
          </div>
        </Paper>

        <form noValidate autoComplete="off">
          <TextField id="story-desc"
            className={classes.textField}
            fullWidth={true}
            value={this.state.message}
            label="Message"
            onChange={(e: any) => this.handleOnFormChange(e, 'message')}
            margin="normal"
          />
          <Button type="submit" variant="contained" size="small" className={classes.button} onClick={(e: any) => this.handleSend(e)}>
            Send
         </Button>
        </form>
      </div >
    )
  }
}

export default withStyles(styles)(ChatForm) as React.ComponentClass<any>;
