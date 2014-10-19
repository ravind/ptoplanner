using PtoPlanner.Domain.Entities;
using System.Collections.Generic;

namespace PtoPlanner.Domain.Repos
{
    public interface IPtoRepository
    {
        IEnumerable<Pto> GetPtoList(int year);

        void Insert(Pto ptoItem);

        bool Update(Pto ptoItem);

        bool Delete(int ptoId);
    }
}
