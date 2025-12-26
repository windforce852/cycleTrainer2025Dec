# Cycle Training Stopwatch Web App - Development Plan

## Overview
A responsive web application for cycle training with two distinct modes, data persistence, and visualization capabilities.

## Architecture

### Tech Stack
- **React + Vite** - Frontend framework and build tool
- **React Router** (if needed) - Navigation between modes/results
- **Chart.js or Recharts** - For visualization charts
- **Local Storage API** - Data persistence
- **CSS Modules or Tailwind CSS** - Styling (mobile-responsive)
- **Vitest + React Testing Library** - Testing framework

### Project Structure
```
src/
├── components/
│   ├── ModeSelector.tsx          # Mode selection screen
│   ├── Mode1Config.tsx           # Mode 1 configuration form
│   ├── Mode1Training.tsx         # Mode 1 training interface
│   ├── Mode1Results.tsx          # Mode 1 results display
│   ├── Mode2Training.tsx         # Mode 2 training interface (no config needed)
│   ├── Mode2Results.tsx           # Mode 2 results with charts
│   ├── TimerDisplay.tsx          # Reusable timer component
│   ├── Button.tsx                # Reusable button component
│   └── SessionList.tsx           # Past sessions list view
├── hooks/
│   ├── useTimer.ts               # Timer logic hook
│   └── useLocalStorage.ts        # Local storage management
├── utils/
│   ├── exportData.ts             # JSON/CSV export functions
│   ├── chartData.ts              # Chart data formatting
│   └── types.ts                  # TypeScript types/interfaces
├── App.tsx                        # Main app component
└── main.tsx                       # Entry point
```

## Features

### Mode 1: Timed Cycles
- **Configuration:**
  - Cycle duration (seconds/minutes)
  - Rest time between cycles
  - Number of cycles (number or "unlimited")
  - Buffer time before first cycle (with countdown display)
- **Training Interface:**
  - Countdown during buffer time
  - Timer showing current cycle/rest time
  - Current round number
  - Auto-starts when coming from configuration screen (Start button hidden)
  - Pause/Resume, Finish buttons (Start button only shown if not auto-started)
  - Text color change notifications (cycle start/end)
- **Results:**
  - Total rounds completed
  - Cycle duration (fixed, as configured)
  - Total training time
  - Export options

### Mode 2: Manual Cycles
- **Configuration:**
  - No configuration needed (unlimited cycles by default)
- **Training Interface:**
  - Timer showing elapsed time for current cycle
  - Current round number
  - Start, End Round, Stop/Resume, Finish buttons
  - Button logic:
    - Start → shows "End Round" + "Stop"
    - Stop → becomes "Resume" + "Finish" appears + "End Round" is **disabled**
    - Resume → becomes "Stop" + "Finish" disappears + "End Round" is **enabled**
    - Finish → ends training (only visible when stopped)
  - Text color change notifications
- **Results:**
  - Line chart: Cycle duration over time (trend)
  - Vertical scrolling bar chart: Individual cycle durations with numbers
  - Statistics: Total cycles, average time, min/max times
  - Export options

### Data Management
- **Local Storage:**
  - Save all training sessions with metadata (timestamp, mode, config)
  - Session list view with ability to view details
  - Delete sessions option
- **Export:**
  - JSON export (full session data)
  - CSV export (cycle times, timestamps)

### UI/UX Requirements
- Mobile-responsive design
- Clean, modern interface
- Visual feedback (text color changes for notifications)
- Smooth transitions and animations
- Accessible button sizes for mobile (min 44x44px)

## Coding Principles
- **Component Structure:** Single responsibility, reusable components
- **State Management:** Use hooks appropriately, avoid prop drilling
- **Type Safety:** Full TypeScript coverage, no `any` types
- **Code Organization:** Clear separation of concerns (components, hooks, utils)
- **Error Handling:** Proper error boundaries and user feedback
- **Performance:** Memoization where needed, avoid unnecessary re-renders
- **Accessibility:** Semantic HTML, ARIA labels, keyboard navigation
- **Code Quality:** ESLint rules, consistent formatting, meaningful names

## Testing Strategy
- **Unit Tests:** Test individual components and hooks in isolation
- **Integration Tests:** Test component interactions and data flow
- **Test Coverage:** Aim for >80% coverage on critical logic
- **Test-Driven Development:** Write tests before/alongside implementation

## Implementation Details

### State Management
- Use React hooks (useState, useEffect, useRef) for timer logic
- Custom hooks for timer and session management
- Local storage sync on session completion

### Timer Logic
- Use `requestAnimationFrame` or `setInterval` for precise timing
- Handle pause/resume state
- Track cycle start/end timestamps
- Calculate elapsed times accurately

### Chart Implementation
- Mode 2 line chart: X-axis (cycle number), Y-axis (duration in seconds)
- Mode 2 bar chart: Vertical bars with cycle numbers and durations
- Use Chart.js or Recharts library

