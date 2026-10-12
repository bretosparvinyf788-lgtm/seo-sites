CREATE TABLE `visitor_finds` (
	`visitor` text NOT NULL,
	`product` text NOT NULL,
	`saved_at` integer,
	`viewed_at` integer,
	PRIMARY KEY(`visitor`, `product`)
);
