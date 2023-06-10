using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Projekat.Dto;
using Projekat.Interfaces;
using Projekat.Models;
using System.Collections.Generic;
using System.Globalization;

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
            DateTime orderTime = DateTime.ParseExact(order.OrderTime, "M/d/yyyy, h:mm:ss tt", CultureInfo.InvariantCulture);
            int rng = GetNumber();
            DateTime targetTime = orderTime.AddMinutes(rng);
            order.OrderArriving = targetTime.ToString("M/d/yyyy, h:mm:ss tt", CultureInfo.InvariantCulture);

            _dataContext.Orders.Add(order);
            _dataContext.SaveChanges();

            int counter = 0;
            foreach (var itemId in orderDto.Ids)
            {
                ItemDto item= _itemService.UpdateItemAfterOrder(itemId, orderDto.Amounts[counter]);

                ItemsInsideOrderDto itemOrderDto = new ItemsInsideOrderDto();
                itemOrderDto.ItemId = itemId;
                itemOrderDto.OrderId = order.Id;
                itemOrderDto.Amount = orderDto.Amounts[counter];

                ItemsInsideOrder itemOrder = _mapper.Map<ItemsInsideOrder>(itemOrderDto);

                _dataContext.ItemsInsideOrders.Add(itemOrder); 
                _dataContext.SaveChanges();

                counter++;
            }

            return _mapper.Map<OrderDto>(order);
        }

        public List<OrderCancelCheckDto> GetOrdersByBuyerId(long buyerId)
        {
            List<Order> orders = _dataContext.Orders.ToList().FindAll(x => x.BuyerId == buyerId && x.Status != OrderStatus.CANCELED);
            List<int> otkazi = new List<int>();
            int otkaz = 0;
            foreach (var order in orders)
            {
                if(order.Status == OrderStatus.IN_PROCESS)
                {
                    Tuple<int, int> rezultat = CalculateTime(order.OrderTime, order.OrderArriving, otkaz);

                    if(rezultat.Item1 == 1)
                        otkazi.Add(1);
                    else
                        otkazi.Add(0);
                    otkaz = 0;

                    if(rezultat.Item2 == 1)
                    {
                        order.Status = OrderStatus.DONE;
                        _dataContext.SaveChanges();
                    }
                }
                else
                    otkazi.Add(0);
            }
            List<OrderCancelCheckDto> orderCancelCheckDtos = _mapper.Map<List<OrderCancelCheckDto>>(orders);
            int counter = 0;
            foreach (var order in orderCancelCheckDtos)
            {
                order.Cancel = otkazi[counter];
                counter++;
            }

            return orderCancelCheckDtos;
        }

        public List<OrderDto> GetNewOrdersBySellerId(long sellerId)
        {
            List<Order> orders = _dataContext.Orders.ToList().FindAll(x => x.SellerId == sellerId && x.Status != OrderStatus.CANCELED);
            List<OrderDto> orderDtos = new List<OrderDto>();

            foreach (var order in orders)
            {
                if (order.Status == OrderStatus.IN_PROCESS)
                {
                    int temp = -1;
                    Tuple<int, int> rezultat = CalculateTime(order.OrderTime, order.OrderArriving, temp);

                    if (rezultat.Item2 == 1)
                    {
                        order.Status = OrderStatus.DONE;
                        _dataContext.SaveChanges();
                    }
                    else
                        orderDtos.Add(_mapper.Map<OrderDto>(order));
                }
            }

            return orderDtos;
        }

        public List<OrderDto> GetPastOrdersBySellerId(long sellerId)
        {
            List<Order> orders = _dataContext.Orders.ToList().FindAll(x => x.SellerId == sellerId && x.Status == OrderStatus.DONE);
            return _mapper.Map<List<OrderDto>>(orders);
        }

        public OrderDto DeleteOrder(long id)
        {
            List<ItemsInsideOrder> itemsInsideOrder = _dataContext.ItemsInsideOrders.ToList().FindAll(x => x.OrderId == id);
            foreach (var item in itemsInsideOrder)
            {
                Item itemDB = _dataContext.Items.Find(item.ItemId);
                itemDB.Amount += item.Amount;
                _dataContext.SaveChanges();
            }

            Order order = _dataContext.Orders.Find(id);
            order.Status = OrderStatus.CANCELED;
            _dataContext.SaveChanges();

            return _mapper.Map<OrderDto>(order);
        }

        public static Tuple<int, int> CalculateTime(string orderTime, string orderArriving, int otkaz)
        {
            DateTime orderDateTime = DateTime.ParseExact(orderTime, "M/d/yyyy, h:mm:ss tt", CultureInfo.InvariantCulture);
            DateTime targetTime = DateTime.ParseExact(orderArriving, "M/d/yyyy, h:mm:ss tt", CultureInfo.InvariantCulture);
            DateTime currentTime = DateTime.Now;
            int delivered = 0;

            if (targetTime < currentTime)
            {
                delivered = 1;
            }
            else if (currentTime < orderDateTime.AddHours(1))
            {
                otkaz = 1;
            }

            Tuple<int, int> rezultat = new Tuple<int, int>(otkaz, delivered);
            return rezultat;
        }

        public int GetNumber()
        {
            Random random = new Random();
            int randomNumber = random.Next(60, 181);
            return randomNumber;
        }
    }
}
