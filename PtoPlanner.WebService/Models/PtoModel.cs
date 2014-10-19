using PtoPlanner.Domain;
using System;

namespace PtoPlanner.WebService.Models
{
    public class PtoModel
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public String Note { get; set; }
        public Boolean HalfDays { get; set; }
        public Constants.PtoTypes PtoType { get; set; }
    }

    public class PtoModelWithUrl : PtoModel
    {
        public String Url { get; set; }    
    }
}