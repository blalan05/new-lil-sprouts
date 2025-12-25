# Care Session Management System Design

## Overview

The care session management system supports two types of sessions:
1. **Impromptu Sessions** - One-time, ad-hoc care sessions created on demand
2. **Recurring Schedules** - Repeating patterns (e.g., "Mon/Wed/Fri 6am-2:30pm") that generate individual session instances

## Database Schema

### CareSchedule Model
Represents a recurring care pattern (template for sessions).

**Fields:**
- `id` - Unique identifier
- `name` - Descriptive name (e.g., "Regular Mon/Wed/Fri Care")
- `recurrence` - Pattern type (ONCE, WEEKLY, BIWEEKLY, MONTHLY)
- `daysOfWeek` - Array of days this schedule applies (MONDAY, WEDNESDAY, FRIDAY, etc.)
- `startTime` - Time in HH:mm format (e.g., "06:00")
- `endTime` - Time in HH:mm format (e.g., "14:30")
- `hourlyRate` - Optional default rate for sessions
- `isActive` - Whether this schedule is currently active
- `startDate` - When this schedule begins
- `endDate` - Optional end date for the schedule
- `notes` - Additional information
- `familyId` - Which family this schedule belongs to
- `children[]` - Which children are included in this schedule

### CareSession Model
Represents an actual care session instance.

**Fields:**
- `id` - Unique identifier
- `scheduledStart` - When the session is scheduled to start
- `scheduledEnd` - When the session is scheduled to end
- `actualStart` - When the session actually started (null until started)
- `actualEnd` - When the session actually ended (null until completed)
- `status` - Current status (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED)
- `hourlyRate` - Rate for this specific session
- `notes` - Session-specific notes
- `isConfirmed` - Whether this session has been confirmed by the family
- `familyId` - Which family this session is for
- `scheduleId` - Optional link to the recurring schedule that generated this session
- `children[]` - Which children are attending this session

## User Flow

### Creating Recurring Schedules

1. **Family creates a schedule template:**
   - Choose name (e.g., "Regular Weekday Care")
   - Select recurrence pattern (WEEKLY)
   - Select days of week (Monday, Wednesday, Friday)
   - Set time range (06:00 - 14:30)
   - Set hourly rate (optional)
   - Select which children
   - Set start date and optional end date

2. **System generates session instances:**
   - Schedule is created but NO sessions exist yet
   - Admin/Nanny generates sessions for a date range (e.g., next 2 weeks)
   - System creates individual CareSession records for each matching day
   - All generated sessions start as `isConfirmed: false`

3. **Family confirms or cancels sessions:**
   - Family reviews upcoming unconfirmed sessions
   - Can confirm individual sessions (sets `isConfirmed: true`)
   - Can cancel individual sessions (sets `status: CANCELLED`)
   - Only confirmed sessions appear in the final schedule

### Creating Impromptu Sessions

1. **Direct session creation:**
   - Select family and children
   - Choose specific date and time
   - Set hourly rate
   - Mark as confirmed immediately (optional)
   - No schedule template needed

2. **Session is created directly:**
   - Creates a CareSession with `scheduleId: null`
   - Can be confirmed immediately or require confirmation

## Key Features

### Session Confirmation Flow
- Generated sessions from schedules are **unconfirmed by default**
- Prevents auto-creating sessions the family doesn't want
- Family can review and confirm/cancel each instance
- Nanny sees which sessions are confirmed vs tentative

### Schedule Management
- Schedules can be activated/deactivated without deleting
- Editing a schedule doesn't affect already-generated sessions
- Can generate sessions weeks or months in advance
- Each session can be individually modified after generation

### Session States
1. **SCHEDULED + unconfirmed** - Generated but awaiting family confirmation
2. **SCHEDULED + confirmed** - Confirmed and ready to happen
3. **IN_PROGRESS** - Care session has started (actualStart recorded)
4. **COMPLETED** - Care session finished (actualEnd recorded)
5. **CANCELLED** - Session was cancelled

## API Actions

### CareSchedule Actions
- `createCareSchedule` - Create a new recurring schedule template
- `updateCareSchedule` - Modify an existing schedule
- `deleteCareSchedule` - Remove a schedule (doesn't affect generated sessions)
- `generateSessionsFromSchedule` - Create session instances for a date range

### CareSession Actions
- `createImpromptuSession` - Create a one-time session
- `updateCareSession` - Modify session details
- `confirmCareSession` - Mark session as confirmed
- `cancelCareSession` - Cancel a session
- `startCareSession` - Begin a session (records actual start time)
- `completeCareSession` - End a session (records actual end time)
- `deleteCareSession` - Remove a session entirely

### Query Actions
- `getCareSchedules` - Get all schedules for a family
- `getCareSchedule` - Get single schedule with details
- `getCareSessions` - Get all sessions for a family
- `getCareSession` - Get single session with details
- `getUnconfirmedSessions` - Get upcoming sessions needing confirmation

## Example Workflows

### Workflow 1: Regular Weekly Care
1. Nanny creates schedule: "Mon/Wed/Fri Morning Care" (6am-2:30pm)
2. Nanny generates sessions for next month
3. System creates 13 session instances (roughly 3 per week × 4 weeks)
4. Family receives notification of unconfirmed sessions
5. Family reviews and confirms all sessions except one vacation week
6. Family cancels 3 sessions during vacation
7. Confirmed sessions appear on nanny's schedule
8. On care days, nanny starts/completes sessions to track actual times

### Workflow 2: Impromptu Care
1. Parent calls: "Can you watch Emma tomorrow 3pm-7pm?"
2. Nanny creates impromptu session for tomorrow
3. Selects Emma, sets 3pm-7pm, sets rate
4. Marks as confirmed immediately
5. Session appears on schedule
6. Next day, nanny tracks actual start/end times

### Workflow 3: Schedule Changes
1. Family wants to add Tuesdays to their schedule
2. Nanny updates schedule to include Tuesday
3. Old sessions (Mon/Wed/Fri) are unchanged
4. Nanny generates new sessions from updated schedule
5. New Tuesday sessions are created
6. Family confirms new sessions

## Benefits

✅ **Flexible** - Supports both planned and impromptu care
✅ **Family Control** - Families confirm sessions before they're final
✅ **No Surprises** - Sessions aren't auto-billed without confirmation
✅ **Easy Planning** - Generate weeks/months of sessions at once
✅ **Individual Control** - Each session can be modified independently
✅ **Accurate Tracking** - Scheduled vs actual times are both recorded
✅ **Tax Friendly** - Complete record of all care provided with rates

## UI Recommendations

### Family Dashboard
- **Unconfirmed Sessions** widget (requires attention)
- **Upcoming Confirmed Sessions** calendar view
- **Quick Actions**: Confirm, Cancel, Request Changes
- **Schedule Overview**: See recurring patterns

### Nanny Dashboard
- **Today's Sessions** - with start/complete buttons
- **This Week's Schedule** - confirmed sessions only
- **Unconfirmed Sessions** - pending family review
- **Generate Sessions** - for active schedules

### Family Detail Page
- **Active Schedules** section
- **Upcoming Sessions** (next 2 weeks)
- **Session History** (past sessions)
- Quick links to create impromptu sessions