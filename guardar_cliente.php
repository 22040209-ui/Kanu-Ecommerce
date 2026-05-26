<?php

$conexion = new mysqli("localhost", "root", "", "kanu_amigos");

if ($conexion->connect_error) {
    die("Error conexión: " . $conexion->connect_error);
}

$body     = json_decode(file_get_contents('php://input'), true);
$nombre   = $body['name'] . ' ' . $body['lastname'];
$email    = $conexion->real_escape_string($body['email']);
$address  = $conexion->real_escape_string($body['address']);
$city     = $conexion->real_escape_string($body['city']);
$password = password_hash($body['password'], PASSWORD_BCRYPT);

$sqlClient = "INSERT INTO client (name, email, address, city)
              VALUES ('$nombre', '$email', '$address', '$city')";

if ($conexion->query($sqlClient)) {

    $clientId = $conexion->insert_id;

    $sqlAuth = "INSERT INTO client_auth (client_id, email, password)
                VALUES ('$clientId', '$email', '$password')";

    if ($conexion->query($sqlAuth)) {
        header('Content-Type: application/json');
        echo json_encode(['success' => true]);
    } else {
        header('Content-Type: application/json');
        echo json_encode(['success' => false]);
    }

} else {
    header('Content-Type: application/json');
    echo json_encode(['success' => false]);
}

$conexion->close();
exit;
?>