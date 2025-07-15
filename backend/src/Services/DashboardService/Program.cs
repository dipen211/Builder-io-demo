using BillingSystem.Shared.Common.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add common services
builder.Services.AddCommonServices(builder.Configuration);

// Add controllers
builder.Services.AddControllers();

// Add CORS
builder.Services.AddCorsPolicy();

// Add Swagger
builder.Services.AddSwaggerDocumentation("Dashboard Service API", "v1");

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Dashboard Service V1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();
app.UseCors("DefaultCorsPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

app.Run("http://localhost:7003");
