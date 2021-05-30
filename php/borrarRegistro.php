<?php
  include ('../clases/claseDB.php');
  
    $cod = $_POST['cod'];
    $tabla= $_POST['tabla'];

    DB::borrarRegistro($cod,$tabla);

?>