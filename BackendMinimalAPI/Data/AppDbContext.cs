using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackendMinimalAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendMinimalAPI.Data
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<User> Users => Set<User>();
    }
}