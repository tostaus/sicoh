<?php
  include ('../clases/claseDB.php');
 
  $array =array('incidencia' => $_POST['incidencia'], 
                'solucion' => $_POST['solucion'],
                'fecha' => $_POST['fecha']);

  
 
   DB::nuevoRegistro($array);

?>