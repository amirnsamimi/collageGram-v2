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
    email: varchar('email', {length: 255}).notNull().unique(),
    username: varchar('username', {length: 255}).notNull().unique(),
    password: varchar('password', {length: 255}).notNull(),
    firstName: varchar('first_name', {length: 255}),
    lastName: varchar('last_name', {length: 255}),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
})

export const userAssets = pgTable('userAssets', {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid('user_id')
        .references(() => users.id, {onDelete: 'cascade'})
        .notNull(),
    name: varchar('name', {length: 255}).notNull(),
    description: text('description'),
    type: varchar('type', {length: 255}).notNull(),
    url: varchar('url', {length: 255}).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
})


// ZOD Schemas
export const selectUserSchema = createSelectSchema(users)
export const insertUserSchema = createInsertSchema(users)
export const selectUserAssetsSchema = createSelectSchema(userAssets)
export const insertUserAssetsSchema = createInsertSchema(userAssets)


// Type Export
export type selectUser = typeof users.$inferSelect
export type insertUser = typeof users.$inferInsert
export type selectUserAssets = typeof userAssets.$inferSelect
export type insertUserAssets = typeof userAssets.$inferInsert
