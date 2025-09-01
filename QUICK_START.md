

# 🚀 Quick Start Guide

Get your fresh Supabase + Prisma project running in 5 minutes!

## ⚡ Quick Setup

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com)
- Create new project: `ai-agent-fresh`
- Save your database password!

### 2. Get Credentials
- **Project URL**: `https://[PROJECT-REF].supabase.co`
- **Anon Key**: Copy from Settings → API
- **Database URL**: Copy from Settings → Database

### 3. Set Environment Variables
Create `.env.local`:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ANON-KEY]
```

### 4. Initialize Database
```bash
npm run db:init
```

### 5. Start Development
```bash
npm run dev
```

🎉 **You're ready!** Visit `http://localhost:3000`

## 🔧 What Just Happened?

The `db:init` script automatically:
- ✅ Generated Prisma client
- ✅ Pushed database schema
- ✅ Seeded with sample data
- ✅ Set up all tables and relationships

## 📱 Test Your Setup

1. **Authentication**: Try signing up/signing in
2. **Projects**: Create a new project
3. **Database**: Open `npm run db:studio` to view data
4. **API**: Check browser console for any errors

## 🆘 Need Help?

- **Full Setup Guide**: See `FRESH_SUPABASE_SETUP.md`
- **Troubleshooting**: Check the troubleshooting section
- **Prisma Studio**: `npm run db:studio` to inspect database

---

**Next**: Customize your schema in `prisma/schema.prisma` and build your AI agent features!
