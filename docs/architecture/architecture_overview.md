# Architecture Overview

## 1. System Architecture

### 1.1 Architecture Style

**Math Mini** follows a **client-Side MVC-like architecture** with a **static file deployment model**:

- **Model**: localStorage (user data, progress tracking)
- **View**: HTML pages with embedded CSS/inline styles
- **Controller**: Vanilla JavaScript modules (main.js, page-specific scripts)

**Key Characteristics**:
- **Zero-backend architecture**: All logic runs in the browser
- **Progressive enhancement**: Core functionality works, enhanced features degrade gracefully
- **Modular page structure**: Each topic has isolated theory/practice/visualization pages
- **Asynchronous computation**: Web Workers handle heavy calculations

### 1.2 High-Level Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Presentation Layer (HTML)                │  │
│  │  ┌─────────┐  ┌─────────┐  ┌───────────────────────┐  │  │
│  │  │ index   │  │ Theory  │  │ Practice/Visualization│  │  │
│  │  │  .html  │  │ Pages   │  │       Pages           │  │  │
│  │  └────┬────┘  └────┬────┘  └──────────┬────────────┘  │  │
│  └───────┼────────────┼──────────────────┼───────────────┘  │
│          │            │                  │                  │
│  ┌───────▼────────────▼──────────────────▼───────────────┐  │
│  │           Logic Layer (JavaScript)                    │  │
│  │  ┌──────────┐  ┌──────────────┐  ┌─────────────────┐  │  │
│  │  │ main.js  │  │ Page-specific│  │   Web Workers   │  │  │
│  │  │ (Core)   │  │   Scripts    │  │ (fractal/graph) │  │  │
│  │  └────┬─────┘  └───────┬──────┘  └────────┬────────┘  │  │
│  └───────┼────────────────┼──────────────────┼───────────┘  │
│          │                │                  │              │
│  ┌───────▼────────────────▼──────────────────▼───────────┐  │
│  │                 Styling Layer (CSS)                   │  │
│  │           style.css + inline page styles              │  │
│  └───────────────────────────┬───────────────────────────┘  │
│                              │                              │
│  ┌───────────────────────────▼───────────────────────────┐  │
│  │              Data Layer (localStorage)                │  │
│  │         { currentUserId, users: [...] }               │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Assets Layer (Static Files)                 │  │
│  │        theory.txt, audio.mp3, modernizr.js            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 2. Component Specifications

### 2.1 Presentation Layer (HTML pages)

**Purpose**: User interface structure and content

**Components**:
- `index.html`: Main landing page with user management and topic grid
- Theory pages: `*-theory.html` (4 topics)
- Practice pages: `*-practice.html` (2 topics)
- Visualization pages: `*-visualization.html` (2 topics)
- Template pages: `topic-*.html` (for future expansion)

**Responsibilities**:
- Semantic HTML5 structure
- Embedded page-specific styles (`<style>` blocks)
- Embedded page-specific scripts (`<script>` blocks)
- Browser warning banner (Modernizr integration)
- Navigation header/footer

### 2.2 Logic Layer (main.js)

**Purpose**: Core application logic and state management

**Key Functions**:
- `initApp()`: Initialize application on page load
- `loadData()` / `saveData()`: localStorage CRUD operations
- `renderUserSection()`: Dynamic user form/selector rendering
- `renderTopics()`: Update topic completion badges
- `handleCreateUser()` / `handleSelectUser()`: User management
- `updatePageVisit()`: Auto-mark theory pages as visited
- `calculateProgress()`: Compute completion percentage

**Global API** (`window.mathTrainer`):
```javascript
{
  loadData: () => Object,
  saveData: (data: Object) => void,
  markTaskComplete: (topic: string) => void
}
```

**Pattern**: IIFE (Immediately Invoked Function Expression) for scope isolation

### 2.3 Styling Layer (style.css)

**Purpose**: Global styles and responsive design

**Structure**:
- CSS Reset
- CSS Variables (`:root` theming)
- Layout styles (Flexbox, Grid)
- Component styles (buttons, cards, forms)
- Modernizr fallback styles (`.no-flexbox`, `.no-cssgrid`)
- Responsive breakpoints (`@media`)
- Animations (`@keyframes`)

**Page-Specific Styles**: Embedded in `<style>` blocks within each HTML page

### 2.4 Data Layer (localStorage)

**Purpose**: Client-side persistent storage

**Key**: `mathTrainer`

**Schema**:
```javascript
{
  currentUserId: number | null,
  users: [
    {
      id: number,
      name: string,
      age: number,
      skill: "pre-school" | "school" | "high-school",
      progress: {
        arithmetic: { theory: boolean, task: boolean },
        fractions: { theory: boolean, task: boolean },
        graphs: { theory: boolean, task: boolean },
        fractal: { theory: boolean, task: boolean }
      }
    }
  ]
}
```

