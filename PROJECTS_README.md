# Projects System - Knowledge Base

This document describes the new projects system for the Knowledge Base that displays all projects from Supabase using modular and simple components built with shadcn/ui.

## Overview

The projects system provides a comprehensive interface for managing document projects, including:
- Viewing all projects from Supabase
- Creating new projects
- Managing project metadata
- Viewing project statistics
- Responsive grid layout for projects

## Components Structure

### Core Components

1. **ProjectsOverview** (`components/knowledgebase/projects-overview.tsx`)
   - Main container component
   - Handles loading states, errors, and project operations
   - Integrates with the projects hook

2. **ProjectsGrid** (`components/knowledgebase/projects-grid.tsx`)
   - Displays projects in a responsive grid
   - Handles empty state
   - Shows project count and total size

3. **ProjectCard** (`components/knowledgebase/project-card.tsx`)
   - Individual project display card
   - Shows project metadata, file count, size, and status
   - Includes action buttons (view files, edit, delete)

4. **ProjectStats** (`components/knowledgebase/project-stats.tsx`)
   - Displays key metrics about projects
   - Shows total projects, files, storage used, and active projects

5. **EmptyProjectsState** (`components/knowledgebase/empty-projects-state.tsx`)
   - Beautiful empty state when no projects exist
   - Includes call-to-action buttons and supported file types

### Supporting Components

6. **CreateProjectDialog** (`components/knowledgebase/dialogs/create-project.tsx`)
   - Modal for creating new projects
   - File upload support with drag & drop
   - Form validation using Zod

7. **LoadingSpinner** (`components/ui/loading-spinner.tsx`)
   - Simple loading indicator component

8. **ErrorDisplay** (`components/ui/error-display.tsx`)
   - Error message display with retry functionality

## Data Layer

### Project Service (`lib/project-service.ts`)
- Handles all Supabase operations
- CRUD operations for projects
- File management
- Data mapping between DB and frontend

### Projects Hook (`hooks/use-projects.ts`)
- Manages projects state
- Provides project operations (create, update, delete)
- Handles loading and error states
- Automatic data fetching

## Database Schema

The system works with the following Supabase tables:

```sql
-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'active',
  total_size BIGINT DEFAULT 0,
  file_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Project files table
CREATE TABLE project_files (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size BIGINT NOT NULL,
  document_type TEXT NOT NULL,
  page_count INTEGER,
  url TEXT,
  project_id UUID REFERENCES projects(id),
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);
```

## Features

### ✅ Implemented
- [x] Fetch all projects from Supabase
- [x] Display projects in responsive grid
- [x] Project statistics dashboard
- [x] Create new projects
- [x] Delete projects
- [x] Loading states and error handling
- [x] Empty state for no projects
- [x] Responsive design
- [x] File upload support in project creation
- [x] Project metadata display

### 🚧 In Progress / TODO
- [ ] Edit project functionality
- [ ] File management within projects
- [ ] Project search and filtering
- [ ] Project sorting options
- [ ] Bulk operations
- [ ] Project templates

## Usage

### Basic Implementation

```tsx
import ProjectsOverview from "@/components/knowledgebase/projects-overview";

const KnowledgePage = () => {
  return (
    <div>
      <h1>Knowledge Base</h1>
      <ProjectsOverview />
    </div>
  );
};
```

### Custom Project Operations

```tsx
import { useProjects } from "@/hooks/use-projects";

const MyComponent = () => {
  const { 
    projects, 
    loading, 
    error, 
    createProject, 
    deleteProject 
  } = useProjects();

  const handleCreate = async () => {
    await createProject({
      name: "My New Project",
      description: "Project description"
    });
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
  };

  // ... rest of component
};
```

## Styling

The system uses:
- **shadcn/ui** components for consistent design
- **Tailwind CSS** for responsive layouts
- **Lucide React** for icons
- **CSS Grid** for responsive project layouts

## Environment Variables

Ensure these Supabase environment variables are set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own projects
- File uploads restricted to user's project folders
- Proper authentication checks in place

## Performance

- Efficient data fetching with proper indexing
- Lazy loading of project files
- Optimized re-renders with React hooks
- Minimal bundle size with tree-shaking

## Contributing

When adding new features:
1. Follow the existing component structure
2. Use TypeScript interfaces for type safety
3. Implement proper error handling
4. Add loading states for async operations
5. Ensure responsive design
6. Write clear component documentation

## Troubleshooting

### Common Issues

1. **Projects not loading**: Check Supabase connection and RLS policies
2. **Create project fails**: Verify user authentication and table permissions
3. **Files not uploading**: Check storage bucket policies and file size limits

### Debug Mode

Enable debug logging in the project service:

```tsx
// In project-service.ts
console.log('Debug info:', { data, error });
```

## Future Enhancements

- Project collaboration features
- Advanced file processing
- AI-powered document analysis
- Project templates and workflows
- Integration with external storage providers
- Real-time project updates
