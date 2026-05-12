-- -------------------------------------------------------------
-- TablePlus 6.9.1(670)
--
-- https://tableplus.com/
--
-- Database: quickpass
-- Generation Time: 2026-05-12 15:54:06.5340
-- -------------------------------------------------------------


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
    CONSTRAINT "bilhetes_id_utilizador_fkey" FOREIGN KEY ("id_utilizador") REFERENCES "public"."utilizador"("id_utilizador") ON DELETE CASCADE,
    CONSTRAINT "bilhetes_id_evento_fkey" FOREIGN KEY ("id_evento") REFERENCES "public"."eventos"("id_evento") ON DELETE CASCADE,
    PRIMARY KEY ("id_bilhete")
);

-- Indices
CREATE UNIQUE INDEX bilhetes_codigo_qr_key ON public.bilhetes USING btree (codigo_qr);

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
