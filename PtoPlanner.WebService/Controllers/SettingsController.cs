using PtoPlanner.Domain.Entities;
using PtoPlanner.Domain.Repos;
using PtoPlanner.WebService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PtoPlanner.WebService.Controllers
{
    public class SettingsController : BaseController
    {
        private ISettingsRepository _repo;

        public SettingsController(ISettingsRepository repo)
        {
            this._repo = repo;
        }

        [Route("api/Settings/Years")]
        public IEnumerable<int> GetAllYears()
        {
            var years = new List<int>(_repo.GetAllYears());
            int currentYear = DateTime.Today.Year;
            for (int i = currentYear; i < currentYear + 2; i++)
			{
			    if (!years.Contains(i)) years.Add(i);
			}
            return years;
        }

        public HttpResponseMessage Get(int? year = null)
        {
            if (year == null) year = DateTime.Today.Year;
            Settings foundSettings = _repo.Get(year.Value);
            if (foundSettings == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Settings Not Found");
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, MyModelFactory.Create(foundSettings));
            }
        }

        public HttpResponseMessage Post([FromBody]SettingsModelWithYear settingsModel)
        {
            Settings settings = MyModelFactory.Parse(settingsModel);
            var foundSetting = _repo.Get(settings.SettingsYear);
            if (foundSetting != null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Settings for this year already exist.");
            }
            else
            {
                try
                {
                    _repo.Insert(settings);
                    return Request.CreateResponse(HttpStatusCode.Created, MyModelFactory.Create(settings));
                }
                catch (Exception)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error inserting Settings.");
                }
            }
        }

        public HttpResponseMessage Put(int year, [FromBody]SettingsModel settingsModel)
        {
            try
            {
                Settings settings = MyModelFactory.Parse(settingsModel, year);
                if (_repo.Update(settings))
                {
                    return Request.CreateResponse(HttpStatusCode.OK);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound);
                }
            }
            catch (Exception)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error updating Settings.");
            }
        }

        public HttpResponseMessage Delete(int year)
        {
            try
            {
                if (_repo.Delete(year))
                {
                    return Request.CreateResponse(HttpStatusCode.OK);
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound);
                }
            }
            catch (Exception)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error deleting Settings.");
            }
        }
    }
}
