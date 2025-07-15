using AutoMapper;
using backend.DTOs;
using backend.Models;

namespace backend.Mappings
{
    public class BillingMappingProfile : Profile
    {
        public BillingMappingProfile()
        {
            // Invoice mappings
            CreateMap<Invoice, InvoiceDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

                        CreateMap<CreateInvoiceDto, Invoice>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.InvoiceNumber, opt => opt.Ignore())
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => DateTime.Now))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => InvoiceStatus.Draft))
                .ForMember(dest => dest.Customer, opt => opt.Ignore())
                .ForMember(dest => dest.SubTotal, opt => opt.Ignore())
                .ForMember(dest => dest.TaxAmount, opt => opt.Ignore())
                .ForMember(dest => dest.Total, opt => opt.Ignore());

            // Invoice Item mappings
            CreateMap<InvoiceItem, InvoiceItemDto>();

            CreateMap<CreateInvoiceItemDto, InvoiceItem>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.InvoiceId, opt => opt.Ignore())
                .ForMember(dest => dest.Invoice, opt => opt.Ignore())
                .ForMember(dest => dest.Total, opt => opt.MapFrom(src => src.Quantity * src.UnitPrice));

            // Customer mappings
            CreateMap<Customer, CustomerDto>()
                .ForMember(dest => dest.TotalInvoices, opt => opt.MapFrom(src => src.Invoices.Count))
                .ForMember(dest => dest.TotalAmount, opt => opt.MapFrom(src => src.Invoices.Sum(i => i.Total)));

            CreateMap<CreateCustomerDto, Customer>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Invoices, opt => opt.Ignore());

            CreateMap<UpdateCustomerDto, Customer>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Invoices, opt => opt.Ignore());
        }
    }
}
