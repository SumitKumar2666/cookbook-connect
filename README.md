# 🍳 CookBook Connect - Recipe Sharing Platform

A comprehensive recipe sharing platform built with NestJS, GraphQL, PostgreSQL, Elasticsearch, and AI integration.

## 🚀 Features

- **Recipe Management**: Full CRUD operations for recipes with ingredients and instructions
- **Real-time Updates**: Live notifications for ratings, comments, and new recipes
- **Advanced Search**: Elasticsearch-powered search with ingredient matching
- **AI Enhancement**: OpenAI integration for recipe improvements and suggestions
- **Social Features**: User following, ratings, comments, and activity feeds
- **Authentication**: JWT-based secure authentication
- **GraphQL API**: Comprehensive GraphQL schema with subscriptions

## 📋 Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- Git

## 🛠️ Installation & Setup

### 1. Clone and Initialize Project

```bash
# Clone repository
git clone <your-repo-url>
cd cookbook-connect

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration
```

### 2. Start Infrastructure Services

```bash
# Start PostgreSQL, Elasticsearch, and Redis
docker-compose up -d
# or
docket compose up -d
```

### 3. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init
```

### 4. Start Development Server

```bash
npm run start:dev
```

🎉 **Server runs on**: `http://localhost:3000`  
📊 **GraphQL Playground**: `http://localhost:3000/graphql`

## 📊 GraphQL API Examples

### Authentication

```graphql
# Register
mutation {
  register(input: {
    email: "user@example.com"
    username: "chef123"
    firstName: "John"
    lastName: "Doe"
    password: "password123"
  }) {
    access_token
    user {
      id
      username
      email
    }
  }
}

# Login
mutation {
  login(input: {
    email: "user@example.com"
    password: "password123"
  }) {
    access_token
    user {
      id
      username
    }
  }
}
```

### Recipe Operations

```graphql
# Create Recipe
mutation {
  createRecipe(input: {
    title: "Pasta Carbonara"
    description: "Classic Italian pasta dish"
    cuisine: "Italian"
    difficulty: "MEDIUM"
    cookingTime: 30
    servings: 4
    ingredients: [
      { name: "Spaghetti", quantity: "400g" }
      { name: "Bacon", quantity: "200g" }
      { name: "Eggs", quantity: "3", unit: "pieces" }
      { name: "Parmesan", quantity: "100g" }
    ]
    instructions: [
      { step: 1, content: "Cook pasta according to package instructions" }
      { step: 2, content: "Fry bacon until crispy" }
      { step: 3, content: "Mix eggs with parmesan" }
      { step: 4, content: "Combine everything while pasta is hot" }
    ]
  }) {
    id
    title
    averageRating
    author {
      username
    }
  }
}

# Search Recipes
query {
  searchRecipes(
    query: "pasta"
    filters: {
      cuisine: "Italian"
      maxCookingTime: 45
      ingredients: ["pasta", "cheese"]
    }
  ) {
    recipes {
      id
      title
      cookingTime
      averageRating
      ingredients {
        name
        quantity
      }
    }
    total
  }
}

# Cook with Available Ingredients
query {
  cookWithWhatIHave(ingredients: ["chicken", "rice", "vegetables"]) {
    recipes {
      id
      title
      averageRating
      ingredients {
        name
        quantity
      }
    }
  }
}
```

### AI Features

```graphql
# Get Recipe Improvements
query {
  getRecipeImprovements(recipeId: "recipe-id") # Returns array of suggestions
}

# Ingredient Substitutions
query {
  getIngredientSubstitutions(
    ingredient: "butter"
    dietaryRestrictions: ["vegan", "lactose-free"]
  ) {
    substitute
    notes
  }
}

# Wine & Side Pairings
query {
  getRecipePairings(recipeId: "recipe-id") {
    wines
    sides
  }
}
```

### Real-time Features

