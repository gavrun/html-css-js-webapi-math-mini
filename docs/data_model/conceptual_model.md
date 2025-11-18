# Conceptual Data Model

## 1. Entity-Relationship Overview

```
┌──────────────┐
│   AppState   │
│              │
│ currentUserId├──────┐
└──────────────┘      │
                      │ 1:1 (active)
                      ▼
┌──────────────┐    ┌──────────────┐
│     User     │    │   Progress   │
│              │    │              │
│ id (PK)      │───▶│ userId (FK)  │
│ name         │ 1:N│ topicId      │
│ age          │    │ theory       │
│ skill        │    │ task         │
└──────────────┘    └──────────────┘
                           │
                           │ N:1
                           ▼
                    ┌──────────────┐
                    │    Topic     │
                    │              │
                    │ id (PK)      │
                    │ name         │
                    └──────────────┘
```

**Relationships**:
- AppState → User: **1:1** (one active user at a time)
- User → Progress: **1:N** (one user has progress for multiple topics)
- Progress → Topic: **N:1** (many progress records reference one topic)

## 2. Entity Definitions

### 2.1 User Entity

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| `id` | `number` | PK, Auto-increment | Unique user identifier |
| `name` | `string` | Required, Pattern: `[A-Za-z\s]+` | User's full name |
| `age` | `number` | Required, Range: 1-99 | User's age in years |
| `skill` | `enum` | Required, Values: `pre-school`, `school`, `high-school` | Education level |
| `progress` | `object` | Required | Nested progress data |


### 2.2 Progress Entity

**Embedded within User** (denormalized for simplicity)

| Attribute | Type | Constraints | Description |
|-----------|------|-------------|-------------|
| `[topicId].theory` | `boolean` | Default: `false` | Theory page visited |
| `[topicId].task` | `boolean` | Default: `false` | Practice/visualization completed |

**Topic IDs**: `arithmetic`, `fractions`, `graphs`, `fractal`

### 2.3 Topic Entity

**Static reference data** (not stored in localStorage)

| Attribute | Type | Description |
|-----------|------|-------------|
| `id` | `string` | Topic identifier (e.g., `arithmetic`) |
| `name` | `string` | Display name (e.g., `Arithmetics`) |
| `hasTheory` | `boolean` | Has theory page |
| `hasPractice` | `boolean` | Has practice page |
| `hasVisualization` | `boolean` | Has visualization page |

**Hardcoded in `main.js`**: `const TOPICS = ['arithmetic', 'fractions', 'graphs', 'fractal'];`

## 3. Complete localStorage Schema

### 3.1 Storage Keys

| Key | Value Type | Purpose |
|-----|-----------|---------|
| `mathTrainer` | JSON string | Application state + all users |

### 3.2 Full JSON Schema 

```javascript
{
  "currentUserId": number | null,  // Active user ID or null
  "users": [
    {
      "id": number,                 // Auto-incremented
      "name": string,               // e.g., "Alice Smith"
      "age": number,                // e.g., 10
      "skill": string,              // "pre-school" | "school" | "high-school"
      "progress": {
        "arithmetic": {
          "theory": boolean,        // Default: false
          "task": boolean           // Default: false
        },
        "fractions": {
          "theory": boolean,
          "task": boolean
        },
        "graphs": {
          "theory": boolean,
          "task": boolean
        },
        "fractal": {
          "theory": boolean,
          "task": boolean
        }
      }
    }
  ]
}
```

## 4. Data Validation Rules

### 4.1 User Validation

| Field | Rule | Error Handling |
|-------|------|----------------|
| `name` | Regex: `/^[A-Za-z\s]+$/` | HTML5 `pattern` attribute + browser validation |
| `age` | `1 ≤ age ≤ 99` | HTML5 `min`/`max` attributes |
| `skill` | Must be in `SKILLS` array | HTML5 `<select>` dropdown (no free input) |
| `id` | Auto-generated (max existing ID + 1) | No user input |

### 4.2 Progress State Validation

| Rule | Enforcement |
|------|-------------|
| `theory` and `task` must be boolean | Explicit `true`/`false` assignment in code |
| All 4 topics must exist in `progress` object | Initialized on user creation |
| Cannot mark task complete without visiting theory | UI flow (practice links from theory page) |


## 5. Data Operations (incomplete CRUD)

### 5.1 Create User

```javascript
function handleCreateUser(formData) {
  //
}
```

### 5.2 Read Active User

```javascript
function getCurrentUser() {
  //
}
```

### 5.3 Update Progress

```javascript
function markTaskComplete(topic) {
  //
}
```

**Note**: No Delete or full Update operations (users cannot be deleted/edited)

## 6. Data Migration & Versioning

### 6.1 Schema Version

**Current**: Implicit v1 (no version `schemaVersion` field stored)

### 6.2 Migration

## 7. Data Constraints & Business Logic

| Constraint | Implementation |
|-----------|----------------|
| **Unique User IDs** | Auto-increment (max ID + 1) |
| **No Duplicate Names** | Not enforced (allowed by design) |
| **Topic Completion** | Both `theory` AND `task` must be `true` |
| **Active User Required** | Redirect to index.html if `currentUserId === null` on topic pages |
| **Progress Immutability** | Cannot reset progress (no UI for it) |
| **User Deletion Forbidden** | No delete function exposed |


## 8. Data Access Patterns

### 8.1 Common Queries

| Query | Implementation | Frequency |
|-------|---------------|-----------|
| Get all users | `data.users` | On page load (index.html) |

### 8.2 Performance

- **Read**: O(n) for user lookup (linear search, acceptable for <100 users)
- **Write**: O(1) for progress update (direct object access)
- **Storage**: ~500 bytes per user → ~50KB for 100 users (well within 5MB limit)

## 9. Data Integrity

### 9.1 Safeguards

| Risk | Mitigation |
|------|-----------|
| **Corrupted JSON** | `try-catch` on parse then return default structure |
| **Missing Fields** | Check existence before access |
| **Type Mismatch** | HTML5 form validation prevents invalid input |
| **Concurrent Writes** | Single-tab assumption (no locking mechanism) |

### 9.2 Recovery 

## 10. Example Data Scenarios
