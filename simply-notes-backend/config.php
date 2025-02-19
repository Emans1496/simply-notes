<?php
// config.php

// Imposta i dati del tuo database
$servername = "localhost";
$username = "if0_38352050";
$password = "bPJKGCrCgn";
$dbname   = "if0_38352050_simply_notes_db";

// Chiave segreta per JWT (scegli una stringa lunga e casuale)
$jwt_secret = "s'39bm2'vc*°pqiwkofàw1??112ù-v*èù-1skf1039";

// Crea la connessione al database
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
