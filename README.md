# AI Presentations

A modern web application for creating AI-powered presentations using Next.js, OpenAI, and modern web technologies.

## Features

- 🤖 AI-powered presentation generation
- 🎨 Modern UI with Tailwind CSS and Radix UI components
- 🔒 Authentication with Clerk
- 📊 Interactive presentation editor
- 🎯 Drag and drop interface
- 🌙 Dark/Light mode support
- 📱 Responsive design
- 🔄 Real-time updates
- 📦 PPTX export functionality

## Tech Stack

- **Framework**: Next.js 15.1.6
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Authentication**: Clerk
- **Database**: Prisma
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **AI Integration**: OpenAI
- **Presentation Generation**: pptxgenjs

## Prerequisites

- Node.js 18+ or Bun
- OpenAI API key
- Clerk account and credentials

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-presentations.git
cd ai-presentations
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Set up the database:
```bash
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
src/
├── actions/     # Server actions and API routes
├── app/         # Next.js app router pages
├── components/  # Reusable UI components
├── hooks/       # Custom React hooks
├── icons/       # Icon components
├── lib/         # Utility functions and configurations
├── provider/    # Context providers
└── store/       # Zustand state management
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
