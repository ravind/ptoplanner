using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PtoPlanner.Domain.Entities
{
    [Table("Settings")]
    public class Settings
    {
        [Key, Column(Order = 0)]
        public String PersonId { get; set; }
        [Key, Column(Order = 1)]
        public Int32 SettingsYear { get; set; }
        public Decimal PtoCarriedOver { get; set; }
        public Int32 HireYear { get; set; }
        public Constants.EmployeeStatuses EmployeeStatus { get; set; }
        public DateTime? ProrateStart { get; set; }
        public DateTime? ProrateEnd { get; set; }
    }
}