### Button State Logic (Mode 2)
```
Initial: [Start]
After Start: [End Round] [Stop]
After Stop: [End Round - DISABLED] [Resume] [Finish]
After Resume: [End Round] [Stop]
After Finish: Navigate to results
```

## Detailed Implementation Steps

### Phase 1: Setup & Core Structure

#### Step 1.1: Initialize Project
- [ ] Initialize Vite + React + TypeScript project with npm/yarn
- [ ] Verify project runs successfully
- [ ] **Manual Verification:** Run `npm run dev` and see default Vite page

#### Step 1.2: Setup Development Tools
- [ ] Configure ESLint with React/TypeScript rules
- [ ] Configure Prettier for code formatting
- [ ] Set up Vitest + React Testing Library
- [ ] Create test configuration files
- [ ] **Test:** Run `npm run test` and verify test framework works

#### Step 1.3: Create Project Structure
- [ ] Create folder structure (components, hooks, utils, types)
- [ ] Create base component files (empty for now)
- [ ] Create base hook files (empty for now)
- [ ] Create base utility files (empty for now)
- [ ] **Manual Verification:** Check folder structure matches plan

#### Step 1.4: Install Dependencies
- [ ] Install Chart.js/Recharts for visualization
- [ ] Install React Router (if needed for navigation)
- [ ] Install CSS framework (Tailwind CSS or CSS Modules setup)
- [ ] **Manual Verification:** Check package.json for all dependencies

### Phase 2: Type Definitions & Base Components

#### Step 2.1: Create Type Definitions
- [ ] Define TypeScript interfaces for training sessions
- [ ] Define configuration types for Mode 1 and Mode 2
- [ ] Define cycle data types
- [ ] Define button state types
- [ ] **Test:** Verify types compile correctly with `tsc --noEmit`

#### Step 2.2: Create Reusable Button Component
- [ ] Build Button component with variants (primary, secondary)
- [ ] Add disabled state styling
- [ ] Add proper TypeScript props
- [ ] **Test:** Write unit tests for Button component (rendering, variants, disabled state)

#### Step 2.3: Create Timer Display Component
- [ ] Build TimerDisplay component for MM:SS format
- [ ] Handle time formatting logic
- [ ] Add proper TypeScript props
- [ ] **Test:** Write unit tests for TimerDisplay (formatting, edge cases)

#### Step 2.4: Create Timer Hook
- [ ] Create useTimer hook with start, pause, resume, reset functionality
- [ ] Implement elapsed time calculation
- [ ] Handle timer state management
- [ ] **Test:** Write comprehensive unit tests for useTimer hook (all states, edge cases)

### Phase 3: Mode 1 Implementation

#### Step 3.1: Mode 1 Configuration Form
- [ ] Build Mode1Config component
- [ ] Add inputs: cycle duration, rest time, number of cycles (or unlimited), buffer time
- [ ] Add form validation
- [ ] Add submit handler that transitions to training screen
- [ ] "Start Training" button automatically starts training (no manual Start needed)
- [ ] **Test:** Write unit tests for form validation and submission

#### Step 3.2: Mode 1 Training Logic
- [ ] Implement training state machine: buffer → cycle → rest → cycle (repeat)
- [ ] Handle cycle counting
- [ ] Handle unlimited cycles option
- [ ] Integrate with useTimer hook
- [ ] **Test:** Write unit tests for state transitions

#### Step 3.3: Mode 1 Training UI
- [ ] Build Mode1Training component
- [ ] Add buffer countdown display
- [ ] Add cycle/rest timer display
- [ ] Add round counter
- [ ] Implement auto-start functionality (via autoStart prop)
- [ ] Add Start button (hidden when auto-starting), Pause/Resume, Finish buttons
- [ ] Connect buttons to training logic
- [ ] **Test:** Write integration tests for button interactions and state changes

#### Step 3.4: Mode 1 Results Display
- [ ] Create Mode1Results component
- [ ] Display total rounds completed
- [ ] Display cycle duration (fixed)
- [ ] Display total training time
- [ ] Add export buttons (JSON/CSV) - functionality to be added later
- [ ] **Test:** Write unit tests for results display

### Phase 4: Mode 2 Implementation

#### Step 4.1: Mode 2 Training Logic
- [ ] Implement manual cycle timing logic
- [ ] Track cycle start/end timestamps
- [ ] Record cycle durations
- [ ] Implement button state management (Start/End Round/Stop/Resume/Finish)
- [ ] **Critical:** Ensure "End Round" is disabled when Stop is pressed
- [ ] **Test:** Write unit tests for cycle recording and button states

#### Step 4.2: Mode 2 Training UI
- [ ] Build Mode2Training component
- [ ] Add timer display for current cycle
- [ ] Add round counter
- [ ] Add Start button
- [ ] Add End Round button (with disable logic)
- [ ] Add Stop/Resume toggle button
- [ ] Add Finish button (only visible when stopped)
- [ ] Implement button state transitions
- [ ] **Test:** Write integration tests for all button states and transitions

