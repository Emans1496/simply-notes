<?php
// jwt.php

$jwt_secret = "chiaveSuperSegreta123"; // Cambia questa chiave con qualcosa di più sicuro

// Funzione per fare il base64 URL safe
function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

// Genera un token JWT
function jwt_encode($payload, $secret) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode($payload);
    $base64UrlHeader = base64url_encode($header);
    $base64UrlPayload = base64url_encode($payload);
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
    $base64UrlSignature = base64url_encode($signature);
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

// Decodifica e verifica un token JWT
function jwt_decode($token, $secret) {
    $parts = explode('.', $token);
    if(count($parts) !== 3) {
        return false;
    }
    list($headerB64, $payloadB64, $signatureB64) = $parts;
    $header = json_decode(base64_decode(strtr($headerB64, '-_', '+/')), true);
    if($header['alg'] !== 'HS256') {
        return false;
    }
    $payload = json_decode(base64_decode(strtr($payloadB64, '-_', '+/')), true);
    $expected_signature = base64url_encode(hash_hmac('sha256', $headerB64 . "." . $payloadB64, $secret, true));
    if($expected_signature !== $signatureB64) {
        return false;
    }
    return $payload;
}
?>
