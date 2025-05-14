# LexAI: AI-Powered Legal Research Platform

An AI-powered legal research platform designed to streamline document analysis, jurisdiction identification, and multilingual content processing for commercial law professionals.

## Features

- **Document Upload & Analysis**: Upload legal documents in PDF, DOCX, or TXT format and get AI-powered analysis
- **Jurisdiction Finder**: Identify which courts would handle specific cases based on document content
- **Multilingual Support**: Translate documents to various languages including Hindi, Spanish, French, and German
- **Document Management**: Organize and track all uploaded documents with status tracking
- **Activity History**: Chronological log of all actions performed within the system

## Technology Stack

- **Frontend**: React with TypeScript, ShadCN UI
- **Backend**: Node.js with Express
- **AI Integration**: OpenAI GPT-4o
- **Database**: PostgreSQL (optional, in-memory storage available for development)
- **Other Technologies**: TanStack Query, Drizzle ORM, Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ (20.x recommended)
- npm or yarn
- OpenAI API Key
- PostgreSQL (optional)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd lexai-platform
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file:
   ```
   cp .env.template .env
   ```

4. Edit the `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_key_here
   ```

5. Create an uploads directory:
   ```
   mkdir uploads
   ```

6. Start the development server:
   ```
   npm run dev
   ```

7. Open your browser and go to http://localhost:5000

### Database Setup (Optional)

By default, the application uses in-memory storage. For persistent storage:

1. Make sure PostgreSQL is installed and running
2. Update the `.env` file with your database credentials
3. Run the database schema push:
   ```
   npm run db:push
   ```

## Usage

### Document Upload

1. Navigate to "Document Upload" in the sidebar
2. Drag & drop your legal documents or click to select
3. The system will automatically process the document

### Court Jurisdiction Finder

1. Navigate to "Court Finder" in the sidebar
2. Use filters to narrow down courts by type and region
3. Search for specific courts or jurisdictions

### Research Engine

1. Navigate to "Research Engine" in the sidebar
2. Select a document from your library or upload a new one
3. Use AI models to extract insights and analyze the document

### Language Translation

1. Select your preferred language from the language selector in the header
2. The UI will update to display content in your selected language
3. Documents can be translated when viewing their details

## Development Notes

- The TypeScript configuration uses relaxed type checking for easier development
- React components follow the ShadCN UI design system
- State management primarily uses React Query for server state and useState for UI state
- The project uses the path aliases `@/*` for client code and `@shared/*` for shared code

## Troubleshooting

- **TypeScript Errors**: If you encounter TypeScript errors during development, you can either:
  - Fix them by adding proper types
  - Temporarily disable strict type checking in tsconfig.json
  
- **OpenAI API Issues**: If document analysis is failing, verify that:
  - Your API key is correctly set in the .env file
  - You have sufficient credits in your OpenAI account
  - You're using a model that supports the required capabilities

- **Database Connectivity**: If using PostgreSQL and encountering connection issues:
  - Verify PostgreSQL is running
  - Check connection credentials in .env file
  - Run `npm run db:push` to ensure schema is up-to-date

## License

[Specify your license here]