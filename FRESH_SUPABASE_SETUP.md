# Fresh Supabase + Prisma Setup Guide

This guide will help you set up a completely fresh Supabase project with Prisma ORM integration for your AI Agent platform.

## 🚀 Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `ai-agent-fresh` (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (usually takes 1-2 minutes)

## 🔑 Step 2: Get Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://abcdefghijklmnop.supabase.co`)
   - **Anon (public) key**
   - **Service Role key** (keep this secret!)
3. Go to **Settings** → **Database**
4. Copy the **Connection string** (you'll need this for Prisma)

## 🗄️ Step 3: Install Dependencies

Run these commands in your project directory:

```bash
# Install Prisma and related packages
npm install @prisma/client
npm install -D prisma tsx

# Generate Prisma client
npm run db:generate
```

## ⚙️ Step 4: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# Database (Prisma)
DATABASE_URL="postgresql://postgres:[YOUR-DB-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]

# Optional: AI Services
OPENAI_API_KEY=[YOUR-OPENAI-API-KEY]
ANTHROPIC_API_KEY=[YOUR-ANTHROPIC-API-KEY]
```

**Replace the placeholders:**
- `[YOUR-DB-PASSWORD]` with your database password
- `[YOUR-PROJECT-REF]` with your project reference (from the URL)
- `[YOUR-ANON-KEY]` with your anon key

## 🗃️ Step 5: Set Up Database Schema

1. **Push the Prisma schema to your database:**
   ```bash
   npm run db:push
   ```

2. **Generate the Prisma client:**
   ```bash
   npm run db:generate
   ```

3. **Seed the database with sample data:**
   ```bash
   npm run db:seed
   ```

## 🔐 Step 6: Configure Supabase Authentication

1. Go to **Authentication** → **Settings** in your Supabase dashboard
2. Configure your site URL: `http://localhost:3000`
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`
4. Go to **Authentication** → **Providers**
5. Enable **Email** provider
6. Optionally enable **Google** and **GitHub** OAuth providers

### For Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Add authorized redirect URIs:
   - `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret to Supabase

### For GitHub OAuth:
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Add Homepage URL: `http://localhost:3000`
4. Add Authorization callback URL: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
5. Copy Client ID and Client Secret to Supabase

## 🗂️ Step 7: Set Up Storage (Optional)

If you want to use Supabase Storage for file uploads:

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket called `project-files`
3. Set the bucket to **private**
4. Go to **Storage** → **Policies** and add these policies:

```sql
-- Allow users to upload files to their own project folders
CREATE POLICY "Users can upload files to own projects" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-files' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to view files in their own project folders
CREATE POLICY "Users can view files in own projects" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'project-files' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to update files in their own project folders
CREATE POLICY "Users can update files in own projects" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'project-files' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete files in their own project folders
CREATE POLICY "Users can delete files in own projects" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-files' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

## 🧪 Step 8: Test the Setup

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Open Prisma Studio to view your database:**
   ```bash
   npm run db:studio
   ```

3. **Navigate to your app:**
   - Go to `http://localhost:3000`
   - Test authentication
   - Create a project
   - Upload files (if storage is configured)

## 📁 Project Structure

Your project now has this structure:

```
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts               # Database seeding
├── lib/
│   ├── prisma.ts             # Prisma client
│   ├── supabase.ts           # Supabase client
│   ├── auth-service.ts       # Authentication service
│   └── project-service.ts    # Project management service
├── .env.local                # Environment variables
└── package.json              # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

## 🚨 Troubleshooting

### Common Issues:

1. **"Cannot find module '@prisma/client'"**
   - Run `npm run db:generate` to generate the client
   - Make sure you've installed `@prisma/client`

2. **Database connection failed**
   - Check your `DATABASE_URL` in `.env.local`
   - Ensure your Supabase project is active
   - Verify the database password is correct

3. **Authentication not working**
   - Check your Supabase URL and anon key
   - Verify redirect URLs in Supabase auth settings
   - Check browser console for errors

4. **Prisma schema push failed**
   - Ensure your database is accessible
   - Check if you have the right permissions
   - Try running `npm run db:generate` first

### Getting Help:

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com/)

## 🎯 Next Steps

After successful setup:

1. **Customize the schema** in `prisma/schema.prisma`
2. **Add more models** for your specific needs
3. **Implement file upload** with Supabase Storage
4. **Add AI integration** for document processing
5. **Set up real-time subscriptions** for live updates
6. **Add user roles and permissions**
7. **Implement search functionality**

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Use Row Level Security (RLS) policies in Supabase
- Validate all user inputs
- Implement proper error handling
- Use HTTPS in production

---

🎉 **Congratulations!** You now have a fresh, modern Supabase + Prisma setup that's much more maintainable and scalable than the previous version.
