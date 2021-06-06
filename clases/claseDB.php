<?php

// Se incluye rb.php para usar redbean

include ('../assets/vendor/redBean/rb.php');
 
class DB {
    
    // Conexión BBDD con redBean
    protected static function conexion(){

        // Descomentar estas dos líneas cuando este en producción y quitar las de abajo
       // R::setup( 'mysql:host=10.193.133.21;dbname=SICOH',
       //'root', 'babylon' ); //for both mysql or mariaDB
       // ***** LAS DOS CONEXIONES TANTO PARA EL UPDATE QUE USA LA CONEXION PDO
       // ***** COMO PARA LO DEMAS QUE USA LA DE Readbeans

       
        R::setup( 'mysql:host=localhost;dbname=SICOH',
       'root', 'inmanuel' ); //for both mysql or mariaDB


       $db_host = 'localhost';  //  hostname 
        $db_name = 'SICOH';  //  databasename
        $db_user = 'root';  //  username
        $user_pw = 'inmanuel';  //  password*/
        // Para Producción abajo
        //$db_host = '10.193.133.21';  //  hostname 
        //$db_name = 'SICOH';  //  databasename
        //$db_user = 'root';  //  username
        //$user_pw = 'babylon';  //  password
        
        
        try {
            $conexion = new PDO('mysql:host='.$db_host.'; dbname='.$db_name, $db_user, $user_pw);
            $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $conexion->exec("set names utf8");
        } catch (PDOException $e) { //Se capturan los mensajes de error
            die("Error: " . $e->getMessage()); 
        }
        return $conexion;
    }

    // Función que devuelve los Registros de una tabla

    public static function listaPersonal($tabla){
        self::conexion();
        try{
            echo json_encode( R::getAll("SELECT * FROM {$tabla} ORDER BY APELLIDOS" ));

        }catch (Exception $e){ // Capturamos el error si se produce
            $mensaje = $e->getMessage();
                die("No se ha podido encontrar Registros: " . $e->getMessage()); 
        }
        
       
    }


    public static function lista($tabla,$valor){
        self::conexion();
        try{
            echo json_encode( R::getAll("SELECT * FROM {$tabla} WHERE ID={$valor} ORDER BY DIA DESC" ));

        }catch (Exception $e){ // Capturamos el error si se produce
            $mensaje = $e->getMessage();
                die("No se ha podido encontrar Registros: " . $e->getMessage()); 
        }
        
       
    }

     

   
    
  // Función que devuelve filtro  de la BUSQUEDA
    public static function buscaRegistroPersonal($valor,$filtro,$tabla){
    
        self::conexion();
        $busca='%' .$valor . '%';
        try{
        echo json_encode( R::getAll("SELECT * FROM {$tabla} WHERE {$filtro} like ? ORDER BY APELLIDOS",array("{$busca}")));
        
        
        }catch (Exception $e){ // Capturamos el error si se produce
            $mensaje = $e->getMessage();
                die("No se ha podido encontrar Registros: " . $e->getMessage()); 
        }
    }

     // Función para devolver un Registro de una tabla
     public static function devuelveRegistroDni($cod ,$tabla){
        self::conexion();
       
        // Intentamos la consulta
        try{
            echo json_encode( R::findOne( $tabla , ' ID = ? ',[$cod]));
        }catch (Exception $e){ // Capturamos el error si se produce
            $mensaje = $e->getMessage();
                die("No se ha podido devolver el Correo: " . $e->getMessage()); 
        }
       
    }
    

     //$dia1= $datetime->format(DateTime::ATOM); // Updated ISO8601
     public static function devuelveRegistro($id, $dia, $modo ,$tabla){
        //$conecta=self::conectar();
        $d = new DateTime($dia);
        $dia1= $d->format('Y-m-d');
        //$dia1=date(DATE_ISO8601, strtotime($dia));
        //$dia1 = new Blar_DateTime('14-05-2021');
        self::conexion();
    
     try{
         echo json_encode( R::getRow("SELECT * FROM {$tabla} where id=$id and modo=$modo and DIA = '$dia'"));

     }catch (Exception $e){ // Capturamos el error si se produce
         $mensaje = $e->getMessage();
             die("No se ha podido encontrar Registros: " . $e->getMessage()); 
     };
      
       
    }
   
    // Función para borrar un Registro de una tabla
    public static function borrarRegistro($cod,$tabla){
        self::conexion();
        // Nos posicionamos en el registro
        $borrar = R::load($tabla,$cod); 
        try{
            // Borramos Registro
            R::trash($borrar);
            echo 1;
        }catch (Exception $e){ // Capturamos el error si se produce
            $mensaje = $e->getMessage();
                die("No se ha podido borrar Registro: " . $e->getMessage()); 
            echo 0;
        }



    }
  // Función que devuelve filtro  de la BUSQUEDA
    public static function buscaRegistros($valor,$valor2,$filtro,$tabla){
        //  Filtro no lo utilizo, no lo quito por no liarlo más
        //$tabla2="SICOH_PERSONAL_MySQL";
        self::conexion();
        $busca='%' .$valor . '%';
        try{
        //echo json_encode( R::getAll("SELECT * FROM {$tabla} WHERE {$filtro} like ? ORDER BY DIA DESC",array("{$busca}")));
        
        echo json_encode( R::getAll("SELECT * FROM {$tabla} 
        WHERE ID = {$valor}  AND DIA = '{$valor2}'
        ORDER BY DIA DESC"));
        }catch (Exception $e){ // Capturamos el error si se produce
            $mensaje = $e->getMessage();
                die("No se ha podido encontrar Registros: " . $e->getMessage()); 
        }
    }
/**
 * A partir de aquí las funciones son para cada tabla no generales
 */
    // Función para modificar registro de Incidencia
    public static function updateRegistro($row){

        $conecta=self::conexion();
        $id=$row['id'];
        $modo=$row['modo'];
        $dia=$row['dia'];
        $entrada=$row['entrada'];
        $salida=$row['salida'];
       
        $consulta= "UPDATE SICOH_COMPUTO_MARCAJE_MySQL SET HORA_ENTRADA = '$entrada', HORA_SALIDA='$salida' WHERE id=$id and modo=$modo and DIA = '$dia'";
        $resultado = $conecta->prepare($consulta);
        try{
            $resultado ->execute();
            echo 0;
        }catch (Exception $e){ // Capturamos el error si se produce
            $mensaje = $e->getMessage();
                die("No se ha podido borrar Entrada: " . $e->getMessage()); 
            echo 1;
        }
       
        

    }
    // Grabar Registro en tabla incidencia
    public static function nuevoRegistro($row){
        self::conexion();
        // creamos estancia de la tabla incidencias
        $incidencias=R::dispense('incidencias');
        
        // Damos valor a cada propiedad de la tabla
        $incidencias->incidencia=$row['incidencia'];
        $incidencias->solucion=$row['solucion'];
        $incidencias->fecha=$row['fecha'];
        
        try{
            // Grabamos en BBDD.
            R::store($incidencias);
            echo 0;
            
        }catch (Exception $e){ // Capturamos el error si se produce
            $mensaje = $e->getMessage();
                die("No se ha podido insertar el registro " . $e->getMessage());
                echo 1;
        }
        
    }
    

}