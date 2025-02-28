<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'config.php';
require 'jwt.php';

header("Content-Type: application/json");

// 1) Verifica header di autorizzazione
$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
if (!$authHeader) {
    echo json_encode(["status" => "error", "message" => "Header di autorizzazione mancante."]);
    exit;
}

// 2) Estrae il token "Bearer"
list($jwt) = sscanf($authHeader, 'Bearer %s');
if (!$jwt) {
    echo json_encode(["status" => "error", "message" => "Token non trovato."]);
    exit;
}

// 3) Decodifica il token e verifica validità
$payload = jwt_decode($jwt, $jwt_secret);
if (!$payload) {
    echo json_encode(["status" => "error", "message" => "Token non valido."]);
    exit;
}

$user_id = $payload['user_id'];

// 4) Gestione del metodo
$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    // ----- LISTA NOTE (GET) -----
    $stmt = $conn->prepare("SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $notes = [];
    while ($row = $result->fetch_assoc()) {
        $notes[] = $row;
    }
    echo json_encode(["status" => "success", "notes" => $notes]);
    exit;

} elseif ($method == 'POST') {
    // ----- OPERAZIONI CRUD (POST) -----

    // Recupera l'azione dalla variabile 'action' in POST
    $action = isset($_POST['action']) ? $_POST['action'] : '';

    switch ($action) {
        case 'add':
            // Aggiunta nuova nota
            $title = isset($_POST['title']) ? trim($_POST['title']) : '';
            $content = isset($_POST['content']) ? trim($_POST['content']) : '';

            if (empty($title) || empty($content)) {
                echo json_encode(["status" => "error", "message" => "Titolo e contenuto sono obbligatori."]);
                exit;
            }

            $stmt = $conn->prepare("INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)");
            $stmt->bind_param("iss", $user_id, $title, $content);

            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "Nota aggiunta con successo."]);
            } else {
                echo json_encode(["status" => "error", "message" => "Errore durante l'inserimento della nota."]);
            }
            exit;

        case 'update':
            // Modifica di una nota esistente
            $note_id = isset($_POST['id']) ? intval($_POST['id']) : 0;
            $title   = isset($_POST['title']) ? trim($_POST['title']) : '';
            $content = isset($_POST['content']) ? trim($_POST['content']) : '';

            if ($note_id <= 0 || empty($title) || empty($content)) {
                echo json_encode(["status" => "error", "message" => "Parametri mancanti per l'aggiornamento."]);
                exit;
            }

            // Aggiorno solo se la nota appartiene a user_id
            $stmt = $conn->prepare("UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?");
            $stmt->bind_param("ssii", $title, $content, $note_id, $user_id);

            if ($stmt->execute() && $stmt->affected_rows > 0) {
                echo json_encode(["status" => "success", "message" => "Nota aggiornata con successo."]);
            } else {
                echo json_encode(["status" => "error", "message" => "Errore durante l'aggiornamento o nota non trovata."]);
            }
            exit;

        case 'delete':
            // Eliminazione di una nota esistente
            $note_id = isset($_POST['id']) ? intval($_POST['id']) : 0;
            if ($note_id <= 0) {
                echo json_encode(["status" => "error", "message" => "ID nota non valido."]);
                exit;
            }

            $stmt = $conn->prepare("DELETE FROM notes WHERE id = ? AND user_id = ?");
            $stmt->bind_param("ii", $note_id, $user_id);

            if ($stmt->execute() && $stmt->affected_rows > 0) {
                echo json_encode(["status" => "success", "message" => "Nota eliminata con successo."]);
            } else {
                echo json_encode(["status" => "error", "message" => "Errore durante l'eliminazione o nota non trovata."]);
            }
            exit;

        default:
            // Azione non riconosciuta
            echo json_encode(["status" => "error", "message" => "Azione non valida o non specificata."]);
            exit;
    }

} else {
    // Metodo non consentito
    echo json_encode(["status" => "error", "message" => "Metodo non consentito."]);
    exit;
}
