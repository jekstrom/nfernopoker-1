export interface JiraTicketsResponse {
  count: number;
  value: Array<JiraTicket>;
}

export interface JiraTicket {
  id: string;
  key: string;
  fields: JiraTicketFields;
  self: string;
}

export interface JiraTicketFields {
  description: JiraDescription;
  project: JiraProject;
  summary: string;
}

export interface JiraDescription {
  type: string;
  version: number;
  content: JiraContent;

}

export interface JiraContent {
  type: string;
  content: Array<{ type: string; text: string; }>
}

export interface JiraProject {
  self: string;
  id: string;
  key: string;
  name: string;
  avatarUrls: JiraAvatarUrls;
  projectCategory: JiraProjectCategory;
  simplified: boolean;
  style: string;
}

export interface JiraAvatarUrls {
  "48x48": string;
  "24x24": string;
  "16x16": string;
  "32x32": string;
}

export interface JiraProjectCategory {
  self: string;
  id: string;
  name: string;
  description: string;
}