```javascript
// WebSocket Connection (Frontend)
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});

// Join recipe room for live updates
socket.emit('join_recipe', 'recipe-id');

// Listen for new ratings
socket.on('new_rating', (data) => {
  console.log('New rating:', data.rating);
});

// Listen for new comments
socket.on('new_comment', (data) => {
  console.log('New comment:', data.comment);
});

// Listen for new recipes from followed users
socket.on('new_recipe', (data) => {
  console.log('New recipe from followed user:', data.recipe);
});
```

## 🏗️ Architecture

### Technology Stack

- **Backend**: NestJS with TypeScript
- **API**: GraphQL with Apollo Server
- **Database**: PostgreSQL with Prisma ORM
- **Search**: Elasticsearch
- **Real-time**: WebSocket + Redis Pub/Sub
- **AI**: OpenAI GPT-3.5
- **Authentication**: JWT with Passport

### Project Structure

```
src/
├── modules/
│   ├── auth/           # Authentication & authorization
│   ├── users/          # User management
│   ├── recipes/        # Recipe CRUD operations
│   ├── search/         # Elasticsearch integration
│   ├── realtime/       # WebSocket & real-time features
│   └── ai/             # OpenAI integration
├── common/
│   ├── prisma/         # Database service
│   └── health/         # Health checks
└── main.ts
```

### Database Schema

```mermaid
erDiagram
    User ||--o{ Recipe : creates
    User ||--o{ Rating : gives
    User ||--o{ Comment : writes
    User ||--o{ Follow : follows
    Recipe ||--o{ Ingredient : contains
    Recipe ||--o{ Instruction : has
    Recipe ||--o{ Rating : receives
    Recipe ||--o{ Comment : receives
    
    User {
        string id PK
        string email UK
        string username UK
        string firstName
        string lastName
        string bio
        string avatar
        string password
        datetime createdAt
        datetime updatedAt
    }
    
    Recipe {
        string id PK
        string title
        string description
        string cuisine
        string difficulty
        int cookingTime
        int servings
        string imageUrl
        string authorId FK
        datetime createdAt
        datetime updatedAt
    }
```

## 🚀 Deployment

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Services
ELASTICSEARCH_URL="http://localhost:9200"
REDIS_URL="redis://localhost:6379"
OPENAI_API_KEY="your-openai-key"

# App
PORT=3000
NODE_ENV=production
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Test specific module
npm run test -- --testPathPattern=recipes
```

## 📊 Performance

### Optimization Features

- **Database**: Prisma query optimization with proper indexing
- **Search**: Elasticsearch with result caching
- **Real-time**: Redis pub/sub for horizontal scaling
- **API**: GraphQL query complexity analysis
- **Caching**: Redis caching for AI responses

### Monitoring

```bash
# Health checks
curl http://localhost:3000/health
curl http://localhost:3000/health/db

# GraphQL introspection
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __schema { types { name } } }"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m "feat: add amazing feature"`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Commit Convention

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation updates
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks

## 📝 API Documentation

Full GraphQL schema available at `/graphql` endpoint when server is running.

### Key Endpoints

- **GraphQL**: `/graphql` - Main API endpoint
- **Health**: `/health` - Service health check
- **WebSocket**: `/socket.io` - Real-time connections

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Check PostgreSQL status
   docker-compose ps
   # Restart services
   docker-compose restart postgres
   ```

2. **Elasticsearch Not Starting**
   ```bash
   # Increase memory limit
   docker run -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" elasticsearch:8.8.0
   ```

3. **WebSocket Connection Failed**
   ```bash
   # Check Redis connection
   redis-cli ping
   # Verify JWT token in WebSocket auth
   ```

4. **Prisma Migration Issues**
   ```bash
   # Reset database (development only)
   npx prisma migrate reset
   # Force push schema
   npx prisma db push --force-reset
   ```

## 📄 License

MIT License - see LICENSE file for details.

## 👨‍💻 Author

Built with ❤️ for the CookBook Connect challenge.

---

**🎉 Happy Cooking & Coding!**