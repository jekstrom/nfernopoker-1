using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using nfernopoker.Config;
using SmallOauth1;

namespace nfernopoker.Controllers
{
  [Route("api/[controller]")]
  public class JiraController : Controller
  {
    private readonly ISmallOauth _smallOauth;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly AuthenticationConfig _config;
    private readonly JiraConfig _jiraConfig;
    private readonly HttpClient _client;

    private static AccessTokenInfo _accessToken; // TODO: Store this persistently?

    public JiraController(ISmallOauth tinyOAuth, AuthenticationConfig config, JiraConfig jiraConfig, IHttpClientFactory httpClientFactory)
    {
      _smallOauth = tinyOAuth ?? throw new ArgumentNullException(nameof(tinyOAuth));
      _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
      _config = config ?? throw new ArgumentNullException(nameof(config));
      _jiraConfig = jiraConfig ?? throw new ArgumentNullException(nameof(jiraConfig));

      _client = _httpClientFactory.CreateClient("client");
    }

    [HttpGet]
    public IActionResult Get()
    {
      var requestTokenInfo = _smallOauth.GetRequestTokenAsync().Result;

      var authorizationUrl = _smallOauth.GetAuthorizationUrl(requestTokenInfo.RequestToken);

      return Redirect(authorizationUrl);
    }

    [HttpGet("callback")]
    public async Task<IActionResult> CallbackHandler(string oauth_token, string oauth_verifier)
    {
      _accessToken = await _smallOauth.GetAccessTokenAsync(oauth_token, _config.SmallOauthConfig.ConsumerSecret, oauth_verifier);

      return Redirect(_config.RedirectUri);
    }

    [HttpGet("issue/{id}")]
    public async Task<JsonResult> GetIssueById(string id)
    {
      return Json(await SendRequest($"issue/{id}.json"));
    }

    [HttpGet("issues/{projectKey}")]
    public async Task<JsonResult> GetIssues(string projectKey)
    {
      var response = await SearchIssues($"project={projectKey}&maxResults=-1");
      return Json(response);
    }

    [HttpGet("issues/search/{jql}")]
    public async Task<JsonResult> SearchIssues(string jql)
    {
      //return Json(await SendRequest($"search?jql={Uri.EscapeUriString(jql)}"));
      string json = @"
{
    ""expand"": ""schema,names"",
    ""startAt"": 0,
    ""maxResults"": 50,
    ""total"": 2,
    ""issues"": [
        {
            ""expand"": ""html"",
            ""id"": ""10230"",
            ""self"": ""http://localhost:8080/rest/api/2/issue/BULK-62"",
            ""key"": ""BULK-62"",
            ""fields"": {
                ""summary"": ""testing"",
                ""timetracking"": null,
                ""issuetype"": {
                    ""self"": ""http://localhost:8080/rest/api/2/issuetype/5"",
                    ""id"": ""5"",
                    ""description"": ""The sub-task of the issue"",
                    ""iconUrl"": ""http://localhost:8080/images/icons/issue_subtask.gif"",
                    ""name"": ""Sub-task"",
                    ""subtask"": true
                },
                ""customfield_10071"": null
            },
            ""transitions"": ""http://localhost:8080/rest/api/2/issue/BULK-62/transitions""
        },
        {
            ""expand"": ""html"",
            ""id"": ""10004"",
            ""self"": ""http://localhost:8080/rest/api/2/issue/BULK-47"",
            ""key"": ""BULK-47"",
            ""fields"": {
                ""summary"": ""Cheese v1 2.0 issue"",
                ""timetracking"": null,
                ""issuetype"": {
                    ""self"": ""http://localhost:8080/rest/api/2/issuetype/3"",
                    ""id"": ""3"",
                    ""description"": ""A task that needs to be done."",
                    ""iconUrl"": ""http://localhost:8080/images/icons/task.gif"",
                    ""name"": ""Task"",
                    ""subtask"": false
                },
                ""transitions"": ""http://localhost:8080/rest/api/2/issue/BULK-47/transitions""
            }
        }
    ]
}";
      Response.Headers.Add("Access-Control-Allow-Origin", "*");
      return Json(JsonConvert.DeserializeObject<dynamic>(json));
    }

    // TODO: Abstract this into a generic proxy service
    private async Task<string> SendRequest(string uri)
    {
      string url = $"{_jiraConfig.BaseUrl}/{uri}";
      var request = new HttpRequestMessage(HttpMethod.Get, url);
      request.Headers.Authorization = _smallOauth.GetAuthorizationHeader(_accessToken.AccessToken, _accessToken.AccessTokenSecret, url, HttpMethod.Get);

      var response = await _client.SendAsync(request);

      return await response.Content.ReadAsStringAsync();
    }
  }
}
