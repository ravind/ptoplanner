using PtoPlanner.WebService.Models;
using System.Web.Http;

namespace PtoPlanner.WebService.Controllers
{
    public abstract class BaseController : ApiController
    {
        private ModelFactory _modelFactory;
        protected ModelFactory MyModelFactory
        {
            get
            {
                if (_modelFactory == null)
                {
                    _modelFactory = new ModelFactory(this.Request);
                }
                return _modelFactory;
            }
        }
    }
}
