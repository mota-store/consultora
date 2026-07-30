CREATE TABLE `consultoras` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`senha` varchar(255) NOT NULL,
	`telefone` varchar(20),
	`whatsapp` varchar(20) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `consultoras_id` PRIMARY KEY(`id`),
	CONSTRAINT `consultoras_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `conversas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`mensagem` text NOT NULL,
	`remetente` enum('usuario','talia') NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conversas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`telefone` varchar(20) NOT NULL,
	`email` varchar(320),
	`status` enum('novo','negociacao','fechado','acompanhamento') NOT NULL DEFAULT 'novo',
	`intencaoTroca` varchar(255),
	`beneficiario` varchar(255),
	`idades` text,
	`motivoBusca` varchar(255),
	`preferenciasOperadora` varchar(255),
	`condicoesPre` text,
	`abrangencia` varchar(50),
	`redeAmpla` varchar(50),
	`criterioPreco` varchar(50),
	`dataConversa` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `conversas` ADD CONSTRAINT `conversas_leadId_leads_id_fk` FOREIGN KEY (`leadId`) REFERENCES `leads`(`id`) ON DELETE cascade ON UPDATE no action;