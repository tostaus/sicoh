<?php
include ('../clases/claseDB.php');

  
      $valor = $_POST['valor'];
      $valor2 = $_POST['valor2'];
      $filtro= $_POST['filtro'];
      $tabla =$_POST['tabla'];
      
      DB::buscaRegistros($valor,$valor2,$filtro,$tabla);
      
  
?>