using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Projekat.Data;
using Projekat.Dto;
using Projekat.Interfaces;
using Projekat.Models;

namespace Projekat.Services
{
    public class ItemService : IItemService
    {

        private readonly IMapper _mapper;
        private readonly DataContext _dataContext;

        public ItemService(IMapper mapper, DataContext dataContext)
        {
            _mapper = mapper;
            _dataContext = dataContext;
        }

        public ItemDto CreateItem(ItemDto itemCreate)
        {
            Item item = _mapper.Map<Item>(itemCreate);
            _dataContext.Items.Add(item);
            _dataContext.SaveChanges();

            return _mapper.Map<ItemDto>(item);
        }

        public List<ItemDto> GetItemsBySellerId(long sellerId)
        {
            return _mapper.Map<List<ItemDto>>(_dataContext.Items.ToList().FindAll(x => x.SellerId == sellerId));
        }

        public void DeleteItem(long id)
        {
            Item item = _dataContext.Items.Find(id);

            _dataContext.Items.Remove(item);

            _dataContext.SaveChanges();
        }

        public ItemDto UpdateItem(long id, ItemDto newItem)
        {
            Item noviUser = _mapper.Map<Item>(newItem);
            Item itemDB = _dataContext.Items.Find(id);

            itemDB.Name = noviUser.Name;
            itemDB.Price = noviUser.Price;
            itemDB.Picture = noviUser.Picture;
            itemDB.Amount = noviUser.Amount;
            itemDB.Description = noviUser.Description;

            _dataContext.SaveChanges();

            return _mapper.Map<ItemDto>(itemDB);
        }

        public ItemDto UpdateItemAfterOrder(long id, int amount)
        {
            Item itemDB = _dataContext.Items.Find(id);
            itemDB.Amount -= amount;
            _dataContext.SaveChanges();

            return _mapper.Map<ItemDto>(itemDB);
        }


        public List<ItemDto> GetAll()
        {
            return _mapper.Map<List<ItemDto>>(_dataContext.Items.ToList());
        }

        public ItemDto GetItemById(long id)
        {
            return _mapper.Map<ItemDto>(_dataContext.Items.First(x => x.Id == id));
        }

        public List<ItemDto> GetItemsByOrderId(long orderId)
        {
            List<ItemsInsideOrderDto> itemsInsideOrderDto = _mapper.Map<List<ItemsInsideOrderDto>>(_dataContext.ItemsInsideOrders.ToList().FindAll(x => x.OrderId == orderId));
            List<ItemDto> items = new List<ItemDto>();
            foreach (var item in itemsInsideOrderDto)
            {
                items.Add(GetItemById(item.ItemId));
            }
            return items;
        }
    }
}
