using PtoPlanner.Domain.Entities;
using System.Collections.Generic;

namespace PtoPlanner.Domain.Repos
{
    public interface ISettingsRepository
    {
        IEnumerable<int> GetAllYears();
        
        Settings Get(int settingsYear);

        void Insert(Settings settings);

        bool Update(Settings settings);

        bool Delete(int settingsYear);
    }
}
