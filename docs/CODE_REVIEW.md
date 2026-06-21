# Code Review Report — Task Board Management System (TBMS)

**Branch:** `main` (`0076f65`)  
**Scope:** Full application codebase  
**Date:** June 21, 2026  
**Reviewer focus:** Bugs, regressions, security, missing tests

---

## Executive Summary

The app is a React + TypeScript kanban-style task board with localStorage persistence. Architecture is reasonable (context, lazy routes, simulated API), but several data-layer and form bugs will cause incorrect behavior once users create or edit tasks via the UI. There is no automated test coverage.

**Top risks:**

1. Form dropdown values do not match domain enums (critical data corruption)
2. Due date and tags cannot be set in the UI despite being in the model
3. No validation of persisted data on read

---

## Findings by Severity

### Critical

| # | Issue | Location | Impact |
|---|--------|----------|--------|
| 1 | **Status/priority enum mismatch in form** | `TaskForm.tsx` vs `types/index.ts` | Form uses `Backlog`, `InProgress`, `Low`; domain uses `backlog`, `in_progress`, `low`. Dashboard counts, priority sort, and badges break after dropdown use. |
| 2 | **Due date & tags not in form UI** | `TaskForm.tsx` | `useTaskForm` supports them; form never renders inputs. Users cannot set/edit these fields. |

#### 1. Status/priority form values do not match domain enums

`TaskForm` uses PascalCase option values (`Backlog`, `InProgress`, `Low`, etc.), but the domain model uses snake_case/lowercase (`backlog`, `in_progress`, `low`, etc.).

`useTaskForm` defaults to the correct values (`backlog`, `medium`), but any change via the dropdown persists invalid values.

**Impact:**

- Dashboard stats use strict equality (`t.status === TaskStatus.Backlog`) — moved/edited tasks disappear from counts.
- Priority sorting breaks (`priorityWeight['High']` is `undefined` → `NaN` sort order).
- `Badge` styling can break (`priorityStyles[value]` is `undefined` for wrong casing).
- Board column matching only works by accident via string normalization; filters and analytics do not.

#### 2. Due date and tags are modeled but not editable in the UI

`useTaskForm` validates and submits `dueDate` and `tags`, but `TaskForm` never renders inputs for them. Users cannot set or edit these fields through create/edit flows, even though `TaskDetail` displays them.

---

### High

| # | Issue | Location | Impact |
|---|--------|----------|--------|
| 3 | **No storage validation on read** | `taskApi.ts` | Corrupt localStorage can crash the app (e.g. missing `tags`). `isTaskArray` exists but is unused. |
| 4 | **Split state: context vs direct API** | `TaskDetail.tsx`, `EditTask.tsx` | Detail/edit bypass `TaskContext`; stale data after mutations until remount. |
| 5 | **`moveTask` race / stale rollback** | `TaskContext.tsx` | Optimistic update captures `tasks` in closure; rapid drags can revert to wrong snapshot. |

#### 3. No validation of persisted task data on read

`taskApi.getTasks()` reads raw JSON from localStorage with no schema check, despite `isTask` / `isTaskArray` existing in `types/index.ts`.

Corrupted or manually edited storage (e.g. missing `tags`) can cause runtime errors such as `task.tags.length` in `TaskDetail.tsx`.

#### 4. Split state between `TaskContext` and direct API reads

`TaskDetail` and `EditTask` fetch via `taskApi` directly instead of using `TaskContext`. After context mutations, detail/edit views can show stale data until remounted. There is no shared refresh strategy.

#### 5. Optimistic `moveTask` is vulnerable to race conditions

`originalTasks` is captured from closure. Rapid consecutive drags can roll back to an outdated snapshot and lose intermediate moves.

Also, `moveTask` depends on `[tasks, addToast]`, so it is recreated on every task change — unnecessary churn and easier stale-closure bugs.

---

### Medium

| # | Issue | Location | Impact |
|---|--------|----------|--------|
| 6 | **Inconsistent localStorage keys** | `taskApi.ts` (`task_board_data`) vs `storageUtility.ts` (`tasks_board_data`) | Legacy helpers unused; old data would not load. |
| 7 | **Priority sort ignores `sortOrder`** | `TaskContext.tsx` | Priority always sorts low→high; inconsistent with date/title sorting. |
| 8 | **Board cards not linked to detail** | `BoardView.tsx` | `/tasks/:id` exists but cards are not clickable. |
| 9 | **Delete inside draggable card** | `BoardView.tsx` | Delete can trigger drag; poor UX/a11y. |
| 10 | **Duplicate `fetchTasks` on board** | `TaskContext.tsx` + `BoardView.tsx` | Extra API calls and loading flicker on every board visit. |

---

### Low

| # | Issue | Location | Impact |
|---|--------|----------|--------|
| 11 | **Dead code** | `storageUtility`, `useDebounce`, `useLocalStorage` | Unused exports increase maintenance cost. |
| 12 | **Toast gaps** | `ToastContext.tsx` | ID collisions, no unmount cleanup, no dismiss/a11y. |
| 13 | **Missing assets & tests** | `index.html`, `package.json` | No `favicon.svg`; no test script or test files. |
| 14 | **Minor UX inconsistencies** | Navigation, buttons, `window.confirm` | Create → `/`, edit → `/board`; cancel/submit look identical. |

---

## Security

| Area | Assessment |
|------|------------|
| XSS | Low risk — React default escaping; no `dangerouslySetInnerHTML` |
| Secrets | None found in source |
| Data storage | localStorage only; unencrypted, per-origin (fine for demo) |

No critical security vulnerabilities identified for the current scope.

---

## Missing Tests

| Area | Suggested coverage |
|------|-------------------|
| Form payload mapping | Status/priority values match enums |
| Storage round-trip | Create/read/update/delete via `taskApi` |
| Board behavior | Drag-and-drop status changes |
| Validation | `isTask` / `isTaskArray` on corrupt input |
| Context | Optimistic `moveTask` rollback |

**Current state:** 0 test files; no `test` script in `package.json`.

---

## Recommended Fix Order

1. Align `TaskForm` option values with `TaskStatus` / `Priority` constants
2. Add due date and tags fields to `TaskForm`
3. Validate storage reads with `isTaskArray`
4. Route detail/edit through `TaskContext` or sync after mutations
5. Fix `moveTask` (functional rollback; remove `tasks` from callback deps)
6. Add unit tests for form + API + context

---

## Code References

**Enum mismatch (form)** — `src/components/forms/TaskForm.tsx`:

```tsx
const statusOptions = [
  { value: 'Backlog', label: 'Backlog' },
  { value: 'InProgress', label: 'In Progress' },
  // ...
];

const priorityOptions = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  // ...
];
```

**Domain enums (correct values)** — `src/types/index.ts`:

```tsx
export const TaskStatus = {
  Backlog: 'backlog',
  InProgress: 'in_progress',
  Review: 'review',
  Done: 'done',
} as const;

export const Priority = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Critical: 'critical',
} as const;
```

**Unvalidated storage read** — `src/services/taskApi.ts`:

```tsx
const tasks = storageUtility.get<Task[]>(STORAGE_KEY, []);
return { success: true, message: 'Tasks fetched successfully', data: tasks };
```

**Optimistic move race** — `src/context/TaskContext.tsx`:

```tsx
const originalTasks = [...tasks];
setTasks((prev) => prev.map(/* optimistic update */));
const response = await taskApi.moveTask(id, status);
if (!response.success) {
  setTasks(originalTasks);
}
```
