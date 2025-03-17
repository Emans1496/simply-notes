<?php
// Impostazioni CORS e simili
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Se è una OPTIONS, rispondi 200 ed esci
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Carichiamo tutto ciò che ci serve
require_once 'config.php';              // Connessione DB e .env
require_once 'jwt.php';                 // Funzioni per generare/decodificare JWT
require_once 'controllers/UserController.php';
require_once 'controllers/NoteController.php';

// Otteniamo metodo e path della richiesta
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Switch sulla rotta (uri)
switch ($uri) {
    
    // -----------------------
    //           LOGIN
    // -----------------------
    case '/login':
        if ($method === 'POST') {
            $email    = isset($_POST['email']) ? trim($_POST['email']) : '';
            $password = isset($_POST['password']) ? $_POST['password'] : '';

            if (empty($email) || empty($password)) {
                echo json_encode(["status" => "error", "message" => "Email e password sono obbligatori."]);
                exit;
            }

            $userController = new UserController($conn);
            // Occhio qui: usiamo $_ENV['JWT_SECRET'] come indicato in config.php
            $result = $userController->login($email, $password, $_ENV['JWT_SECRET']);
            echo json_encode($result);
            exit;
        } else {
            echo json_encode(["status" => "error", "message" => "Metodo non consentito."]);
            exit;
        }
        break;

    // -----------------------
    //         REGISTER
    // -----------------------
    case '/register':
        if ($method === 'POST') {
            $email    = isset($_POST['email']) ? $conn->real_escape_string($_POST['email']) : '';
            $password = isset($_POST['password']) ? $_POST['password'] : '';

            if (empty($email) || empty($password)) {
                echo json_encode(["status" => "error", "message" => "Email e password sono obbligatori."]);
                exit;
            }

            $userController = new UserController($conn);
            $result = $userController->register($email, $password);
            echo json_encode($result);
            exit;
        } else {
            echo json_encode(["status" => "error", "message" => "Metodo non consentito."]);
            exit;
        }
        break;
    
    // -----------------------
    //          NOTES
    // -----------------------
    case '/notes':
        // Per qualsiasi azione sulle note, serve il token
        // Controllo header di autorizzazione
        $authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
        if (!$authHeader) {
            echo json_encode(["status" => "error", "message" => "Header di autorizzazione mancante."]);
            exit;
        }

        // Estrae il token Bearer
        list($jwtToken) = sscanf($authHeader, 'Bearer %s');
        if (!$jwtToken) {
            echo json_encode(["status" => "error", "message" => "Token non trovato."]);
            exit;
        }

        // Decodifica e verifica il token
        $payload = jwt_decode($jwtToken, $_ENV['JWT_SECRET']);
        if (!$payload) {
            echo json_encode(["status" => "error", "message" => "Token non valido."]);
            exit;
        }

        $user_id        = $payload['user_id'];
        $noteController = new NoteController($conn);

        if ($method === 'GET') {
            // Elenco note
            echo json_encode($noteController->listNotes($user_id));
            exit;
        } elseif ($method === 'POST') {
            // Decidiamo l'azione in base a $_POST['action']
            $action = isset($_POST['action']) ? $_POST['action'] : '';

            switch ($action) {
                case 'add':
                    $title   = isset($_POST['title']) ? trim($_POST['title']) : '';
                    $content = isset($_POST['content']) ? trim($_POST['content']) : '';
                    echo json_encode($noteController->addNote($user_id, $title, $content));
                    exit;

                case 'update':
                    $note_id = isset($_POST['id']) ? intval($_POST['id']) : 0;
                    $title   = isset($_POST['title']) ? trim($_POST['title']) : '';
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
        break;
    
    // Se la rotta non corrisponde a nessuna delle precedenti
    default:
        echo json_encode(["status" => "error", "message" => "Endpoint non trovato."]);
        exit;
}
?>
