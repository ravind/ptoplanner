using PtoPlanner.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PtoPlanner.Domain.Repos
{
    public class EFDbContext : DbContext
    {
        public EFDbContext() : base("DefaultConnection") { }
        
        public DbSet<Pto> PtoList { get; set; }

        public DbSet<Settings> SettingsList { get; set; }
    }
}
