# SoftLearn - LearnHouse Frontend

A modern, full-featured Learning Management System (LMS) built with Next.js, TypeScript, and Tailwind CSS. SoftLearn provides a comprehensive platform for creating, managing, and delivering educational content with support for courses, assignments, grading, and collaborative learning.

## 🚀 Features

### Core Learning Platform
- **Course Management**: Create and organize courses with chapters and activities
- **Multiple Activity Types**: Support for videos, documents, dynamic pages, and assignments
- **Assignment System**: File submissions, quizzes, and automated/manual grading
- **Progress Tracking**: Student progress monitoring with trail system
- **Collections**: Organize courses into curated collections

### User Experience
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Focus Mode**: Distraction-free learning environment
- **Real-time Updates**: Live progress tracking and notifications
- **User Profiles**: Customizable user profiles with bio and sections
- **Multi-organization Support**: Support for multiple educational organizations

### Content Creation
- **Rich Content Editor**: Dynamic content creation with Canva integration
- **File Management**: Support for PDFs, videos, images, and documents
- **Video Activities**: Video player with playback controls and settings
- **Assignment Builder**: Create file submission and quiz-based assignments

### Administration
- **Dashboard**: Comprehensive admin dashboard for course management
- **User Management**: User roles, permissions, and organization management
- **Analytics**: Course completion tracking and student progress analytics
- **Payment Integration**: Monetization support for premium content

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Forms**: Formik for form handling
- **State Management**: React Context API with custom hooks
- **Data Fetching**: SWR for client-side data fetching
- **Animations**: Framer Motion for smooth transitions

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint with custom configuration
- **Code Formatting**: Prettier
- **Type Checking**: TypeScript compiler
- **Build Tool**: Next.js built-in bundler

## 📁 Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   ├── auth/                     # Authentication pages
│   ├── editor/                   # Content editor
│   ├── home/                     # Home page
│   ├── install/                  # Installation wizard
│   ├── orgs/[orgslug]/          # Organization-specific pages
│   │   ├── dash/                 # Admin dashboard
│   │   │   ├── assignments/      # Assignment management
│   │   │   └── courses/          # Course management
│   │   └── (withmenu)/          # Public pages with navigation
│   │       ├── course/          # Course viewing
│   │       ├── user/            # User profiles
│   │       └── collection/      # Collections
│   └── payments/                # Payment handling
├── components/                   # Reusable React components
│   ├── Contexts/                # React Context providers
│   │   ├── Assignments/         # Assignment-related contexts
│   │   ├── AI/                  # AI integration contexts
│   │   └── CourseContext.tsx    # Course management context
│   ├── Dashboard/               # Admin dashboard components
│   ├── Objects/                 # UI component library
│   │   ├── Activities/          # Activity type components
│   │   ├── Courses/            # Course-related components
│   │   ├── StyledElements/     # Base UI components
│   │   └── Onboarding/         # User onboarding
│   └── Pages/                   # Page-specific components
├── hooks/                       # Custom React hooks
├── lib/                         # Utility libraries
├── public/                      # Static assets
├── services/                    # API service layer
│   ├── courses/                 # Course-related API calls
│   ├── config/                  # Configuration utilities
│   ├── media/                   # Media handling
│   └── utils/                   # Utility functions
├── styles/                      # Global styles
└── types/                       # TypeScript type definitions
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm package manager
- Backend API server running

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd softlearnfront
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Configure the following variables:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   API_URL=your-backend-api-url
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Installation Wizard

On first run, you'll be guided through the installation wizard:

1. **Get Started**: Initialize the installation
2. **Organization Creation**: Set up your educational organization
3. **Default Elements**: Configure default settings
4. **Account Creation**: Create admin account
5. **Sample Data**: Optionally install sample content
6. **Finish**: Complete the setup

## 📖 Usage Guide

### Creating a Course

1. Navigate to the dashboard (`/orgs/[orgslug]/dash/courses`)
2. Click "Create Course"
3. Fill in course details (name, description, thumbnail)
4. Add chapters and activities
5. Publish when ready

### Activity Types

