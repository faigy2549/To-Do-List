using Microsoft.EntityFrameworkCore;
using TodoApi;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("ToDoDB"),
                     new MySqlServerVersion(new Version(8, 0, 23))));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin() // Allows requests from any domain
              .AllowAnyMethod() // Allows any HTTP method (GET/POST/PUT/DELETE, etc.)
              .AllowAnyHeader(); // Allows any HTTP headers
    });
});
 
builder.Services.AddEndpointsApiExplorer(); // This enables the API explorer
builder.Services.AddSwaggerGen(); // This adds Swagger generation

var app = builder.Build();

app.UseCors("AllowAll");

if (app.Environment.IsDevelopment()) // Optionally, enable Swagger only in development
{
    app.UseSwagger(); // Enable Swagger generation
    app.UseSwaggerUI(); // Enable Swagger UI interface
}


app.MapGet("/", () => "Hello World!");
// Route: Get all tasks
app.MapGet("/tasks", async (ToDoDbContext context) =>
{
    return await context.Items.ToListAsync();
});

// Route: Add a new task
app.MapPost("/tasks", async (ToDoDbContext context, Item newItem) =>
{
    context.Items.Add(newItem);
    await context.SaveChangesAsync();
    return Results.Created($"/tasks/{newItem.Id}", newItem);
});

// Route: Update an existing task
app.MapPut("/tasks/{id}", async (ToDoDbContext context, int id, Item updatedItem) =>
{
    var existingItem = await context.Items.FindAsync(id);

    if (existingItem == null)
        return Results.NotFound();

    existingItem.Name = updatedItem.Name;
    existingItem.IsComplete = updatedItem.IsComplete;

    await context.SaveChangesAsync();
    return Results.NoContent();
});

// Route: Delete a task
app.MapDelete("/tasks/{id}", async (ToDoDbContext context, int id) =>
{
    var itemToDelete = await context.Items.FindAsync(id);

    if (itemToDelete == null)
        return Results.NotFound();

    context.Items.Remove(itemToDelete);
    await context.SaveChangesAsync();
    return Results.NoContent();
});


app.Run();
