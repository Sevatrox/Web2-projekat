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
            try
            {
                Item item = _mapper.Map<Item>(itemCreate);
                _dataContext.Items.Add(item);
                _dataContext.SaveChanges();

                return _mapper.Map<ItemDto>(item);
            }
            catch (Exception)
            {
                return null;
            }

        }

        public List<ItemDto> GetItemsBySellerId(long sellerId)
        {
            try
            {
                return _mapper.Map<List<ItemDto>>(_dataContext.Items.ToList().FindAll(x => x.SellerId == sellerId));
            }
            catch (Exception)
            {
                return null;
            }
        }

        public bool DeleteItem(long id)
        {
            try
            {
                Item item = _dataContext.Items.Find(id);

                _dataContext.Items.Remove(item);

                _dataContext.SaveChanges();

                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }

        public ItemDto UpdateItem(long id, ItemDto newItem)
        {
            try
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
            catch (Exception)
            {
                return null;
            }
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
            try
            {
                return _mapper.Map<List<ItemDto>>(_dataContext.Items.ToList());
            }
            catch (Exception)
            {
                return null;
            }
        }

        public ItemDto GetItemById(long id)
        {
            return _mapper.Map<ItemDto>(_dataContext.Items.First(x => x.Id == id));
        }

        public List<ItemDto> GetItemsByOrderId(long orderId)
        {
            try
            {
                List<ItemsInsideOrderDto> itemsInsideOrderDto = _mapper.Map<List<ItemsInsideOrderDto>>(_dataContext.ItemsInsideOrders.ToList().FindAll(x => x.OrderId == orderId));
                List<ItemDto> items = new List<ItemDto>();
                foreach (var item in itemsInsideOrderDto)
                {
                    ItemDto itemDB = GetItemById(item.ItemId);
                    itemDB.Amount = item.Amount;
                    items.Add(itemDB);
                }
                return items;
            }
            catch (Exception)
            {
                return null;
            }

        }
    }
}
