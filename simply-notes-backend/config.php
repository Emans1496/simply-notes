<?php
$host = "sql306.infinityfree.com"; // Host del database
$username = "if0_38352050"; // Nome utente del database
$password = "bPJKGCrCgn"; // Password del database
$database = "if0_38352050_simply_notes_db"; // Nome del database

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Errore di connessione al database: " . $conn->connect_error);
}
?>
