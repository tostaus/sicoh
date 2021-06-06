// Inicio
$(document).ready(function() {
    //Declaramos tabla con la que vamos a trabajar
    let cod=$('#cod').val();
    console.log(cod);
    let tabla='SICOH_COMPUTO_MARCAJE_MySQL';
    let tabla2="SICOH_PERSONAL_MySQL";
    // Enseñamos listado de Registros
    fetchListaPersonal();
    // Variable para comprobar si estamos editando o dando de alta
    let edit = false;
    //Ocultamos formulario de Registro
    $('#formulario').hide();
    // Función para lista de Registro
    
    
   
     // Botón Grabar
     $('#formulario').submit(e => {
        e.preventDefault();
        //const cod = $('#codigoformulario').val()
        // Validar hora con expresión regular formato HH:MM:SS
    // ^([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$

    //sACADO DE http://w3.unpocodetodo.info/utiles/regex-ejemplos.php?type=hora
   
    
        var expreg= new RegExp("^([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$");
        var horaEntrada=$("#entrada_tiempo").val();
        var horaSalida=$("#salida_tiempo").val();
        if (!expreg.test(horaEntrada) || !expreg.test(horaSalida)) {
            alertify.error('Formato hora erróneo');
        }else{

            let entradaP = $('#entrada').val()+" "+$('#entrada_tiempo').val();
        let salidaP = $('#salida').val()+" "+$('#salida_tiempo').val();
        console.log(entrada);
        const postData = {
            id:  $('#id').val(),
            dia: $('#dia').val(),
            modo: $('#modo').val(),
            entrada: entradaP,
            salida: salidaP,
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
                    fetchListaPersonal();
                }
            });
        }
    
        
    });

    // Nuevo Registro ***NO UTILIZADO 
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
        //ponreadonly(false);
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
            // Formateamos la fecha para que solo se pueda modificar la hora y no el día
            let horaEntrada =registro.HORA_ENTRADA.split(' ')[1];
            let diaEntrada = registro.HORA_ENTRADA.split(' ')[0];
            let horaSalida =registro.HORA_SALIDA.split(' ')[1];
            let diaSalida = registro.HORA_SALIDA.split(' ')[0];
            
            $('#id').val(registro.ID);
            $('#dia').val(registro.DIA);
            $('#modo').val(registro.MODO);
            $('#entrada').val(diaEntrada);
            $('#entrada_tiempo').val(horaEntrada);
            $('#salida').val(diaSalida);
            $('#salida_tiempo').val(horaSalida);
            
            $('.grabar').show();
        });
        e.preventDefault();
    });

    // Borrar Registro **NO UTILIZADO
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
        let valor = cod;
        // Metemos en una variable por lo que se va a filtrar
        let filtro = "ID";
        // aunque se llama devuelveRegistroDni , lo buscamos por ID en la version anterior buscabamos por dni
        
        fetchLista();
           
      
        
    });

    // Cerrar formulario
    $(document).on('click', '.cerrar', (e) => {
        e.preventDefault();
        $('#formulario').hide();
    });
    
    function fetchListaPersonal(){
        let valor = cod;
        $.post('./php/devuelveRegistroDni.php', { valor , tabla2}, (response) => {
            const registro = JSON.parse(response);
                console.log(response);
                console.log(registro);
                $('#fichajesde').show();
                $('#fichajesde').html("Fichajes de:"+" "+registro.APELLIDOS+ ", " +registro.NOMBRE+"-"+registro.DNI);
                $('#tabla').show();
              
           
        });
        $.ajax({
            url: './php/lista.php',
            data: { tabla, valor},
            type: 'POST',
            success: function(response) {
                const registros = JSON.parse(response);
                if(registros.length==0){
                    alertify.error('No hay Marcajes de ese día para esta Persona');
                };
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
                      
                    </td>
                    </tr>
                  `
                });
                $('#tabla').html(template);
            }
        });

    };
    
   

    function fetchLista(){

        let valor = cod;
       
            let valor2 = $('#search_fecha').val()+" "+"00:00:00";

        
    
        console.log("esto es la fecha "+valor2);

        // Metemos en una variable por lo que se va a filtrar
        let filtro = "ID";

        console.log (valor+" "+valor2+" "+filtro+ " "+tabla)
        $.ajax({
            url: './php/buscaRegistro.php',
            data: { tabla, valor, valor2, filtro },
            type: 'POST',
            success: function(response) {
                const registros = JSON.parse(response);
                if(registros.length==0){
                    alertify.error('No hay Marcajes de ese día para esta Persona');
                };
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
                      
                    </td>
                    </tr>
                  `
                });
                $('#tabla').html(template);
            }
        });
    };
});