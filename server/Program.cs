using server.Extensions;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

// Use your extension methods here:
builder.Services
    .AddDatabase(configuration.GetConnectionString("DefaultConnection"))
    .AddJwtAuthentication(configuration)
    .AddSwaggerDocumentation()
    .AddCorsPolicy(configuration["FrontendUrls"])
    .AddProjectServices();

builder.Services.AddControllers();
builder.Services.AddSignalR();

var app = builder.Build();

app.UseCors("CorsPolicy");
app.MapHub<ChatHub>("/chathub");

app.UseAuthentication();
app.UseAuthorization();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Online mobile recharge API v1");
});

app.MapControllers();

app.Run();
