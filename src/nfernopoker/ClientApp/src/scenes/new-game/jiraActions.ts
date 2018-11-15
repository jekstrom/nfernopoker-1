import { ThunkAction } from "redux-thunk";
import { Story } from "../../core/models";
import { JiraTicket } from "../../core/models/jira-work-items";
import { MessageTypes } from "../../core/actions/SnackMessage";

export function getJiraTickets(gameId: string, jql: string, projectid: string, Config: any): ThunkAction<any, any, any, any> {
  return (dispatch, getState, getFirebase) =>
    fetch(`${Config.serverUrl}/api/jira/issues/search/${encodeURIComponent(jql)}`, {
      method: "GET"
    }).then(r => {
      r.json().then(results => {
        if (!results) {
          errorReceived("No results");
        }
        let stories = mapJiraIssuesToStories(JSON.parse(results).issues);
        getFirebase().ref(`/games/${gameId}`).update({ stories: stories })
          .then(() => {
            dispatch({ type: MessageTypes.ToastMessage, payload: `Added ${stories.length} Jira work items` });
          })

      })
    }, e => errorReceived(e));
}

function mapJiraIssuesToStories(issues: Array<JiraTicket>): Array<Story> {
  return issues.map(t => {
    return {
      id: t.key,
      title: `${t.key} - ${t.fields.summary}`,
      type: "JIRA",
      url: t.self,
      description: t.fields.description,
      acceptanceCriteria: t.fields.customfield_10027,
      storyPoints: "",
      iconUrl: t.fields.priority.iconUrl
    }
  });
}


function errorReceived(errorMsg: any) {
  alert(errorMsg.message ? errorMsg.message : errorMsg);
}
