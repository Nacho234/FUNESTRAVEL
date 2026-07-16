# Manual del panel administrativo · Funes Travel

Guía de uso de cada sección del backoffice, pensada para el equipo (no hace falta saber de sistemas). La misma guía vive dentro del panel en **/admin/guia**, con enlaces directos a cada módulo.

---

## Primeros pasos

### Ingreso y roles

Cada persona entra con su usuario y un rol (ventas, reservas, finanzas, etc.). El rol define qué puede ver y hacer: por ejemplo, Ventas no ve costos ni márgenes, y solo Finanzas registra pagos.

1. Ingresá con tu nombre y rol (en el demo, cualquier combinación entra).
2. Si un botón aparece gris o una sección dice "sin permisos", tu rol no habilita esa acción: pedísela a un administrador.

> **Tip:** En producción el ingreso será con contraseña y verificación; los permisos se controlan desde Sistema → Roles.

### Navegación y búsqueda

El menú lateral agrupa todo en 7 bloques: Resumen, Operación, Clientes, Catálogo, Marketing, Finanzas y Sistema. Los números rojos son pendientes.

1. Colapsá el menú con el botón de abajo si necesitás más espacio.
2. Usá la búsqueda de arriba (o Cmd/Ctrl + K) para saltar a cualquier sección o acción sin tocar el menú.
3. El botón naranja "Nueva acción" crea lo más común desde cualquier pantalla: reserva, cotización, cliente, pago, etc.

> **Tip:** La campana muestra las novedades (pagos, consultas, cupos bajos). Entrá una vez a la mañana y otra después del mediodía.

### Cómo funcionan las tablas

Casi todos los módulos usan la misma tabla: buscador, filtros, orden por columna, densidad, exportar CSV y acciones masivas.

1. Hacé click en el encabezado de una columna para ordenar.
2. Tildá varias filas para acciones en lote (confirmar, aprobar, exportar).
3. Click en una fila abre el panel lateral con el detalle completo y las acciones.

---

## Resumen y Tareas

### Resumen (dashboard) — `/admin`

La foto del día: ventas, reservas nuevas, pagos pendientes, embudo comercial, próximas salidas y actividad del equipo. Todo es clicable y lleva al detalle.

1. Empezá el día por "Tareas prioritarias": es lo que no puede esperar.
2. Revisá "Próximas salidas": los números en amarillo/rojo son documentación o pagos pendientes de ese grupo.
3. El embudo muestra dónde se pierden ventas (ej. cotizaciones que no se envían).

### Tareas — `/admin/tareas`

La lista completa de pendientes del equipo: pagos vencidos, documentación faltante, consultas sin responder, cupos bajos, reclamos.

1. Filtrá por responsable para ver lo tuyo.
2. Abrí una tarea para reasignarla, cambiarle la prioridad o comentar.
3. "Abrir registro relacionado" te lleva directo a la reserva/cotización/consulta de esa tarea.
4. Marcala resuelta con el tilde cuando esté lista.

---

## Operación

El circuito comercial completo: de la consulta a la venta y el viaje.

### Ventas — `/admin/ventas`

El registro de cada venta cerrada: cliente, producto, vendedor, canal, total y estado de cobro. Es la vista comercial; la operativa del viaje vive en Reservas.

1. Filtrá por vendedor o canal para el seguimiento del mes.
2. Abrí una venta para ver el desglose (precio, impuestos, descuentos, comisión) y registrar pagos o notas.
3. Exportá a CSV para el contador con el botón de la barra.

> **Tip:** El margen y los costos solo los ven los roles con ese permiso.

### Reservas — `/admin/reservas`

El corazón operativo: cada reserva con su estado, pagos, pasajeros, documentación y checklist. Las reservas hechas por clientes en la web entran solas con la etiqueta "Web".

1. Usá la vista Lista para buscar y la vista Kanban para ver el flujo por estado (pendiente de pago → confirmada → lista para viajar).
2. Dentro de una reserva, el checklist de 12 pasos te dice exactamente qué falta (seña, vouchers, seguro, mensaje previo…).
3. Desde ahí mismo: registrá pagos, reprogramá, generá vouchers o escribí al cliente por WhatsApp con el contexto ya cargado.

> **Tip:** Antes de cada salida, filtrá por ese paquete y verificá que todos los checklists estén completos.

### Cotizaciones — `/admin/cotizaciones`

El tablero de propuestas en curso, ordenado por etapa (nueva → enviada → en negociación → aceptada). Las solicitudes de "viaje a medida" de la web entran solas.