**Dynamic Pages**: Rich content with text, images, and interactive elements
```tsx
// Dynamic content is rendered using the Canva component
{activity.activity_type === 'TYPE_DYNAMIC' && (
  <Canva content={activity.content} activity={activity} />
)}
```

**Video Activities**: Video content with playback controls
```tsx
// Video activities support start/end times and autoplay
{activity.activity_type === 'TYPE_VIDEO' && (
  <VideoActivity course={course} activity={activity} />
)}
```

**Document Activities**: PDF and document viewing
```tsx
// Document viewer for educational materials
{activity.activity_type === 'TYPE_DOCUMENT' && (
  <DocumentPdfActivity course={course} activity={activity} />
)}
```

**Assignments**: File submissions and quizzes
```tsx
// Assignment system with submissions and grading
{activity.activity_type === 'TYPE_ASSIGNMENT' && (
  <AssignmentStudentActivity />
)}
```

### Assignment System

The platform supports comprehensive assignment management:

**File Submissions**: Students can upload files for review
- Supported formats: PDF, DOCX, MP4, JPG, PNG, PPTX, ZIP
- Automatic file validation and storage
- Download and review capabilities for instructors

**Grading System**: Multiple grading methods
- **Numeric**: Traditional point-based grading (e.g., 85/100)
- **Percentage**: Percentage-based grading (e.g., 85%)
- **Alphabetic**: Letter grades (A, B, C, D, F)

**Submission Workflow**:
1. Student uploads file
2. Instructor reviews submission
3. Grade is assigned and feedback provided
4. Student receives notification of grade

### Progress Tracking

The trail system tracks student progress:
- Activity completion status
- Course progress percentage
- Learning path recommendations
- Achievement badges and milestones

## 🔧 API Integration

### Service Layer

The application uses a service layer for API communication:

```typescript
// Course services
import { getCourseMetadata, updateCourse } from '@services/courses/courses'
import { createActivity, getActivity } from '@services/courses/activities'
import { createAssignment, updateAssignment } from '@services/courses/assignments'

// Assignment workflow
const handleFileSubmission = async (file: File) => {
  const result = await updateSubFile(
    file,
    assignmentTaskUUID,
    assignmentUUID,
    access_token
  )
  return result
}
```

### Authentication

Uses NextAuth.js for authentication with custom session handling:

```typescript
// Session management
const session = useLHSession()
const access_token = session?.data?.tokens?.access_token
```

## 🎨 Styling and Theming

### Tailwind CSS Configuration

The project uses a custom Tailwind configuration with:
- Custom color palette
- Typography scales
- Component utilities
- Responsive breakpoints

### Component Library

Built on Radix UI primitives for accessibility:
- Forms with validation
- Modal dialogs
- Tooltips and popovers
- Navigation components

Example form component:
```tsx
<FormField name="title">
  <FormLabelAndMessage label="Title" message={formik.errors.title} />
  <Form.Control asChild>
    <Input
      onChange={formik.handleChange}
      value={formik.values.title}
      type="text"
    />
  </Form.Control>
</FormField>
```

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- File upload validation
- CSRF protection
- Input sanitization

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly navigation
- Mobile-optimized course viewer
- Swipe gestures for content navigation

## 🚀 Deployment

### Docker Deployment

The project includes a multi-stage Dockerfile:

```dockerfile
FROM node:22-alpine AS base
# Dependencies installation
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build
```

### Environment Variables

Required environment variables for production:
```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=production-secret
API_URL=https://api.yourdomain.com
DATABASE_URL=your-database-url
```

## 🧪 Development

### Code Quality

- **ESLint**: Linting with custom rules
- **Prettier**: Code formatting
- **TypeScript**: Type safety
- **Husky**: Git hooks for quality checks

### Testing

Run tests with:
```bash
pnpm test
```

### Build

Create production build:
```bash
pnpm build
```

## 📚 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing component structure
- Add proper type definitions
- Include JSDoc comments for complex functions
- Use semantic commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Join our community Discord

## 🗺 Roadmap

- [ ] Real-time collaboration features
- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] Offline content support
- [ ] Advanced AI integration
- [ ] Multi-language support
- [ ] Advanced assessment tools
- [ ] Integration marketplace

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.