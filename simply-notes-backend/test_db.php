<?php
include 'config.php';

if ($conn) {
    echo "Connessione riuscita!";
} else {
    echo "Errore di connessione al database.";
}
?>
