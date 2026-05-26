<?php

$conexion = new mysqli("localhost", "root", "", "kanu_amigos");

if ($conexion->connect_error) {
    die("Error conexión: " . $conexion->connect_error);
}

$body     = json_decode(file_get_contents('php://input'), true);
$email    = $conexion->real_escape_string($body['email'] ?? '');
$password = $body['password'] ?? '';

$result = $conexion->query("SELECT ca.password, c.id, c.name, c.email, c.address, c.city
                             FROM client_auth ca
                             JOIN client c ON ca.client_id = c.id
                             WHERE ca.email = '$email'");

header('Content-Type: application/json');

if ($result && $result->num_rows > 0) {

    $row = $result->fetch_assoc();

    if (password_verify($password, $row['password'])) {
        echo json_encode([
            'success' => true,
            'user' => [
                'id'      => $row['id'],
                'name'    => $row['name'],
                'email'   => $row['email'],
                'address' => $row['address'],
                'city'    => $row['city']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta.']);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'No existe una cuenta con ese correo.']);
}

$conexion->close();
exit;
?>