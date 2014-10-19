using PtoPlanner.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PtoPlanner.Domain.Repos
{
    public class EFSettingsRepository : ISettingsRepository
    {
        private EFDbContext context = new EFDbContext();
        private Services.IdentityService idService = new Services.IdentityService();

        public IEnumerable<int> GetAllYears()
        {
            return context.SettingsList.Where(s => s.PersonId == idService.CurrentUserIdentifier).Select(s => s.SettingsYear).OrderBy(y => y);
        }

        public Settings Get(int settingsYear)
        {
            return context.SettingsList.Where(s => s.PersonId == idService.CurrentUserIdentifier & s.SettingsYear == settingsYear).FirstOrDefault();
        }

        public void Insert(Settings settings)
        {
            settings.PersonId = idService.CurrentUserIdentifier;
            context.SettingsList.Add(settings);
            context.SaveChanges();
        }

        public bool Update(Settings settings)
        {
            bool retVal = false;

            settings.PersonId = idService.CurrentUserIdentifier;
            Settings foundSettings = this.Get(settings.SettingsYear);
            if (foundSettings != null)
            {
                context.Entry(foundSettings).CurrentValues.SetValues(settings);
                context.SaveChanges();
                retVal = true;
            }

            return retVal;
        }

        public bool Delete(int settingsYear)
        {
            bool retVal = false;

            Settings foundSettings = this.Get(settingsYear);
            if (foundSettings != null)
            {
                context.SettingsList.Remove(foundSettings);
                context.SaveChanges();
                retVal = true;
            }

            return retVal;
        }
    }
}
