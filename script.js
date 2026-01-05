// Nombre del archivo JSON que cargaremos
const JSON_FILE_NAME = 'Planilla_Carga.json';

document.getElementById('patenteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtiene el DOMINIO/Patente, la limpia y la convierte a MAYÚSCULAS para coincidencia
    const patente = document.getElementById('patenteInput').value.toUpperCase().trim();
    
    // Limpia y oculta mensajes/contenedores
    document.getElementById('mensaje-error').textContent = '';
    document.getElementById('resultados-container').style.display = 'none';

    // 1. Cargar el archivo JSON local
    fetch(JSON_FILE_NAME)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo ${JSON_FILE_NAME}.`);
            }
            return response.json(); 
        })
        .then(datos => {
            // 2. Buscar el historial de mantenimiento (el array de trabajos) usando la patente como clave
            const historialMantenimiento = datos[patente];
            
            // 3. Buscar los datos estáticos del vehículo (opcional, para PROPIETARIO, MARCA, etc.)
            const datosVehiculoEstaticos = datos.direccionamiento.find(item => item.DOMINIO === patente);

            if (historialMantenimiento && historialMantenimiento.length > 0) {
                mostrarResultados(patente, datosVehiculoEstaticos, historialMantenimiento);
            } else {
                document.getElementById('mensaje-error').textContent = `ERROR: La patente "${patente}" no fue encontrada o no tiene historial.`;
            }
        })
        .catch(error => {
            console.error('Error al procesar la solicitud:', error);
            document.getElementById('mensaje-error').textContent = 'Error interno del sistema de archivos. Asegúrese de usar Live Server y revisar el nombre del JSON.';
        });
});

/**
 * Muestra el historial de mantenimiento en formato de tabla.
 */
function mostrarResultados(patente, datosEstaticos, historial) {
    const infoContainer = document.getElementById('info-detalles');
    const historialContainer = document.getElementById('historial-tabla');
    
    infoContainer.innerHTML = ''; 
    historialContainer.innerHTML = ''; 

    // 1. Mostrar Patente y Datos Estáticos (PROPIETARIO, MODELO)
    document.getElementById('patente-mostrada').textContent = patente;
    
    if (datosEstaticos) {
        infoContainer.innerHTML = `
            <p><strong>Propietario:</strong> ${datosEstaticos.PROPIETARIO || 'N/D'}</p>
            <p><strong>Marca/Modelo:</strong> ${datosEstaticos.MARCA_MODELO || 'N/D'}</p>
            <p><strong>Motor:</strong> ${datosEstaticos.MOTOR || 'N/D'}</p>
        `;
    }

    // 2. Generar la Tabla de Historial
    // Usamos las claves del primer registro para los encabezados de la tabla
    const encabezados = Object.keys(historial[0]);
    
    let htmlTabla = '<table class="historial-table"><thead><tr>';
    
    // Encabezados de la tabla
    encabezados.forEach(header => {
        let titulo = header.replace(/_/g, ' '); 
        htmlTabla += `<th>${titulo.charAt(0).toUpperCase() + titulo.slice(1).toLowerCase()}</th>`;
    });
    htmlTabla += '</tr></thead><tbody>';

    // Filas de datos (cada registro es una fila)
    historial.forEach(registro => {
        htmlTabla += '<tr>';
        encabezados.forEach(header => {
            let valor = registro[header] || 'N/D';
            // Resaltar el PRÓXIMO SERVICE para visibilidad
            const classAttr = (header.toUpperCase().includes('PROXIMO_SERVICE')) ? 'class="proximo-service"' : '';
            
            // Formatear fechas si es necesario (quita la parte de la hora y T)
            if (header.toUpperCase().includes('FECHA') && valor.includes('T')) {
                valor = valor.split('T')[0];
            }
            
            htmlTabla += `<td ${classAttr}>${valor}</td>`;
        });
        htmlTabla += '</tr>';
    });
    htmlTabla += '</tbody></table>';

    historialContainer.innerHTML = htmlTabla;
    
    // Muestra el contenedor de resultados y oculta el login
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('resultados-container').style.display = 'block';
}

/* -------------------------------------------------
   Generar galerías laterales a partir de archivos
   definidos en `ASSETS_FILES`. Distribuye las
   tarjetas alternando entre la columna izquierda
   y la derecha. Mantiene el mismo texto (caption)
   para cada imagen.
   ------------------------------------------------- */
(function createSideGallery(){
    const ASSETS_FILES = [
        'autopartes Cabot.jpg',
        'autopartes Coco.jpg',
        'autopartes Dos Ramos.jpg',
        'autopartes Ebes.jpg',
        'autopartes Gran Prix.png',
        'frenos NP.jpg',
        'resp 2000.jpg',
        'resp Alvear.jpg',
        'resp Avenida.jpg',
        'resp Cacho.jpg',
        'resp Cerra.jpg',
        'resp Chuletas.png',
        'resp Coqui.jpg',
        'resp Del Sur.jpg',
        'resp electr Lef.jpg',
        'resp Trelew.jpg',
        'resp Vento.jpg',
        'resp Zonales.jpg'
    ];

    const bottomDiv = document.createElement('div');
    bottomDiv.id = 'bottom-gallery';

    ASSETS_FILES.forEach((name, idx) => {
        const heroCard = document.createElement('div');
        heroCard.className = 'hero-card';

        const heroInner = document.createElement('div');
        heroInner.className = 'hero';

        const img = document.createElement('img');
        img.id = 'hero-img-' + idx;
        img.src = 'assets/' + encodeURIComponent(name);
        img.alt = name;
        img.style.maxWidth = '100%';

        const caption = document.createElement('div');
        caption.className = 'hero-caption';
        caption.innerHTML = `
            <div class="caption-title">Repuestos Vento</div>
            <div class="caption-address">Calle falsa 123</div>
            <div class="caption-phone">Tel 2804018002</div>
        `;

        heroInner.appendChild(img);
        heroInner.appendChild(caption);
        heroCard.appendChild(heroInner);

        // Añadir todas las tarjetas al contenedor inferior (mosaico)
        bottomDiv.appendChild(heroCard);
    });
    // Insertar la galería inferior dentro de la cuadrícula principal
    const layout = document.querySelector('.layout-grid');
    if (layout) {
        layout.appendChild(bottomDiv);
    } else {
        // fallback: añadir al body
        document.body.appendChild(bottomDiv);
    }
})();