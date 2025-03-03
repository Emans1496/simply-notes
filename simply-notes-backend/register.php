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
require 'controllers/UserController.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = isset($_POST['email']) ? $conn->real_escape_string($_POST['email']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';

    if(empty($email) || empty($password)) {
        echo json_encode(["status" => "error", "message" => "Email e password sono obbligatori."]);
        exit;
    }
    
    $userController = new UserController($conn);
    $result = $userController->register($email, $password);
    echo json_encode($result);
    exit;
}

echo json_encode(["status" => "error", "message" => "Metodo non consentito."]);
exit;
?>
