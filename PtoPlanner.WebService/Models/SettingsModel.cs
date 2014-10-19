using PtoPlanner.Domain;
using System;

namespace PtoPlanner.WebService.Models
{
    public class SettingsModel
    {
        public Decimal PtoCarriedOver { get; set; }
        public Int32 HireYear { get; set; }
        public Constants.EmployeeStatuses EmployeeStatus { get; set; }
        public DateTime? ProrateStart { get; set; }
        public DateTime? ProrateEnd { get; set; }
    }

    public class SettingsModelWithYear : SettingsModel
    {
        public Int32 SettingsYear { get; set; }
    }

    public class SettingsModelWithUrl : SettingsModelWithYear
    {
        public String Url { get; set; }
    }
}