<?php
  include ('../clases/claseDB.php');
 
  $array =array('id' => $_POST['incidencia_id'],
                'incidencia' => $_POST['incidencia'], 
                'solucion' => $_POST['solucion'],
                'fecha' => $_POST['fecha']);
  
 
   DB::updateRegistro($array);
   DB::conexion();
   $incidencias = R::load('incidencias',$row['id']); 
   

   $incidencias->incidencia=$row['incidencia'];
   $incidencias->solucion=$row['solucion'];
   $incidencias->fecha=$row['fecha'];

   try{
       R::store($incidencias);
       echo 0;
   }catch (Exception $e){ // Capturamos el error si se produce
       $mensaje = $e->getMessage();
           die("No se ha podido Modificar Registro: " . $e->getMessage()); 
       echo 1;
   }
   

?>