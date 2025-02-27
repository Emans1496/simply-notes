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

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';

    if(empty($email) || empty($password)) {
        echo json_encode(["status" => "error", "message" => "Email e password sono obbligatori."]);
        exit;
    }

    $stmt = $conn->prepare("SELECT id, email, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        if(password_verify($password, $user['password'])) {
            $payload = [
                "user_id" => $user['id'],
                "email"   => $user['email'],
                "exp"     => time() + (60 * 60 * 24)
            ];
            $token = jwt_encode($payload, $jwt_secret);
            echo json_encode(["status" => "success", "token" => $token]);
            exit;
        }
    }
    echo json_encode(["status" => "error", "message" => "Credenziali non valide."]);
}
?>
