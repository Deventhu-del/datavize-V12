# Supabase Integration Setup Guide

This guide will help you set up Supabase for your AI Agent project with authentication and file storage.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier available at [supabase.com](https://supabase.com))

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `ai-agent-platform` (or your preferred name)
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (usually takes 1-2 minutes)

## Step 2: Get Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - Project URL
   - Anon (public) key
3. Create a `.env.local` file in your project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 3: Set Up Database Tables

Run the following SQL in your Supabase SQL Editor:

### Create users table (extends Supabase auth.users)
```sql
-- Create a custom users table that extends the auth.users
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Create projects table
```sql
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'processing', 'error')),
  total_size BIGINT DEFAULT 0,
  file_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_created_at ON public.projects(created_at);
```

### Create project_files table
```sql
CREATE TABLE public.project_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size BIGINT NOT NULL,
  document_type TEXT NOT NULL,
  page_count INTEGER,
  url TEXT,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view files in own projects" ON public.project_files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = project_files.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create files in own projects" ON public.project_files
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = project_files.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update files in own projects" ON public.project_files
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = project_files.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete files in own projects" ON public.project_files
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = project_files.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX idx_project_files_project_id ON public.project_files(project_id);
CREATE INDEX idx_project_files_created_at ON public.project_files(created_at);
```

## Step 4: Set Up Storage

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `project-files`
3. Set the bucket to private
4. Go to Storage → Policies and add these policies:

### Storage policies for project-files bucket
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

## Step 5: Configure Authentication

1. Go to Authentication → Settings in your Supabase dashboard
2. Configure your site URL (e.g., `http://localhost:3000` for development)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`
4. Go to Authentication → Providers
5. Enable Email provider
6. Optionally enable Google and GitHub OAuth providers

### For Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Add authorized redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret to Supabase

### For GitHub OAuth:
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Add Homepage URL: `http://localhost:3000`
4. Add Authorization callback URL: `https://your-project-ref.supabase.co/auth/v1/callback`
5. Copy Client ID and Client Secret to Supabase

## Step 6: Install Dependencies

Your project should already have the required dependencies installed:

```bash
npm install @supabase/ssr @supabase/supabase-js react-dropzone
```

## Step 7: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`
3. Create a new account or sign in
4. Test file upload functionality in the dashboard

## Features Implemented

### Authentication
- ✅ Email/password authentication
- ✅ OAuth with Google and GitHub
- ✅ Protected routes with middleware
- ✅ User session management
- ✅ Sign out functionality

### File Management
- ✅ File upload with drag & drop
- ✅ Project-based organization
- ✅ File type detection
- ✅ File preview and download
- ✅ File deletion
- ✅ Progress tracking
- ✅ Storage quota management

### Security
- ✅ Row Level Security (RLS) policies
- ✅ User isolation
- ✅ Secure file access
- ✅ Authentication middleware

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check your `.env.local` file has correct values
   - Ensure you're using the anon key, not the service role key

2. **File upload fails**
   - Verify storage bucket exists and is named `project-files`
   - Check storage policies are correctly set
   - Ensure user is authenticated

3. **Authentication redirect loops**
   - Check your site URL in Supabase auth settings
   - Verify redirect URLs are correctly configured

4. **Database connection issues**
   - Ensure your Supabase project is active
   - Check if you've hit any usage limits

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com/)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## Next Steps

After setting up the basic integration, consider:

1. **File Processing**: Add AI-powered document analysis
2. **Search**: Implement full-text search across documents
3. **Collaboration**: Add team sharing and permissions
4. **Analytics**: Track file usage and user activity
5. **Backup**: Set up automated backups and versioning
