using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PtoPlanner.WebService.Controllers
{
    [RequireHttps]
    public class DefaultController : Controller
    {
        // GET: Default
        public ActionResult Index()
        {
            ViewBag.Title = "PTO Planner";
            return View();
        }
    }
}