1. Cada tarjeta muestra vigencia: si está en rojo, vence en menos de 48 h. Llamá o extendé.
2. El editor permite armar hasta 3 opciones (económica / recomendada / premium) con vuelo, hotel, régimen, traslados y seguro.
3. "Enviar PDF" o "Enviar link" manda la propuesta; el seguimiento registra aperturas y clicks.

> **Tip:** Una cotización aceptada se convierte en reserva desde la misma tarjeta: no la cargues dos veces.

### Consultas — `/admin/consultas`

La bandeja única de mensajes: web, WhatsApp, correo, Instagram, Facebook y teléfono, con el historial completo de cada conversación.

1. Los puntos naranjas son consultas nuevas sin asignar: tomalas o asignalas primero.
2. Respondé desde el panel derecho; las "respuestas rápidas" insertan textos frecuentes (precios, documentación, pagos).
3. "Convertir en cotización" pasa la conversación al tablero comercial sin retipear nada.
4. Las notas internas (bloque amarillo) las ve solo el equipo, nunca el cliente.

### Tickets — `/admin/tickets`

Reclamos e imprevistos con fecha límite (SLA): cambios, cancelaciones, problemas en viaje. Distinto de Consultas: acá hay un problema que resolver y un plazo.

1. El contador "vence en X días" ordena la urgencia; lo vencido aparece en rojo.
2. Registrá cada avance como actualización, así cualquiera puede retomar el caso.
3. Para cerrar un ticket es obligatorio escribir la solución: eso arma nuestra base de casos.

### Documentación — `/admin/documentacion`

Todos los documentos de viaje: pasaportes, DNI, visas, autorizaciones de menores, vouchers y facturas, con su estado de revisión.

1. Trabajá la cola "en revisión": aprobá o rechazá (el rechazo pide motivo, que le llega al cliente).
2. "Solicitar nuevamente" avisa al pasajero que debe volver a subir el documento.
3. Los vencidos y faltantes también aparecen como alertas en Pasajeros y en las Tareas.

---

## Clientes y pasajeros

### Clientes — `/admin/clientes`

La ficha 360° de cada cliente: datos, segmentos (VIP, frecuente, familia…), preferencias, historial de viajes, cotizaciones, documentos y notas.

1. Antes de cotizar, mirá Preferencias e Historial: repetir el hotel que le gustó vende solo.
2. Los segmentos se usan después en promociones y comunicación: mantenelos al día.
3. "Nueva cotización" y "WhatsApp" salen directo desde la ficha.

### Pasajeros — `/admin/pasajeros`

Las personas que viajan (no siempre son quienes compran). Acá viven los documentos y las alertas: pasaportes vencidos o por vencer, menores sin autorización.

1. La franja de alertas de arriba es lo primero a limpiar cada semana.
2. Cada pasajero muestra sus reservas y documentos asociados.

> **Tip:** Regla de oro: pasaporte con menos de 6 meses de vigencia al regreso = alerta que hay que resolver antes de emitir.

---

## Catálogo

Todo lo que se vende: se carga acá y la página pública lo muestra.

### Productos — `/admin/productos`

La vista unificada de todo el catálogo (paquetes, hoteles, excursiones, traslados, seguros, grupales) con su estado: publicado, borrador, pausado o agotado.

1. Usalo para el control general: qué está publicado y qué no.
2. La estrella marca destacados (aparecen primero en la web).
3. "Abrir editor" te lleva al módulo específico de ese tipo de producto.

### Paquetes — `/admin/paquetes`

El editor completo de paquetes: información general, itinerario día por día, salidas con precios y cupos, inclusiones y SEO.

1. El itinerario se reordena con las flechas y se pueden duplicar días.
2. En Salidas cargás cada fecha con su precio, cupos y si está confirmada.
3. Las inclusiones salen de una biblioteca común: tildá las que apliquen para mantener el texto consistente.
4. Guardá con la barra inferior; nada se publica hasta guardar.

### Destinos — `/admin/destinos`

Las fichas de destino de la web: textos, foto, mejor época, precio orientativo y qué aparece destacado.

1. Editá desde la card; "Ver en el sitio" abre la página pública para controlar cómo quedó.

### Hoteles — `/admin/hoteles`

Hoteles con sus habitaciones: capacidad, régimen, precio por noche y disponibilidad.

1. La tabla de habitaciones se edita adentro de cada hotel; ahí también se agregan habitaciones nuevas.