**Operations**: JSON serialization/deserialization via `JSON.parse()` / `JSON.stringify()`

### 2.5 Assets Layer

**Purpose**: Static content files

**Components**:
- `lib/modernizr-2.8.3.js`: Feature detection library
- `assets/*.txt`: Theory content (plain text, UTF-8)
- `assets/*.mp3`: Audio narration files
- `favicon.png`: Browser tab icon

**Loading**: Fetch API (with XMLHttpRequest polyfill fallback)

## 3. Interaction Flows

### 3.1 User Creation Flow

```
User visits index.html
  ↓
main.js: initApp() → loadData()
  ↓
No users exist? → Render create user form
  ↓
User fills form (name, age, skill) → Submit
  ↓
handleCreateUser() → Validate input
  ↓
Generate user ID → Add to users array
  ↓
Set currentUserId → saveData() to localStorage
  ↓
Reload page → Show user info + topic grid
```

### 3.2 Topic Completion Flow

```
User clicks "Theory" link
  ↓
Navigate to *-theory.html
  ↓
Page loads → updatePageVisit()
  ↓
Mark progress[topic].theory = true
  ↓
saveData() to localStorage
  ↓
User clicks "Go to Practice"
  ↓
Navigate to *-practice.html
  ↓
User completes task → Click "Check"
  ↓
Validate answer → Correct?
  ↓
YES: markTaskComplete(topic)
  ↓
Set progress[topic].task = true
  ↓
saveData() → Show success message
  ↓
Return to index.html → Badge shows ✅
```

### 3.3 Practice Drag-and-Drop Flow

```
Page loads → Initialize drag items & drop zones
  ↓
User drags item → handleDragStart()
  ↓
Store draggedElement reference
  ↓
User hovers over drop zone → handleDragOver()
  ↓
Add 'drag-over' CSS class (visual feedback)
  ↓
User drops item → handleDrop()
  ↓
Swap existing item (if any) back to source
  ↓
Append draggedElement to drop zone
  ↓
User clicks "Check" → checkAnswer()
  ↓
Compare currentOrder vs correctOrder
  ↓
Match? → Add 'correct' class + save progress
  ↓
No match? → Add 'incorrect' class + shake animation
```

### 3.3 Visualization Flow

```
User clicks "Plot" button
  ↓
Show loading spinner → Disable button
  ↓
Create Web Worker (fractal-worker.js / graphs-worker.js)
  ↓
worker.postMessage({ type, parameters })
  ↓
Worker: Calculate coordinates (recursive/loop)
  ↓
worker.postMessage({ type: 'calculated', data })
  ↓
Main thread: worker.onmessage → Receive data
  ↓
Hide spinner → Render SVG elements
  ↓
Draw axes, grid, polylines/polygons
  ↓
Animate elements (opacity transitions)
  ↓
Show success message → markTaskComplete()
  ↓
Terminate worker
```

## 4. Design Patterns & Principles

### 4.1 Applied Patterns

| Pattern | Implementation | Purpose |
|---------|---------------|---------|
| **Module Pattern** | IIFE wrapping all scripts | Scope isolation, avoid global pollution |
| **Observer Pattern** | Event listeners (`addEventListener`) | Decouple UI events from logic |
| **Factory Pattern** | Dynamic HTML generation (`innerHTML`) | Create user forms/topic cards |
| **Strategy Pattern** | Topic-specific validation logic | Different rules per practice page |
| **Web Worker Pattern** | Offload calculations to background threads | Prevent UI blocking |
| **Singleton Pattern** | `window.mathTrainer` global API | Single point of access to core functions |

### 4.2 Design Principles

