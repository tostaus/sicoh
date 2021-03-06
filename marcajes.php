<?php
    // Comprobamos que hay sesión abierta
    
    if (isset($_GET['cod'])){
        $cod = $_GET['cod'];
        
    }
    //http://192.168.1.154/admin/correo.php?leido=0

?>
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="Creaciones Web Sitios">
    <meta name="generator" content="Hugo 0.79.0">
    <title>Web CRUD</title>
    <!-- Bootstrap  CSS -->
    <link href="./assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <!-- Css propio -->
    <link href="./assets/css/style.css" rel="stylesheet">
    <style>
    </style>
    <!-- Estilos varios -->
    <link href="./assets/vendor/fontawesome/css/all.css" rel="stylesheet">    
    <link rel="stylesheet" href="./assets/vendor/alertify/css/alertify.css">
    <link rel="stylesheet" href="./assets/vendor/alertify/css/themes/bootstrap.rtl.min.css" />
    <script src="./assets/vendor/jquery/jquery.min.js"></script>
    <script src="./assets/vendor/ckeditor/ckeditor.js"></script>
    <!-- Para botón de subir a principio página-->
    <script type='text/javascript'>
        $(document).ready(function() {
            $(window).scroll(function() {
                if ($(this).scrollTop() > 100) {
                    $('#scroll').fadeIn();
                } else {
                    $('#scroll').fadeOut();
                }
            });
            $('#scroll').click(function() {
                $("html, body").animate({
                    scrollTop: 0
                }, 600);
                return false;
            });
        });
    </script>
</head>

<body>
    <a href="javascript:void(0);" id="scroll" title="Scroll to Top" style="display: none;">Top<span></span></a>
    <header>
        <div class="container">
        <HR>
            <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                <a class="navbar-brand" id="fichajesde" href="#"></a>
                
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <!--ul class="navbar-nav mx-auto mb-2 mb-md-0">
                        <li class="nav-item active">
                            <a class="nav-link" aria-current="page" href="#"><b>Titulo 2</b></a>

                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Primero
                            </a>
                            <div class="dropdown-menu " aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#">Primero 1</a>
                                <a class="dropdown-item" href="#">Primero 2</a>
                            </div>
                        </li>
                        
                    <li class="nav-item ">
                            <a class="nav-link " href="#">Segundo</a>
                        </li>
                        <li class="nav-item ">
                            <a class="nav-link " href="#">Tercero</a>
                        </li>
                        
                    
                    </ul-->
                    <ul class="navbar-nav mx-auto mb-2 mb-md-0">
                    <a href="index.php" class="btn btn-outline-success" role="button"">
                    <i class="fas fa-undo"></i>
                    Volver</a>
                        <!--button class="btn btn-outline-success" type="button" id="nuevoRegistro"> <i class="fas fa-folder-plus"> </i> Nuevo registro</button-->
                    </ul>
                    <form class="form-inline my-2 my-lg-0">
                        
                    <input name="search_fecha" id="search_fecha" class="form-control mr-sm-2" type="date" placeholder="fecha" aria-label="Search">
                        <!-- Con Botón -->
                        <button class="buscar btn btn-success my-2 my-sm-0" type="button" id="buscar">Buscar</button>
                        <!--select class="form-control" id="filtro">
                            <option value="ID">ID</option>
                            <option value="MODO">MODO</option>
                            <option value="DIA">DIA</option>
                        </select-->
                    </form>
                </div>
            </nav>
        </div>
    </header>
    <main>
        <br>
        <div class="container-fluid">
            <div class="row p-2" >
                <!-- Campo para filtrar  -->
                <input type="text" id="cod" value = "<?php echo $cod;?>" hidden>
                <div class="col-md-6">
                    <table class="table table-bordered table-sm">
                        <thead>
                            <tr class="info">
                                <!--td>Código</td -->
                                <th style="display: none;">ID</th>
                                <th>DIA</th>
                                <th>HORARIO</th>
                                <th>ENTRADA</th>
                                <th>SALIDA</th>
                               
                            </tr>
                        </thead>
                        <tbody id="tabla"></tbody>
                    </table>
                </div>
                <div class="col-md-6">
                    <div class="card" id="formulario">
                    <div class="card-body" id="formulario">
                        <!-- FORMULARIO -->
                        <form id="formulario" enctype="multipart/form-data">
                        <!--No cambiamos nunca el id codigo para poder enlazarlo siempre igual-->
                        <input type="number" id="id" hidden>
                            <div class="form-group">
                                <label for="dia">DIA</label>
                                <input type="text" id="dia" class="form-control" readonly>
                            </div>
                            <div class="form-group">
                                <label for="modo">HORARIO</label>
                                <!--input type="text" id="modo" class="form-control" required-->
                                <select id="modo" class="form-control" disabled="true">
                                    <option value="1">MAÑANA</option> 
                                    <option value="2">TARDE</option> 
                                    
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="entrada">ENTRADA</label>
                                <input type="date" id="entrada" class="form-control" readonly>
                                <input type="text" id="entrada_tiempo" class="form-control"  required>
                            </div>
                            <div class="form-group">
                                <input type="date" id="salida" class="form-control" readonly>
                                <input type="text" id="salida_tiempo" class="form-control"  required>
                            </div>
                            
                        <br>
                        <br>
                        <button class="grabar btn btn-danger" type="submit">
                        <i class="fas fa-save"></i>
                                Grabar 
                        </button>
                        <button class="cerrar btn btn-info">
                        <i class="fas fa-window-close"></i>
                            Cerrar 
                        </button>
                        </form>
                    </div>
                    </div>
                </div>
            </div>

        </div>
        
  
    </main>
    
    <!-- Scripts utilizados -->
    <script src="./assets/vendor/popper/popper.min.js"></script>
    <script src="./assets/vendor/bootstrap/js/bootstrap.min.js "></script>
    <script src="./assets/vendor/alertify/js/alertify.min.js"></script>

    <!--Script de la página -->
    <script src="./assets/js/funcionesMarcajes.js"></script>


</body>

</html>
