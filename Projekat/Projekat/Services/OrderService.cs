using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Projekat.Dto;
using Projekat.Interfaces;
using Projekat.Models;

namespace Projekat.Services
{
    public class OrderService : IOrderService
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dataContext;
        private readonly IItemService _itemService;

        public OrderService(IMapper mapper, DataContext dataContext, IItemService itemService)
        {
            _mapper = mapper;
            _dataContext = dataContext;
            _itemService = itemService;
        }

        public OrderDto CreateOrder(OrderDto orderDto)
        {
            Order order = _mapper.Map<Order>(orderDto);
            order.Status = OrderStatus.IN_PROCESS;
            _dataContext.Orders.Add(order);
            _dataContext.SaveChanges();

            int counter = 0;
            foreach (var itemId in orderDto.Ids)
            {
                ItemDto item= _itemService.UpdateItemAfterOrder(itemId, orderDto.Amounts[counter]);
                counter++;

                ItemsInsideOrderDto itemOrderDto = new ItemsInsideOrderDto();
                itemOrderDto.ItemId = itemId;
                itemOrderDto.OrderId = order.Id;

                ItemsInsideOrder itemOrder = _mapper.Map<ItemsInsideOrder>(itemOrderDto);

                _dataContext.ItemsInsideOrders.Add(itemOrder); 
                _dataContext.SaveChanges();
            }

            return _mapper.Map<OrderDto>(order);
        }
    }
}
