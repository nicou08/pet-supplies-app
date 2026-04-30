# TODO

## Appointments feature — full rebuild

The appointment creation flow is currently broken (the calendar component package no longer works) and the booking model is incomplete. When this feature is rebuilt, the following pieces need to land together as one coherent change.

### Decisions / constraints (locked in)

- **Slot duration:** every appointment is exactly 30 minutes. Not configurable per service or per provider. Code that generates or validates slots should carry a comment noting this assumption so a future contributor doesn't quietly break it by adding a 60-min service.
- **No split shifts:** each staff member has at most one continuous working window per weekday (e.g. 9:00–17:00). Schema enforces one row per `(staffId, dayOfWeek)`.
- **No timezones:** all dates and times are interpreted in the server's local timezone. No `Staff.timezone` field, no UTC conversion logic.
- **No buffer between appointments:** back-to-back 30-min slots are valid. Slot generator does not insert cleanup gaps.
- **Canonical time format:** internal `"HH:mm"` 24-hour strings (e.g. `"09:30"`, `"14:00"`). A `formatSlotLabel("09:30") → "9:30 AM"` helper handles display.

### 1. Schema changes — `prisma/schema.prisma`

#### `StaffSchedule` (recurring weekly working hours)

```prisma
model StaffSchedule {
  id          String   @id @default(uuid())
  staffId     String
  staff       Staff    @relation("StaffToSchedule", fields: [staffId], references: [id], onDelete: Cascade)
  dayOfWeek   Int      // 0 = Sunday ... 6 = Saturday
  startMinute Int      // minutes from midnight, e.g. 540 = 09:00
  endMinute   Int      // exclusive, e.g. 1020 = 17:00
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([staffId, dayOfWeek])  // one shift per weekday — split shifts intentionally not supported
  @@index([staffId])
}
```

Storing minutes-since-midnight as `Int` keeps slot arithmetic trivial and avoids string parsing.

#### `StaffTimeOff` (date-range exceptions)

```prisma
model StaffTimeOff {
  id        String   @id @default(uuid())
  staffId   String
  staff     Staff    @relation("StaffToTimeOff", fields: [staffId], references: [id], onDelete: Cascade)
  startsAt  DateTime
  endsAt    DateTime
  reason    String?
  createdAt DateTime @default(now())

  @@index([staffId, startsAt, endsAt])
}
```

#### Updates to `Staff` and `Appointment`

```prisma
model Staff {
  // existing fields ...
  schedules StaffSchedule[] @relation("StaffToSchedule")
  timeOff   StaffTimeOff[]  @relation("StaffToTimeOff")
}

model Appointment {
  // existing fields ...
  @@unique([appointmentProviderId, appointmentDate, appointmentTime])
}
```

The unique constraint on `Appointment` is the last-line race-condition guard. Requires `appointmentTime` normalized to `"HH:mm"`.

### 2. Seed defaults — `prisma/seed.ts`

Each existing `Staff` row gets a default Mon–Fri 9:00–17:00 schedule (`startMinute = 540`, `endMinute = 1020`). No admin UI in this iteration; schedule edits are direct DB until/unless an admin page is built.

### 3. API — `GET /api/staff/[id]/availability?date=YYYY-MM-DD`

New file: `app/api/staff/[id]/availability/route.ts`.

Algorithm:
1. Parse `date` query param; reject malformed or past dates → 400.
2. Confirm staff exists → 404 if not.
3. Look up `StaffSchedule` row for `staffId + dayOfWeek(date)`. If none → return `{ slots: [] }` (off that day).
4. Generate every 30-min slot from `startMinute` to `endMinute` exclusive.
5. Subtract slots inside any `StaffTimeOff` range overlapping `date`.
6. Subtract slots already booked: `findMany` `Appointment` where `appointmentProviderId = staffId` AND `appointmentDate` matches the day; compare against the slot string list.
7. Return `{ slots: string[] }` sorted ascending, `"HH:mm"` format.

No server-side caching for v1 — SWR client cache is enough.

### 4. Hook — `hooks/useStaffAvailability.ts`

Mirror the existing SWR pattern. Gate the SWR key on both `staffId` and `date` being present so the hook is a no-op until the user has selected both.

```ts
export function useStaffAvailability(staffId: string | null, date: Date | null) {
  const key = staffId && date
    ? `/api/staff/${staffId}/availability?date=${formatYMD(date)}`
    : null;
  const { data, error, isLoading } = useSWR(key, fetcher);
  return { slots: data?.slots ?? [], isLoading, isError: error };
}
```

### 5. UI changes

#### `BookingStage4` — disable non-working days

- Update `useStaff` to `include: { schedules: true }` so the provider object carries its schedule.
- `BookingForm` passes the selected provider's schedule down to stage 4.
- Stage 4 derives a `Set<number>` of working `dayOfWeek` values and updates the calendar `disabled` predicate:

```tsx
disabled={(calendarDate) =>
  calendarDate <= new Date() ||
  !workingDaysSet.has(calendarDate.getDay())
}
```

#### `BookingStage5` — replace hardcoded grid with fetched slots

- `BookingForm` passes `providerId` and `date` down.
- Stage 5 calls `useStaffAvailability(providerId, date)` and renders loading / error / empty states.
- Splits results into morning (`< 12:00`) and afternoon (`>= 12:00`) grids, identical layout to today.
- Stores the canonical `"HH:mm"` form in `bookingData.time`; renders via `formatSlotLabel`.

### 6. Backend hardening — `app/api/appointments/route.ts`

UI-side validation is not enough; re-verify on the server:

1. Reject if `appointmentTime` is not in the canonical slot list for that provider/date → 400.
2. Wrap `prisma.appointment.create` in a `try/catch` for `Prisma.PrismaClientKnownRequestError` code `P2002` → 409.
3. Drop or simplify the existing `findFirst` pre-check — the unique constraint is now authoritative.

### 7. Rollout order

Ship in this sequence so nothing breaks mid-deploy:

1. Prisma migration (`StaffSchedule`, `StaffTimeOff`, unique constraint on `Appointment`) + seed defaults.
2. Availability endpoint + hook (independently testable).
3. Update `useStaff` to include `schedules`.
4. `BookingStage4` disabled-days logic.
5. `BookingStage5` swap to hook-driven slots.
6. Harden `POST /api/appointments`.
7. Delete this TODO entry once verified end-to-end.

### Reference: race condition discussion

Original GitHub Copilot finding: check-then-insert race in `app/api/appointments/route.ts:119-150` with no composite unique guard in the schema. Real — but a data-integrity bug, not a security vulnerability. Copilot's suggested unique key (`petTypeId + appointmentDate + appointmentTime + userId`) matches the existing in-code check but is the wrong invariant; the correct one is `(appointmentProviderId, appointmentDate, appointmentTime)`.
