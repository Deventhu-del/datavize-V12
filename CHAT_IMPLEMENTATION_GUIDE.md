# Chat Implementation Guide

This document outlines the implementation of the new chat system with OpenRouter integration, chat history management, and improved user experience.

## Overview

The chat system has been completely redesigned to provide:
- **OpenRouter Integration**: Access to multiple AI models through a single API
- **Chat History Management**: Persistent chat sessions with local storage
- **Improved UX**: Better navigation, context sidebar, and chat management
- **Model Selection**: Choose from various AI models for different use cases

## Architecture

### 1. Chat Context (`lib/chat-context.tsx`)
The central state management for all chat functionality:
- Chat creation and management
- Message handling
- OpenRouter API integration
- Local storage persistence

### 2. OpenRouter API (`app/api/chat/openrouter/route.ts`)
Handles communication with OpenRouter's API:
- Supports multiple AI models
- Configurable parameters (temperature, max tokens)
- Error handling and response processing

### 3. Chat Pages
- **`/chat`**: Chat list overview with quick actions
- **`/chat/new`**: New chat creation with prompt input
- **`/chat/[slug]`**: Individual chat session

### 4. Context Sidebar
Enhanced sidebar showing:
- Chat history
- Quick chat creation
- Chat management (edit, delete)

## Features

### Chat Management
- **Create New Chats**: Start conversations with custom prompts
- **Chat History**: View all previous conversations
- **Edit Chat Titles**: Click on chat titles to rename them
- **Delete Chats**: Remove unwanted conversations
- **Model Selection**: Choose AI models per chat

### OpenRouter Integration
- **Multiple Models**: GPT-4o, Claude 3.5, Llama 3.1, etc.
- **Configurable Parameters**: Temperature, max tokens
- **Error Handling**: Graceful fallbacks for API failures

### User Experience
- **Quick Actions**: Pre-defined prompts for common tasks
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Instant message delivery
- **Auto-scroll**: Automatic scrolling to latest messages

## Environment Variables

Add these to your `.env.local` file:

```bash
# OpenRouter API Key (required)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## API Endpoints

### POST `/api/chat/openrouter`
Handles chat completions through OpenRouter:

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ],
  "model": "gpt-4o",
  "chatId": "chat_123"
}
```

**Response:**
```json
{
  "content": "Hello! I'm doing well, thank you for asking. How can I help you today?",
  "model": "gpt-4o",
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}
```

## Available Models

The system supports various AI models through OpenRouter:

- **GPT Models**: `gpt-4o`, `gpt-4o-mini`
- **Claude Models**: `claude-3-5-sonnet`, `claude-3-5-haiku`
- **Llama Models**: `llama-3-1-8b`
- **And many more** available through OpenRouter

## Usage Examples

### Starting a New Chat
1. Navigate to `/chat/new`
2. Enter your prompt or select a quick suggestion
3. Choose your preferred AI model
4. Click "Start Chat" to begin

### Managing Existing Chats
1. Use the context sidebar (toggle with context button)
2. View chat history and select conversations
3. Edit titles by clicking on them
4. Delete unwanted chats

### Quick Actions
- **Ask for Help**: Get assistance with tasks
- **Brainstorm Ideas**: Generate creative solutions
- **Learn Something**: Understand complex topics

## Data Persistence

Chat data is stored locally using:
- **Local Storage**: Persistent across browser sessions
- **Chat Context**: React context for real-time state
- **Auto-save**: Automatic saving of chat state

## Error Handling

The system includes comprehensive error handling:
- **API Failures**: Graceful fallbacks for OpenRouter errors
- **Network Issues**: User-friendly error messages
- **Validation**: Input validation and sanitization

## Future Enhancements

Planned improvements include:
- **Streaming Responses**: Real-time message streaming
- **File Attachments**: Support for document uploads
- **Chat Export**: Export conversations to various formats
- **Advanced Settings**: Customizable AI parameters
- **Multi-modal Support**: Image and audio input

## Troubleshooting

### Common Issues

1. **OpenRouter API Errors**
   - Verify your API key is correct
   - Check OpenRouter service status
   - Ensure proper environment variables

2. **Chat Not Loading**
   - Clear browser local storage
   - Check browser console for errors
   - Verify chat context is properly initialized

3. **Messages Not Sending**
   - Check network connectivity
   - Verify API endpoint configuration
   - Review browser console for errors

### Debug Mode

Enable debug logging by adding to your environment:
```bash
DEBUG_CHAT=true
```

## Contributing

When contributing to the chat system:
1. Follow the existing code structure
2. Add proper error handling
3. Include TypeScript types
4. Test with multiple AI models
5. Update this documentation

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review browser console logs
3. Verify environment configuration
4. Test with minimal examples
