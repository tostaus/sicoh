<?php

// Se incluye rb.php para usar redbean

include ('../assets/vendor/redBean/rb.php');
 
class DB {
    
    // Conexión BBDD con redBean
    protected static function conexion(){

        // Descomentar estas dos líneas cuando este en producción y quitar las de abajo
       // R::setup( 'mysql:host=10.193.133.21;dbname=SICOH',
       // 'root', 'babylon' ); //for both mysql or mariaDB
       
        R::setup( 'mysql:host=localhost;dbname=SICOH',
        'root', 'inmanuel' ); //for both mysql or mariaDB
    }

    // Función que devuelve los Registros de una tabla

    public static function lista($tabla){
        self::conexion();
        try{
            echo json_encode( R::getAll("SELECT * FROM {$tabla} where id=789 ORDER BY DIA DESC" ));

        }catch (Exception $e){ // Capturamos el error si se produce
            $mensaje = $e->getMessage();
                die("No se ha podido encontrar Registros: " . $e->getMessage()); 
        }
        
       
    }

     // Función para devolver un Registro de una tabla
     public static function devuelveRegistro($cod ,$tabla){
        self::conexion();
       
        // Intentamos la consulta
        try{
            echo json_encode( R::findOne( $tabla , ' DNI = ? ',[$cod]));
        }catch (Exception $e){ // Capturamos el error si se produce
            $mensaje = $e->getMessage();
                die("No se ha podido devolver el Correo: " . $e->getMessage()); 
        }
       
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
    public static function buscaRegistros($valor,$filtro,$tabla){
        //  Filtro no lo utilizo, no lo quito por no liarlo más
        $tabla2="SICOH_PERSONAL_MySQL";
        self::conexion();
        $busca='%' .$valor . '%';
        try{
        //echo json_encode( R::getAll("SELECT * FROM {$tabla} WHERE {$filtro} like ? ORDER BY DIA DESC",array("{$busca}")));
        
        echo json_encode( R::getAll("SELECT {$tabla}.* , {$tabla2}.* FROM {$tabla} ,{$tabla2}
        WHERE {$tabla2}.DNI like ? AND 
        {$tabla}.ID= {$tabla2}.ID
        ORDER BY DIA DESC",array("{$busca}")));
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
    
        self::conexion();
        // Cargamos registro que vamos a modificar
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