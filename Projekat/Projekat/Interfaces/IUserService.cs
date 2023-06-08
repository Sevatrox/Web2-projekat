using Projekat.Dto;

namespace Projekat.Interfaces
{
    public interface IUserService
    {
        UserRegisterDto AddUser(UserRegisterDto account);
        string LoginUser(UserLoginDto account);
        UserRegisterDto GetByEmail(string email);
        List<UserRegisterDto> GetByType(int type);
        UserRegisterDto UpdateUser(long id, UserRegisterDto account);

    }
}
