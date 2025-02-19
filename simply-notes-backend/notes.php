<?php
// notes.php
require 'config.php';
require 'jwt.php';

header("Content-Type: application/json");

// Verifica l'header di autorizzazione
$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';

if (!$authHeader) {
    echo json_encode(["status" => "error", "message" => "Header di autorizzazione mancante."]);
    exit;
}

// Formato atteso: "Bearer token"
list($jwt) = sscanf($authHeader, 'Bearer %s');
if (!$jwt) {
    echo json_encode(["status" => "error", "message" => "Token non trovato."]);
    exit;
}

$payload = jwt_decode($jwt, $jwt_secret);
if (!$payload) {
    echo json_encode(["status" => "error", "message" => "Token non valido."]);
    exit;
}

$user_id = $payload['user_id'];

// Gestione delle operazioni
$method = $_SERVER['REQUEST_METHOD'];
if ($method == 'GET') {
    // Legge tutte le note dell'utente
    $sql = "SELECT * FROM notes WHERE user_id = $user_id ORDER BY created_at DESC";
    $result = $conn->query($sql);
    $notes = [];
    while ($row = $result->fetch_assoc()) {
        $notes[] = $row;
    }
    echo json_encode(["status" => "success", "notes" => $notes]);
    exit;
} else if ($method == 'POST') {
    $action = isset($_GET['action']) ? $_GET['action'] : 'create';

    if ($action == 'create') {
        $title = isset($_POST['title']) ? $conn->real_escape_string($_POST['title']) : '';
        $content = isset($_POST['content']) ? $conn->real_escape_string($_POST['content']) : '';
        if (empty($title) || empty($content)) {
            echo json_encode(["status" => "error", "message" => "Titolo e contenuto sono obbligatori."]);
            exit;
        }
        $sql = "INSERT INTO notes (user_id, title, content) VALUES ($user_id, '$title', '$content')";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success", "message" => "Nota creata."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Errore nella creazione della nota."]);
        }
    } else if ($action == 'update') {
        $note_id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
        $title = isset($_POST['title']) ? $conn->real_escape_string($_POST['title']) : '';
        $content = isset($_POST['content']) ? $conn->real_escape_string($_POST['content']) : '';
        if ($note_id <= 0 || empty($title) || empty($content)) {
            echo json_encode(["status" => "error", "message" => "Dati non validi per l'aggiornamento."]);
            exit;
        }
        // Verifica che la nota appartenga all'utente
        $check = $conn->query("SELECT * FROM notes WHERE id = $note_id AND user_id = $user_id");
        if ($check->num_rows == 0) {
            echo json_encode(["status" => "error", "message" => "Nota non trovata."]);
            exit;
        }
        $sql = "UPDATE notes SET title='$title', content='$content' WHERE id = $note_id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success", "message" => "Nota aggiornata."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Errore nell'aggiornamento della nota."]);
        }
    } else if ($action == 'delete') {
        $note_id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
        if ($note_id <= 0) {
            echo json_encode(["status" => "error", "message" => "ID della nota non valido."]);
            exit;
        }
        // Verifica che la nota appartenga all'utente
        $check = $conn->query("SELECT * FROM notes WHERE id = $note_id AND user_id = $user_id");
        if ($check->num_rows == 0) {
            echo json_encode(["status" => "error", "message" => "Nota non trovata."]);
            exit;
        }
        $sql = "DELETE FROM notes WHERE id = $note_id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["status" => "success", "message" => "Nota eliminata."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Errore nell'eliminazione della nota."]);
        }
    }
}
