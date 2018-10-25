import { ThunkAction } from "redux-thunk";
import { Story } from "../../core/models";
import { JiraTicket } from "../../core/models/jira-work-items";
import { MessageTypes } from "../../core/actions/SnackMessage";

const serverUrl = "http://localhost:52690"

export function getJiraTickets(gameId: string, jql: string): ThunkAction<any, any, any, any> {
  return (dispatch, getState, getFirebase) =>
    fetch(`${serverUrl}/api/jira/issues/search/${encodeURIComponent(jql)}`, {
      method: "GET"
    }).then(r => {
      r.json().then(results => {
        if (!results) {
          errorReceived("No results");
        }
        let stories = mapJiraTicketsToStories(results.issues);
        getFirebase().ref(`/games/${gameId}`).update({ stories: stories })
          .then(() => {
            dispatch({ type: MessageTypes.ToastMessage, payload: `Added ${stories.length} Jira work items` });
          })

      })
    }, e => errorReceived(e));
}

function mapJiraTicketsToStories(tickets: Array<JiraTicket>): Array<Story> {
  return tickets.map(t => {
    return {
      id: t.key,
      title: `${t.key} - ${t.fields.summary}`,
      type: "JIRA",
      url: t.self,
      description: t.fields.description ? t.fields.description.content.content[0].text : "",
      acceptanceCriteria: "",
      storyPoints: ""
    }
  });
}


function errorReceived(errorMsg: any) {
  alert(errorMsg.message ? errorMsg.message : errorMsg);
}
