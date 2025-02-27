<?php
// Abilita CORS per qualsiasi dominio (*), oppure specifica un dominio esatto
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Gestisce le richieste di preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

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
}
?>
