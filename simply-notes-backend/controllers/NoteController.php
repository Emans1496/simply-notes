<?php
// controllers/NoteController.php

class NoteController {
    private $conn;
    
    public function __construct($conn) {
        $this->conn = $conn;
    }
    
    // Elenca le note per un utente
    public function listNotes($user_id) {
        $stmt = $this->conn->prepare("SELECT * FROM notes WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $notes = [];
        while ($row = $result->fetch_assoc()) {
            $notes[] = $row;
        }
        return ["status" => "success", "notes" => $notes];
    }
    
    // Aggiunge una nuova nota
    public function addNote($user_id, $title, $content) {
        if (empty($title) || empty($content)) {
            return ["status" => "error", "message" => "Titolo e contenuto sono obbligatori."];
        }
        $stmt = $this->conn->prepare("INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)");
        $stmt->bind_param("iss", $user_id, $title, $content);
        if($stmt->execute()){
            return ["status" => "success", "message" => "Nota aggiunta con successo."];
        } else {
            return ["status" => "error", "message" => "Errore durante l'inserimento della nota."];
        }
    }
    
    // Aggiorna una nota esistente
    public function updateNote($user_id, $note_id, $title, $content) {
        if ($note_id <= 0 || empty($title) || empty($content)) {
            return ["status" => "error", "message" => "Parametri mancanti per l'aggiornamento."];
        }
        $stmt = $this->conn->prepare("UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ssii", $title, $content, $note_id, $user_id);
        if($stmt->execute() && $stmt->affected_rows > 0){
            return ["status" => "success", "message" => "Nota aggiornata con successo."];
        } else {
            return ["status" => "error", "message" => "Errore durante l'aggiornamento o nota non trovata."];
        }
    }
    
    // Elimina una nota
    public function deleteNote($user_id, $note_id) {
        if ($note_id <= 0) {
            return ["status" => "error", "message" => "ID nota non valido."];
        }
        $stmt = $this->conn->prepare("DELETE FROM notes WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ii", $note_id, $user_id);
        if($stmt->execute() && $stmt->affected_rows > 0){
            return ["status" => "success", "message" => "Nota eliminata con successo."];
        } else {
            return ["status" => "error", "message" => "Errore durante l'eliminazione o nota non trovata."];
        }
    }
}
?>
