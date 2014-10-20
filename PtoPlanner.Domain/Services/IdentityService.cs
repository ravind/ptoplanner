using System;
using System.Security.Claims;
using System.Threading;

namespace PtoPlanner.Domain.Services
{
    public class IdentityService
    {
        public string CurrentUserIdentifier
        {
            get 
            {
                if (!ClaimsPrincipal.Current.Identity.IsAuthenticated)
                {
                    throw new Exception("User is not authenticated");
                }

                Claim idClaim = ClaimsPrincipal.Current.FindFirst(ClaimTypes.NameIdentifier);
                if (idClaim == null)
                    throw new Exception("ClaimsPrincipal missing ClaimType of NameIdentifier");
                else
                    return idClaim.Value;
            }
        }
    }
}
