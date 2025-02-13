using System.Collections.Immutable;
using BackendMinimalAPI.Data;
using BackendMinimalAPI.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios al contenedor
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Configuración para soportar JWT Bearer Token
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Ingrese el token JWT en el campo 'Bearer {token}'"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});


// Configurar SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Habilitar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});


// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger(); // Genera el archivo swagger.json
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"); // Configura la UI
        c.RoutePrefix = string.Empty; // Hace que Swagger esté en la raíz (http://localhost:5000/)
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseSwagger();
app.UseSwaggerUI();


//CRUD de Usuarios
app.MapGet("/users", async (AppDbContext db) =>
{
    try
    {
        var users = await db.Users.ToListAsync();
        return Results.Ok(users);
    }
    catch (Exception ex)
    {
        return Results.Problem("No se pudo obtener los usuarios. Error: " + ex.Message);
    }
});


app.MapGet("/users/{id}", async (int id, AppDbContext db) =>
{
    try
    {
        var user = await db.Users.FindAsync(id);
        if (user == null)
        {
            return Results.NotFound($"No se encontró un usuario con el ID {id}.");
        }
        return Results.Ok(user);
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al obtener el usuario. Detalles: {ex.Message}");
    }
});


app.MapPost("/users", async (User user, AppDbContext db) =>
{
    try
    {
        // Verificar si ya existe un usuario con el mismo UserName
        if (await db.Users.AnyAsync(u => u.Name == user.Name))
        {
            return Results.BadRequest("Ya existe un usuario con ese nombre.");
        }
        // Verificar si ya existe un usuario con el mismo Email
        if (await db.Users.AnyAsync(u => u.Email == user.Email))
        {
            return Results.BadRequest("Ya existe un usuario con ese correo electrónico.");
        }

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return Results.Created($"/users/{user.Id}", new
        {
            Message = "Usuario creado con éxito",
            User = user
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al crear el usuario. Detalles: {ex.Message}");
    }
});


app.MapPut("/users/{id}", async (int id, User user, AppDbContext db) =>
{
    try
    {
        // Verificar si el usuario existe
        var existingUser = await db.Users.FindAsync(id);
        if (existingUser is null)
        {
            return Results.NotFound($"No se encontró un usuario con el ID {id}.");
        }

        // Verificar si ya existe un usuario con el mismo correo (excluyendo al usuario actual)
        if (await db.Users.AnyAsync(u => u.Email == user.Email && u.Id != id))
        {
            return Results.BadRequest("Ya existe un usuario con ese correo electrónico.");
        }

        // Verificar si ya existe un usuario con el mismo nombre (excluyendo al usuario actual)
        if (await db.Users.AnyAsync(u => u.Name == user.Name && u.Id != id))
        {
            return Results.BadRequest("Ya existe un usuario con ese nombre.");
        }

        // Actualizar los datos del usuario
        existingUser.Name = user.Name;
        existingUser.Email = user.Email;
        await db.SaveChangesAsync();

        return Results.Ok(new
        {
            Message = "Usuario actualizado con éxito",
            User = existingUser
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al actualizar el usuario. Detalles: {ex.Message}");
    }
});


app.MapDelete("/users/{id}", async (int id, AppDbContext db) =>
{
    try
    {
        // Buscar el usuario en la base de datos
        var user = await db.Users.FindAsync(id);
        if (user is null)
        {
            return Results.NotFound($"No se encontró un usuario con el ID {id}.");
        }

        // Eliminar el usuario
        db.Users.Remove(user);
        await db.SaveChangesAsync();

        return Results.Ok(new
        {
            Message = "Usuario eliminado con éxito",
            UserId = id
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error al eliminar el usuario. Detalles: {ex.Message}");
    }
});

app.Run();