### Vuelos — `/admin/vuelos`

Inventario de vuelos cargados a mano (tarifas negociadas). Cuando se conecte el GDS, acá van a convivir los importados.

1. Alta y edición desde el panel lateral; costo y margen solo visibles con permiso.

### Excursiones, Traslados y Seguros — `/admin/excursiones`

Los servicios sueltos que completan un viaje, cada uno con su editor simple (horarios, capacidad, políticas, precios).

1. Mantené actualizada la política climática de excursiones: es lo que más consultan los clientes.

### Disponibilidad — `/admin/disponibilidad`

Los cupos de cada salida: vendidos, bloqueados, lista de espera y mínimo para operar. Con vista de tabla y de calendario.

1. Los chips de alerta (últimos cupos, mínimo no alcanzado, agotado) filtran con un click.
2. Los bloqueos se editan en línea y se liberan con un botón.
3. En calendario, cada punto es una salida: click para ver su detalle.

> **Tip:** Cupos bajos + muchas cotizaciones abiertas sobre la misma salida = pedir más lugares al operador YA.

### Tarifas — `/admin/tarifas`

El motor de precios: costo + markup + impuestos = precio final, por salida. Todo cambio queda auditado.

1. Elegí el paquete y editá markup o precio por fila: el precio final se recalcula en vivo.
2. El simulador lateral sirve para probar números sin tocar nada.
3. "Actualización masiva" aplica un % a todas las salidas de un paquete (pide confirmación).

> **Tip:** Si tu rol no tiene permiso de aprobación, el cambio queda "pendiente de aprobación" para un administrador.

### Proveedores — `/admin/proveedores`

Operadores, hoteles y prestadores: contactos, contratos con vencimiento, tarifas, saldos e incidencias.

1. Las alertas de arriba avisan contratos por vencer y deudas.
2. Registrá cada incidencia (demoras, errores) para evaluar al proveedor a fin de temporada.

---

## Marketing y contenido

Todo lo que se ve en la página se cambia desde acá, sin tocar código.

### Promociones — `/admin/promociones`

Crear, programar y pausar promociones (cuotas, descuentos, compra anticipada, cupos limitados…). La vista previa muestra cómo queda la card en la home antes de publicar.

1. Completá título público, vigencia, productos aplicables y condiciones: todo eso se ve en la web tal cual.
2. Usá el toggle Desktop/Mobile del preview para controlar que el texto entre bien.
3. "Programar" deja la promo lista para publicarse sola en una fecha.

> **Tip:** Cuando una promo vence, reemplazala o pausala: una promo vencida visible resta confianza.

### Cupones — `/admin/cupones`

Códigos de descuento con límites de uso, vigencia y productos aplicables, con estadísticas de cuánto vendieron y cuánto costaron.

1. Revisá la columna de usos antes de renovar un cupón: si no se usó, el problema es la difusión, no el descuento.

### Contenido — `/admin/contenido`

Los textos de cada sección de la home (títulos, bajadas, CTA), editables y con orden configurable.

1. Editá el texto, guardá como borrador y publicá cuando esté aprobado.

### Medios — `/admin/medios`

La biblioteca de imágenes del sitio: dónde se usa cada foto, su texto alternativo y el reemplazo controlado.

1. Antes de archivar una imagen, el sistema te muestra en qué páginas se usa.
2. Completá siempre el texto alternativo: es accesibilidad y SEO.

### Editor de home — `/admin/editor-home`

Encender, apagar y reordenar las secciones de la página de inicio, con vista previa real en desktop, tablet y mobile.

1. Reordená con las flechas, desactivá con el toggle y mirá el resultado en el preview antes de publicar.

> **Tip:** El editor no permite romper el diseño: solo reordena y activa/desactiva secciones ya diseñadas.

### Blog — `/admin/blog`

Las guías y artículos de "Inspiración": borradores, programación y publicación con su SEO.

1. Escribí en borrador, pasá a revisión y programá la publicación; "Ver en el sitio" muestra el resultado final.

### SEO — `/admin/seo`

La salud del sitio en buscadores: auditoría de títulos y descripciones, redirecciones y metadata por página.

1. Atacá primero los errores (rojo), después las advertencias.
2. Cuando cambies la URL de algo, cargá la redirección acá para no perder posicionamiento.

---

## Finanzas

### Pagos — `/admin/pagos`

Todos los cobros: Mercado Pago, tarjetas, transferencias, efectivo y links de pago, con su estado (aprobado, pendiente, rechazado, conciliado, devuelto).

