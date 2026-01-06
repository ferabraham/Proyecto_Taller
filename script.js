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
        { file: 'autopartes Cabot.jpg', captionTitle: 'Autopartes Cabot', captionAddress: 'Cabot y Zapiola', captionPhone: 'Tel 280-4398995', href: 'https://share.google/6AhLFNqLBtJZM6PWO' },
        { file: 'autopartes Coco.jpg', captionTitle: 'Autopartes Coco', captionAddress: 'Lopez y Planes y Condarco', captionPhone: 'Tel 280-4597437', href: 'https://share.google/k23viCc48pXrrAPav' },
        { file: 'autopartes Dos Ramos.jpg', captionTitle: 'Autopartes Dos Ramos', captionAddress: 'San Martin entre Entre Rios y Cuba', captionPhone: 'Tel 280-4323892', href: 'https://share.google/v57iSqbfMqK3M2VnV' },
        { file: 'autopartes Ebes.jpg', captionTitle: 'Autopartes Ebes', captionAddress: 'España y Moreno', captionPhone: 'Tel 280-4427700', href: 'https://share.google/u5DhJChEdony9mrpo' },
        { file: 'autopartes Gran Prix.png', captionTitle: 'Autopartes Gran Prix', captionAddress: 'Don Bosco y Moreno', captionPhone: 'Tel 280-4193677', href: 'https://share.google/2D1pHPVhF1SOjBCwX' },
        { file: 'frenos NP.jpg', captionTitle: 'Frenos NP', captionAddress: 'Rosales y Alem', captionPhone: 'Tel 280-4620577', href: 'https://share.google/SW4wzDMvrFgCgAnGH' },
        { file: 'resp 2000.jpg', captionTitle: 'Respuestos 2000', captionAddress: 'Gales y Ameghino', captionPhone: 'Tel 280-4620669', href: 'https://share.google/fNDwmpYex27wKuG50' },
        { file: 'resp Alvear.jpg', captionTitle: 'Respuestos Alvear', captionAddress: '25 de Mayo entre Uruguay y Bs As', captionPhone: 'Tel 280-4705826', href: 'https://share.google/POTbJXzQ6kdVskUYI' },
        { file: 'resp Avenida.jpg', captionTitle: 'Resp Avenida', captionAddress: 'Avenida Yrigoyen y Cabot', captionPhone: 'Tel 280-4023599', href: 'https://share.google/zitvkldTyKiI4d5ze' },
        { file: 'resp Cacho.jpg', captionTitle: 'Respuestos Cacho', captionAddress: 'Gales y Ameghino', captionPhone: 'Tel 280-4422756', href: 'https://share.google/f4tU9OwAttqDfck22' },
        { file: 'resp Cerra.jpg', captionTitle: 'Respuestos Cerra', captionAddress: 'Cruz del Sur y Ramon y Cajal', captionPhone: 'Tel 280-4421883', href: 'https://share.google/vZAWG15qKRCANAQWZ' },
        { file: 'resp Chuletas.png', captionTitle: 'Respuestos Chuletas', captionAddress: 'Cuba entre Venezuela y J.A.Roca', captionPhone: 'Tel 280-5092242', href: 'https://share.google/Dct6xjKwxYvSNQCQV' },
        { file: 'resp Coqui.jpg', captionTitle: 'Respuesto Coqui', captionAddress: 'Avenida Allende y Laprida', captionPhone: 'Tel 280-4008038', href: 'https://share.google/1euVNA53U0URuPfb1' },
        { file: 'resp Del Sur.jpg', captionTitle: 'Respuestos Del Sur', captionAddress: 'Galina y Lloyd Jones', captionPhone: 'Tel 280-5022812', href: 'https://share.google/mHm0eZkwm4OKk9439' },
        { file: 'resp electr Lef.jpg', captionTitle: 'Electricidad Lef', captionAddress: 'Marconi y J.A.Roca', captionPhone: 'Tel 280-4426777', href: 'https://share.google/gqGKEZPOPy0Cn9lYB' },
        { file: 'resp Trelew.jpg', captionTitle: 'Respuestos Trelew', captionAddress: '25 de Mayo y Cuba', captionPhone: 'Tel 280-4602439', href: 'https://share.google/JzBGKJIgjCcZ3XBJm' },
        { file: 'resp Vento.jpg', captionTitle: 'Respuestos Vento', captionAddress: '25 de Mayo entre Edison y Marconi', captionPhone: 'Tel 280-4370292', href: 'https://share.google/og6j99BiVWFVnf8G2' },
        { file: 'resp Zonales.jpg', captionTitle: 'Respuestos Zonales', captionAddress: 'Soberania Nacional y Edison', captionPhone: 'Tel 280-4717338', href: 'https://share.google/BRdrVB80tSygSQqkh' }
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