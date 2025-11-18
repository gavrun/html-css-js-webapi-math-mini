# Software Requirements Specification

## 1. Functional Requirements

### 1.1 User Management

**FR-1.1.1** The system shall allow creation of multiple user profiles with name (letters only), age (1-99), and skill level (pre-school/school/high-school).

**FR-1.1.2** The system shall generate unique user IDs automatically upon profile creation.

**FR-1.1.3** The system shall allow users to switch between existing profiles from the main page.

**FR-1.1.4** The system shall persist user data in browser localStorage across sessions.

**FR-1.1.5** The system shall display current user information (name, age, skill level) on the main page.

### 1.2 Progress Tracking

**FR-1.2.1** The system shall track completion status for each topic's theory page.

**FR-1.2.2** The system shall track completion status for each topic's practice/visualization task .

**FR-1.2.3** The system shall display visual indicators (✅/⏳) on topic cards showing completion status.

**FR-1.2.4** The system shall calculate and display overall progress on the main page.

**FR-1.2.5** The system shall mark a topic as complete only when both theory AND task are completed.

### 1.3 Theory Pages

**FR-1.3.1** The system shall load theory content from external `.txt` files via Fetch API.

**FR-1.3.2** The system shall display fallback hardcoded content if file loading fails.

**FR-1.3.3** The system shall provide HTML5 audio player with narrated theory content (`.mp3` files).

**FR-1.3.4** The system shall automatically mark theory as visited when page loads.

**FR-1.3.5** The system shall provide navigation buttons to main page and corresponding practice/visualization page.

### 1.4 Practice Pages

**FR-1.4.1** The system shall implement drag-and-drop interface.

**FR-1.4.2** The system shall allow items to be dragged between source area and drop zones.

**FR-1.4.3** The system shall allow swapping items between drop zones.

**FR-1.4.4** The system shall validate answers when "Check" button is clicked.

**FR-1.4.5** The system shall provide visual feedback (green/red background, animations) for correct/incorrect answers.

**FR-1.4.6** The system shall display success message and save progress upon correct completion.

**FR-1.4.7** The system shall provide "Reset" button to return all items to source area.

### 1.5 Visualization Pages

**FR-1.5.1** The system shall render SVG by calculated coordinates.

**FR-1.5.2** The system shall use Web Workers for graph/fractal coordinate calculations.

**FR-1.5.3** The system shall display loading spinner during calculations.

**FR-1.5.4** The system shall draw coordinate axes, grid lines, and function curves on SVG canvas.

**FR-1.5.5** The system shall display success message and save progress upon visualization completion.

### 1.6 

## 2. Non-Functional Requirements

### 2.1 Performance

**NFR-2.1.1** Page load time shall not exceed 2 seconds on standard broadband connection.

**NFR-2.1.2** Fractal calculations (depth ≤ 6) shall complete within 3 seconds.

### 2.2 Usability

**NFR-2.2.1** The interface shall use age-appropriate language and visual design for 8-10 year olds.

**NFR-2.2.2** All interactive elements shall provide visual hover/focus states.

**NFR-2.2.3** Form inputs shall provide real-time validation feedback (green/red borders).

**NFR-2.2.4** Success/error states shall use color + animation (not color alone).

### 2.3 Compatibility

**NFR-2.3.1** The system shall function correctly on Chrome 60+, Firefox 55+, Edge 79+, Safari 12+.

**NFR-2.3.2** The system shall be responsive and usable on screens ≥768px width.

**NFR-2.3.3** The system shall degrade gracefully on IE 11 with feature warnings.

### 2.4 Maintainability

**NFR-2.4.1** All JavaScript code shall use strict mode and IIFE pattern for scope isolation.

**NFR-2.4.2** Code shall follow consistent naming conventions (camelCase for variables/functions).

**NFR-2.4.3** CSS shall use CSS variables for theming (colors, spacing).

### 2.5 Accessibility

**NFR-2.5.1** All form inputs shall have associated `<label>` elements.

**NFR-2.5.2** Images/icons shall have descriptive alt text or ARIA labels.

### 2.6 Security

**NFR-2.6.1** User input shall be validated client-side (pattern matching, min/max values).

**NFR-2.6.2** localStorage data shall be scoped to application domain.

## 3. Data Requirements

### 3.1 localStorage Schema

**DR-3.1.1** Data shall be stored under key `mathTrainer` as JSON string.

**DR-3.1.2** Root object structure:
```javascript
{
  currentUserId: number | null,
  users: Array<User>
}
```

**DR-3.1.3** User object structure:
```javascript
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
```

### 3.2 Text File Content

**DR-3.2.1** Theory text files shall be UTF-8 encoded plain text.

**DR-3.2.2** Audio files shall be MP3 format, ≤5MB per file.

## 4. Interface Requirements

### 4.1 Navigation Flow

**IR-4.1.1** Main page → Theory page → Practice/Visualization page → Main page (circular flow).

**IR-4.1.2** All pages shall have persistent header with app title and navigation links.

**IR-4.1.3** All pages shall have footer with copyright notice.

**IR-4.1.4** Practice/Visualization pages shall have "Back to Main" and "Back to Theory" buttons.

### 4.2 API Contracts

**IR-4.2.1** Web Worker message format (request):
```javascript
{
  type: "calculateSierpinski" | "calculateGraphs",
  // type-specific parameters
}
```

**IR-4.2.2** Web Worker message format (response):
```javascript
{
  type: "sierpinskiCalculated" | "graphsCalculated",
  data: { /* calculated results */ }
}
```

**IR-4.2.3** Global API exposed via `window.mathTrainer`:
```javascript
{
  loadData: () => Object,
  saveData: (data: Object) => void,
  markTaskComplete: (topic: string) => void
}
```

## 5. Constraints

**C-5.1** No server-side backend or database (pure client-side application).

**C-5.2** No external dependencies.

**C-5.3** No user authentication or multi-device sync.

**C-5.4** localStorage size limit (~5-10MB) constrains number of users.

**C-5.5** Users cannot be deleted once created (intentional design decision).

**C-5.6** Application requires JavaScript enabled to function.

## 6. Assumptions

**A-6.1** Users have access to modern browser with JavaScript enabled.

**A-6.2** Users have basic computer literacy (mouse/touch interaction).

**A-6.3** Users complete topics in order (theory before practice).

**A-6.4** Single device usage per user (no cross-device sync needed).

**A-6.5** Adult supervision available for initial user profile creation.

**A-6.6** Audio files and text files are present in `/assets/` directory.

## 7. Out of Scope 

**OS-7.1** User authentication and password protection.

**OS-7.2** Multi-language support (English only).

**OS-7.3** Mobile native app versions (iOS/Android).

**OS-7.4** User profile deletion or data export.
