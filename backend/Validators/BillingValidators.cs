using FluentValidation;
using backend.DTOs;

namespace backend.Validators
{
    public class CreateInvoiceDtoValidator : AbstractValidator<CreateInvoiceDto>
    {
        public CreateInvoiceDtoValidator()
        {
            RuleFor(x => x.CustomerId)
                .GreaterThan(0)
                .WithMessage("Customer ID must be greater than 0");

            RuleFor(x => x.DueDate)
                .GreaterThanOrEqualTo(DateTime.Today)
                .WithMessage("Due date must be today or in the future");

            RuleFor(x => x.Items)
                .NotEmpty()
                .WithMessage("Invoice must have at least one item");

            RuleForEach(x => x.Items)
                .SetValidator(new CreateInvoiceItemDtoValidator());

            RuleFor(x => x.Notes)
                .MaximumLength(500)
                .WithMessage("Notes cannot exceed 500 characters");
        }
    }

    public class CreateInvoiceItemDtoValidator : AbstractValidator<CreateInvoiceItemDto>
    {
        public CreateInvoiceItemDtoValidator()
        {
            RuleFor(x => x.Description)
                .NotEmpty()
                .WithMessage("Item description is required")
                .MaximumLength(200)
                .WithMessage("Description cannot exceed 200 characters");

            RuleFor(x => x.Quantity)
                .GreaterThan(0)
                .WithMessage("Quantity must be greater than 0")
                .LessThanOrEqualTo(10000)
                .WithMessage("Quantity cannot exceed 10,000");

            RuleFor(x => x.UnitPrice)
                .GreaterThan(0)
                .WithMessage("Unit price must be greater than 0")
                .LessThanOrEqualTo(1000000)
                .WithMessage("Unit price cannot exceed $1,000,000");
        }
    }

    public class CreateCustomerDtoValidator : AbstractValidator<CreateCustomerDto>
    {
        public CreateCustomerDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Customer name is required")
                .MaximumLength(100)
                .WithMessage("Name cannot exceed 100 characters");

            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage("Email is required")
                .EmailAddress()
                .WithMessage("Invalid email format")
                .MaximumLength(100)
                .WithMessage("Email cannot exceed 100 characters");

            RuleFor(x => x.Phone)
                .MaximumLength(20)
                .WithMessage("Phone cannot exceed 20 characters")
                .Matches(@"^[\+]?[1-9][\d\s\-\(\)]{0,15}$")
                .When(x => !string.IsNullOrEmpty(x.Phone))
                .WithMessage("Invalid phone number format");

            RuleFor(x => x.Address)
                .MaximumLength(500)
                .WithMessage("Address cannot exceed 500 characters");
        }
    }

    public class UpdateCustomerDtoValidator : AbstractValidator<UpdateCustomerDto>
    {
        public UpdateCustomerDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("Customer name is required")
                .MaximumLength(100)
                .WithMessage("Name cannot exceed 100 characters");

            RuleFor(x => x.Email)
                .NotEmpty()
                .WithMessage("Email is required")
                .EmailAddress()
                .WithMessage("Invalid email format")
                .MaximumLength(100)
                .WithMessage("Email cannot exceed 100 characters");

            RuleFor(x => x.Phone)
                .MaximumLength(20)
                .WithMessage("Phone cannot exceed 20 characters")
                .Matches(@"^[\+]?[1-9][\d\s\-\(\)]{0,15}$")
                .When(x => !string.IsNullOrEmpty(x.Phone))
                .WithMessage("Invalid phone number format");

            RuleFor(x => x.Address)
                .MaximumLength(500)
                .WithMessage("Address cannot exceed 500 characters");
        }
    }

    public class InvoiceFilterDtoValidator : AbstractValidator<InvoiceFilterDto>
    {
        public InvoiceFilterDtoValidator()
        {
            RuleFor(x => x.PageNumber)
                .GreaterThan(0)
                .WithMessage("Page number must be greater than 0");

            RuleFor(x => x.PageSize)
                .GreaterThan(0)
                .WithMessage("Page size must be greater than 0")
                .LessThanOrEqualTo(100)
                .WithMessage("Page size cannot exceed 100");

            RuleFor(x => x.Status)
                .Must(BeValidStatus)
                .When(x => !string.IsNullOrEmpty(x.Status))
                .WithMessage("Invalid status. Valid values are: Draft, Sent, Paid, Overdue, Cancelled");

            RuleFor(x => x.DateFrom)
                .LessThanOrEqualTo(x => x.DateTo)
                .When(x => x.DateFrom.HasValue && x.DateTo.HasValue)
                .WithMessage("DateFrom must be less than or equal to DateTo");

            RuleFor(x => x.AmountMin)
                .GreaterThanOrEqualTo(0)
                .When(x => x.AmountMin.HasValue)
                .WithMessage("Minimum amount must be greater than or equal to 0");

            RuleFor(x => x.AmountMax)
                .GreaterThanOrEqualTo(x => x.AmountMin)
                .When(x => x.AmountMin.HasValue && x.AmountMax.HasValue)
                .WithMessage("Maximum amount must be greater than or equal to minimum amount");

            RuleFor(x => x.SortDirection)
                .Must(BeValidSortDirection)
                .When(x => !string.IsNullOrEmpty(x.SortDirection))
                .WithMessage("Invalid sort direction. Valid values are: asc, desc");
        }

        private bool BeValidStatus(string? status)
        {
            if (string.IsNullOrEmpty(status)) return true;
            var validStatuses = new[] { "Draft", "Sent", "Paid", "Overdue", "Cancelled" };
            return validStatuses.Contains(status, StringComparer.OrdinalIgnoreCase);
        }

        private bool BeValidSortDirection(string? direction)
        {
            if (string.IsNullOrEmpty(direction)) return true;
            return direction.Equals("asc", StringComparison.OrdinalIgnoreCase) ||
                   direction.Equals("desc", StringComparison.OrdinalIgnoreCase);
        }
    }
}
