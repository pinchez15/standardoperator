# Standard Operator - Product Requirements Document

## 1. Overview

Standard Operator is an AI-powered SOP builder for small businesses. Users upload any content (documents, PDFs, emails, videos, audio, etc.), and the AI automatically drafts a structured SOP. Users can edit in-browser and export clean Word/PDF files. Unlike other tools, Standard Operator focuses on AI-first SOP creation rather than screen recording, making SOP writing painless.

## 2. Goals

- Remove the burden of SOP writing through AI
- Deliver a minimal, restrained UI (Notion/ChatGPT style)
- Allow exports in formats businesses actually use (Word/PDF)
- Offer optional "Arcade SOP" games for novelty and engagement

## 3. Users

**Primary**: Small business owners/managers who are lightly technical
- Know Microsoft and Google suites well
- Need to create/update SOPs for their organization
- Want simple, intuitive tools without complexity
- Single user per organization (not team collaboration)

**Secondary**: Consultants creating SOPs for clients

## 4. Core Features

### 4.1 Authentication
- Clerk for user auth + billing
- Freemium: 3 SOPs free, Pro at $20/mo

### 4.2 Library
- Left sidebar for folders/tags
- Stores all created SOPs
- Simple organization without complexity

### 4.3 Editor
- Center panel: Editable SOP (Notion-like rich text, via TipTap/Yjs)
- Export to Word & PDF
- Clean, distraction-free interface

### 4.4 AI Agent
- Right sidebar chat panel
- Upload anything (text, doc, PDF, video/audio)
- Agent parses → asks clarifying questions → drafts SOP
- Simple conversation flow

### 4.5 Exports
- **Primary**: Word (editable) + PDF (clean)
- **Phase 2**: PowerPoint + public web page option
- Business-ready document formats

### 4.6 Arcade Mode (Manual at MVP)
Users see a "Play this SOP" button with options:
- **Space Invader style**: Resume-style demo
- **Racer style**: Daytona-inspired process walk-through  
- **Platformer**: Step-by-step SOP as levels

At MVP: request is sent to Standard Operator team. Game is manually built and delivered. Later: automate.

## 5. Tech Stack

- **Frontend**: React (Next.js 14, TypeScript), TailwindCSS, shadcn/ui
- **Backend**: Supabase (DB + file storage)
- **Auth/Billing**: Clerk
- **AI**: OpenAI GPT-4.1 (multimodal, structured SOP templates)
- **Exports**: docx, pdfkit
- **Hosting**: Vercel

## 6. Current Implementation Status

### ✅ Completed
- Basic three-panel layout (Library, Editor, AI Agent)
- Clerk authentication integration
- Supabase database with users, folders, SOPs tables
- Basic SOP creation and editing
- Folder organization
- ContentEditable rich text editor
- API endpoints for CRUD operations

### 🔄 In Progress
- AI agent chat functionality (placeholder)
- File upload handling
- Export functionality

### 📋 Next Priority
- OpenAI GPT-4.1 integration
- TipTap/Yjs rich text editor implementation
- Word/PDF export functionality
- File upload and processing
- Arcade Mode request system

## 7. User Experience Flow

### 7.1 First-Time User
1. Sign up with Clerk
2. See empty library with "Create your first SOP" prompt
3. Upload a document or describe a process in chat
4. AI asks clarifying questions
5. AI drafts structured SOP
6. User edits in clean editor
7. Export to Word/PDF

### 7.2 Returning User
1. See library with existing SOPs
2. Click SOP to edit or create new one
3. Use AI agent for improvements or new SOPs
4. Export when ready

## 8. Success Metrics

### User Engagement
- **SOPs Created**: Average 5+ SOPs per user
- **Time to First SOP**: < 15 minutes from signup
- **Export Usage**: 80% of users export at least one SOP
- **User Retention**: 70% after 30 days

### Product Performance
- **SOP Creation Time**: < 10 minutes with AI assistance
- **AI Response Time**: < 5 seconds for generation
- **Export Quality**: Professional Word/PDF output
- **User Satisfaction**: Simple, intuitive interface

## 9. Technical Requirements

### 9.1 AI Integration
- OpenAI GPT-4.1 API for multimodal content processing
- Structured prompts for consistent SOP formatting
- File upload handling (documents, images, audio, video)
- Conversation memory for follow-up questions

### 9.2 Editor Implementation
- TipTap rich text editor with Yjs for real-time editing
- Notion-like interface with blocks and formatting
- Auto-save functionality
- Clean, distraction-free design

### 9.3 Export System
- Word export using docx library
- PDF export using pdfkit
- Professional formatting and styling
- Branded headers and footers

### 9.4 File Processing
- Support for multiple file types
- Text extraction from PDFs and documents
- Audio/video transcription (using OpenAI Whisper)
- Image analysis and description

## 10. Development Phases

### Phase 1: Core MVP (4 weeks)
- OpenAI GPT-4.1 integration
- TipTap editor implementation
- Basic file upload and processing
- Word/PDF export functionality
- Simple AI conversation flow

### Phase 2: Enhanced Features (4 weeks)
- Advanced file processing
- Improved AI conversation flow
- Arcade Mode request system
- Enhanced export options
- User onboarding improvements

### Phase 3: Polish & Scale (4 weeks)
- Performance optimization
- Advanced AI features
- Automated Arcade Mode
- Analytics and monitoring
- User feedback integration

## 11. Risk Mitigation

### Technical Risks
- **AI API Costs**: Monitor usage and implement rate limiting
- **File Processing**: Handle large files and processing errors gracefully
- **Export Quality**: Ensure professional output formatting

### Business Risks
- **User Adoption**: Focus on simplicity and clear value proposition
- **Competition**: Emphasize unique Arcade Mode and AI-first approach
- **Pricing**: Test freemium model with target users

## 12. Next Steps

### Immediate (This Week)
1. Set up OpenAI API integration
2. Implement TipTap rich text editor
3. Add file upload functionality
4. Create basic export system

### Short-term (Next 2 Weeks)
1. Complete AI conversation flow
2. Implement Word/PDF export
3. Add file processing capabilities
4. Test with target users

### Medium-term (Next Month)
1. Launch MVP with core features
2. Gather user feedback
3. Implement Arcade Mode request system
4. Optimize based on usage data

This PRD focuses on simplicity, AI-first approach, and single-user experience for lightly technical small business owners who need to create professional SOPs quickly and easily.