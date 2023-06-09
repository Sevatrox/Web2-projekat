using Microsoft.AspNetCore.Mvc;
using Projekat.Dto;

namespace Projekat.Interfaces
{
    public interface IOrderService
    {
        OrderDto CreateOrder(OrderDto orderDto);
    }
}
