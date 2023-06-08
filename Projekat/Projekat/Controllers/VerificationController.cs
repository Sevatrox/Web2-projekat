using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Projekat.Dto;
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

        [HttpGet("all")]
        [Authorize(Roles = "admin")]
        public IActionResult GetAll()
        {
            return Ok(_verificationService.GetAll());
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult UpdateVerification(long id, [FromBody] VerificationDto verificationDto)
        {
            return Ok(_verificationService.UpdateVerification(id, verificationDto));
        }
    }
}
