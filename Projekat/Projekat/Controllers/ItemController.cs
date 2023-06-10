using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Projekat.Dto;
using Projekat.Interfaces;
using Projekat.Services;
using System.Data;

namespace Projekat.Controllers
{
    [Route("api/items")]
    [ApiController]
    public class ItemController : ControllerBase
    {
        private readonly IItemService _itemService;

        public ItemController(IItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpPost("create")]
        [Authorize(Roles = "prodavac")]
        public IActionResult CreateItem([FromBody] ItemDto itemCreateDto)
        {
            return Ok(_itemService.CreateItem(itemCreateDto));
        }

        [HttpGet("{sellerId}")]
        [Authorize(Roles = "prodavac")]
        public IActionResult GetItemsBySellerId(long sellerId)
        {
            return Ok(_itemService.GetItemsBySellerId(sellerId));
        }

        [HttpGet("byOrder/{orderId}")]
        [Authorize(Roles = "kupac,prodavac")]
        public IActionResult GetItemsByOrderId(long orderId)
        {
            return Ok(_itemService.GetItemsByOrderId(orderId));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "prodavac")]
        public IActionResult DeleteItem(long id)
        {
            _itemService.DeleteItem(id);
            return Ok();
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "prodavac")]
        public IActionResult UpdateItem(long id, [FromBody] ItemDto itemDto)
        {
            return Ok(_itemService.UpdateItem(id, itemDto));
        }

        [HttpGet("all")]
        [Authorize(Roles = "kupac")]
        public IActionResult GetAll()
        {
            return Ok(_itemService.GetAll());
        }
    }
}
