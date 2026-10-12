import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
export const visitorFinds = sqliteTable('visitor_finds', {
 visitor: text('visitor').notNull(),
 product: text('product').notNull(),
 savedAt: integer('saved_at'),
 viewedAt: integer('viewed_at'),
}, table => [primaryKey({columns:[table.visitor,table.product]})]);
