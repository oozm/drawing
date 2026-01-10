CREATE TABLE `component_stats` (
	`componentId` text PRIMARY KEY NOT NULL,
	`views` integer DEFAULT 0,
	`favorites` integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`userId` text NOT NULL,
	`componentId` text NOT NULL,
	`createdAt` integer NOT NULL,
	PRIMARY KEY(`userId`, `componentId`)
);
