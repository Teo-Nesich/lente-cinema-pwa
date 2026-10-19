# Lente — Dentro il cinema

> **Work in progress** — progetto personale ancora in sviluppo. Funzioni, contenuti e interfaccia possono cambiare.

Lente è una PWA dedicata ai mestieri del cinema. Permette di esplorare film, cercare nel catalogo e leggere schede su regia, fotografia, scenografia e produzione.

**[Apri la demo pubblica](https://lente-cinema-teoboba.matteonesich92.chatgpt.site)**

![Anteprima di Lente su smartphone](lente-demo.png)

## Funzionalità attuali

- Sei schede editoriali dimostrative disponibili anche senza configurare servizi esterni.
- Ricerca per film e professionisti, con filtri per genere.
- Pagine di dettaglio e preferiti salvati sul dispositivo.
- Interfaccia mobile e installazione come PWA tramite manifest e service worker.
- Ricerca nel catalogo TMDB quando è configurato un token sul server.

## Tecnologie e struttura

Il frontend usa HTML, CSS e JavaScript. `app.js`, `catalog.js` e `data.js` gestiscono interfaccia, ricerca e dati editoriali. `manifest.webmanifest` e `sw.js` forniscono le funzioni PWA. `server.js` espone il server locale e gli endpoint TMDB; `worker/index.ts` svolge lo stesso ruolo nella versione ospitata su Sites. Il token TMDB resta sul server.

## Avvio in locale

Serve Node.js **22.13 o successivo**. Clona il repository ed esegui:

```bash
npm install
npm run dev:local
```

Apri `http://localhost:4173`. La demo con sei film funziona senza token TMDB. Per abilitare la ricerca nel catalogo esteso, copia `.env.example` in `.env`, inserisci il tuo `TMDB_BEARER_TOKEN` e riavvia il server. **Non pubblicare il file `.env` o il token.**

## Test

```bash
npm test
```

I test attuali coprono ricerca, filtri e formattazione dei nomi della troupe.

## Stato e prossimi passi

Il codice qui pubblicato corrisponde alla versione sorgente della demo Sites, esclusa la configurazione interna di hosting e le credenziali. Lo sviluppo è ancora aperto: restano da completare la gestione dei contenuti editoriali con fonti, la sincronizzazione dei preferiti e ulteriori verifiche dell’interfaccia. Il repository GitHub non aggiorna automaticamente la demo ospitata.

This product uses the TMDB API but is not endorsed or certified by TMDB.
