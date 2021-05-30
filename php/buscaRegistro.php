<?php
include ('../clases/claseDB.php');

  
      $valor = $_POST['valor'];
      $filtro= $_POST['filtro'];
      $tabla =$_POST['tabla'];
      
      DB::buscaRegistros($valor,$filtro,$tabla);
      
  
?>