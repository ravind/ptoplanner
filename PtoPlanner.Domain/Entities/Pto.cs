using System;

namespace PtoPlanner.Domain.Entities
{
    public class Pto
    {
        public Int32 PtoId { get; set; }
        public Int32 PersonId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public String Note { get; set; }
        public Boolean HalfDays { get; set; }
        public Constants.PtoTypes PtoType { get; set; }
    }
}
