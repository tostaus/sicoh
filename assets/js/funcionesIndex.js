// Inicio
$(document).ready(function() {
    //Declaramos tabla con la que vamos a trabajar
    let tabla='SICOH_COMPUTO_MARCAJE_MySQL';
    let tabla2="SICOH_PERSONAL_MySQL";
    // Enseñamos listado de Registros
    //fetchLista();
    // Variable para comprobar si estamos editando o dando de alta
    let edit = false;
    //Ocultamos formulario de Registro
    $('#formulario').hide();
    // Función para lista de Registro
    function fetchLista() {
        $.post('./php/lista.php', { tabla }, (response) => {
                console.log(response);
                const registros = JSON.parse(response);
                let template = '';
                console.log(registros);
                registros.forEach(registro => {
                    // Creamos Tabla
                    //var res = registro.solucion.substring(0, 150);
                    template += `
                    <tr codigo="${registro.ID}">
                    <td>${registro.ID}</td>
                    <td>${registro.MODO}</td>
                    <td>${registro.DIA}</td>
                    <td>${registro.HORA_ENTRADA}</td>
                    <td>${registro.HORA_SALIDA}</td>
                    <td>
                      <button class="leer btn btn-info">
                      <i class="fas fa-book-open"></i>
                      Leer
                      </button>
                      <button class="modificar btn btn-success">
                      <i class="fas fa-edit"></i>
                      Modificar
                      </button>
                      <button class="borrar btn btn-danger">
                      <i class="fas fa-trash"></i>
                       Borrar 
                    </td>
                    </tr>
                  `
                });
                $('#tabla').html(template);
            }
        );
    }
    
    //Mostrar Registro seleccionado de tabla
    $(document).on('click', '.leer', (e) => {
        CKEDITOR.instances.solucion.destroy();
        // Hacemos visible el formulario para mostrar el registro
        $('#formulario').show();
        ponreadonly('true');
        const element = $(this)[0].activeElement.parentElement.parentElement;
        const cod = $(element).attr('codigo');
        let template = ``;
        // Nos devuelve el Registro y lo ponemos en el formulario
        $.post('./php/devuelveRegistro.php', { cod , tabla }, (response) => {
            console.log(response);
            const registro = JSON.parse(response);
            $('#codigoformulario').val(registro.id);
            $('#incidencia').val(registro.incidencia);
            $('#fecha').val(registro.fecha);
            $('#solucion').val(registro.solucion);
            CKEDITOR.replace("solucion", {
                uiColor: '#f3f3f3',
                language: 'es',
                height:400
            });
            $('.grabar').hide();
        });
        e.preventDefault();
    });

    // Nuevo Registro
    $(document).on('click', '#nuevoRegistro', (e) => {
        console.log('NuevoRegistro');
        e.preventDefault();
        CKEDITOR.instances.solucion.destroy();
        ponreadonly(false);
        $('#formulario').show();
        $('.grabar').show();
        $('#incidencia').val("");
        $('#solucion').val("");
        CKEDITOR.replace("solucion", {
            uiColor: '#f3f3f3',
            language: 'es',
            height:400
        });
        $('#fecha').val(fechaprint());
        // Ponemos a false edit para sumar registro
        edit = false;
    });
    // Función para poner 2 digitos a la fecha y hora
    function dosdigitos(n) {
        return (n < 10 ? '0' : '') + n;
    }

    // Botón Grabar
    $('#formulario').submit(e => {
        e.preventDefault();
        const cod = $('#codigoformulario').val()
            
        const postData = {
            incidencia_id: cod,
            incidencia: $('#incidencia').val(),
            solucion: $('#solucion').val(),
            fecha: $('#fecha').val(),
        };
            // Comprobamos si estamos editando o añadiendo Registro para llamar a uno o a otro
            const url = edit === false ? './php/nuevoRegistro.php' : './php/updateRegistro.php';
            console.log(postData, url);
            $.ajax({
                url: url,
                type: 'post',
                data: postData,
                dataType: 'json',
                success: function(response) {
                    console.log(response);
                    if (response == 0) {
                        alertify.success('Registro Grabado')
                    } else {
                        alertify.error('Ha ocurrido en un error en BBDD');
                    } 
                    $('#formulario').trigger('reset');
                    // Quitamos form y botón guardar
                    $('#formulario').hide();
                    fetchLista();
                }
            });
    });

    //Click en modificar
    $(document).on('click', '.modificar', (e) => {
        CKEDITOR.instances.solucion.destroy();
        // Hacemos visible el formulario para mostrar el registro
        $('#formulario').show();
        // edit a true 
        edit = 'true';
        ponreadonly(false);
        const element = $(this)[0].activeElement.parentElement.parentElement;
        const cod = $(element).attr('codigo');
        //console.log(cod);
        let template = ``;
        // Nos devuelve el Registro y lo ponemos en el formulario
        $.post('./php/devuelveRegistro.php', { cod , tabla}, (response) => {
            console.log(response);
            const registro = JSON.parse(response);
            $('#codigoformulario').val(registro.id);
            $('#incidencia').val(registro.incidencia);
            $('#solucion').val(registro.solucion);
            $('#fecha').val(registro.fecha);
            CKEDITOR.replace("solucion", {
                uiColor: '#f3f3f3',
                language: 'es',
                height:400
            });
            $('.grabar').show();
        });
        e.preventDefault();
    });

    // Borrar Registro
    $(document).on('click', '.borrar', (e) => {
        $('#formulario').hide();
        e.preventDefault();
        // Posición en la tabla donde hemos dado click
        const element = $(this)[0].activeElement.parentElement.parentElement;
        const cod = $(element).attr('codigo');
        console.log(cod);
        alertify.confirm('Incidencias', '¿Está seguro que quiere borrar este registro?',
            function() {
                // Solicitamos confirmación para borrar Registro
                $.post('./php/borrarRegistro.php', { cod, tabla }, (response) => {
                    {
                        if (response == 1) {
                            fetchLista();

                            alertify.success('Entrada Borrada');
                        } else {

                            alertify.error('Error conexión BBDD');
                        }
                    }
                });
            },
            function() {
                alertify.message('Operación Cancelada')
            });
    });

    // Buscador
    $('#buscar').click(function() {
        console.log('Buscando');
        // Ocultamos form 
        $('#formulario').hide();
        // Metemos en una variable lo que se va escribiendo en search
        let valor = $('#search').val();
        // Metemos en una variable por lo que se va a filtrar
        let filtro = "ID";
        $.post('./php/devuelveRegistro.php', { valor , tabla2}, (response) => {
            console.log(response);
            const registro = JSON.parse(response);
            console.log(registro);
            $('#fichajesde').html("Fichajes de:"+" "+registro.APELLIDOS+ ", " +registro.NOMBRE+"-"+registro.DNI);
        });
        $.ajax({
            url: './php/buscaRegistro.php',
            data: { tabla, valor, filtro },
            type: 'POST',
            success: function(response) {
                const registros = JSON.parse(response);
                let template = '';
                console.log(registros);
                registros.forEach(registro => {
                    var modo;
                    if (registro.MODO==1){
                        modo="MAÑANA";
                    }else{modo="TARDE";};
                    // Creamos Tabla
                    //var res = registro.solucion.substring(0, 150);
                    template += `
                    <tr codigo="${registro.ID}">
                    <td style="display: none;">${registro.ID}</td>
                    <td>${registro.DIA}</td>
                    <td>${modo}</td>
                    <td>${registro.HORA_ENTRADA}</td>
                    <td>${registro.HORA_SALIDA}</td>
                    <td>
                      <button class="leer btn btn-info">
                      <i class="fas fa-book-open"></i>
                      Leer
                      </button>
                      <button class="modificar btn btn-success">
                      <i class="fas fa-edit"></i>
                      Modificar
                      </button>
                      <button class="borrar btn btn-danger">
                      <i class="fas fa-trash"></i>
                       Borrar 
                    </td>
                    </tr>
                  `
                });
                $('#tabla').html(template);
            }
        });
    });

    // Cerrar formulario
    $(document).on('click', '.cerrar', (e) => {
        e.preventDefault();
        $('#formulario').hide();
    });
    
    // Quitamos o ponemos readonly campos formulario
    function ponreadonly(no) {
        $('#incidencia').attr('readonly', no);
        $('#solucion').attr('readonly', no);
        $('#fecha').attr('readonly', no);
    }

    // Fecha de hoy
    function fechaprint() {
        var fecha = new Date(); //Fecha actual
        var mes = fecha.getMonth() + 1; //obteniendo mes
        var dia = fecha.getDate(); //obteniendo dia
        var ano = fecha.getFullYear(); //obteniendo año
        return ano + "-" + dosdigitos(mes) + "-" + dosdigitos(dia);
    };
});