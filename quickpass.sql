-- -------------------------------------------------------------
-- TablePlus 6.9.1(670)
--
-- https://tableplus.com/
--
-- Database: quickpass
-- Generation Time: 2026-05-12 17:20:47.4800
-- -------------------------------------------------------------


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
    "estado_bilhete" varchar(20) DEFAULT 'ativo'::character varying,
    PRIMARY KEY ("id_bilhete")
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
    "reset_token" varchar(100),
    "reset_token_expira" timestamp,
    PRIMARY KEY ("id_utilizador")
);

DROP TABLE IF EXISTS "public"."comentarios";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS comentarios_id_comentario_seq;

-- Table Definition
CREATE TABLE "public"."comentarios" (
    "id_comentario" int4 NOT NULL DEFAULT nextval('comentarios_id_comentario_seq'::regclass),
    "id_utilizador" int4,
    "nome" varchar(100) NOT NULL,
    "comentario" text NOT NULL,
    "estrelas" int4 NOT NULL CHECK ((estrelas >= 1) AND (estrelas <= 5)),
    "data_comentario" timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id_comentario")
);

INSERT INTO "public"."eventos" ("id_evento", "titulo", "descricao", "descricao_curta", "data_hora", "hora_portas", "hora_inicio", "preco", "stock_disponivel", "foto_evento", "categoria", "distrito", "local_evento", "morada", "em_alta", "novo", "classificacao") VALUES
(1, 'Concerto do Travis Scott', 'Astro mundial da música vem a Portugal pela primeira vez. Não percas esta oportunidade de ver ao vivo um dos maiores nomes do rap e trap contemporâneo, numa noite inesquecível no Altice Arena.', 'Astro mundial da música vem a Portugal pela primeira vez. Não percas esta oportunidade única', '2026-02-14 21:00:00', '19:00:00', '21:00:00', 90.00, 138, 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&q=80', 'Música', 'Lisboa', 'Altice Arena', 'Rossio dos Olivais, 1990-231 Lisboa', 't', 'f', 4.8),
(2, 'Benfica x Porto', 'Clássico português a não perder. Duas das maiores equipas de Portugal defrontam-se num jogo decisivo no Estádio da Luz.', 'Clássico português a não perder. Duas das maiores equipas de Portugal.', '2026-03-17 20:15:00', '18:00:00', '20:15:00', 55.00, 799, 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&q=80', 'Desporto', 'Lisboa', 'Estádio da Luz', 'Av. Eusébio da Silva Ferreira, 1500-313 Lisboa', 't', 'f', 4.9),
(3, 'NOS Alive', 'Um dos festivais mais prestigiados da Europa, que combina o melhor do indie, rock e eletrónica no Passeio Marítimo de Algés.', 'Um dos festivais mais prestigiados da Europa, que combina o melhor do indie, rock e eletrónica.', '2026-05-18 17:00:00', '16:00:00', '17:00:00', 79.00, 250, 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80', 'Música', 'Lisboa', 'Passeio Marítimo de Algés', 'Passeio Marítimo de Algés, 1495-165 Algés', 'f', 't', 4.7),
(4, 'Levanta-te e Ri - Edição Especial', 'Uma noite de gargalhadas garantidas com os melhores nomes do stand-up nacional num espetáculo ao vivo e sem filtros.', 'Uma noite de gargalhadas garantidas com os melhores nomes do stand-up nacional.', '2027-11-26 21:00:00', '20:00:00', '21:00:00', 25.00, 699, 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=1200&q=80', 'Comédia', 'Porto', 'Coliseu do Porto', 'R. de Passos Manuel 137, 4000-385 Porto', 'f', 't', 4.6),
(5, 'O Fantasma da Ópera', 'A grandiosa produção da Broadway chega ao palco do Coliseu para uma experiência musical imersiva e visualmente deslumbrante.', 'A grandiosa produção da Broadway chega ao palco do Coliseu.', '2026-01-15 20:30:00', '19:30:00', '20:30:00', 45.00, 3, 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&q=80', 'Teatro', 'Lisboa', 'Coliseu dos Recreios', 'R. das Portas de Santo Antão 96, 1150-269 Lisboa', 'f', 'f', 4.9),
(6, 'Masters of Tennis', 'Os grandes nomes do ténis mundial defrontam-se num torneio de exibição exclusivo sob o sol da Quinta do Lago.', 'Os grandes nomes do ténis mundial defrontam-se num torneio de exibição exclusivo.', '2026-02-01 14:00:00', '13:00:00', '14:00:00', 35.00, 178, 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=1200&q=80', 'Desporto', 'Leiria', 'Quinta do Lago', 'Quinta do Lago, 8135-024 Almancil', 'f', 'f', 4.5);

INSERT INTO "public"."bilhetes" ("id_bilhete", "id_utilizador", "id_evento", "codigo_qr", "data_compra", "estado_bilhete") VALUES
(5, 4, 5, 'QR-5-4-1778101817137', '2026-05-06 22:10:17.121598', 'usado'),
(6, 4, 5, 'QR-5-4-1778101921394', '2026-05-06 22:12:01.39342', 'usado'),
(7, 4, 5, 'QR-5-4-1778102135289', '2026-05-06 22:15:35.288309', 'usado'),
(8, 5, 1, 'QR-1-5-1778106331574', '2026-05-06 23:25:31.571575', 'usado'),
(9, 5, 5, 'QR-5-5-1778160189730', '2026-05-07 14:23:09.727424', 'ativo'),
(10, 5, 2, 'QR-2-5-1778163469045', '2026-05-07 15:17:49.041281', 'usado'),
(11, 5, 1, 'QR-1-5-1778163913177', '2026-05-07 15:25:13.173257', 'usado'),
(12, 5, 6, 'QR-6-5-1778165516921', '2026-05-07 15:51:56.916217', 'usado'),
(13, 5, 5, 'QR-5-5-1778165612932', '2026-05-07 15:53:32.930964', 'usado');

INSERT INTO "public"."utilizador" ("id_utilizador", "nome", "email", "password", "data_nascimento", "foto_perfil", "data_registo", "is_admin", "reset_token", "reset_token_expira") VALUES
(4, 'João Morais', 'joaop13smorais@gmail.com', '$2b$10$YRH2rzZq6XhfV9UXQ14vwOY4kZv.Dj1Pu3jUkI7YbHzxNv/kuopdG', NULL, NULL, '2026-05-06 22:08:52.049284', 'f', NULL, NULL),
(5, 'André Guiné Barreira', 'andre2013barreira@gmail.com', '$2b$10$.5v2oZDafj/.ek5wRhKrPeuFd3i2Y87w3nGiRWZ8zDPNJ8DcrvwUq', NULL, NULL, '2026-05-06 22:20:26.073968', 'f', NULL, NULL),
(10, 'Admin', 'admin@quickpass.pt', '$2b$10$3ZY.JVircKW4zBCkGHz7ku9o7xjZlc144qYraqQPhmHrEfBvnKmFK', NULL, NULL, '2026-05-05 16:49:57.585836', 't', NULL, NULL);

INSERT INTO "public"."comentarios" ("id_comentario", "id_utilizador", "nome", "comentario", "estrelas", "data_comentario") VALUES
(1, NULL, 'a', 'a', 5, '2026-05-06 21:56:52.470737'),
(2, NULL, 'jose', 'adorei
', 5, '2026-05-07 14:29:28.506055');

ALTER TABLE "public"."bilhetes" ADD FOREIGN KEY ("id_utilizador") REFERENCES "public"."utilizador"("id_utilizador") ON DELETE CASCADE;
ALTER TABLE "public"."bilhetes" ADD FOREIGN KEY ("id_evento") REFERENCES "public"."eventos"("id_evento") ON DELETE CASCADE;


-- Indices
CREATE UNIQUE INDEX bilhetes_codigo_qr_key ON public.bilhetes USING btree (codigo_qr);


-- Indices
CREATE UNIQUE INDEX utilizador_email_key ON public.utilizador USING btree (email);
ALTER TABLE "public"."comentarios" ADD FOREIGN KEY ("id_utilizador") REFERENCES "public"."utilizador"("id_utilizador") ON DELETE SET NULL;
