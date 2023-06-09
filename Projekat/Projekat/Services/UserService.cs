using AutoMapper;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Projekat.Dto;
using Projekat.Interfaces;
using Projekat.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Projekat.Services
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dataContext;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IVerificationService _verificationService;

        private string SecretKey { get; set; }

        public UserService(IMapper mapper, DataContext dataContext, IWebHostEnvironment hostEnvironment, IConfiguration config, IVerificationService verificationService)
        {
            _mapper = mapper;
            _dataContext = dataContext;
            _hostEnvironment = hostEnvironment;
            SecretKey = config.GetSection("Authentication:SecretKey").Value;
            _verificationService = verificationService;
        }

        public UserRegisterDto AddUser(UserRegisterDto account)
        {
            User user = _mapper.Map<User>(account);

            try
            {
                if (_dataContext.Users.First(x => x.Email == account.Email) != null)
                    return null;
            }
            catch (Exception ex)
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                //user.Picture = SaveImage(account.PictureFile);
                _dataContext.Users.Add(user);
                _dataContext.SaveChanges();

                if(user.Type == UserType.SELLER)
                    _verificationService.CreateVerification(user.Id);
            }
            return _mapper.Map<UserRegisterDto>(user);

        }

        public string LoginUser(UserLoginDto account)
        {
            User user;
            try
            {
                user = _dataContext.Users.First(x => x.Email == account.Email);

                if (BCrypt.Net.BCrypt.Verify(account.Password, user.Password))//Uporedjujemo hes pasvorda iz baze i unetog pasvorda
                {
                    List<Claim> claims = new List<Claim>();
                    //Mozemo dodati Claimove u token, oni ce biti vidljivi u tokenu i mozemo ih koristiti za autorizaciju
                    if (user.Type == UserType.ADMIN)
                        claims.Add(new Claim(ClaimTypes.Role, "admin")); //Add user type to claim
                    if (user.Type == UserType.BUYER)
                        claims.Add(new Claim(ClaimTypes.Role, "kupac")); //Add user type to claim
                    if (user.Type == UserType.SELLER)
                        claims.Add(new Claim(ClaimTypes.Role, "prodavac")); //Add user type to claim

                    //Kreiramo kredencijale za potpisivanje tokena. Token mora biti potpisan privatnim kljucem
                    //kako bi se sprecile njegove neovlascene izmene
                    SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
                    var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                    var tokeOptions = new JwtSecurityToken(
                        issuer: "http://localhost:7194", //url servera koji je izdao token
                        claims: claims, //claimovi
                        expires: DateTime.Now.AddMinutes(20), //vazenje tokena u minutama
                        signingCredentials: signinCredentials //kredencijali za potpis
                    );
                    string tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
                    return tokenString;
                }
                else
                {
                    return null;
                }
            }
            catch(Exception e)
            {
                return null;
            }
      
        }

        public UserRegisterDto GetByEmail(string email)
        {
            return _mapper.Map<UserRegisterDto>(_dataContext.Users.First(x => x.Email == email));
        }

        public List<UserRegisterDto> GetByType(int type)
        {
            UserType filterType;
            if (type == 0)
                filterType = UserType.ADMIN;
            else if (type == 1)
                filterType = UserType.BUYER;
            else
                filterType = UserType.SELLER;

            return _mapper.Map<List<UserRegisterDto>>(_dataContext.Users.ToList().FindAll(x => x.Type == filterType));
        }

        public UserRegisterDto GetUserById(long id)
        {
            return _mapper.Map<UserRegisterDto>(_dataContext.Users.Find(id));
        }

        public UserRegisterDto UpdateUser(long id, UserRegisterDto newUser)
        {
            User noviUser = _mapper.Map<User>(newUser);
            User userDB = _dataContext.Users.Find(id);

            try
            {
                if (_dataContext.Users.First(x => x.Email == noviUser.Email && x.Id != userDB.Id) != null)
                    return null;
            }
            catch (Exception ex)
            {
                noviUser.Password = BCrypt.Net.BCrypt.HashPassword(noviUser.Password);
                //user.Picture = SaveImage(account.PictureFile);
                userDB.Email = noviUser.Email;
                userDB.Password = noviUser.Password;
                userDB.Name = noviUser.Name;
                userDB.Surname = noviUser.Surname;
                userDB.Username = noviUser.Username;
                userDB.Date = noviUser.Date;
                userDB.Address = noviUser.Address;
                userDB.Picture = noviUser.Picture;

                _dataContext.SaveChanges();
            }

            return _mapper.Map<UserRegisterDto>(userDB);
        }

        public string SaveImage(IFormFile imageFile)
        {
            string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName).Take(10).ToArray()).Replace(' ', '-');
            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetFileNameWithoutExtension(imageFile.FileName);
            var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "Images", imageName);
            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                imageFile.CopyToAsync(fileStream);
            }
            return imageName;
        }


    }
}
