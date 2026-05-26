<?php

$conexion = new mysqli("localhost", "root", "", "kanu_amigos");

if ($conexion->connect_error) {
    die("Error conexión: " . $conexion->connect_error);
}

$dueno    = $_POST['owner-name'] ?? '';
$mascota  = $_POST['pet-name'] ?? '';
$fecha    = $_POST['booking-date'] ?? '';
$hora     = $_POST['booking-time'] ?? '';
$servicio = $_POST['service-type'] ?? '';

$sql = "INSERT INTO citas (nombre_dueno, nombre_mascota, fecha, hora, servicio, fecha_registro)
        VALUES ('$dueno', '$mascota', '$fecha', '$hora', '$servicio', NOW())";

if ($conexion->query($sql)) {
    header('Location: services.html?cita=exitosa');
} else {
    header('Location: services.html?cita=error');
}

$conexion->close();
exit;
?><?php

$conexion = new mysqli("localhost", "root", "", "kanu_amigos");

if ($conexion->connect_error) {
    die("Error conexión: " . $conexion->connect_error);
}

$dueno    = $_POST['owner-name'] ?? '';
$mascota  = $_POST['pet-name'] ?? '';
$fecha    = $_POST['booking-date'] ?? '';
$hora     = $_POST['booking-time'] ?? '';
$servicio = $_POST['service-type'] ?? '';

$sql = "INSERT INTO citas (nombre_dueno, nombre_mascota, fecha, hora, servicio, fecha_registro)
        VALUES ('$dueno', '$mascota', '$fecha', '$hora', '$servicio', NOW())";

if ($conexion->query($sql)) {
    header('Location: services.html?cita=exitosa');
} else {
    header('Location: services.html?cita=error');
}

$conexion->close();
exit;
?>