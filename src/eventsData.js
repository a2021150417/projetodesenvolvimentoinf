export const EVENTS = [
  {
    id: 1,
    title: "Concerto do Travis Scott",
    description:
      "Astro mundial da música vem a Portugal pela primeira vez. Não percas esta oportunidade de ver ao vivo um dos maiores nomes do rap e trap contemporâneo, numa noite inesquecível no Altice Arena.",
    shortDescription:
      "Astro mundial da música vem a Portugal pela primeira vez. Não percas esta oportunidade única",
    date: "2026-02-14",
    doorsOpen: "19h00",
    startTime: "21h00",
    price: 90,
    category: "Música",
    district: "Lisboa",
    venue: "Altice Arena",
    address: "Rossio dos Olivais, 1990-231 Lisboa",
    image:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&q=80",
    ticketsLeft: 42,
    total: 5000,
    rating: 4.8,
    trending: true,
    isNew: false,
    ticketTypes: [
      {
        id: "geral",
        name: "Geral",
        description: "Acesso ao piso inferior",
        price: 90,
        available: 140,
      },
      {
        id: "vip",
        name: "VIP",
        description: "Zona VIP com vista privilegiada",
        price: 150,
        available: 70,
      },
      {
        id: "backstage",
        name: "Backstage Pass",
        description: "Acesso aos bastidores e meet & greet",
        price: 300,
        available: 20,
      },
    ],
  },
  {
    id: 2,
    title: "Benfica x Porto",
    description:
      "Clássico português a não perder. Duas das maiores equipas de Portugal defrontam-se num jogo decisivo no Estádio da Luz.",
    shortDescription:
      "Clássico portugues a não perder. Duas das maiores equipas de Portugal.",
    date: "2026-03-17",
    doorsOpen: "18h00",
    startTime: "20h15",
    price: 55,
    category: "Desporto",
    district: "Lisboa",
    venue: "Estádio da Luz",
    address: "Av. Eusébio da Silva Ferreira, 1500-313 Lisboa",
    image:
      "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&q=80",
    ticketsLeft: 1200,
    total: 65000,
    rating: 4.9,
    trending: true,
    isNew: false,
    ticketTypes: [
      {
        id: "topo",
        name: "Topo",
        description: "Bancada de topo",
        price: 55,
        available: 800,
      },
      {
        id: "lateral",
        name: "Lateral",
        description: "Bancada lateral com boa visibilidade",
        price: 95,
        available: 350,
      },
      {
        id: "central",
        name: "Central",
        description: "Bancada central — a melhor vista",
        price: 180,
        available: 50,
      },
    ],
  },
  {
    id: 3,
    title: "NOS Alive",
    description:
      "Um dos festivais mais prestigiados da Europa, que combina o melhor do indie, rock e eletrónica no Passeio Marítimo de Algés.",
    shortDescription:
      "Um dos festivais mais prestigiados da Europa, que combina o melhor do indie, rock e eletrónica no Passeio Marítimo de Algés.",
    date: "2026-05-18",
    doorsOpen: "16h00",
    startTime: "17h00",
    price: 79,
    category: "Música",
    district: "Lisboa",
    venue: "Passeio Marítimo de Algés",
    address: "Passeio Marítimo de Algés, 1495-165 Algés",
    image:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80",
    ticketsLeft: 380,
    total: 10000,
    rating: 4.7,
    trending: false,
    isNew: true,
    ticketTypes: [
      {
        id: "diario",
        name: "Bilhete Diário",
        description: "Acesso a um dia do festival",
        price: 79,
        available: 250,
      },
      {
        id: "passe",
        name: "Passe 3 Dias",
        description: "Acesso aos três dias do festival",
        price: 179,
        available: 100,
      },
      {
        id: "vip",
        name: "Passe VIP",
        description: "Zona VIP com bar exclusivo",
        price: 349,
        available: 30,
      },
    ],
  },
  {
    id: 4,
    title: "Levanta-te e Ri - Edição Especial",
    description:
      "Uma noite de gargalhadas garantidas com os melhores nomes do stand-up nacional num espetáculo ao vivo e sem filtros.",
    shortDescription:
      "Uma noite de gargalhadas garantidas com os melhores nomes do stand-up nacional num espetáculo ao vivo e sem filtros.",
    date: "2027-11-26",
    doorsOpen: "20h00",
    startTime: "21h00",
    price: 25,
    category: "Comédia",
    district: "Porto",
    venue: "Coliseu do Porto",
    address: "R. de Passos Manuel 137, 4000-385 Porto",
    image:
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=1200&q=80",
    ticketsLeft: 850,
    total: 2000,
    rating: 4.6,
    trending: false,
    isNew: true,
    ticketTypes: [
      {
        id: "geral",
        name: "Geral",
        description: "Lugar sentado",
        price: 25,
        available: 700,
      },
      {
        id: "premium",
        name: "Premium",
        description: "Primeiras filas",
        price: 45,
        available: 150,
      },
    ],
  },
  {
    id: 5,
    title: "O Fantasma da Ópera",
    description:
      "A grandiosa produção da Broadway chega ao palco do Coliseu para uma experiência musical imersiva e visualmente deslumbrante.",
    shortDescription:
      "A grandiosa produção da Broadway chega ao palco do Coliseu para uma experiência musical imersiva e visualmente deslumbrante.",
    date: "2026-01-15",
    doorsOpen: "19h30",
    startTime: "20h30",
    price: 45,
    category: "Teatro",
    district: "Lisboa",
    venue: "Coliseu dos Recreios",
    address: "R. das Portas de Santo Antão 96, 1150-269 Lisboa",
    image:
      "https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&q=80",
    ticketsLeft: 15,
    total: 3000,
    rating: 4.9,
    trending: false,
    isNew: false,
    ticketTypes: [
      {
        id: "balcao",
        name: "Balcão",
        description: "Lugar no balcão superior",
        price: 45,
        available: 10,
      },
      {
        id: "plateia",
        name: "Plateia",
        description: "Lugar na plateia",
        price: 75,
        available: 5,
      },
    ],
  },
  {
    id: 6,
    title: "Masters of Tennis",
    description:
      "Os grandes nomes do ténis mundial defrontam-se num torneio de exibição exclusivo sob o sol da Quinta do Lago.",
    shortDescription:
      "Os grandes nomes do ténis mundial defrontam-se num torneio de exibição exclusivo sob o sol da Quinta do Lago.",
    date: "2026-02-01",
    doorsOpen: "13h00",
    startTime: "14h00",
    price: 35,
    category: "Desporto",
    district: "Leiria",
    venue: "Quinta do Lago",
    address: "Quinta do Lago, 8135-024 Almancil",
    image:
      "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=1200&q=80",
    ticketsLeft: 220,
    total: 1500,
    rating: 4.5,
    trending: false,
    isNew: false,
    ticketTypes: [
      {
        id: "geral",
        name: "Geral",
        description: "Acesso geral ao recinto",
        price: 35,
        available: 180,
      },
      {
        id: "courtside",
        name: "Courtside",
        description: "Lugar junto ao court central",
        price: 120,
        available: 40,
      },
    ],
  },
];

export const CATEGORIES = ["Música", "Desporto", "Teatro", "Comédia"];
export const DISTRICTS = ["Coimbra", "Porto", "Lisboa", "Leiria"];

export const SORT_OPTIONS = [
  { id: "date-asc", label: "Data: ascendente" },
  { id: "date-desc", label: "Data: descendente" },
  { id: "price-asc", label: "Preço: baixo para alto" },
  { id: "price-desc", label: "Preço: alto para baixo" },
];

export function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "numeric",
    year: "2-digit",
  });
}

export function formatDateLong(iso) {
  const d = new Date(iso);
  const weekday = d.toLocaleDateString("pt-PT", { weekday: "long" });
  const day = d.getDate();
  const month = d.toLocaleDateString("pt-PT", { month: "long" });
  const year = d.getFullYear();
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  return `${cap(weekday)}, ${day} de ${month} de ${year}`;
}

export function getEventById(id) {
  return EVENTS.find((e) => String(e.id) === String(id));
}
