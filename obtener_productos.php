<?php

header('Content-Type: application/json');

$conexion = new mysqli("localhost", "root", "", "kanu_amigos");
$conexion->set_charset("utf8"); 

if ($conexion->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Error de conexión"
    ]);
    exit;
}

$sql = "SELECT * FROM productos";
$resultado = $conexion->query($sql);

$productos = [];

while ($fila = $resultado->fetch_assoc()) {

    $productos[] = [
        "id" => $fila["id"],
        "name" => $fila["name"],
        "category" => $fila["category"],
        "price" => (int)$fila["price"],
        "originalPrice" => $fila["originalPrice"] ? (int)$fila["originalPrice"] : null,
        "image" => $fila["image"]
    ];
}

$json = json_encode($productos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
if ($json === false) {
    die(json_encode(["error" => json_last_error_msg()]));
}

echo $json;
$conexion->close();

?>