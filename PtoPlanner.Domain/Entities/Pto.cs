using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace PtoPlanner.Domain.Entities
{
    [Table("Pto")]
    public class Pto
    {
        public Int32 PtoId { get; set; }
        public String PersonId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public String Note { get; set; }
        public Boolean HalfDays { get; set; }
        public Constants.PtoTypes PtoType { get; set; }
    }
}
