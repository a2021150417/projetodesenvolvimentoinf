-- -------------------------------------------------------------
-- TablePlus 6.9.0(668)
--
-- https://tableplus.com/
--
-- Database: quickpass
-- Generation Time: 2026-05-05 22:03:10.0320
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."bilhetes";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS bilhetes_id_bilhete_seq;

-- Table Definition
CREATE TABLE "public"."bilhetes" (
    "id_bilhete" int4 NOT NULL DEFAULT nextval('bilhetes_id_bilhete_seq'::regclass),
    "id_utilizador" int4 NOT NULL,
    "id_evento" int4 NOT NULL,
    "codigo_qr" varchar(100) NOT NULL,
    "data_compra" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id_bilhete")
);

DROP TABLE IF EXISTS "public"."eventos";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS eventos_id_evento_seq;

-- Table Definition
CREATE TABLE "public"."eventos" (
    "id_evento" int4 NOT NULL DEFAULT nextval('eventos_id_evento_seq'::regclass),
    "titulo" varchar(100) NOT NULL,
    "descricao" text NOT NULL,
    "descricao_curta" varchar(150),
    "data_hora" timestamp NOT NULL,
    "hora_portas" time,
    "hora_inicio" time,
    "preco" numeric(6,2) NOT NULL,
    "stock_disponivel" int4 NOT NULL DEFAULT 0,
    "foto_evento" varchar(255),
    "categoria" varchar(50),
    "distrito" varchar(30),
    "local_evento" varchar(100),
    "morada" varchar(150),
    "em_alta" bool DEFAULT false,
    "novo" bool DEFAULT true,
    "classificacao" numeric(2,1) DEFAULT 5.0,
    PRIMARY KEY ("id_evento")
);

DROP TABLE IF EXISTS "public"."utilizador";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS utilizador_id_utilizador_seq;

-- Table Definition
CREATE TABLE "public"."utilizador" (
    "id_utilizador" int4 NOT NULL DEFAULT nextval('utilizador_id_utilizador_seq'::regclass),
    "nome" varchar(100) NOT NULL,
    "email" varchar(100) NOT NULL,
    "password" bpchar(60) NOT NULL,
    "data_nascimento" date,
    "foto_perfil" varchar(255),
    "data_registo" timestamp DEFAULT CURRENT_TIMESTAMP,
    "is_admin" bool DEFAULT false,
    PRIMARY KEY ("id_utilizador")
);

INSERT INTO "public"."bilhetes" ("id_bilhete", "id_utilizador", "id_evento", "codigo_qr", "data_compra") VALUES
(1, 11, 5, 'QR-5-11-1777999309967', '2026-05-05 17:41:49.96416'),
(2, 11, 4, 'QR-4-11-1778010669867', '2026-05-05 20:51:09.863713'),
(3, 11, 5, 'QR-5-11-1778010669887', '2026-05-05 20:51:09.886962');

