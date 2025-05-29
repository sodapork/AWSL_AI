# Senior Living Content Generator

An AI-powered content generation platform for senior living marketing teams. This application helps create various types of marketing content including website event posts, blogs, emails, reminders, and flyers.

## Features

- AI-powered content generation
- Multiple content type templates
- Document upload for reference materials
- User-friendly interface
- Content history and management

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- OpenAI API key

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```
3. Create a `.env` file in the backend directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
4. Start the application:
   ```bash
   npm start
   ```

## Project Structure

- `/frontend` - React application
- `/backend` - Node.js/Express server
- `/uploads` - Directory for uploaded reference documents

## Content Types

- Website Event Posts
- Blog Posts
- Email Campaigns
- Email Reminders
- Marketing Flyers

## Security

- All API keys are stored securely in environment variables
- User authentication required for content generation
- Secure file upload handling 