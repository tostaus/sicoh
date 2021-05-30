<?php
  include ('../clases/claseDB.php');
 
  $array =array('id' => $_POST['incidencia_id'],
                'incidencia' => $_POST['incidencia'], 
                'solucion' => $_POST['solucion'],
                'fecha' => $_POST['fecha']);
  
 
   DB::updateRegistro($array);

?>