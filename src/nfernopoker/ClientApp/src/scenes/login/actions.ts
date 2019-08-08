import { Action } from "redux-actions";
import { MessageTypes } from "../../core/actions/SnackMessage";

export function sendMessageAction(message: string): Action<string> {
  return { type: MessageTypes.ToastMessage, payload: message };
}
