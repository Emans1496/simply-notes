<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'config.php';

if ($conn) {
    echo "Connessione riuscita!";
} else {
    echo "Errore di connessione al database: " . $conn->connect_error;
}
?>
