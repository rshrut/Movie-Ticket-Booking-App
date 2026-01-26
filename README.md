# MovieTicketBookingApp

A modern, responsive Single Page Application (SPA) built with Angular 19. This frontend provides a seamless user journey from browsing movies to selecting seats and generating digital tickets.

🚀 Live Site

Check out the live application on Vercel:
https://movie-ticket-booking-app-woad-kappa.vercel.app

🛠 Tech Stack

Framework: Angular 19 (Standalone Components)

Styling: Tailwind CSS & SCSS

State Management: RxJS (Observables & BehaviorSubjects)

Icons: FontAwesome

Deployment: Vercel

✨ Key Features

Dynamic Seat Selection: An interactive seat map with real-time availability updates.

Smart Loading: Implementation of "Cold Start" detection to notify users when the free-tier backend is waking up.

Auth Interceptor: Automated JWT handling—the app automatically attaches tokens to requests and handles session expiration (401/403) by redirecting to login.

Responsive Design: Fully optimized for Mobile, Tablet, and Desktop views.

Seamless Navigation: Built with Angular Router and Protected Guards for secure checkout flows.

📂 Project Structure

src/app/pages: Main view components (Movie List, Payment, Ticket).

src/app/services: Core logic for API communication and State management.

src/app/interceptors: Global HTTP handling for Security.

src/app/guards: Route protection logic.

⚙️ Environment Configuration

The project uses Angular's environment-swapping strategy:

environment.ts: Configured for local development (localhost:8080).

environment.prod.ts: Configured for production (Render.com URL).

🚀 Getting Started

Install dependencies: npm install

Start the dev server: ng serve

Open http://localhost:4200 in your browser.

🤝 Connectivity Note

This frontend communicates with a Spring Boot backend. Ensure the CORS_ALLOWED_ORIGINS on the backend includes the URL where this frontend is running.