1. Los rechazados y vencidos aparecen arriba: son plata por recuperar, contactá al cliente.
2. "Registrar pago" carga cobros manuales (oficina, transferencia) contra una reserva.
3. Conciliá lo aprobado para que Finanzas cierre el mes sin sorpresas.

### Finanzas — `/admin/finanzas`

La vista contable: ingresos, egresos, margen, comisiones, saldos con proveedores e impuestos estimados. Solo para roles con permiso de costos.

1. Exportá los movimientos a CSV para el estudio contable a fin de mes.

### Reportes — `/admin/reportes`

Reportes armables por período: ventas por vendedor/destino/canal, conversión, cancelaciones, pagos, estacionalidad.

1. Elegí reporte, rango y agrupación; guardá los que uses siempre como favoritos.
2. "Programar envío" manda el reporte por correo con la frecuencia que definas.

---

## Sistema

Configuración y control. En general, terreno del administrador.

### Usuarios — `/admin/usuarios`

Las cuentas del equipo: rol, sucursal, estado y última sesión.

1. Invitá con email + rol; suspendé cuentas que no deban entrar (se puede reactivar).

### Roles y permisos — `/admin/roles`

La matriz de qué puede hacer cada rol: ver, crear, editar, aprobar, publicar, ver costos, registrar pagos, etc.

1. Antes de cambiar un permiso, mirá la descripción del rol: menos permisos = menos riesgo.

> **Tip:** Los permisos reales se validan en el servidor; esta pantalla es la administración, no la seguridad en sí.

### Integraciones — `/admin/integraciones`

Las conexiones externas: Mercado Pago, correo, WhatsApp, mapas, GDS, analytics. Estado, última sincronización y logs.

1. Si algo falla en el sitio (pagos, mails), mirá acá primero: una integración en error explica casi todo.

> **Tip:** Las credenciales nunca se muestran completas; se cargan como variables de entorno en el servidor.

### Configuración — `/admin/configuracion`

Los datos maestros: empresa, sucursales, horarios, monedas y tipo de cambio, impuestos, medios de pago, numeración y plantillas de comunicación.

1. Las plantillas usan variables como {cliente} o {reserva}: no borres las llaves.
2. Actualizá el tipo de cambio si no está automatizado: afecta todos los precios en pesos.

### Auditoría — `/admin/auditoria`

El historial inmutable de cambios: quién modificó qué, cuándo, desde dónde y con qué valores (antes → después).

1. Filtrá por usuario o módulo para reconstruir cualquier cambio; los registros no se pueden borrar desde la interfaz.

---

## Flujos típicos

### De una consulta a una venta

1. Consultas: tomá la conversación nueva y respondé (o asignala).
2. "Convertir en cotización": armá hasta 3 opciones y envialas con vigencia.
3. Seguimiento: si no responde antes del vencimiento, contactá; si acepta, convertí en reserva.
4. Reservas: registrá la seña, completá pasajeros y arrancá el checklist.
5. Documentación: pedí y aprobá los documentos. Pagos: cobrá el saldo antes de los 35 días.

### Cargar una nueva salida de un paquete

1. Catálogo → Paquetes: abrí el paquete y agregá la fecha en "Salidas" (precio, cupos, mínimo).
2. Tarifas: verificá costo + markup y guardá (queda auditado).
3. Disponibilidad: controlá que la salida aparezca con sus cupos.
4. Promociones: si la salida necesita empuje, creá la promo con el preview.

### Cambiar una foto o un texto de la página

1. Medios: subí la imagen nueva y completá el texto alternativo.
2. Contenido (textos) o Editor de home (orden y secciones): hacé el cambio.
3. Verificá en el preview desktop y mobile, y publicá.

### Imprevisto durante un viaje

1. Tickets: creá el caso con prioridad y SLA (ej. vuelo reprogramado).
2. Reservas: abrí la reserva afectada y registrá lo que se gestione (noche extra, cambio de traslado).
3. Consultas/WhatsApp: mantené al pasajero informado desde el panel, con el contexto cargado.
4. Al resolver, cerrá el ticket escribiendo la solución: queda para el próximo caso igual.

### Cierre de mes

1. Pagos: conciliá todos los aprobados y perseguí rechazados/vencidos.
2. Finanzas: exportá movimientos para el estudio contable.
3. Reportes: generá ventas por vendedor y por destino del período.
4. Proveedores: revisá saldos y contratos por vencer.
