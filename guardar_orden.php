<?php
$conexion = new mysqli("localhost", "root", "", "kanu_amigos");

if ($conexion->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Error de conexión.']));
}

header('Content-Type: application/json');

$body     = json_decode(file_get_contents('php://input'), true);
$name     = $conexion->real_escape_string($body['name'] ?? '');
$email    = $conexion->real_escape_string($body['email'] ?? '');
$address  = $conexion->real_escape_string($body['address'] ?? '');
$city     = $conexion->real_escape_string($body['city'] ?? '');
$total    = floatval($body['total'] ?? 0);
$items    = $body['items'] ?? [];
$clientId = isset($body['client_id']) ? intval($body['client_id']) : null;

if (!$name || !$email || !$address || !$city || $total <= 0 || empty($items)) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos.']);
    exit;
}

$clientIdSql = $clientId ? $clientId : 'NULL';

$conexion->query("INSERT INTO orders (client_id, name, email, address, city, total)
                  VALUES ($clientIdSql, '$name', '$email', '$address', '$city', $total)");

if ($conexion->error) {
    echo json_encode(['success' => false, 'message' => 'Error al guardar la orden.']);
    exit;
}

$orderId = $conexion->insert_id;

foreach ($items as $item) {
    $productId = intval($item['id']);
    $itemName  = $conexion->real_escape_string($item['name']);
    $price     = floatval($item['price']);
    $qty       = intval($item['qty']);

    $conexion->query("INSERT INTO order_items (order_id, product_id, name, price, qty)
                      VALUES ($orderId, $productId, '$itemName', $price, $qty)");
}

echo json_encode(['success' => true, 'order_id' => $orderId]);

$conexion->close();
exit;
?>