using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Reflection;
using backend.Models;
using backend.Services;
using backend.Mappings;
using FluentValidation;

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/billing-api-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

try
{
    var builder = WebApplication.CreateBuilder(args);

    // Add Serilog
    builder.Host.UseSerilog();

    // Add services to the container.
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    
    // Configure Swagger
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "Billing Management API",
            Version = "v1",
            Description = "A comprehensive billing management system API",
            Contact = new OpenApiContact
            {
                Name = "Support Team",
                Email = "support@billing.com"
            }
        });

        // Include XML comments
        var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
        var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
        if (File.Exists(xmlPath))
        {
            c.IncludeXmlComments(xmlPath);
        }
    });

    // Add Entity Framework with In-Memory Database
    builder.Services.AddDbContext<BillingContext>(opt =>
        opt.UseInMemoryDatabase("BillingDb"));

    // Add CORS
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowReactApp", policy =>
        {
            policy.WithOrigins(
                "http://localhost:3000",
                "https://localhost:3000",
                "http://localhost:3001",
                "https://localhost:3001"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        });
    });

        // Add AutoMapper
    builder.Services.AddAutoMapper(typeof(BillingMappingProfile));

    // Add FluentValidation
    builder.Services.AddValidatorsFromAssemblyContaining<Program>();

    // Add application services
    builder.Services.AddScoped<IBillingService, BillingService>();
    builder.Services.AddScoped<IDashboardService, DashboardService>();

    // Add health checks
    builder.Services.AddHealthChecks();

    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Billing API V1");
            c.RoutePrefix = string.Empty; // Serve Swagger UI at app's root
        });
    }

    // Add security headers
    app.Use(async (context, next) =>
    {
        context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
        context.Response.Headers.Add("X-Frame-Options", "DENY");
        context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
        await next();
    });

    app.UseHttpsRedirection();
    app.UseCors("AllowReactApp");
    app.UseAuthentication();
    app.UseAuthorization();
    
    // Add health check endpoint
    app.MapHealthChecks("/health");
    
    app.MapControllers();

    // Seed data
    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<BillingContext>();
        SeedData.Initialize(context);
    }

    Log.Information("Billing API starting up");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