INSERT INTO "public"."eventos" ("id_evento", "titulo", "descricao", "descricao_curta", "data_hora", "hora_portas", "hora_inicio", "preco", "stock_disponivel", "foto_evento", "categoria", "distrito", "local_evento", "morada", "em_alta", "novo", "classificacao") VALUES
(1, 'Concerto do Travis Scott', 'Astro mundial da música vem a Portugal pela primeira vez. Não percas esta oportunidade de ver ao vivo um dos maiores nomes do rap e trap contemporâneo, numa noite inesquecível no Altice Arena.', 'Astro mundial da música vem a Portugal pela primeira vez. Não percas esta oportunidade única', '2026-02-14 21:00:00', '19:00:00', '21:00:00', 90.00, 140, 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&q=80', 'Música', 'Lisboa', 'Altice Arena', 'Rossio dos Olivais, 1990-231 Lisboa', 't', 'f', 4.8),
(2, 'Benfica x Porto', 'Clássico português a não perder. Duas das maiores equipas de Portugal defrontam-se num jogo decisivo no Estádio da Luz.', 'Clássico português a não perder. Duas das maiores equipas de Portugal.', '2026-03-17 20:15:00', '18:00:00', '20:15:00', 55.00, 800, 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&q=80', 'Desporto', 'Lisboa', 'Estádio da Luz', 'Av. Eusébio da Silva Ferreira, 1500-313 Lisboa', 't', 'f', 4.9),
(3, 'NOS Alive', 'Um dos festivais mais prestigiados da Europa, que combina o melhor do indie, rock e eletrónica no Passeio Marítimo de Algés.', 'Um dos festivais mais prestigiados da Europa, que combina o melhor do indie, rock e eletrónica.', '2026-05-18 17:00:00', '16:00:00', '17:00:00', 79.00, 250, 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80', 'Música', 'Lisboa', 'Passeio Marítimo de Algés', 'Passeio Marítimo de Algés, 1495-165 Algés', 'f', 't', 4.7),
(4, 'Levanta-te e Ri - Edição Especial', 'Uma noite de gargalhadas garantidas com os melhores nomes do stand-up nacional num espetáculo ao vivo e sem filtros.', 'Uma noite de gargalhadas garantidas com os melhores nomes do stand-up nacional.', '2027-11-26 21:00:00', '20:00:00', '21:00:00', 25.00, 699, 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=1200&q=80', 'Comédia', 'Porto', 'Coliseu do Porto', 'R. de Passos Manuel 137, 4000-385 Porto', 'f', 't', 4.6),
(5, 'O Fantasma da Ópera', 'A grandiosa produção da Broadway chega ao palco do Coliseu para uma experiência musical imersiva e visualmente deslumbrante.', 'A grandiosa produção da Broadway chega ao palco do Coliseu.', '2026-01-15 20:30:00', '19:30:00', '20:30:00', 45.00, 8, 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&q=80', 'Teatro', 'Lisboa', 'Coliseu dos Recreios', 'R. das Portas de Santo Antão 96, 1150-269 Lisboa', 'f', 'f', 4.9),
(6, 'Masters of Tennis', 'Os grandes nomes do ténis mundial defrontam-se num torneio de exibição exclusivo sob o sol da Quinta do Lago.', 'Os grandes nomes do ténis mundial defrontam-se num torneio de exibição exclusivo.', '2026-02-01 14:00:00', '13:00:00', '14:00:00', 35.00, 180, 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=1200&q=80', 'Desporto', 'Leiria', 'Quinta do Lago', 'Quinta do Lago, 8135-024 Almancil', 'f', 'f', 4.5);

INSERT INTO "public"."utilizador" ("id_utilizador", "nome", "email", "password", "data_nascimento", "foto_perfil", "data_registo", "is_admin") VALUES
(1, 'André Barreira', 'a@gmailcom', '$2y$10$8K9Vf6f7G8H9I0J1K2L3MeO5pQ6rS7tU8vW9xY0z1A2B3C4D5E6F.', NULL, NULL, '2026-04-30 14:58:42.732833', 'f'),
(8, 'Administrador', 'admin@quickpass.pt', '$2b$10$3ZY.JVircKW4zBCkGHz7ku9o7xjZlc144qYraqQPhmHrEfBvnKmFK', NULL, NULL, '2026-05-05 16:40:14.530134', 't'),
(10, 'Admin', 'admin@quickpass.com', '$2b$10$3ZY.JVircKW4zBCkGHz7ku9o7xjZlc144qYraqQPhmHrEfBvnKmFK', NULL, NULL, '2026-05-05 16:49:57.585836', 't'),
(11, 'a', 'a1@gmail.com', '$2b$10$7iHdHWUm9w9rr5v2KL2SDOvniMMt3PI05lpYxE6RHb9KpdbUfuL0G', NULL, NULL, '2026-05-05 17:41:06.098042', 'f');

ALTER TABLE "public"."bilhetes" ADD FOREIGN KEY ("id_evento") REFERENCES "public"."eventos"("id_evento") ON DELETE CASCADE;
ALTER TABLE "public"."bilhetes" ADD FOREIGN KEY ("id_utilizador") REFERENCES "public"."utilizador"("id_utilizador") ON DELETE CASCADE;


-- Indices
CREATE UNIQUE INDEX bilhetes_codigo_qr_key ON public.bilhetes USING btree (codigo_qr);


-- Indices
CREATE UNIQUE INDEX utilizador_email_key ON public.utilizador USING btree (email);
