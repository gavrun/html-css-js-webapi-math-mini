# html-css-js-webapi-math-mini

## Math Mini

A study project to learn core web development with **HTML5**, **CSS3**, and vanilla **JavaScript**, with emphasis on some **Web APIs** usage and without any frameworks or build tools.

The project goal is to understand core web technologies and browser APIs directly, with zero dependencies and full control over behavior.

## Project Idea

**Math Mini** is an **interactive educational web application** for young adults that teaches mathematical concepts through visual, hands-on exercises:

- Multi-user support: multiple users can use the same application with individual progress tracking
- Learning modules: extensible leanring topics 
- Theory-Practice approach: each topic combines explanatory content with interactive exercises or visualizations

Educational topics:

- Arithmetic: Theory page + drag-and-drop expression builder
- Fractions: Theory page + drag-and-drop fraction ordering
- Graphs: Theory page + interactive function graph plotting (4 functions)
- Fractals: Theory page + Sierpinski triangle generator with depth control

Mathematical concepts and topic are adapted from school curriculum.

## Features

- **User Management**
  - Create multiple user profiles
  - Select active user
  - Per-user progress tracking
  - Data persistence 

- **Progress Tracking**
  - Completions states: Not Started, In Progress, Completed
  - Visual indicators on dashboard
  - Persistent across sessions

- **Interactive Elements**
  - HTML5 Drag and Drop for practice exercises
  - SVG rendering for mathematical visualizations
  - Web Workers for computationally intensive tasks
  - Audio playback for theory narration

- **Pages Layout**
  - **Home** page: User selection sidebar and topic cards grid
  - **Theory** pages: Article-style layout with text content and audio player
  - **Practice** pages: Draggable elements panel, drop zones area, control buttons
  - **Visualization** pages: Control panel and SVG for graphics


## Tech stack

- **HTML5** semantic markup, modern elements
- **CSS3** advanced styling (Grid, Flexbox, animations, gradient, custom properties, media queries etc.)
- **JavaScript (ES6+)** vanilla JS, modern syntax with arrow functions, app logic and DOM manipulation, promises and async/await, JSON serialization, destructuring
- **Web APIs** including:
  - **Web Storage** data persistence, localStorage
  - **Web Workers** background computation for visualizations
  - **Fetch API** loads assets for topics pages
  - **Drag and Drop API** interactivity on practice page
  - **Audio API** narration playback
  - **SVG (DOM)** graphics and visualizations, etc.

## Design choices

- **Card-based layout** clean, colorful, and friendly design
- **Responsive design** desktop and tablet support
- **Visual feedback** for interactions (hover states, drag-over highlights, success/error pulse animations, computation indication)
- **Graceful degradation** with fallback content if cannot be fetched
- **Pure client-side** works entirely on the client-side without server infrastructure 
- **IIFE modularity** for encapsulation, namespace isolation, clean public API
- **Template** pages follow same structure implicitly, all custom styles and logic in-place
- **Multi-threaded** computation via Web Worker
- **Error handling** according to best practices


## Project Structure

```
/
├── docs/
│   ├── analysis/
│   │   ├── business_scenario.md
│   │   └── software_requirements.md
│   ├── architecture/
│   │   └── architecture_overview.md
│   ├── data_model/
│   │   └── conceptual_model.md
│   └── planning/
│       └── development_plan_tasks.md
│
├── public/
│   ├── favicon.png
│   ├── index.html
│   │
│   ├── assets/
│   │   ├── arithmetic-theory.{txt,mp3}
│   │   ├── fractal-theory.{txt,mp3}
│   │   ├── fractions-theory.{txt,mp3}
│   │   ├── graphs-theory.{txt,mp3}
│   │   └── topic-theory.{txt,mp3}
│   │
│   ├── fonts/
│   │   └── local_font
│   │
│   ├── lib/
│   │   └── modernizr-2.8.3.js
│   │
│   ├── pages/
│   │   ├── arithmetic-practice.html
│   │   ├── arithmetic-theory.html
│   │   ├── fractal-theory.html
│   │   ├── fractal-visualization.html
│   │   ├── fractions-practice.html
│   │   ├── fractions-theory.html
│   │   ├── graphs-theory.html
│   │   ├── graphs-visualization.html
│   │   ├── topic-practice.html
│   │   ├── topic-theory.html
│   │   └── topic-visualization.html
│   │
│   ├── scripts/
│   │   ├── fractal-worker.js
│   │   ├── graphs-worker.js
│   │   ├── main.js
│   │   └── modernizr-checks.js
│   │
│   └── styles/
│       └── style.css
│
└── src/
    └── sources

```

## How to publish

Steps to publish [TBD]

A modern web browser (Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+) required if accessing published project.

## How to evaluate

1. Required: VSCode editor with Live Preview (ms-vscode.live-server) extension installed.

2. Clone repository

```
git clone https://github.com/gavrun/html-css-js-webapi-math-mini.git
cd html-css-js-webapi-math-mini
```
3. Open the project folder in VSCode

```
code .
```

4. Right-click on index.html select **Show Preview**

5. Run
  - Create a user profile
  - Select a topic
  - Read/listen theory or try practice exercises 
  - Progress is automatically saved in project env.
