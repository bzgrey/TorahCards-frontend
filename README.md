# TorahCards 📚

A modern web application designed to help students of Jewish religious texts create, study, and share flashcards and notes. TorahCards enables users to convert their study notes into interactive flashcards, making Torah study more engaging and effective.

## 🌟 Features

- **Note Management**: Create and organize study notes
- **AI-Powered Flashcard Generation**: Convert notes into flashcards automatically
- **Flashcard Review**: Study with interactive flashcards featuring question/answer flip functionality
- **Search & Discovery**: Find flashcards and notes created by other users
- **Social Learning**: Follow other users and access their public study materials
<!-- - **Label & Organization**: Tag and categorize your study materials -->
- **User Authentication**: Secure login and user management

## 🛠️ Tech Stack

- **Runtime**: [Deno](https://deno.land/) - Modern JavaScript/TypeScript runtime
- **Framework**: [Vue 3](https://vuejs.org/) - Progressive JavaScript framework
- **Routing**: [Vue Router](https://router.vuejs.org/) - Official Vue.js routing
- **State Management**: [Pinia](https://pinia.vuejs.org/) - Vue store
- **Build Tool**: [Vite](https://vitejs.dev/) - Next generation frontend tooling
- **HTTP Client**: [Axios](https://axios-http.com/) - Promise-based HTTP client
- **Language**: TypeScript

## 📋 Prerequisites

- [Deno](https://deno.land/) (latest version)
- Node modules support in Deno
- A backend server running (see API documentation)

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bzgrey/TorahCards-frontend.git
cd TorahCards-frontend
```

2. The project uses Deno's npm compatibility, so dependencies are automatically managed through `deno.json`.

### Development

Run the development server:
```bash
deno task dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

### Build

Create a production build:
```bash
deno task build
```

### Preview

Preview the production build:
```bash
deno task preview
```

## 📁 Project Structure

```
TorahCards-frontend/
├── src/
│   ├── api/                    # API integration layer
│   │   ├── concepts/          # API modules for each feature
│   │   │   ├── FlashCardsAPI.ts
│   │   │   ├── Following.ts
│   │   │   ├── LabelingAPI.ts
│   │   │   ├── NotesAPI.ts
│   │   │   └── UserAuthAPI.ts
│   │   └── types.ts           # TypeScript type definitions
│   ├── components/            # Reusable Vue components
│   │   ├── FlashCardItem.vue
│   │   ├── FlashCardSet.vue
│   │   ├── FollowButton.vue
│   │   ├── NoteItem.vue
│   │   └── search/            # Search-related components
│   ├── stores/                # Pinia state management
│   │   └── user.ts            # User authentication store
│   ├── views/                 # Page components
│   │   ├── ViewAuth.vue       # Login/Register page
│   │   ├── ViewFlashcards.vue # Flashcard viewing/editing
│   │   ├── ViewHome.vue       # Dashboard
│   │   ├── ViewNotes.vue      # Note viewing/editing
│   │   └── ViewSearch.vue     # Search interface
│   ├── App.vue                # Root component
│   ├── main.ts                # Application entry point
│   └── router.ts              # Vue Router configuration
├── deno.json                  # Deno configuration and tasks
├── deno.lock                  # Dependency lock file
├── vite.config.js            # Vite configuration
└── index.html                # HTML entry point
```

## 🎨 Design Philosophy

TorahCards uses a **Torah Scroll-inspired design palette**:
- **Parchment background** (#F8F5E9) - Warm, study-friendly backdrop
- **Leather accents** (#A67C52) - Navigation and primary elements
- **Charcoal text** (#2E2E2E) - High readability
- **Gold borders** (#CBBF7A) - Elegant highlights
- **Typography**: EB Garamond for headings (classical), Noto Sans for body text (modern readability)

## 🔐 Authentication

The application includes route guards:
- **Protected routes**: Require authentication (Home, Flashcards, Notes, Search)
- **Guest-only routes**: Only accessible when not logged in (Auth page)
- Authentication state persists using localStorage

## 🔌 API Integration

The frontend connects to a backend API with the following concepts:
- **User Authentication**: Login, logout, and session management
- **Notes**: CRUD operations for study notes
- **Flashcards**: Create, read, update, and delete flashcards
- **Following**: Social features to follow other users
- **Labeling**: Organize content with tags and labels

See the API documentation in `src/api/concepts/docs/` for detailed endpoint information.

## 👥 User Journey

A typical user workflow:
1. **Sign in** to TorahCards
2. **Create a note** with study content (e.g., "Laws of Shabbos")
3. **Convert to flashcards** using AI-powered generation
4. **Review and edit** flashcards in the interactive viewer
5. **Study** by flipping cards and testing knowledge
6. **Share** by making flashcard sets public
7. **Discover** other users' materials through search and following

## 🤝 Contributing

This is a course project for MIT 6.104 Software Design. 

## 🙏 Acknowledgments

Built as part of MIT's 6.104 course on software design (2025), taught by Daniel Jackson and Mitchell Gordon.

---

**Note**: Make sure your backend server is running before starting the frontend application. Check the API documentation for backend setup instructions.
