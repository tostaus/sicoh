<?php
  include ('../clases/claseDB.php');
 
  $array =array('id' => $_POST['id'],
                'dia' => $_POST['dia'], 
                'modo' => $_POST['modo'],
                'entrada' => $_POST['entrada'],
                'salida' => $_POST['salida']);
  
 
   DB::updateRegistro($array);

?>