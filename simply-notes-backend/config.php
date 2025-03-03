<?php
$host = "nozomi.proxy.rlwy.net:33737";
$username = "root"; 
$password = "yfGCtvOrPEeoRSUJUlvgQRBghsmjjhhX";
$database = "railway";
$port = 33737;

// Connessione al database
$conn = new mysqli($host, $username, $password, $database, $port);

if ($conn->connect_error) {
    die("Errore di connessione al database: " . $conn->connect_error);
}
?>
