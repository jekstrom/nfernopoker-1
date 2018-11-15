using System;
using System.Net.Http;
using System.Text.Encodings.Web;
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
      Response.Headers.Add("Access-Control-Allow-Origin", "*");
      
      return Json(await SendRequest($"search?jql={UrlEncoder.Default.Encode(jql)}"));
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
