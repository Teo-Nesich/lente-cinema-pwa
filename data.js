export const genres = ["Tutti", "Fantascienza", "Dramma", "Avventura", "Commedia", "Thriller"];

export const movies = [
  {
    id: "blade-runner-2049",
    tmdbId: 335984,
    title: "Blade Runner 2049",
    originalTitle: "Blade Runner 2049",
    year: 2017,
    duration: "2h 44m",
    country: "Stati Uniti",
    genres: ["Fantascienza", "Dramma"],
    tagline: "Il futuro è costruito un fascio di luce alla volta.",
    synopsis: "Un nuovo blade runner porta alla luce un segreto sepolto da tempo, capace di far precipitare nel caos ciò che resta della società.",
    director: "Denis Villeneuve",
    productionDesigners: ["Dennis Gassner"],
    cinematographer: "Roger Deakins",
    palette: ["#d87535", "#1f3950", "#0f1010"],
    visualLabel: "nebbia arancio / neon freddo",
    featured: true,
    curiosity: [
      {
        title: "La luce entra nella scenografia",
        text: "Per molti interni la luce non è stata aggiunta alla fine: pannelli, aperture e superfici riflettenti sono stati progettati insieme ai set, così che architettura e fotografia parlassero la stessa lingua."
      },
      {
        title: "Una città costruita anche in miniatura",
        text: "Accanto agli effetti digitali sono state usate grandi miniature e set fisici. Il loro peso visivo aiuta edifici e veicoli a sembrare davvero parte di un mondo consumato e monumentale."
      }
    ],
    challenge: "Tenere coerenti pioggia, foschia, riflessi e densità dell’aria tra set enormi e riprese separate: la continuità atmosferica è diventata una parte essenziale del racconto.",
    gallery: [
      { label: "Luce e ombra", caption: "Studio visivo dimostrativo — sostituibile con uno still autorizzato", ratio: "wide" },
      { label: "Architetture", caption: "Studio visivo dimostrativo", ratio: "portrait" },
      { label: "Atmosfera", caption: "Studio visivo dimostrativo", ratio: "square" }
    ]
  },
  {
    id: "grand-budapest-hotel",
    tmdbId: 120467,
    title: "Grand Budapest Hotel",
    originalTitle: "The Grand Budapest Hotel",
    year: 2014,
    duration: "1h 39m",
    country: "Stati Uniti / Germania",
    genres: ["Commedia", "Avventura"],
    tagline: "Un albergo, tre epoche, una precisione quasi commestibile.",
    synopsis: "Le avventure di un leggendario concierge e del giovane fattorino che diventa il suo amico più fidato, sullo sfondo di un’Europa immaginaria.",
    director: "Wes Anderson",
    productionDesigners: ["Adam Stockhausen"],
    cinematographer: "Robert Yeoman",
    palette: ["#d9899b", "#a53f50", "#f0cf8b"],
    visualLabel: "rosa pastello / rosso ascensore",
    curiosity: [
      {
        title: "Un grande magazzino diventato hotel",
        text: "La hall principale è stata ricavata in un ex grande magazzino di Görlitz, in Germania. Scale, balconate e vetrate hanno dato al set la sua geometria teatrale."
      },
      {
        title: "Il formato racconta il tempo",
        text: "Le diverse epoche del racconto usano rapporti d’aspetto differenti. Il bordo dell’immagine diventa quindi un indizio narrativo, non una semplice scelta estetica."
      }
    ],
    challenge: "Trasformare uno spazio reale in più versioni dello stesso albergo, mantenendo simmetria, palette e movimenti di macchina rigorosi mentre la storia attraversa decenni diversi.",
    gallery: [
      { label: "La hall", caption: "Studio visivo dimostrativo", ratio: "wide" },
      { label: "Palette", caption: "Studio visivo dimostrativo", ratio: "portrait" },
      { label: "Miniature", caption: "Studio visivo dimostrativo", ratio: "square" }
    ]
  },
  {
    id: "mad-max-fury-road",
    tmdbId: 76341,
    title: "Mad Max: Fury Road",
    originalTitle: "Mad Max: Fury Road",
    year: 2015,
    duration: "2h 01m",
    country: "Australia / Stati Uniti",
    genres: ["Avventura", "Fantascienza"],
    tagline: "Metallo, sabbia e movimento reale.",
    synopsis: "In un mondo desertico devastato, Max si unisce a Furiosa e a un gruppo di ribelli in fuga da un tiranno e dal suo esercito di veicoli.",
    director: "George Miller",
    productionDesigners: ["Colin Gibson"],
    cinematographer: "John Seale",
    palette: ["#e2692e", "#f3b84a", "#14798f"],
    visualLabel: "sabbia accesa / cielo ciano",
    curiosity: [
      {
        title: "Veicoli pensati come personaggi",
        text: "Gran parte delle macchine è stata costruita per funzionare davvero. Ogni mezzo comunica rango, cultura e funzione prima ancora che qualcuno pronunci una battuta."
      },
      {
        title: "L’azione al centro",
        text: "Molte inquadrature tengono il punto d’interesse vicino al centro del fotogramma: nel montaggio rapidissimo, lo sguardo dello spettatore non deve rincorrere l’azione."
      }
    ],
    challenge: "Coordinare stunt, mezzi reali, vento e polvere nel deserto mantenendo leggibile la geografia dell’inseguimento e sicure troupe e interpreti.",
    gallery: [
      { label: "La carovana", caption: "Studio visivo dimostrativo", ratio: "wide" },
      { label: "Polvere", caption: "Studio visivo dimostrativo", ratio: "portrait" },
      { label: "Macchine", caption: "Studio visivo dimostrativo", ratio: "square" }
    ]
  },
  {
    id: "parasite",
    tmdbId: 496243,
    title: "Parasite",
    originalTitle: "기생충",
    year: 2019,
    duration: "2h 12m",
    country: "Corea del Sud",
    genres: ["Dramma", "Thriller"],
    tagline: "Ogni scala rivela una distanza sociale.",
    synopsis: "Una famiglia in difficoltà entra, un membro alla volta, nella vita di una famiglia benestante, con conseguenze imprevedibili.",
    director: "Bong Joon-ho",
    productionDesigners: ["Lee Ha-jun"],
    cinematographer: "Hong Kyung-pyo",
    palette: ["#53654a", "#bd9a64", "#1b201c"],
    visualLabel: "cemento verde / legno caldo",
    curiosity: [
      {
        title: "La casa era uno strumento di regia",
        text: "Gli ambienti principali sono stati progettati per le necessità della macchina da presa. Finestre, corridoi e linee di vista permettono ai personaggi di osservarsi senza essere visti."
      },
      {
        title: "Salire e scendere",
        text: "Scale, rampe e livelli urbani rendono visibile la gerarchia sociale. La scenografia porta avanti il tema anche quando i dialoghi tacciono."
      }
    ],
    challenge: "Far sembrare la casa un’autentica opera d’architettura pur mantenendola un set modulare, illuminabile e aperto ai movimenti precisi della macchina da presa.",
    gallery: [
      { label: "Linee di vista", caption: "Studio visivo dimostrativo", ratio: "wide" },
      { label: "I livelli", caption: "Studio visivo dimostrativo", ratio: "portrait" },
      { label: "La finestra", caption: "Studio visivo dimostrativo", ratio: "square" }
    ]
  },
  {
    id: "metropolis",
    tmdbId: 19,
    title: "Metropolis",
    originalTitle: "Metropolis",
    year: 1927,
    duration: "2h 28m",
    country: "Germania",
    genres: ["Fantascienza", "Dramma"],
    tagline: "La città del futuro costruita a mano.",
    synopsis: "In una città divisa tra élite e lavoratori, il figlio del padrone scopre il mondo sotterraneo che tiene in vita la metropoli.",
    director: "Fritz Lang",
    productionDesigners: ["Otto Hunte", "Erich Kettelhut", "Karl Vollbrecht"],
    cinematographer: "Karl Freund, Günther Rittau",
    palette: ["#b8aa89", "#5d5b55", "#161616"],
    visualLabel: "argento / carbone",
    curiosity: [
      {
        title: "Il trucco Schüfftan",
        text: "Specchi inclinati e porzioni raschiate permettevano di combinare interpreti reali e miniature nella stessa immagine, molto prima del compositing digitale."
      },
      {
        title: "Una metropoli in miniatura",
        text: "Grattacieli, ponti e traffico furono animati e ripresi come modelli. La scala della città nasce dalla precisione, dalla luce e dalla ripetizione del movimento."
      }
    ],
    challenge: "Realizzare centinaia di effetti ottici e scene di massa con tecniche analogiche, esposizioni multiple e tempi di lavorazione estremamente lunghi.",
    gallery: [
      { label: "La città", caption: "Studio visivo dimostrativo", ratio: "wide" },
      { label: "La macchina", caption: "Studio visivo dimostrativo", ratio: "portrait" },
      { label: "Gli specchi", caption: "Studio visivo dimostrativo", ratio: "square" }
    ]
  },
  {
    id: "dune-part-two",
    tmdbId: 693134,
    title: "Dune: Parte Due",
    originalTitle: "Dune: Part Two",
    year: 2024,
    duration: "2h 46m",
    country: "Stati Uniti / Canada",
    genres: ["Fantascienza", "Avventura"],
    tagline: "Il deserto non è uno sfondo: è un personaggio.",
    synopsis: "Paul Atreides si unisce ai Fremen mentre cerca di impedire un futuro terribile che solo lui sembra poter prevedere.",
    director: "Denis Villeneuve",
    productionDesigners: ["Patrice Vermette"],
    cinematographer: "Greig Fraser",
    palette: ["#a77952", "#d8b281", "#30271f"],
    visualLabel: "ocra / sole bianco",
    curiosity: [
      {
        title: "Pochi minuti di luce perfetta",
        text: "Alcune scene nel deserto richiedevano la luce morbida dell’alba o del tramonto. La troupe preparava tutto in anticipo per sfruttare finestre di ripresa molto brevi."
      },
      {
        title: "Un altro spettro per Giedi Prime",
        text: "Per distinguere il mondo degli Harkonnen sono state esplorate riprese in infrarosso, ottenendo cieli e incarnati spettrali invece di affidare l’intero effetto alla post-produzione."
      }
    ],
    challenge: "Proteggere attrezzature e continuità visiva tra caldo, vento e sabbia, coordinando grandi unità in location remote e lavorando in fasce di luce ristrette.",
    gallery: [
      { label: "Il deserto", caption: "Studio visivo dimostrativo", ratio: "wide" },
      { label: "Controluce", caption: "Studio visivo dimostrativo", ratio: "portrait" },
      { label: "Giedi Prime", caption: "Studio visivo dimostrativo", ratio: "square" }
    ]
  }
];
