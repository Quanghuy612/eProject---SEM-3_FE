using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;
using server.Services;
using System.Security.Claims;

namespace server.Controllers
{
    [ApiController]
    [Route("api/v1/special-service-packages")]
    public class SvcPackageController : BaseApiController
    {
        private readonly SpecialServicePackageService _service;
        private readonly DatabaseContext _dbContext;

        public SvcPackageController(SpecialServicePackageService service, DatabaseContext dbContext)
        {
            _service = service;
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return ToActionResult(result);
        }
    }
}
