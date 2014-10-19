using PtoPlanner.Domain.Entities;
using PtoPlanner.Domain.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http.Routing;

namespace PtoPlanner.WebService.Models
{
    public class ModelFactory
    {
        private UrlHelper _urlHelper;
        private IdentityService _idService;

        public ModelFactory(HttpRequestMessage request)
        {
            _urlHelper = new UrlHelper(request);
            _idService = new IdentityService();
        }
        
        public PtoModelWithUrl Create(Pto pto)
        {
            var retVal = new PtoModelWithUrl();
            retVal.Url = _urlHelper.Link("PtoApi", new { id = pto.PtoId });
            retVal.StartDate = pto.StartDate;
            retVal.EndDate = pto.EndDate;
            retVal.Note= pto.Note;
            retVal.HalfDays = pto.HalfDays;
            retVal.PtoType = pto.PtoType;
            return retVal;
        }

        public Pto Parse(PtoModel ptoModel, Int32 ptoId = 0)
        {
            var retVal = new Pto();
            retVal.PtoId = ptoId;
            retVal.PersonId = _idService.CurrentUserIdentifier;
            retVal.StartDate = ptoModel.StartDate;
            retVal.EndDate = ptoModel.EndDate;
            retVal.Note = ptoModel.Note;
            retVal.HalfDays = ptoModel.HalfDays;
            retVal.PtoType = ptoModel.PtoType;
            return retVal;
        }

        public SettingsModelWithUrl Create(Settings settings)
        {
            var retVal = new SettingsModelWithUrl();
            retVal.Url = _urlHelper.Link("SettingsApi", new { year = settings.SettingsYear });
            retVal.SettingsYear = settings.SettingsYear;
            retVal.PtoCarriedOver = settings.PtoCarriedOver;
            retVal.HireYear = settings.HireYear;
            retVal.EmployeeStatus = settings.EmployeeStatus;
            retVal.ProrateStart = settings.ProrateStart;
            retVal.ProrateEnd = settings.ProrateEnd;
            return retVal;
        }

        public Settings Parse(SettingsModel settingsModel, Int32 settingsYear)
        {
            var retVal = new Settings();
            retVal.PersonId = _idService.CurrentUserIdentifier;
            retVal.SettingsYear = settingsYear;
            retVal.PtoCarriedOver = settingsModel.PtoCarriedOver;
            retVal.HireYear = settingsModel.HireYear;
            retVal.EmployeeStatus = settingsModel.EmployeeStatus;
            retVal.ProrateStart = settingsModel.ProrateStart;
            retVal.ProrateEnd = settingsModel.ProrateEnd;
            return retVal;
        }

        public Settings Parse(SettingsModelWithYear settingsModel)
        {
            return this.Parse((SettingsModel)settingsModel, settingsModel.SettingsYear);
        }
    }
}