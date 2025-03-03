<?php
// config.php

// Carica l'autoload di Composer
require __DIR__ . '/vendor/autoload.php';

// Carica le variabili d'ambiente dal file .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Usa le variabili d'ambiente
$host = $_ENV['DB_HOST'];
$username = $_ENV['DB_USERNAME'];
$password = $_ENV['DB_PASSWORD'];
$database = $_ENV['DB_DATABASE'];
$port = $_ENV['DB_PORT'];

// Connessione al database
$conn = new mysqli($host, $username, $password, $database, $port);

if ($conn->connect_error) {
    die("Errore di connessione al database: " . $conn->connect_error);
}
?>
