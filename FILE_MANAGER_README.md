# File Manager for Knowledge Base

This document describes the new file manager functionality added to the Knowledge Base page.

## Features

### 1. Project Management
- **Create Projects**: Users can create new projects with custom names
- **Project Cards**: Each project displays:
  - Project name and description
  - File count and total storage used
  - Creation date and last updated
  - Project status (active, processing, error)
  - Quick actions (view files, edit, delete)

### 2. File Management
- **File Upload**: Drag & drop or browse to upload files
- **Supported File Types**: PDF, Word, Excel, PowerPoint, Images, Text, CSV, Email, RTF, ZIP
- **File Table**: Comprehensive file listing with:
  - File name and icon
  - Document type with color-coded badges
  - Update date
  - File size
  - Page count (for documents)
  - Actions (view, download, delete)

### 3. Advanced Features
- **Search**: Search files by name or document type
- **Filtering**: Filter by file type
- **Sorting**: Sort by name, date, size, or type (ascending/descending)
- **Statistics**: Overview cards showing total files, storage used, file types, and last updated

## Components

### ProjectCard
- Displays project information in a card format
- Shows project stats and status
- Provides quick actions via dropdown menu

### FileManager
- Comprehensive file management interface
- Search, filter, and sort capabilities
- File table with actions
- Statistics overview

### ProjectsList
- Grid layout for displaying all projects
- Empty state when no projects exist
- Integrates with project creation dialog

## Usage

1. **View Projects**: Navigate to Knowledge Base page to see all projects
2. **Create Project**: Click "Create Project" button to start a new project
3. **Upload Files**: Add files during project creation or later
4. **View Files**: Click "View Files" on any project card
5. **Manage Files**: Use the file manager to search, filter, and manage files
6. **Navigate Back**: Use the back button to return to projects view

## File Types Supported

- **Documents**: PDF, Word (.docx), Excel, PowerPoint, Text, RTF
- **Images**: JPEG, PNG, TIFF
- **Data**: CSV, Email
- **Archives**: ZIP

## Technical Details

- Built with React and TypeScript
- Uses shadcn/ui components for consistent design
- Responsive design for mobile and desktop
- State management with React hooks
- Mock data included for demonstration

## Future Enhancements

- File preview functionality
- Bulk file operations
- File versioning
- Advanced search with content indexing
- File sharing and collaboration
- Integration with external storage services
