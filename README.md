# 📒 Simply Notes

**Simply Notes** è una web app per la gestione delle note, realizzata con un approccio **full-stack**.  
L'app consente agli utenti di registrarsi, effettuare il login e gestire le proprie note (**creare, modificare, eliminare e visualizzare**).

## 🚀 Tecnologie Utilizzate

### 🖥️ **Frontend**
- **React** con **Material UI** per un'interfaccia moderna e responsive.

### ⚙️ **Backend**
- **PHP** con un router interno che gestisce le richieste in base a **rotta** e **metodo HTTP**.
- **Autenticazione JWT** per la gestione degli utenti.
- **MySQL** come database (il tutto ospitato su **Railway**).

---

## 🖥️ Backend

### `index.php`
- **Unico entry point** per tutte le richieste HTTP.
- Attraverso uno **switch** basato su `$_SERVER['REQUEST_URI']` e `$_SERVER['REQUEST_METHOD']`, instrada la richiesta ai controller (**/login, /register, /notes**).

### **📝 Controller**
- `UserController.php`: logica per **login** e **register**.
- `NoteController.php`: logica per **creare, leggere, aggiornare ed eliminare** le note.

### **⚙️ config.php**
- Carica le dipendenze di **Composer** (`vendor/autoload.php`).
- Utilizza **Dotenv** per caricare le variabili d’ambiente (**safeLoad()**).
- Se non trova `.env`, legge direttamente le variabili fornite dall’hosting (**Railway**).
- **Connessione a MySQL** con `mysqli`.

### **🔑 jwt.php**
- Generazione e verifica dei **token JWT** (autenticazione).

### **📌 Variabili d’Ambiente**
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `JWT_SECRET`, ecc.
- In **locale** vanno inserite in un file `.env` (**ignorato da Git**).
- In **produzione**, vengono impostate su **Railway**.
- Un file `.env.example` funge da riferimento per chi clona il progetto.

---

## 🎨 Frontend (React + Material UI)

### **🌍 Pagine principali**
- `Login.js` e `Register.js`: form per **autenticazione** (`/login` e `/register`).
- `Dashboard.js`: visualizza e gestisce le **note** (`/notes`).

### **🔄 Routing e Stato**
- **Routing** con **React Router**.
- **Gestione dei messaggi di stato** con **Snackbar** (Material UI).

---

## 🔥 Come Funziona

### 🔐 **Registrazione e Login**
1. L'utente si registra inviando **email e password** a `/register`.
2. Se l'operazione ha successo, può eseguire il **login** a `/login`.
3. Il server genera un **token JWT**, inviato al client e **salvato in localStorage**.

### 🗂️ **Dashboard delle Note**
1. Il client invia una richiesta **GET** a `/notes` con il **token JWT** nell'header `Authorization`.
2. Il server **decodifica il token**, identifica l’utente e restituisce le **note** associate.
3. L'utente può **creare, modificare o cancellare** note con richieste **POST** a `/notes` (`action = 'add'/'update'/'delete'`).
4. Il server risponde con un **messaggio di successo o errore**.

### 🎨 **UI e UX**
- Il frontend **React** è **responsivo** e utilizza **Material UI** (card, dialog, pulsanti, snackbar).
- **Form** di **aggiunta/modifica nota, login e registrazione** con **componenti MUI**.
- Uno **sfondo animato a gradiente** migliora l’esperienza utente.

---

##  🔒 Sicurezza e Best Practices
### 🛡️ Sicurezza con JWT
L’autenticazione avviene tramite JSON Web Token:
1. Al login, il server firma un token con JWT_SECRET.
2. Il client deve includere Authorization: Bearer <token> in ogni richiesta protetta.
3. Il server verifica il token e estrae l’user_id per gestire le note associate.

### 🔑 Variabili Sensibili
.env è ignorato da Git (.gitignore) per proteggere credenziali e chiavi segrete.
In locale, creare .env partendo da .env.example.
In produzione, le variabili sono configurate su Railway.
