export const GetItem =  () =>
{
    return JSON.parse(localStorage.getItem('item'));
}

export const SetItem =  (item) =>
{
    localStorage.setItem('item', JSON.stringify(item));
}