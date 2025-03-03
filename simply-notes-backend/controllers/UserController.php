<?php
// controllers/UserController.php

class UserController {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    // Registra un nuovo utente
    public function register($email, $password) {
        // Verifica se l'utente esiste già
        $email = $this->conn->real_escape_string($email);
        $sql = "SELECT * FROM users WHERE email = '$email'";
        $result = $this->conn->query($sql);
        if($result->num_rows > 0) {
            return ["status" => "error", "message" => "Utente già registrato."];
        }

        $hashed_password = password_hash($password, PASSWORD_BCRYPT);
        $sql = "INSERT INTO users (email, password) VALUES ('$email', '$hashed_password')";
        if($this->conn->query($sql) === TRUE) {
            return ["status" => "success", "message" => "Registrazione avvenuta con successo."];
        } else {
            return ["status" => "error", "message" => "Errore durante la registrazione."];
        }
    }

    // Effettua il login e restituisce un token JWT
    public function login($email, $password, $jwt_secret) {
        $stmt = $this->conn->prepare("SELECT id, email, password FROM users WHERE email = ?");
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
                return ["status" => "success", "token" => $token];
            }
        }
        return ["status" => "error", "message" => "Credenziali non valide."];
    }
}
?>
