using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Projekat.Dto;
using Projekat.Interfaces;
using Projekat.Models;

namespace Projekat.Services
{
    public class VerificationService : IVerificationService
    {

        private readonly IMapper _mapper;
        private readonly DataContext _dataContext;

        public VerificationService(IMapper mapper, DataContext dataContext)
        {
            _mapper = mapper;
            _dataContext = dataContext;
        }

        public VerificationDto CreateVerification(long userId)
        {
            Verification verification = new Verification();
            verification.UserId = userId;
            verification.Status = VerificationStatus.IN_PROCESS;
            _dataContext.Verifications.Add(verification);
            _dataContext.SaveChanges();

            return _mapper.Map<VerificationDto>(verification);
        }

        public List<VerificationDto> GetAll()
        {
            return _mapper.Map<List<VerificationDto>>(_dataContext.Verifications.ToList());
        }

        public VerificationDto GetByUserId(long userId)
        {
            return _mapper.Map<VerificationDto>(_dataContext.Verifications.First(x => x.UserId == userId));
        }

        public VerificationDto UpdateVerification(long id, VerificationDto newVerification)
        {
            Verification noviUser = _mapper.Map<Verification>(newVerification);
            Verification verificationDB = _dataContext.Verifications.Find(id);

            verificationDB.Status = noviUser.Status;
             _dataContext.SaveChanges();

            return _mapper.Map<VerificationDto>(verificationDB);
        }
    }
}
