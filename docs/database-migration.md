# Database Migration Guide: MongoDB to PostgreSQL (Drizzle ORM)

This document provides a suggested PostgreSQL schema using Drizzle ORM to facilitate the integration of the BigFive personality test into the "Manual de Perfiles Técnicos" application.

## Suggested Drizzle Schema

```typescript
import { pgTable, serial, text, integer, boolean, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core';

// Results table to replace the MongoDB 'results' collection
export const results = pgTable('b5_results', {
  id: uuid('id').defaultRandom().primaryKey(),
  testId: text('test_id').notNull(),
  lang: text('lang').notNull().default('en'),
  invalid: boolean('invalid').default(false),
  timeElapsed: integer('time_elapsed'),
  dateStamp: timestamp('date_stamp').defaultNow(),
  // Storing answers as JSONB for flexibility,
  // similar to how they are stored in MongoDB
  answers: jsonb('answers').notNull(),

  // Optional: Link to a technician if integrated with the profiles system
  technicianId: integer('technician_id').references(() => technicians.id, { onDelete: 'set null' }),
});

// Feedback table to replace the MongoDB 'feedback' collection
export const feedback = pgTable('b5_feedback', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email'),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

## Implementation Notes for Integration

1.  **Service Layer**: The `web/src/services/` directory already abstracts the data access. When migrating, you only need to update `resultService.ts` and `feedbackService.ts` to use Drizzle instead of the MongoDB client.
2.  **ID Conversion**: MongoDB uses `ObjectId`. In PostgreSQL, we recommend using `UUID` for the results `id` to maintain a similar non-sequential string format in URLs.
3.  **Answers Format**: The Big Five test expects an array of answers:
    ```json
    [
      { "id": "1", "score": 3, "domain": "N", "facet": 1 },
      ...
    ]
    ```
    Storing this as a `JSONB` column in PostgreSQL is the most direct path for integration.

## Relationship with "Manual de Perfiles Técnicos"

You can add a `technician_id` foreign key to the `b5_results` table to link test results directly to the technician profiles managed in your other application.
