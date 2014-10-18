﻿using PtoPlanner.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PtoPlanner.Domain.Repos
{
    public class EFPtoRepository : IPtoRepository
    {
        private EFDbContext context = new EFDbContext();
        private Services.IdentityService idService = new Services.IdentityService();
        
        public IEnumerable<Entities.Pto> PtoList
        {
            get { return context.PtoList.Where(p => p.PersonId == idService.CurrentUserIdentifier).OrderBy(p => p.StartDate); }
        }

        public void Insert(Pto ptoItem)
        {
            ptoItem.PtoId = 0;
            ptoItem.PersonId = idService.CurrentUserIdentifier;
            context.PtoList.Add(ptoItem);
            context.SaveChanges();
        }

        public bool Update(Pto ptoItem)
        {
            bool retVal = false;

            Pto foundItem = FindPtoById(ptoItem.PtoId);
            if (foundItem != null)
            {
                context.Entry(foundItem).CurrentValues.SetValues(ptoItem);
                context.SaveChanges();
                retVal = true;
            }

            return retVal;
        }

        public bool Delete(int ptoId)
        {
            bool retVal = false;
            
            Pto foundItem = FindPtoById(ptoId);
            if (foundItem != null)
            {
                context.PtoList.Remove(foundItem);
                context.SaveChanges();
                retVal = true;
            }

            return retVal;
        }

        private Pto FindPtoById(int ptoId)
        {
            return context.PtoList.Where(p => p.PtoId == ptoId & p.PersonId == idService.CurrentUserIdentifier).FirstOrDefault();
        }
    }
}
