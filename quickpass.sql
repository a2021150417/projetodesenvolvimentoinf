-- -------------------------------------------------------------
-- TablePlus 7.0.0(700)
--
-- https://tableplus.com/
--
-- Database: quickpass
-- Generation Time: 2026-06-15 18:42:02.1410
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
    "subtitulo" varchar(255),
    PRIMARY KEY ("id_evento")
);

INSERT INTO "public"."eventos" ("id_evento", "titulo", "descricao", "descricao_curta", "data_hora", "hora_portas", "hora_inicio", "preco", "stock_disponivel", "foto_evento", "categoria", "distrito", "local_evento", "morada", "em_alta", "novo", "classificacao", "subtitulo") VALUES
(1, 'Concerto do Travis Scott', 'Astro mundial da música vem a Portugal pela primeira vez. Não percas esta oportunidade de ver ao vivo um dos maiores nomes do rap e trap contemporâneo, numa noite inesquecível no Altice Arena.', 'Astro mundial da música vem a Portugal pela primeira vez. Não percas esta oportunidade única', '2026-02-14 21:00:00', '19:00:00', '21:00:00', 90.00, 136, 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&q=80', 'Música', 'Lisboa', 'Altice Arena', 'Rossio dos Olivais, 1990-231 Lisboa', 't', 'f', 4.8, NULL),
(2, 'Benfica x Porto', 'Clássico português a não perder. Duas das maiores equipas de Portugal defrontam-se num jogo decisivo no Estádio da Luz.', 'Clássico português a não perder. Duas das maiores equipas de Portugal.', '2026-07-30 20:15:00', '18:00:00', '20:15:00', 55.00, 797, 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&q=80', 'Desporto', 'Lisboa', 'Estádio da Luz', 'Av. Eusébio da Silva Ferreira, 1500-313 Lisboa', 't', 'f', 4.9, 'd'),
(3, 'NOS Alive', 'Um dos festivais mais prestigiados da Europa, que combina o melhor do indie, rock e eletrónica no Passeio Marítimo de Algés.', 'Um dos festivais mais prestigiados da Europa, que combina o melhor do indie, rock e eletrónica.', '2026-07-21 17:00:00', '16:00:00', '17:00:00', 79.00, 248, 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80', 'Música', 'Lisboa', 'Passeio Marítimo de Algés', 'Passeio Marítimo de Algés, 1495-165 Algés', 'f', 't', 4.7, 'd'),
(4, 'Levanta-te e Ri - Edição Especial', 'Uma noite de gargalhadas garantidas com os melhores nomes do stand-up nacional num espetáculo ao vivo e sem filtros.', 'Uma noite de gargalhadas garantidas com os melhores nomes do stand-up nacional.', '2027-11-26 21:00:00', '20:00:00', '21:00:00', 25.00, 695, 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=1200&q=80', 'Comédia', 'Porto', 'Coliseu do Porto', 'R. de Passos Manuel 137, 4000-385 Porto', 'f', 't', 4.6, NULL),
(5, 'O Fantasma ', 'A grandiosa produção da Broadway chega ao palco do Coliseu para uma experiência musical imersiva e visualmente deslumbrante.', 'A grandiosa produção da Broadway chega ao palco do Coliseu.', '2026-01-15 20:30:00', '19:30:00', '20:30:00', 45.00, 2, 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&q=80', 'Teatro', 'Lisboa', 'Coliseu dos Recreios', 'R. das Portas de Santo Antão 96, 1150-269 Lisboa', 'f', 'f', 4.9, 'opera'),
(6, 'Masters of Tennis', 'Os grandes nomes do ténis mundial defrontam-se num torneio de exibição exclusivo sob o sol da Quinta do Lago.', 'Os grandes nomes do ténis mundial defrontam-se num torneio de exibição exclusivo.', '2026-02-01 14:00:00', '13:00:00', '14:00:00', 35.00, 171, 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=1200&q=80', 'Desporto', 'Leiria', 'Quinta do Lago', 'Quinta do Lago, 8135-024 Almancil', 'f', 'f', 4.5, NULL),
(8, 'teste', 'teste', NULL, '2026-06-15 20:43:00', '20:43:00', '22:43:00', 12.00, 12, NULL, 'Comédia', 'coimbra', 'coimbra', NULL, 'f', 't', 5.0, 'teste'),
(9, 'testeeee', '21', NULL, '2026-09-17 16:57:00', '16:58:00', '16:02:00', 1.00, 1, NULL, 'e', 'coimbra', 'coimra', NULL, 'f', 't', 5.0, 'e');

