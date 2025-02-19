<?php
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
