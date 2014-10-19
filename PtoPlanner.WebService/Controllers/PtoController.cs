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
    public class PtoController : ApiController
    {
        private IPtoRepository _repo;
        
        public PtoController(IPtoRepository repo)
        {
            this._repo = repo;
        }

        [Route("api/pto/{year?}")]
        public IEnumerable<Pto> Get(int? year = null)
        {
            if (year == null) year = DateTime.Today.Year;
            return _repo.GetPtoList(year.Value);
        }

        public HttpResponseMessage Post([FromBody]Pto ptoItem)
        {
            if (ptoItem.PtoId != default(int))
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Unable to insert PTO with non-zero PtoId.");
            }
            else
            {
                try
                {
                    _repo.Insert(ptoItem);
                    return Request.CreateResponse(HttpStatusCode.Created, ptoItem);
                }
                catch (Exception)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error inserting PTO.");
                }
            }
        }

        public HttpResponseMessage Put([FromBody]Pto ptoItem)
        {
            try
            {
                if (_repo.Update(ptoItem))
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
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error updating PTO.");
            }
        }

        [Route("api/pto/{id}")]
        public HttpResponseMessage Delete(int id)
        {
            try
            {
                if (_repo.Delete(id))
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
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error deleting PTO.");
            }
        }
    }
}
