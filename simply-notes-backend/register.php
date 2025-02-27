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

// register.php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = isset($_POST['email']) ? $conn->real_escape_string($_POST['email']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';

    if(empty($email) || empty($password)) {
        echo json_encode(["status" => "error", "message" => "Email e password sono obbligatori."]);
        exit;
    }

    // Verifica se l'utente esiste già
    $sql = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($sql);
    if($result->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Utente già registrato."]);
        exit;
    }

    // Hash della password
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);

    // Inserisci il nuovo utente
    $sql = "INSERT INTO users (email, password) VALUES ('$email', '$hashed_password')";
    if($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Registrazione avvenuta con successo."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Errore durante la registrazione."]);
    }
}
?>
