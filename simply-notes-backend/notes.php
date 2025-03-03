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
require 'controllers/NoteController.php';

header("Content-Type: application/json");

// Verifica header di autorizzazione
$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
if (!$authHeader) {
    echo json_encode(["status" => "error", "message" => "Header di autorizzazione mancante."]);
    exit;
}

// Estrae il token "Bearer"
list($jwt) = sscanf($authHeader, 'Bearer %s');
if (!$jwt) {
    echo json_encode(["status" => "error", "message" => "Token non trovato."]);
    exit;
}

// Decodifica e verifica il token
$payload = jwt_decode($jwt, $_ENV['JWT_SECRET']);
if (!$payload) {
    echo json_encode(["status" => "error", "message" => "Token non valido."]);
    exit;
}

$user_id = $payload['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

$noteController = new NoteController($conn);

if ($method == 'GET') {
    echo json_encode($noteController->listNotes($user_id));
    exit;
} elseif ($method == 'POST') {
    $action = isset($_POST['action']) ? $_POST['action'] : '';
    switch ($action) {
        case 'add':
            $title = isset($_POST['title']) ? trim($_POST['title']) : '';
            $content = isset($_POST['content']) ? trim($_POST['content']) : '';
            echo json_encode($noteController->addNote($user_id, $title, $content));
            exit;
        case 'update':
            $note_id = isset($_POST['id']) ? intval($_POST['id']) : 0;
            $title = isset($_POST['title']) ? trim($_POST['title']) : '';
            $content = isset($_POST['content']) ? trim($_POST['content']) : '';
            echo json_encode($noteController->updateNote($user_id, $note_id, $title, $content));
            exit;
        case 'delete':
            $note_id = isset($_POST['id']) ? intval($_POST['id']) : 0;
            echo json_encode($noteController->deleteNote($user_id, $note_id));
            exit;
        default:
            echo json_encode(["status" => "error", "message" => "Azione non valida o non specificata."]);
            exit;
    }
} else {
    echo json_encode(["status" => "error", "message" => "Metodo non consentito."]);
    exit;
}
?>
