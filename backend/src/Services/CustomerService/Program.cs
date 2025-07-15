using Microsoft.EntityFrameworkCore;
using BillingSystem.CustomerService.Data;
using BillingSystem.CustomerService.Repositories;
using BillingSystem.CustomerService.Services;
using BillingSystem.Shared.Common.Extensions;
using BillingSystem.Shared.EventBus.Interfaces;
using BillingSystem.Shared.EventBus;

var builder = WebApplication.CreateBuilder(args);

// Add common services
builder.Services.AddCommonServices(builder.Configuration);

// Add controllers
builder.Services.AddControllers();

// Add CORS
builder.Services.AddCorsPolicy();

// Add Swagger
builder.Services.AddSwaggerDocumentation("Customer Service API", "v1");

// Add Entity Framework
builder.Services.AddDbContext<CustomerDbContext>(opt =>
    opt.UseInMemoryDatabase("CustomerDb"));

// Add repositories
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();

// Add business services
builder.Services.AddScoped<ICustomerBusinessService, CustomerBusinessService>();

// Add event bus
builder.Services.AddSingleton<IEventBus, InMemoryEventBus>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Customer Service V1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();
app.UseCors("DefaultCorsPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

// Seed data
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<CustomerDbContext>();
    context.Database.EnsureCreated();
}

app.Run("http://localhost:7001");
