<?php
// login.php
require 'config.php';
require 'jwt.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = isset($_POST['email']) ? $conn->real_escape_string($_POST['email']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';

    if(empty($email) || empty($password)) {
        echo json_encode(["status" => "error", "message" => "Email e password sono obbligatori."]);
        exit;
    }

    // Cerca l'utente
    $sql = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($sql);
    if($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        if(password_verify($password, $user['password'])) {
            // Genera il token JWT
            $payload = [
                "user_id" => $user['id'],
                "email"   => $user['email'],
                "exp"     => time() + (60 * 60 * 24) // valido per 1 giorno
            ];
            $token = jwt_encode($payload, $jwt_secret);
            echo json_encode(["status" => "success", "token" => $token]);
            exit;
        }
    }
    echo json_encode(["status" => "error", "message" => "Credenziali non valide."]);
}
?>
