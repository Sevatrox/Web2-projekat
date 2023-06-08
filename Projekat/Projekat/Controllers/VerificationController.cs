using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Projekat.Interfaces;
using Projekat.Services;
using System.Data;

namespace Projekat.Controllers
{
    [Route("api/verifications")]
    [ApiController]
    public class VerificationController : ControllerBase
    {
        private readonly IVerificationService _verificationService;

        public VerificationController(IVerificationService verificationService)
        {
            _verificationService = verificationService;
        }

        [HttpGet("{userId}")]
        [Authorize(Roles = "admin,prodavac")]
        public IActionResult GetVerification(long userId)
        {
            return Ok(_verificationService.GetByUserId(userId));
        }
    }
}
