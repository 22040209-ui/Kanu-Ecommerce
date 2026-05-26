<?php

header('Content-Type: application/json');

$conexion = new mysqli("localhost", "root", "", "kanu_amigos");
$conexion->set_charset("utf8"); 
if ($conexion->connect_error) {

    die(json_encode([
        "success" => false,
        "message" => $conexion->connect_error
    ]));
}

$sql = "SELECT * FROM promociones";

$resultado = $conexion->query($sql);

if (!$resultado) {

    die(json_encode([
        "success" => false,
        "message" => $conexion->error
    ]));
}

$promociones = [];
while ($fila = $resultado->fetch_assoc()) {
   
    $promociones[] = [

        "id" => $fila["id"],
        "title" => $fila["titulo"],
        "description" => $fila["descripcion"],
        "buttonText" => $fila["texto_boton"],
        "link" => $fila["enlace"],
        "image" => $fila["imagen"],
        "theme" => $fila["tema"]

    ];
}

$json = json_encode($promociones, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

if ($json === false) {
    die(json_encode(["error" => json_last_error_msg()]));
}

echo $json;
$conexion->close();

?>