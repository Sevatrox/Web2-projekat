﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Projekat.Dto;
using Projekat.Interfaces;
using System.Data;

namespace Projekat.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public IActionResult CreateUser([FromBody] UserRegisterDto userRegisterDto)
        {
            UserRegisterDto user = _userService.AddUser(userRegisterDto);
            if (user != null)
            {
                return Ok(user);
            }
            else 
            {
                return BadRequest("User with same email address already exists!"); 
            }
        }

        [HttpPost("login")]
        public IActionResult LoginUser([FromBody] UserLoginDto userLoginDto)
        {
            var token = _userService.LoginUser(userLoginDto);
            return token == null ? BadRequest(token) : Ok(token);
        }

        [HttpGet("{email}")]
        [Authorize(Roles = "kupac,admin,prodavac")]
        public IActionResult GetUser(string email)
        {
            return Ok(_userService.GetByEmail(email));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "kupac,admin,prodavac")]
        public IActionResult UpdateUser(long id, [FromBody] UserRegisterDto userRegisterDto)
        {
            UserRegisterDto user = _userService.UpdateUser(id, userRegisterDto);
            if (user != null)
            {
                return Ok(user);
            }
            else
            {
                return BadRequest("User with same email address already exists!");
            }
        }
    }
}
