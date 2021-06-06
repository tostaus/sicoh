<?php
  include ('../clases/claseDB.php');
  
  $tabla = $_POST['tabla'];
  $valor = $_POST['valor'];
    DB::lista($tabla,$valor);

?>