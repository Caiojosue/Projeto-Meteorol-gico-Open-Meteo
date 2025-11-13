--
-- PostgreSQL database dump
--

\restrict dLaDO2RYSY2ur7rYOogz21ZiramqFkWSxhXwL6JdRwazQKMg35Fotk8btDrOvIp

-- Dumped from database version 14.19 (Homebrew)
-- Dumped by pg_dump version 14.19 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: diary; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diary (
    id integer NOT NULL,
    date date,
    tags character varying(255),
    observacoes text,
    condicoes_percebidas character varying(255),
    photo_url text
);


ALTER TABLE public.diary OWNER TO postgres;

--
-- Name: diary_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.diary_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.diary_id_seq OWNER TO postgres;

--
-- Name: diary_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.diary_id_seq OWNED BY public.diary.id;


--
-- Name: diary id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diary ALTER COLUMN id SET DEFAULT nextval('public.diary_id_seq'::regclass);


--
-- Data for Name: diary; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diary (id, date, tags, observacoes, condicoes_percebidas, photo_url) FROM stdin;
108	2025-11-12	sol	dia foi muito quente	calor	\N
109	2025-11-12	chuvas e ventos	dia calorento, porem com chuva	chuvoso	\N
110	2025-11-20	calor	dia normal	nublado	\N
111	2025-11-12	vento e chuva está a caminho	esqueci de fechar a janela do quarto	nublado	\N
112	2025-11-12	ventos e trovões	dia esta muito nublado	nublado	\N
113	2025-11-12	sol de verão	dia quente	calor	\N
114	2025-11-12	ventos de leve	clima de europa	frio	\N
115	2025-11-12	sol de leve	dia quente	ensolarado	\N
116	2025-11-13	vento forte	levar uma blusa de frio	ventoso	\N
117	2025-11-12	chuva forte	levar guarda chuva	chuvoso	\N
118	2025-11-11	sol muito forte	dia ensolarado	ensolarado	\N
\.


--
-- Name: diary_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.diary_id_seq', 118, true);


--
-- Name: diary diary_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diary
    ADD CONSTRAINT diary_pkey PRIMARY KEY (id);


--
-- Name: diary unique_diary_entry; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diary
    ADD CONSTRAINT unique_diary_entry UNIQUE (date, tags, observacoes, condicoes_percebidas, photo_url);


--
-- PostgreSQL database dump complete
--

\unrestrict dLaDO2RYSY2ur7rYOogz21ZiramqFkWSxhXwL6JdRwazQKMg35Fotk8btDrOvIp

