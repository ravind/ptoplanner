using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PtoPlanner.Domain.Repos
{
    public class EFPtoRepository : IPtoRepository
    {
        private EFDbContext context = new EFDbContext();
        
        public IEnumerable<Entities.Pto> PtoList
        {
            get { return context.PtoList; }
        }
    }
}
