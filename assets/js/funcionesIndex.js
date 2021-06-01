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
    
    
    //Mostrar Registro seleccionado de tabla
   

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
    
    //Click en modificar
    $(document).on('click', '.modificar', (e) => {
        
        // Hacem   os visible el formulario para mostrar el registro
        $('#formulario').show();
        // edit a true 
        edit = 'true';
        ponreadonly(false);
        const element = $(this)[0].activeElement.parentElement.parentElement;
        const id = $(element).attr('codigo');
        const modo = $(element).attr('modo');
        const dia = $(element).attr('dia');
        console.log(id);
        console.log(modo);
        console.log(dia);
        //console.log(cod);
        let template = ``;
        // Nos devuelve el Registro y lo ponemos en el formulario
        $.post('./php/devuelveRegistro.php', { id, dia, modo , tabla}, (response) => {
            console.log(response);
            const registro = JSON.parse(response);
            $('#id').val(registro.ID);
            $('#dia').val(registro.DIA);
            $('#modo').val(registro.MODO);
            $('#entrada').val(registro.HORA_ENTRADA);
            $('#salida').val(registro.HORA_SALIDA);
            
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
        $.post('./php/devuelveRegistroDni.php', { valor , tabla2}, (response) => {
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
                    <tr codigo="${registro.ID}" modo="${registro.MODO}" dia="${registro.DIA}">
                    <td style="display: none;">${registro.ID}</td>
                    <td>${registro.DIA}</td>
                    <td>${modo}</td>
                    <td>${registro.HORA_ENTRADA}</td>
                    <td>${registro.HORA_SALIDA}</td>
                    <td>
                     
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