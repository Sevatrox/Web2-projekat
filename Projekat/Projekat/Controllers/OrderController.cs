using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Projekat.Dto;
using Projekat.Interfaces;
using Projekat.Services;
using System.Data;

namespace Projekat.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost("create")]
        [Authorize(Roles = "kupac")]
        public IActionResult CreateOrder([FromBody] OrderDto orderDto)
        {
            return Ok(_orderService.CreateOrder(orderDto));
        }

        [HttpGet("buyer/{buyerId}")]
        [Authorize(Roles = "kupac")]
        public IActionResult GetOrdersByBuyerId(long buyerId)
        {
            return Ok(_orderService.GetOrdersByBuyerId(buyerId));
        }

        [HttpGet("newOrders/{sellerId}")]
        [Authorize(Roles = "prodavac")]
        public IActionResult GetNewOrdersBySellerId(long sellerId)
        {
            return Ok(_orderService.GetNewOrdersBySellerId(sellerId));
        }

        [HttpGet("pastOrders/{sellerId}")]
        [Authorize(Roles = "prodavac")]
        public IActionResult GetPastOrdersBySellerId(long sellerId)
        {
            return Ok(_orderService.GetPastOrdersBySellerId(sellerId));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "kupac")]
        public IActionResult DeleteOrder(long id)
        {
            _orderService.DeleteOrder(id);
            return Ok();
        }
    }
}
