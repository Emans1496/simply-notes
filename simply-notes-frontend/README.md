# Simply Notes

**Simply Notes** è una web app per la gestione delle note, realizzata con un approccio full-stack. L'app consente agli utenti di registrarsi, effettuare il login e gestire le proprie note (creare, modificare, eliminare e visualizzare).

L'app utilizza:
- Un **backend** in PHP con JWT per l'autenticazione e MySQL (ospitato su Railway)
- Un **frontend** sviluppato in React con Material UI per un'interfaccia moderna e responsive

---

## Struttura dell'Applicazione

### Backend

- **PHP con JWT**
  - `config.php`: Gestisce la connessione a MySQL (utilizzando variabili d'ambiente o valori hardcoded su Railway).
  - `jwt.php`: Contiene le funzioni per generare e verificare i token JWT.
  - `notes.php`: Un unico endpoint che gestisce tutte le operazioni CRUD sulle note.
    - **GET**: Restituisce tutte le note dell'utente autenticato.
    - **POST**: In base al parametro `action` (add, update, delete), esegue l'inserimento, l'aggiornamento o l'eliminazione di una nota.

- **Altri endpoint**
  - `login.php`: Gestisce l'autenticazione, verifica le credenziali e restituisce un token JWT.
  - `register.php`: Gestisce la registrazione degli utenti.

### Frontend

- **React & Material UI**
  - **Login.js**
    - Pagina di login con uno sfondo animato a gradiente e una card centrata.
    - Comunica con il backend per autenticare l'utente e, in caso di successo, reindirizza alla dashboard.
  - **Register.js**
    - Pagina di registrazione con lo stesso stile di Login (sfondo animato, card centrata, form pulito).
  - **Dashboard.js**
    - Visualizza l'elenco delle note in una griglia responsive.
    - Funzionalità CRUD:
      - **Creazione**: Tramite un dialog con transizione Slide.
      - **Modifica**: Tramite un dialog per aggiornare una nota.
      - **Eliminazione**: Tramite un pulsante (icona Delete) con conferma.
    - Include una barra per la ricerca e un menu a tendina per l'ordinamento (per data o titolo).
    - Fornisce feedback all'utente tramite uno Snackbar.
    - Il design è reso moderno grazie a uno sfondo animato e componenti Material UI.

---

## Funzionamento dell'App

1. **Registrazione e Login**
   - Gli utenti si registrano tramite `register.php` e poi si autenticano con `login.php`.
   - Al login, il backend restituisce un token JWT che viene salvato nel `localStorage` del browser.
   - Se il token è presente, l'utente viene reindirizzato alla Dashboard.

2. **Dashboard**
   - La Dashboard carica le note dell'utente tramite una richiesta GET a `notes.php`.
   - L'utente può filtrare le note tramite un campo di ricerca e ordinare i risultati (per data o titolo).
   - Tramite i dialog di aggiunta e modifica, l'utente può creare e aggiornare le note.
   - Le note possono essere eliminate tramite il pulsante di eliminazione (con conferma).
   - Ogni operazione (aggiunta, aggiornamento, eliminazione) mostra un feedback visivo tramite uno Snackbar.
   - Il design include un **sfondo animato** a gradiente, garantendo coerenza visiva con le pagine di Login e Register.

3. **Navigazione e Tema**
   - La navigazione tra le pagine è gestita da React Router.
   - Il tema chiaro/scuro è gestito globalmente (in `App.js`) e può essere attivato tramite un toggle (inserito nel Drawer).

---

## Tecnologie e Strumenti

- **Frontend:**
  - **React**: per la creazione dell'interfaccia utente.
  - **Material UI (MUI)**: per componenti UI moderni e responsive.
  - **React Router**: per la navigazione tra le pagine.
  - **GlobalStyles** di MUI: per definire stili globali (es. animazione del background).
  - **Fetch API**: per la comunicazione con il backend.

- **Backend:**
  - **PHP**: per la logica di autenticazione e gestione delle note.
  - **JWT**: per l'autenticazione degli utenti.
  - **MySQL**: come database per salvare utenti e note.
  - **Railway**: per l'hosting del backend e del database.

---

## Considerazioni Finali

- **Design Moderno e Coerente:**  
  L'app utilizza uno sfondo animato a gradiente e card centrati, offrendo un'esperienza visiva moderna sia su dispositivi mobili che desktop.
  
- **Feedback Immediato:**  
  Grazie all'uso di Snackbar e Skeleton, l'utente riceve riscontri immediati durante le operazioni e il caricamento dei dati.

- **Sicurezza:**  
  L'autenticazione tramite JWT e il controllo del token sul frontend assicurano che solo gli utenti autorizzati possano accedere alle note.

- **Scalabilità:**  
  La struttura modulare (componenti Login, Register, Dashboard) e l'endpoint unico per le note permettono futuri aggiornamenti e l'aggiunta di nuove funzionalità.

---

## Flusso dell'Applicazione

1. **Registrazione:**  
   L'utente si registra tramite `register.php`, fornendo email e password.

2. **Login:**  
   L'utente effettua il login tramite `login.php`. Se le credenziali sono corrette, il backend restituisce un token JWT che viene salvato nel `localStorage`.

3. **Dashboard:**  
   - Vengono caricate le note dell'utente tramite `notes.php`.
   - L'utente può cercare, ordinare, aggiungere, modificare ed eliminare le note.
   - Le operazioni generano notifiche visive tramite Snackbar.
   - Il design responsive e lo sfondo animato garantiscono un'esperienza ottimale su mobile e desktop.

4. **Navigazione e Tema:**  
   - La navigazione tra le pagine è gestita tramite React Router.
   - Il Drawer laterale offre opzioni come il logout e il toggle del tema chiaro/scuro.
   - Il tema è gestito globalmente (in `App.js`) e si applica uniformemente a tutte le pagine.

---