<?php
  include ('../clases/claseDB.php');
  
    $cod = $_POST['valor'];
    $tabla= $_POST['tabla2'];

    DB::devuelveRegistroDni($cod,$tabla);

?>

