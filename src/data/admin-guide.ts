/**
 * Single source for the backoffice user guide. Rendered at /admin/guia and
 * exported to docs/MANUAL-ADMIN.md. Written for the non-technical team.
 */

export interface GuideModule {
  id: string;
  name: string;
  href?: string;
  what: string;
  how: string[];
  tips?: string[];
}

export interface GuideSection {
  id: string;
  title: string;
  intro?: string;
  modules: GuideModule[];
}

export interface GuideRecipe {
  id: string;
  title: string;
  steps: string[];
}

export const guideSections: GuideSection[] = [
  {
    id: "primeros-pasos",
    title: "Primeros pasos",
    intro: "Lo básico para moverse por el panel antes de entrar a cada módulo.",
    modules: [
      {
        id: "ingreso",
        name: "Ingreso y roles",
        what: "El panel vive en /admin del sitio (ej. www.funestravel.com/admin) y se entra con tu cuenta de Google autorizada. Cada correo tiene un rol (ventas, reservas, finanzas…) que define qué puede ver y hacer: por ejemplo, Ventas no ve costos ni márgenes, y solo Finanzas registra pagos.",
        how: [
          "Entrá a /admin y elegí “Continuar con Google” con tu correo de la agencia.",
          "Si Google te rechaza, tu correo no está en la lista de autorizados: pedile el alta a un administrador.",
          "Si un botón aparece gris o una sección dice “sin permisos”, tu rol no habilita esa acción.",
        ],
        tips: ["Sin credenciales de Google configuradas (entorno de desarrollo), el panel usa un ingreso demo local. Los permisos se administran en Sistema → Roles."],
      },
      {
        id: "navegacion",
        name: "Navegación y búsqueda",
        what: "El menú lateral agrupa todo en 7 bloques: Resumen, Operación, Clientes, Catálogo, Marketing, Finanzas y Sistema. Los números rojos son pendientes.",
        how: [
          "Colapsá el menú con el botón de abajo si necesitás más espacio.",
          "Usá la búsqueda de arriba (o Cmd/Ctrl + K) para saltar a cualquier sección o acción sin tocar el menú.",
          "El botón naranja “Nueva acción” crea lo más común desde cualquier pantalla: reserva, cotización, cliente, pago, etc.",
        ],
        tips: ["La campana muestra las novedades (pagos, consultas, cupos bajos). Entrá una vez a la mañana y otra después del mediodía."],
      },
      {
        id: "tablas",
        name: "Cómo funcionan las tablas",
        what: "Casi todos los módulos usan la misma tabla: buscador, filtros, orden por columna, densidad, exportar CSV y acciones masivas.",
        how: [
          "Hacé click en el encabezado de una columna para ordenar.",
          "Tildá varias filas para acciones en lote (confirmar, aprobar, exportar).",
          "Click en una fila abre el panel lateral con el detalle completo y las acciones.",
        ],
      },
    ],
  },
  {
    id: "resumen",
    title: "Resumen y Tareas",
    modules: [
      {
        id: "dashboard",
        name: "Resumen (dashboard)",
        href: "/admin",
        what: "La foto del día: ventas, reservas nuevas, pagos pendientes, embudo comercial, próximas salidas y actividad del equipo. Todo es clicable y lleva al detalle.",
        how: [
          "Empezá el día por “Tareas prioritarias”: es lo que no puede esperar.",
          "Revisá “Próximas salidas”: los números en amarillo/rojo son documentación o pagos pendientes de ese grupo.",
          "El embudo muestra dónde se pierden ventas (ej. cotizaciones que no se envían).",
        ],
      },
      {
        id: "tareas",
        name: "Tareas",
        href: "/admin/tareas",
        what: "La lista completa de pendientes del equipo: pagos vencidos, documentación faltante, consultas sin responder, cupos bajos, reclamos.",
        how: [
          "Filtrá por responsable para ver lo tuyo.",
          "Abrí una tarea para reasignarla, cambiarle la prioridad o comentar.",
          "“Abrir registro relacionado” te lleva directo a la reserva/cotización/consulta de esa tarea.",
          "Marcala resuelta con el tilde cuando esté lista.",
        ],
      },
    ],
  },
  {
    id: "operacion",
    title: "Operación",
    intro: "El circuito comercial completo: de la consulta a la venta y el viaje.",
    modules: [
      {
        id: "ventas",
        name: "Ventas",
        href: "/admin/ventas",
        what: "El registro de cada venta cerrada: cliente, producto, vendedor, canal, total y estado de cobro. Es la vista comercial; la operativa del viaje vive en Reservas.",
        how: [
          "Filtrá por vendedor o canal para el seguimiento del mes.",
          "Abrí una venta para ver el desglose (precio, impuestos, descuentos, comisión) y registrar pagos o notas.",
          "Exportá a CSV para el contador con el botón de la barra.",
        ],
        tips: ["El margen y los costos solo los ven los roles con ese permiso."],
      },
      {
        id: "reservas",
        name: "Reservas",
        href: "/admin/reservas",
        what: "El corazón operativo: cada reserva con su estado, pagos, pasajeros, documentación y checklist. Las reservas hechas por clientes en la web entran solas con la etiqueta “Web”.",
        how: [
          "Usá la vista Lista para buscar y la vista Kanban para ver el flujo por estado (pendiente de pago → confirmada → lista para viajar).",
          "Dentro de una reserva, el checklist de 12 pasos te dice exactamente qué falta (seña, vouchers, seguro, mensaje previo…).",
          "Desde ahí mismo: registrá pagos, reprogramá, generá vouchers o escribí al cliente por WhatsApp con el contexto ya cargado.",
        ],
        tips: ["Antes de cada salida, filtrá por ese paquete y verificá que todos los checklists estén completos."],
      },
      {
        id: "cotizaciones",
        name: "Cotizaciones",
        href: "/admin/cotizaciones",
        what: "El tablero de propuestas en curso, ordenado por etapa (nueva → enviada → en negociación → aceptada). Las solicitudes de “viaje a medida” de la web entran solas.",
        how: [
          "Cada tarjeta muestra vigencia: si está en rojo, vence en menos de 48 h — llamá o extendé.",
          "El editor permite armar hasta 3 opciones (económica / recomendada / premium) con vuelo, hotel, régimen, traslados y seguro.",
          "“Enviar PDF” o “Enviar link” manda la propuesta; el seguimiento registra aperturas y clicks.",
        ],
        tips: ["Una cotización aceptada se convierte en reserva desde la misma tarjeta: no la cargues dos veces."],
      },
      {
        id: "consultas",
        name: "Consultas",
        href: "/admin/consultas",
        what: "La bandeja única de mensajes: web, WhatsApp, correo, Instagram, Facebook y teléfono, con el historial completo de cada conversación.",
        how: [
          "Los puntos naranjas son consultas nuevas sin asignar: tomalas o asignalas primero.",
          "Respondé desde el panel derecho; las “respuestas rápidas” insertan textos frecuentes (precios, documentación, pagos).",
          "“Convertir en cotización” pasa la conversación al tablero comercial sin retipear nada.",
          "Las notas internas (bloque amarillo) las ve solo el equipo, nunca el cliente.",
        ],
      },
      {
        id: "tickets",
        name: "Tickets",
        href: "/admin/tickets",
        what: "Reclamos e imprevistos con fecha límite (SLA): cambios, cancelaciones, problemas en viaje. Distinto de Consultas: acá hay un problema que resolver y un plazo.",
        how: [
          "El contador “vence en X días” ordena la urgencia; lo vencido aparece en rojo.",
          "Registrá cada avance como actualización, así cualquiera puede retomar el caso.",
          "Para cerrar un ticket es obligatorio escribir la solución: eso arma nuestra base de casos.",
        ],
      },
      {
        id: "documentacion",
        name: "Documentación",
        href: "/admin/documentacion",
        what: "Todos los documentos de viaje: pasaportes, DNI, visas, autorizaciones de menores, vouchers y facturas, con su estado de revisión.",
        how: [
          "Trabajá la cola “en revisión”: aprobá o rechazá (el rechazo pide motivo, que le llega al cliente).",
          "“Solicitar nuevamente” avisa al pasajero que debe volver a subir el documento.",
          "Los vencidos y faltantes también aparecen como alertas en Pasajeros y en las Tareas.",
        ],
      },
    ],
  },
  {
    id: "clientes",
    title: "Clientes y pasajeros",
    modules: [
      {
        id: "clientes",
        name: "Clientes",
        href: "/admin/clientes",
        what: "La ficha 360° de cada cliente: datos, segmentos (VIP, frecuente, familia…), preferencias, historial de viajes, cotizaciones, documentos y notas.",
        how: [
          "Antes de cotizar, mirá Preferencias e Historial: repetir el hotel que le gustó vende solo.",
          "Los segmentos se usan después en promociones y comunicación: mantenelos al día.",
          "“Nueva cotización” y “WhatsApp” salen directo desde la ficha.",
        ],
      },
      {
        id: "pasajeros",
        name: "Pasajeros",
        href: "/admin/pasajeros",
        what: "Las personas que viajan (no siempre son quienes compran). Acá viven los documentos y las alertas: pasaportes vencidos o por vencer, menores sin autorización.",
        how: [
          "La franja de alertas de arriba es lo primero a limpiar cada semana.",
          "Cada pasajero muestra sus reservas y documentos asociados.",
        ],
        tips: ["Regla de oro: pasaporte con menos de 6 meses de vigencia al regreso = alerta que hay que resolver antes de emitir."],
      },
    ],
  },
  {
    id: "catalogo",
    title: "Catálogo",
    intro: "Todo lo que se vende: se carga acá y la página pública lo muestra.",
    modules: [
      {
        id: "productos",
        name: "Productos",
        href: "/admin/productos",
        what: "La vista unificada de todo el catálogo (paquetes, hoteles, excursiones, traslados, seguros, grupales) con su estado: publicado, borrador, pausado o agotado.",
        how: [
          "Usalo para el control general: qué está publicado y qué no.",
          "La estrella marca destacados (aparecen primero en la web).",
          "“Abrir editor” te lleva al módulo específico de ese tipo de producto.",
        ],
      },
      {
        id: "paquetes",
        name: "Paquetes",
        href: "/admin/paquetes",
        what: "El editor completo de paquetes: información general, itinerario día por día, salidas con precios y cupos, inclusiones y SEO.",
        how: [
          "El itinerario se reordena con las flechas y se pueden duplicar días.",
          "En Salidas cargás cada fecha con su precio, cupos y si está confirmada.",
          "Las inclusiones salen de una biblioteca común: tildá las que apliquen para mantener el texto consistente.",
          "Guardá con la barra inferior; nada se publica hasta guardar.",
        ],
      },
      {
        id: "destinos",
        name: "Destinos",
        href: "/admin/destinos",
        what: "Las fichas de destino de la web: textos, foto, mejor época, precio orientativo y qué aparece destacado.",
        how: ["Editá desde la card; “Ver en el sitio” abre la página pública para controlar cómo quedó."],
      },
      {
        id: "hoteles",
        name: "Hoteles",
        href: "/admin/hoteles",
        what: "Hoteles con sus habitaciones: capacidad, régimen, precio por noche y disponibilidad.",
        how: ["La tabla de habitaciones se edita adentro de cada hotel; ahí también se agregan habitaciones nuevas."],
      },
      {
        id: "vuelos",
        name: "Vuelos",
        href: "/admin/vuelos",
        what: "Inventario de vuelos cargados a mano (tarifas negociadas). Cuando se conecte el GDS, acá van a convivir los importados.",
        how: ["Alta y edición desde el panel lateral; costo y margen solo visibles con permiso."],
      },
      {
        id: "excursiones-traslados-seguros",
        name: "Excursiones, Traslados y Seguros",
        href: "/admin/excursiones",
        what: "Los servicios sueltos que completan un viaje, cada uno con su editor simple (horarios, capacidad, políticas, precios).",
        how: ["Mantené actualizada la política climática de excursiones: es lo que más consultan los clientes."],
      },
      {
        id: "disponibilidad",
        name: "Disponibilidad",
        href: "/admin/disponibilidad",
        what: "Los cupos de cada salida: vendidos, bloqueados, lista de espera y mínimo para operar. Con vista de tabla y de calendario.",
        how: [
          "Los chips de alerta (últimos cupos, mínimo no alcanzado, agotado) filtran con un click.",
          "Los bloqueos se editan en línea y se liberan con un botón.",
          "En calendario, cada punto es una salida: click para ver su detalle.",
        ],
        tips: ["Cupos bajos + muchas cotizaciones abiertas sobre la misma salida = pedir más lugares al operador YA."],
      },
      {
        id: "tarifas",
        name: "Tarifas",
        href: "/admin/tarifas",
        what: "El motor de precios: costo + markup + impuestos = precio final, por salida. Todo cambio queda auditado.",
        how: [
          "Elegí el paquete y editá markup o precio por fila: el precio final se recalcula en vivo.",
          "El simulador lateral sirve para probar números sin tocar nada.",
          "“Actualización masiva” aplica un % a todas las salidas de un paquete (pide confirmación).",
        ],
        tips: ["Si tu rol no tiene permiso de aprobación, el cambio queda “pendiente de aprobación” para un administrador."],
      },
      {
        id: "proveedores",
        name: "Proveedores",
        href: "/admin/proveedores",
        what: "Operadores, hoteles y prestadores: contactos, contratos con vencimiento, tarifas, saldos e incidencias.",
        how: [
          "Las alertas de arriba avisan contratos por vencer y deudas.",
          "Registrá cada incidencia (demoras, errores) para evaluar al proveedor a fin de temporada.",
        ],
      },
    ],
  },
  {
    id: "marketing",
    title: "Marketing y contenido",
    intro: "Todo lo que se ve en la página se cambia desde acá, sin tocar código.",
    modules: [
      {
        id: "promociones",
        name: "Promociones",
        href: "/admin/promociones",
        what: "Crear, programar y pausar promociones (cuotas, descuentos, compra anticipada, cupos limitados…). La vista previa muestra cómo queda la card en la home antes de publicar.",
        how: [
          "Completá título público, vigencia, productos aplicables y condiciones: todo eso se ve en la web tal cual.",
          "Usá el toggle Desktop/Mobile del preview para controlar que el texto entre bien.",
          "“Programar” deja la promo lista para publicarse sola en una fecha.",
        ],
        tips: ["Cuando una promo vence, reemplazala o pausala: una promo vencida visible resta confianza."],
      },
      {
        id: "cupones",
        name: "Cupones",
        href: "/admin/cupones",
        what: "Códigos de descuento con límites de uso, vigencia y productos aplicables, con estadísticas de cuánto vendieron y cuánto costaron.",
        how: ["Revisá la columna de usos antes de renovar un cupón: si no se usó, el problema es la difusión, no el descuento."],
      },
      {
        id: "contenido",
        name: "Contenido",
        href: "/admin/contenido",
        what: "Los textos de cada sección de la home (títulos, bajadas, CTA), editables y con orden configurable.",
        how: ["Editá el texto, guardá como borrador y publicá cuando esté aprobado."],
      },
      {
        id: "medios",
        name: "Medios",
        href: "/admin/medios",
        what: "La biblioteca de imágenes del sitio: dónde se usa cada foto, su texto alternativo y el reemplazo controlado.",
        how: [
          "Antes de archivar una imagen, el sistema te muestra en qué páginas se usa.",
          "Completá siempre el texto alternativo: es accesibilidad y SEO.",
        ],
      },
      {
        id: "editor-home",
        name: "Editor de home",
        href: "/admin/editor-home",
        what: "Encender, apagar y reordenar las secciones de la página de inicio, con vista previa real en desktop, tablet y mobile.",
        how: ["Reordená con las flechas, desactivá con el toggle y mirá el resultado en el preview antes de publicar."],
        tips: ["El editor no permite romper el diseño: solo reordena y activa/desactiva secciones ya diseñadas."],
      },
      {
        id: "blog",
        name: "Blog",
        href: "/admin/blog",
        what: "Las guías y artículos de “Inspiración”: borradores, programación y publicación con su SEO.",
        how: ["Escribí en borrador, pasá a revisión y programá la publicación; “Ver en el sitio” muestra el resultado final."],
      },
      {
        id: "seo",
        name: "SEO",
        href: "/admin/seo",
        what: "La salud del sitio en buscadores: auditoría de títulos y descripciones, redirecciones y metadata por página.",
        how: [
          "Atacá primero los errores (rojo), después las advertencias.",
          "Cuando cambies la URL de algo, cargá la redirección acá para no perder posicionamiento.",
        ],
      },
    ],
  },
  {
    id: "finanzas",
    title: "Finanzas",
    modules: [
      {
        id: "pagos",
        name: "Pagos",
        href: "/admin/pagos",
        what: "Todos los cobros: Mercado Pago, tarjetas, transferencias, efectivo y links de pago, con su estado (aprobado, pendiente, rechazado, conciliado, devuelto).",
        how: [
          "Los rechazados y vencidos aparecen arriba: son plata por recuperar, contactá al cliente.",
          "“Registrar pago” carga cobros manuales (oficina, transferencia) contra una reserva.",
          "Conciliá lo aprobado para que Finanzas cierre el mes sin sorpresas.",
        ],
      },
      {
        id: "finanzas-vista",
        name: "Finanzas",
        href: "/admin/finanzas",
        what: "La vista contable: ingresos, egresos, margen, comisiones, saldos con proveedores e impuestos estimados. Solo para roles con permiso de costos.",
        how: ["Exportá los movimientos a CSV para el estudio contable a fin de mes."],
      },
      {
        id: "reportes",
        name: "Reportes",
        href: "/admin/reportes",
        what: "Reportes armables por período: ventas por vendedor/destino/canal, conversión, cancelaciones, pagos, estacionalidad.",
        how: [
          "Elegí reporte, rango y agrupación; guardá los que uses siempre como favoritos.",
          "“Programar envío” manda el reporte por correo con la frecuencia que definas.",
        ],
      },
    ],
  },
  {
    id: "sistema",
    title: "Sistema",
    intro: "Configuración y control. En general, terreno del administrador.",
    modules: [
      {
        id: "usuarios",
        name: "Usuarios",
        href: "/admin/usuarios",
        what: "Las cuentas del equipo: rol, sucursal, estado y última sesión.",
        how: ["Invitá con email + rol; suspendé cuentas que no deban entrar (se puede reactivar)."],
      },
      {
        id: "roles",
        name: "Roles y permisos",
        href: "/admin/roles",
        what: "La matriz de qué puede hacer cada rol: ver, crear, editar, aprobar, publicar, ver costos, registrar pagos, etc.",
        how: ["Antes de cambiar un permiso, mirá la descripción del rol: menos permisos = menos riesgo."],
        tips: ["Los permisos reales se validan en el servidor; esta pantalla es la administración, no la seguridad en sí."],
      },
      {
        id: "integraciones",
        name: "Integraciones",
        href: "/admin/integraciones",
        what: "Las conexiones externas: Mercado Pago, correo, WhatsApp, mapas, GDS, analytics. Estado, última sincronización y logs.",
        how: ["Si algo falla en el sitio (pagos, mails), mirá acá primero: una integración en error explica casi todo."],
        tips: ["Las credenciales nunca se muestran completas; se cargan como variables de entorno en el servidor."],
      },
      {
        id: "configuracion",
        name: "Configuración",
        href: "/admin/configuracion",
        what: "Los datos maestros: empresa, sucursales, horarios, monedas y tipo de cambio, impuestos, medios de pago, numeración y plantillas de comunicación.",
        how: [
          "Las plantillas usan variables como {cliente} o {reserva}: no borres las llaves.",
          "Actualizá el tipo de cambio si no está automatizado: afecta todos los precios en pesos.",
        ],
      },
      {
        id: "auditoria",
        name: "Auditoría",
        href: "/admin/auditoria",
        what: "El historial inmutable de cambios: quién modificó qué, cuándo, desde dónde y con qué valores (antes → después).",
        how: ["Filtrá por usuario o módulo para reconstruir cualquier cambio; los registros no se pueden borrar desde la interfaz."],
      },
    ],
  },
];

