<?php
  include ('../clases/claseDB.php');
  
  $tabla = $_POST['tabla'];
    
    DB::listaPersonal($tabla);

?>