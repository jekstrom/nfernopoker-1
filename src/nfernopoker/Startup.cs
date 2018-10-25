using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.IO;
using SmallOauth1;
using nfernopoker.Config;

namespace nfernopoker
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddMvc();
      services.AddHttpClient();

      // In production, the React files will be served from this directory
      services.AddSpaStaticFiles(configuration =>
      {
        configuration.RootPath = "ClientApp/build";
      });

      using (var reader = File.OpenText("jira_privatekey.pem"))
      {
        AuthenticationConfig config = new AuthenticationConfig();
        Configuration.GetSection("AuthenticationConfig").Bind(config);

        JiraConfig jiraConfig = new JiraConfig();
        Configuration.GetSection("JiraConfig").Bind(jiraConfig);

        config.SmallOauthConfig.SigningKey = reader.ReadToEnd();

        services.AddSingleton<ISmallOauth>(sp => new SmallOauth(config.SmallOauthConfig));
        services.AddSingleton<AuthenticationConfig>(config);
        services.AddSingleton<JiraConfig>(jiraConfig);
      }
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IHostingEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        app.UseExceptionHandler("/Home/Error");
      }

      app.UseStaticFiles();
      app.UseSpaStaticFiles();

      app.UseMvc();

      app.UseSpa(spa =>
      {
        spa.Options.SourcePath = "ClientApp";

        if (env.IsDevelopment())
        {
          spa.UseProxyToSpaDevelopmentServer("http://localhost:8081");
        }
      });
    }
  }
}
