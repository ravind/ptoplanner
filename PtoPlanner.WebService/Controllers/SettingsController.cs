using PtoPlanner.Domain.Entities;
using PtoPlanner.Domain.Repos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace PtoPlanner.WebService.Controllers
{
    public class SettingsController : ApiController
    {
        private ISettingsRepository _repo;

        public SettingsController(ISettingsRepository repo)
        {
            this._repo = repo;
        }

        [Route("api/settings/years")]
        public IEnumerable<int> GetAllYears()
        {
            return new int[] { 1, 2, 3, 4 };
            //return _repo.GetAllYears();
        }

        [Route("api/settings/{year?}")]
        public Settings Get(int? year = null)
        {
            if (year == null) year = DateTime.Today.Year;
            return _repo.Get(year.Value);
        }

        public HttpResponseMessage Post([FromBody]Settings settings)
        {
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
                    return Request.CreateResponse(HttpStatusCode.Created, settings);
                }
                catch (Exception)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error inserting Settings.");
                }
            }
        }

        public HttpResponseMessage Put([FromBody]Settings settings)
        {
            try
            {
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

        [Route("api/settings/{year}")]
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