- **Separation of Concerns**: HTML (structure), CSS (presentation), JS (behavior)
- **Progressive Enhancement**: Core functionality works, enhanced features optional
- **DRY (Don't Repeat Yourself)**: Reusable functions, CSS variables, template files
- **KISS (Keep It Simple)**: No frameworks, minimal dependencies
- **Graceful Degradation**: Fallbacks for unsupported features
- **Responsive Design**: Mobile-first CSS with breakpoints

## 5. Technology Stack

| Layer | Technology | Version/Notes |
|-------|-----------|---------------|
| **Markup** | HTML5 | Semantic elements (`<header>`, `<main>`, `<article>`) |
| **Styling** | CSS3 | Flexbox, Grid, Variables, Animations |
| **Scripting** | Vanilla JavaScript | ES5/ES6 (strict mode) |
| **Storage** | localStorage API | ~5-10MB limit |
| **Graphics** | SVG | Inline in HTML, manipulated via DOM |
| **Audio** | HTML5 `<audio>` | MP3 format |
| **Workers** | Web Workers API | Background computation |
| **Feature Detection** | Modernizr 2.8.3 | Browser compatibility checks |
| **Polyfills** | Custom (Fetch → XHR) | Backward compatibility |

## 6. File Structure

```
/
├── index.html                    # Main page
├── favicon.png                   # App icon
├── pages/                        # Topic pages
│   ├── arithmetic-theory.html
│   ├── arithmetic-practice.html
│   ├── fractions-theory.html
│   ├── fractions-practice.html
│   ├── graphs-theory.html
│   ├── graphs-visualization.html
│   ├── fractal-theory.html
│   ├── fractal-visualization.html
│   └── topic-*.html              # Templates
├── scripts/
│   ├── main.js                   # Core logic (user mgmt, progress)
│   ├── modernizr-checks.js       # Feature detection + polyfills
│   ├── fractal-worker.js         # Sierpinski calculation
│   └── graphs-worker.js          # Function graph calculation
├── styles/
│   └── style.css                 # Global styles
├── lib/
│   └── modernizr-2.8.3.js        # Feature detection library
└── assets/                       # Static content
    ├── arithmetic-theory.txt
    ├── arithmetic-theory.mp3
    ├── fractions-theory.txt
    ├── fractions-theory.mp3
    ├── graphs-theory.txt
    ├── graphs-theory.mp3
    ├── fractal-theory.txt
    └── fractal-theory.mp3
```

## 7. Scalability & Extensibility

### 7.1 Adding New Topics

**Steps**:
1. Copy `topic-theory.html` → `newtopic-theory.html`
2. Copy `topic-practice.html` → `newtopic-practice.html` (if needed)
3. Add theory content: `assets/newtopic-theory.txt` + `.mp3`
4. Update `main.js`: Add `'newtopic'` to `TOPICS` array
5. Update `index.html`: Add new `<article class="topic-card" data-topic="newtopic">`
6. Implement page-specific logic in `<script>` block

**Effort**: ~2 hours per topic (excluding content creation)

### 7.2 Future Enhancements

**Low Effort**:
- Add more topics (geometry, algebra)
- Customize CSS theme (change color variables)
- Add difficulty levels (easy/medium/hard)

**Medium Effort**:
- Export/import user data (JSON download/upload)
- Print progress reports (CSS print styles)
- Multi-language support (i18n JSON files)

**High Effort**:
- Backend integration (user authentication, cloud sync)
- Mobile native app (Cordova/Capacitor wrapper)
- Real-time collaboration (WebSockets)

## 8. Security Considerations

**Threats & Mitigations**:

| Threat | Mitigation |
|--------|-----------|
| **XSS (Cross-Site Scripting)** | No user-generated HTML rendering; input sanitized via form validation |
| **localStorage Tampering** | Client-side only; no sensitive data stored; validation on load |
| **Code Injection** | No `eval()` or `Function()` constructors used |
| **CSRF (Cross-Site Request Forgery)** | N/A (no server-side endpoints) |
| **Data Leakage** | localStorage scoped to domain; no external API calls |

**Limitations**: No encryption (localStorage is plain text), no authentication

## 9. Performance Optimization

**Techniques Applied**:

1. **Web Workers**: Offload fractal/graph calculations (prevents UI freezing)
2. **Lazy Loading**: Theory content loaded on-demand via Fetch
3. **CSS Animations**: Hardware-accelerated transforms (`translateY`, `scale`)
4. **Event Delegation**: Minimal event listeners (where applicable)
5. **Debouncing**: Range slider updates throttled (implicit via `input` event)
6. **SVG Optimization**: Minimal DOM nodes, reuse gradients/defs
7. **localStorage Caching**: Single read/write per user action

**Bottlenecks**:

## 10. Testing Strategy

**Manual Testing**:

| Test Type | Scope | Tools |
|-----------|-------|-------|
| **Functional** | User flows, form validation, drag-and-drop | Browser DevTools |
| **Cross-Browser** | Chrome, Firefox, Safari, Edge | BrowserStack (optional) |
| **Responsive** | Mobile/tablet layouts | DevTools Device Mode |
| **Accessibility** | Keyboard navigation, screen readers | WAVE, axe DevTools |
| **Performance** | Load times, worker execution | Lighthouse, Performance tab |

**Automated Testing** (Future):
- Unit tests: Jest (for `main.js` functions)
- E2E tests: Playwright/Cypress (user flows)
- Visual regression: Percy/Chromatic

**Test Cases** (Examples):
- Create user with valid/invalid inputs
- Switch between users
- Complete topic (theory + practice)
- Drag-and-drop correct/incorrect answers
- Render graphs/fractals at various depths
- localStorage persistence across sessions
- Graceful degradation on IE 11
