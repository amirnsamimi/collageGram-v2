import {pgTable, uuid, varchar, text, timestamp, boolean, integer} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm"
import {createInsertSchema, createSelectSchema} from 'drizzle-zod'

// DB TABLE TYPESAFE MAPPING

/**
 *
 * @params 'username', 'email', ... are actual db_columns name
 * @params id, email, ... are properties which used to generate type schemas for zod and creating table.
 * @function varchar() timestamp() uuid() primaryKey() defaultRandom() notNull() unique() defaultNow() are functions to declare types and narrow them
 *
 * @author amir samimi
 *
 */

export const users = pgTable('users', {
    id: uuid().primaryKey().defaultRandom(),
    email: varchar('email',{ length: 255}).notNull().unique(),
    username: varchar('username', { length: 255}).notNull().unique(),
    password: varchar('password', { length: 255}).notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// ZOD Schemas
export const selectUserSchema = createSelectSchema(users)
export const insertUserSchema = createInsertSchema(users)

// Type Export
export type selectUser = typeof users.$inferSelect
export type insertUser = typeof users.$inferInsert