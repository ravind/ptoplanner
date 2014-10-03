using PtoPlanner.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PtoPlanner.Domain.Repos
{
    class EFDbContext : DbContext
    {
        public DbSet<Pto> PtoList { get; set; }
    }
}
