
<?php
  include ('../clases/claseDB.php');
  
    $id = $_POST['id'];
    $dia= $_POST['dia'];
    $modo= $_POST['modo'];
    $tabla= $_POST['tabla'];

    DB::devuelveRegistro($id, $dia, $modo, $tabla);
?>