// Inicio
$(document).ready(function() {
    //Declaramos tabla con la que vamos a trabajar
    let tabla='SICOH_PERSONAL_MySQL';
    // Enseñamos listado de Registros
    fetchLista();
    // Variable para comprobar si estamos editando o dando de alta
    let edit = false;
    //Ocultamos formulario de Registro
    $('#formulario').hide();
    // Función para lista de Registro
    function fetchLista() {
        $.post('./php/listaPersonal.php', { tabla }, (response) => {
                const registros = JSON.parse(response);
                let template = '';
                console.log(registros);
                registros.forEach(registro => {
                    // Creamos Tabla
                    //var res = registro.solucion.substring(0, 150);
                    template += `
                    <tr>
                    <td>${registro.ID}</td>
                    <td>${registro.DNI}</td>
                    <td>${registro.APELLIDOS}</td>
                    <td>${registro.NOMBRE}</td>
                    <td>
                    <a href="marcajes.php?cod=${registro.ID}" class="btn btn-ttc" role="button"">
                    <i class="fas fa-trash"></i>
                    Marcajes</a>
                      
                    </td>
                    </tr>
                  `
                });
                $('#tabla').html(template);
            }
        );
    }
    
       

   

    // Buscador
    $('#search').keyup(function() {
        // Ocultamos form 
        $('#formulario').hide();
        // Metemos en una variable lo que se va escribiendo en search
        let valor = $('#search').val();
        // Metemos en una variable por lo que se va a filtrar
        let filtro = $('#filtro').val();
        $.ajax({
            url: './php/buscaRegistroPersonal.php',
            data: { tabla, valor, filtro },
            type: 'POST',
            success: function(response) {
                const registros = JSON.parse(response);
                let template = '';
                console.log(registros);
                registros.forEach(registro => {
                    // Creamos Tabla
                    //var res = registro.solucion.substring(0, 150);
                    template += `
                    <tr>
                    <td>${registro.ID}</td>
                    <td>${registro.DNI}</td>
                    <td>${registro.APELLIDOS}</td>
                    <td>${registro.NOMBRE}</td>
                    <td>
                    <a href="marcajes.php?cod=${registro.ID}" class="btn btn-ttc" role="button"">
                    <i class="fas fa-trash"></i>
                    Marcajes</a>
                    </td>
                    </tr>
                  `
                });
                $('#tabla').html(template);
            }
        });
    });

    // Cerrar formulario
   
});