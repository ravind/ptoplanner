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
    public class PtoController : BaseController
    {
        private IPtoRepository _repo;
        
        public PtoController(IPtoRepository repo)
        {
            this._repo = repo;
        }

        [Route("api/PtoList/{year?}")]
        public IEnumerable<PtoModelWithUrl> Get(int? year = null)
        {
            if (year == null) year = DateTime.Today.Year;
            foreach (Pto item in  _repo.GetPtoList(year.Value))
            {
                yield return MyModelFactory.Create(item);
            }
        }

        public HttpResponseMessage Get(int id)
        {
            Pto pto = _repo.Get(id);
            if (pto == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "PTO Not Found");
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, MyModelFactory.Create(pto));
            }
        }

        public HttpResponseMessage Post([FromBody]PtoModel ptoModel)
        {
            Pto ptoItem = MyModelFactory.Parse(ptoModel);
            if (ptoItem.PtoId != default(int))
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Unable to insert PTO with non-zero PtoId.");
            }
            else
            {
                try
                {
                    _repo.Insert(ptoItem);
                    return Request.CreateResponse(HttpStatusCode.Created, MyModelFactory.Create(ptoItem));
                }
                catch (Exception)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error inserting PTO.");
                }
            }
        }

        public HttpResponseMessage Put(int id, [FromBody]PtoModel ptoModel)
        {
            try
            {
                Pto ptoItem = MyModelFactory.Parse(ptoModel, id);
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

        public HttpResponseMessage Delete(int id = 0)
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
