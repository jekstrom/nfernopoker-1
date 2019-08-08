import * as React from "react";
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, withMobileDialog
} from "@material-ui/core";
import { WithWidth } from "@material-ui/core/withWidth";

interface IOwnProps {
  classes: any;
  body: string;
  isOpen: boolean;
  onConfirm: (e: boolean) => {};
}

type IProps = IOwnProps & WithWidth;

class DialogConfirmation extends React.Component<IProps> {

  constructor(props: any) {
    super(props);
  }

  handleConfirmation = () => {
    this.props.onConfirm(true);
  };

  handleClose(): void {
    this.props.onConfirm(false);
  }

  render() {

    return (
      <Dialog
        open={this.props.isOpen}
        onClose={() => this.handleClose()}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title"> Confirm </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {this.props.body}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.handleClose()} color="secondary">
            Cancle
					</Button>
          <Button onClick={() => this.handleConfirmation()} color="primary" autoFocus>
            Yes
					</Button>
        </DialogActions>
      </Dialog >
    );
  }
}

export default withMobileDialog()(DialogConfirmation);