#### Step 4.3: Mode 2 Chart Components
- [ ] Create line chart component for cycle duration trend
- [ ] Create vertical scrolling bar chart for individual cycles
- [ ] Format chart data from cycle records
- [ ] Add chart labels and legends
- [ ] **Test:** Write unit tests for chart data formatting

#### Step 4.4: Mode 2 Results Display
- [ ] Build Mode2Results component
- [ ] Integrate line chart (trend over time)
- [ ] Integrate vertical scrolling bar chart
- [ ] Display statistics (total cycles, average, min, max)
- [ ] Add export buttons (JSON/CSV) - functionality to be added later
- [ ] **Test:** Write unit tests for results display and chart rendering

### Phase 5: Data Persistence & Export

#### Step 5.1: Local Storage Hook
- [ ] Create useLocalStorage hook
- [ ] Implement save functionality
- [ ] Implement retrieve functionality
- [ ] Handle storage errors gracefully
- [ ] **Test:** Write unit tests for local storage operations

#### Step 5.2: Session Persistence
- [ ] Integrate session saving after Mode 1 completion
- [ ] Integrate session saving after Mode 2 completion
- [ ] Add session metadata (timestamp, mode, config)
- [ ] **Test:** Write integration tests for session persistence

#### Step 5.3: Session List View
- [ ] Build SessionList component
- [ ] Display list of past sessions with date, mode, basic stats
- [ ] Add session selection functionality
- [ ] Add delete session functionality
- [ ] **Test:** Write unit tests for session list operations

#### Step 5.4: Session Details View
- [ ] Create session details view component
- [ ] Display full session data
- [ ] Show results (Mode 1 or Mode 2 format)
- [ ] Add navigation back to list
- [ ] **Test:** Write unit tests for session details display

#### Step 5.5: Export Functionality
- [ ] Implement JSON export function
- [ ] Implement CSV export function
- [ ] Add export buttons to results components
- [ ] Test file download functionality
- [ ] **Test:** Write unit tests for export functions

### Phase 6: UI/UX Enhancements

#### Step 6.1: Visual Notifications
- [ ] Add text color change on cycle start (Mode 1)
- [ ] Add text color change on cycle end (Mode 1)
- [ ] Add text color change on cycle start (Mode 2)
- [ ] Add text color change on cycle end (Mode 2)
- [ ] Add smooth color transitions
- [ ] **Manual Test:** Verify color changes are visible and smooth

#### Step 6.2: Mobile Responsive Design
- [ ] Review all components for mobile layout
- [ ] Ensure button touch targets are at least 44x44px
- [ ] Test responsive layouts on various screen sizes
- [ ] Fix any layout issues
- [ ] **Manual Test:** Test on actual mobile device

#### Step 6.3: Styling & Visual Polish
- [ ] Apply consistent color scheme
- [ ] Add visual hierarchy
- [ ] Style all components consistently
- [ ] Add loading states where appropriate
- [ ] **Manual Test:** Review UI for consistency and polish

#### Step 6.4: Animations & Transitions
- [ ] Add smooth transitions for state changes
- [ ] Add animations for notifications
- [ ] Add page transition animations (if using router)
- [ ] Ensure animations don't impact performance
- [ ] **Manual Test:** Verify animations are smooth

#### Step 6.5: Accessibility
- [ ] Add ARIA labels to interactive elements
- [ ] Ensure keyboard navigation works
- [ ] Use semantic HTML elements
- [ ] Test with screen reader (if possible)
- [ ] **Manual Test:** Navigate using keyboard only

### Phase 7: Testing & Refinement

#### Step 7.1: End-to-End Testing
- [ ] Test complete Mode 1 flow: config → training → results → export
- [ ] Test complete Mode 2 flow: training → results → export
- [ ] Test session list and details view
- [ ] Test local storage persistence
- [ ] **Manual Test:** Complete user journey on desktop and mobile

#### Step 7.2: Performance Optimization
- [ ] Add React.memo where appropriate
- [ ] Optimize re-renders
- [ ] Analyze bundle size
- [ ] Lazy load chart components if needed
- [ ] **Test:** Run performance profiling

#### Step 7.3: Bug Fixes & Refinement
- [ ] Fix any bugs found during testing
- [ ] Refine UI/UX based on testing
- [ ] Code review and refactoring
- [ ] Update documentation
- [ ] **Final Manual Test:** Complete testing on multiple devices

## Future Considerations
- Audio notifications (low priority)
- Firebase hosting setup (after local testing)
- Additional statistics and analytics
- PWA capabilities for offline use

## Development Workflow
1. Complete each step in order
2. Write tests alongside implementation
3. Run tests after each step: `npm run test`
4. Manual verification after each phase
5. Commit changes after completing each step
6. Continue to next step only after current step is verified

## Notes
- Mode 1: "Start Training" button in configuration automatically starts training; Start button in training screen is hidden when auto-starting
- Mode 2 has no configuration screen - goes directly to training
- "End Round" button must be disabled when Stop is pressed in Mode 2
- All components should be mobile-responsive
- Test on actual mobile devices, not just browser dev tools
- Maintain >80% test coverage on critical logic