export const guideRecipes: GuideRecipe[] = [
  {
    id: "consulta-a-venta",
    title: "De una consulta a una venta",
    steps: [
      "Consultas: tomá la conversación nueva y respondé (o asignala).",
      "“Convertir en cotización”: armá hasta 3 opciones y envialas con vigencia.",
      "Seguimiento: si no responde antes del vencimiento, contactá; si acepta, convertí en reserva.",
      "Reservas: registrá la seña, completá pasajeros y arrancá el checklist.",
      "Documentación: pedí y aprobá los documentos. Pagos: cobrá el saldo antes de los 35 días.",
    ],
  },
  {
    id: "nueva-salida",
    title: "Cargar una nueva salida de un paquete",
    steps: [
      "Catálogo → Paquetes: abrí el paquete y agregá la fecha en “Salidas” (precio, cupos, mínimo).",
      "Tarifas: verificá costo + markup y guardá (queda auditado).",
      "Disponibilidad: controlá que la salida aparezca con sus cupos.",
      "Promociones: si la salida necesita empuje, creá la promo con el preview.",
    ],
  },
  {
    id: "cambiar-foto-home",
    title: "Cambiar una foto o un texto de la página",
    steps: [
      "Medios: subí la imagen nueva y completá el texto alternativo.",
      "Contenido (textos) o Editor de home (orden y secciones): hacé el cambio.",
      "Verificá en el preview desktop y mobile, y publicá.",
    ],
  },
  {
    id: "imprevisto-en-viaje",
    title: "Imprevisto durante un viaje",
    steps: [
      "Tickets: creá el caso con prioridad y SLA (ej. vuelo reprogramado).",
      "Reservas: abrí la reserva afectada y registrá lo que se gestione (noche extra, cambio de traslado).",
      "Consultas/WhatsApp: mantené al pasajero informado desde el panel, con el contexto cargado.",
      "Al resolver, cerrá el ticket escribiendo la solución: queda para el próximo caso igual.",
    ],
  },
  {
    id: "cierre-de-mes",
    title: "Cierre de mes",
    steps: [
      "Pagos: conciliá todos los aprobados y perseguí rechazados/vencidos.",
      "Finanzas: exportá movimientos para el estudio contable.",
      "Reportes: generá ventas por vendedor y por destino del período.",
      "Proveedores: revisá saldos y contratos por vencer.",
    ],
  },
];
