using System.Web.Http;

namespace PtoPlanner.WebService
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "PtoApi",
                routeTemplate: "api/Pto/{id}",
                defaults: new { controller = "Pto", id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "SettingsApi",
                routeTemplate: "api/Settings/{year}",
                defaults: new { controller = "Settings", year = RouteParameter.Optional }
            );

            //config.Routes.MapHttpRoute(
            //    name: "DefaultApi",
            //    routeTemplate: "api/{controller}/{id}",
            //    defaults: new { id = RouteParameter.Optional }
            //);
        }
    }
}
