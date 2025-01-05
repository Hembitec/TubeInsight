# Tube Insight 

A powerful YouTube video analysis platform built with Next.js 15, TypeScript, and AI capabilities. Transform your YouTube content strategy with deep insights and analytics.

## Features

- **YouTube Video Analysis** with transcript processing
- **AI-Powered Insights** using Google's Generative AI
- **Next.js 15** with App Router & Server Actions
- **Modern UI** with Tailwind CSS 3.3 & shadcn/ui
- **Analytics Dashboard** with Recharts
- **Authentication** with Supabase
- **Stripe Integration** for premium features
- **Fully Responsive** design
- **Dark Mode** support
- **Type Safe** with TypeScript

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18.17 or higher)
- [Python](https://python.org/) (for backend services)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone [your-repository-url]
   ```

2. **Install Dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install Python backend dependencies
   cd python-backend
   pip install -r requirements.txt
   ```

3. **Set Up Environment Variables**
   Create a `.env.local` file with the following:
   ```env
   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Stripe
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_webhook_secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key

   # Google AI
   GOOGLE_AI_API_KEY=your_google_ai_key
   ```

4. **Run Development Server**
   ```bash
   # Start the frontend
   npm run dev

   # In a separate terminal, start the Python backend
   cd python-backend
   python main.py
   ```

## Project Structure

```
tube-insight/
├── src/
│   ├── app/             # Next.js app router pages
│   ├── components/      # React components
│   ├── contexts/        # React contexts
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   └── types/          # TypeScript types
├── python-backend/     # Python backend services
├── public/            # Static assets
└── supabase/         # Database configuration
```

## Core Components

- **Frontend**
  - Next.js 15 for the web application
  - Tailwind CSS for styling
  - Recharts for analytics visualization
  - shadcn/ui for UI components

- **Backend**
  - Python backend for video processing
  - Supabase for database and authentication
  - Google's Generative AI for content analysis

- **Infrastructure**
  - Stripe for payment processing
  - YouTube API integration
  - SQL database with Supabase

## Configuration

### Setting Up Supabase

1. Create a Supabase project
2. Run the SQL scripts in `storage-policies.sql`
3. Configure authentication providers
4. Add credentials to `.env.local`

### Setting Up Stripe

1. Create a Stripe account
2. Set up your products and price points
3. Configure webhook endpoints
4. Add API keys to `.env.local`

### Setting Up Google AI

1. Get API credentials from Google Cloud Console
2. Enable Generative AI API
3. Add the API key to `.env.local`

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support or feature requests, please open an issue in the repository.

---

Built with  by the Hembitec.
