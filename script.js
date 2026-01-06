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
    const ASSETS = [
        { file: 'autopartes Cabot.jpg', captionTitle: 'Autopartes Cabot', captionAddress: 'Calle Falsa 1', captionPhone: 'Tel 111-111', href: 'https://www.google.com' },
        { file: 'autopartes Coco.jpg', captionTitle: 'Autopartes Coco', captionAddress: 'Calle Falsa 2', captionPhone: 'Tel 222-222', href: 'https://www.google.com' },
        { file: 'autopartes Dos Ramos.jpg', captionTitle: 'Autopartes Dos Ramos', captionAddress: 'Calle Falsa 3', captionPhone: 'Tel 333-333', href: 'https://www.google.com' },
        { file: 'autopartes Ebes.jpg', captionTitle: 'Autopartes Ebes', captionAddress: 'Calle Falsa 4', captionPhone: 'Tel 444-444', href: 'https://www.google.com' },
        { file: 'autopartes Gran Prix.png', captionTitle: 'Autopartes Gran Prix', captionAddress: 'Av. Principal 5', captionPhone: 'Tel 555-555', href: 'https://www.google.com' },
        { file: 'frenos NP.jpg', captionTitle: 'Frenos NP', captionAddress: 'Av. Frenos 6', captionPhone: 'Tel 666-666', href: 'https://www.google.com' },
        { file: 'resp 2000.jpg', captionTitle: 'Resp 2000', captionAddress: 'Ruta 7', captionPhone: 'Tel 777-777', href: 'https://www.google.com' },
        { file: 'resp Alvear.jpg', captionTitle: 'Resp Alvear', captionAddress: 'Calle Alvear 10', captionPhone: 'Tel 888-888', href: 'https://www.google.com' },
        { file: 'resp Avenida.jpg', captionTitle: 'Resp Avenida', captionAddress: 'Av. Central 12', captionPhone: 'Tel 999-999', href: 'https://www.google.com' },
        { file: 'resp Cacho.jpg', captionTitle: 'Resp Cacho', captionAddress: 'Cacho 45', captionPhone: 'Tel 101-101', href: 'https://www.google.com' },
        { file: 'resp Cerra.jpg', captionTitle: 'Resp Cerra', captionAddress: 'Cerra 22', captionPhone: 'Tel 202-202', href: 'https://www.google.com' },
        { file: 'resp Chuletas.png', captionTitle: 'Resp Chuletas', captionAddress: 'Chuletas 7', captionPhone: 'Tel 303-303', href: 'https://www.google.com' },
        { file: 'resp Coqui.jpg', captionTitle: 'Resp Coqui', captionAddress: 'Coqui 9', captionPhone: 'Tel 404-404', href: 'https://www.google.com' },
        { file: 'resp Del Sur.jpg', captionTitle: 'Resp Del Sur', captionAddress: 'Del Sur 11', captionPhone: 'Tel 505-505', href: 'https://www.google.com' },
        { file: 'resp electr Lef.jpg', captionTitle: 'Resp Elect. Lef', captionAddress: 'Electr Lef 13', captionPhone: 'Tel 606-606', href: 'https://www.google.com' },
        { file: 'resp Trelew.jpg', captionTitle: 'Respuestos Trelew', captionAddress: '25 de Mayo y Cuba', captionPhone: 'Tel 280-4602439', href: 'https://share.google/JzBGKJIgjCcZ3XBJm' },
        { file: 'resp Vento.jpg', captionTitle: 'Resp Vento', captionAddress: 'Vento 18', captionPhone: 'Tel 808-808', href: 'https://www.google.com' },
        { file: 'resp Zonales.jpg', captionTitle: 'Resp Zonales', captionAddress: 'Zonales 20', captionPhone: 'Tel 909-909', href: 'https://www.google.com' }
    ];

    const bottomDiv = document.createElement('div');
    bottomDiv.id = 'bottom-gallery';

    ASSETS.forEach((asset, idx) => {
        const heroCard = document.createElement('div');
        heroCard.className = 'hero-card';

        const heroInner = document.createElement('div');
        heroInner.className = 'hero';

        const img = document.createElement('img');
        img.id = 'hero-img-' + idx;
        img.src = 'assets/' + encodeURIComponent(asset.file);
        img.alt = asset.captionTitle || asset.file;
        img.style.maxWidth = '100%';

        // Envolver la imagen en un hipervínculo (temporal a google.com)
        const link = document.createElement('a');
        link.href = asset.href || '#';
        link.target = '_blank';
        link.rel = 'noopener';
        link.appendChild(img);

        const caption = document.createElement('div');
        caption.className = 'hero-caption';
        caption.innerHTML = `
            <div class="caption-title">${asset.captionTitle}</div>
            <div class="caption-address">${asset.captionAddress}</div>
            <div class="caption-phone">${asset.captionPhone}</div>
        `;

        heroInner.appendChild(link);
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