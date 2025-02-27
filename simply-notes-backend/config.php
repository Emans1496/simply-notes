<?php
$host = "mysql.railway.internal"; // Host del database su Railway
$username = "root"; // Nome utente del database
$password = "yfGCtvOrPEeoRSUJUlvgQRBghsmjjhhX"; // Password del database
$database = "railway"; // Nome del database
$port = 3306; // Porta del database

// Connessione al database
$conn = new mysqli($host, $username, $password, $database, $port);

if ($conn->connect_error) {
    die("Errore di connessione al database: " . $conn->connect_error);
}

?>
