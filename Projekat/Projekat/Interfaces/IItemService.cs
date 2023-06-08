using Microsoft.AspNetCore.Mvc;
using Projekat.Dto;

namespace Projekat.Interfaces
{
    public interface IItemService
    {
        ItemDto CreateItem(ItemDto itemCreate);
        List<ItemDto> GetItemsBySellerId(long sellerId);
        void DeleteItem(long id);
        ItemDto UpdateItem(long id, ItemDto itemDto);
    }
}
