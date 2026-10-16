[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/2gizGE2c)
# Proyecto 2 - Desarrollo de Aplicación Web Completa con Next.js y PostgreSQL

### 📌 Introducción

En este segundo proyecto, cada comisión desarrollará una aplicación web más avanzada utilizando **Next.js y PostgreSQL**. Se incluirá autenticación de usuarios y la integración con servicios externos, entre ellos **Mercado Pago** para pagos en línea. El proyecto permitirá a los alumnos trabajar con una aplicación realista y reforzar conceptos clave como **gestión de datos, autenticación y pagos online**.

Cada comisión deberá elegir uno de los siguientes tipos de aplicación, respetando la estructura común y los requisitos establecidos:

- **E-commerce** → Venta de productos con carrito de compras y pago online.
- **Plataforma de reservas** → Reserva de turnos, alquiler de espacios o compra de entradas.

---

### 📋 Requisitos

✅ **Frontend en Next.js** → Deberá incluir páginas y componentes reutilizables.

✅ **Backend con API en Node.js y PostgreSQL** → Gestión de datos persistente con una base de datos relacional.

✅ **Autenticación de usuarios** → Uso de autenticación con JWT o NextAuth.

✅ **Integración con Mercado Pago** → Implementación de pagos online en **modo sandbox** para pruebas.

✅ **Carrito de compras o selección de reservas** → Dependiendo del tipo de aplicación.

✅ **Interfaz bien trabajada** → Se recomienda Tailwind CSS, Chakra UI o Bootstrap.

✅ **Búsqueda y Paginación** → Implementar funcionalidades de búsqueda y paginación en la lista de productos utilizando parámetros de búsqueda en la URL.

✅ **Manejo de Errores** → Implementar manejo de errores generales y específicos para errores 404 no encontrados.

✅ **Validación de Formularios** → Realizar validación de formularios en el lado del servidor.

✅ **Accesibilidad** → Aplicar prácticas recomendadas para mejorar la accesibilidad en la aplicación.

✅ **Consumo de una API Externa** →

- Incorporar datos o funcionalidades de una API externa que agregue valor a los productos o servicios ofrecidos. Por ejemplo, una API de reseñas de productos, información climática para eventos programados, o cualquier otro servicio que complemente la oferta de la tienda.
- Incorporar contenido de páginas externas a través de embeber otros sitios, como mapas de Google Maps, no se considera como que se está consumiendo una API externa. El requerimiento implica hacer un requerimiento a un servicio (API) externo y procesar la respuesta para mostrar la información obtenida.

✅ **Opcional IA** → Se podrá incorporar funcionalidad basada en inteligencia artificial que aporte valor a la aplicación. Ejemplos posibles incluyen: sugerencias automáticas de productos o servicios, generación de descripciones con IA, chatbots para atención al cliente, o recomendaciones personalizadas. Esta funcionalidad será valorada positivamente, pero no es obligatoria.

---

### 💡 Ejemplos de aplicaciones posibles

Cada comisión podrá elegir entre las siguientes opciones:

- **E-commerce** → Tienda online con carrito de compras y pago.
- **Reserva de turnos** → Aplicación donde los usuarios seleccionan y pagan por turnos.
- **Alquiler de espacios o eventos** → Los usuarios reservan fechas y pagan por ellas.
- **Venta de membresías o servicios** → Los usuarios seleccionan planes y los contratan mediante Mercado Pago.

Cada comisión podrá proponer variaciones siempre que se mantenga la estructura base.

---

### 📌 Aclaraciones

- **📦 Gestión de Stock:** Cuando corresponda, no es necesario implementar un sistema de gestión de stock para los productos.
- **💸 Simplicidad en los Pagos:** Se espera que la integración con Mercado Pago sea básica, manejando únicamente el flujo de pago sin necesidad de configurar opciones avanzadas ni que el usuario tenga que registrarse en la aplicación.
- **🔐 Autenticación:** La autenticación de usuarios administradores no necesita manejar recuperación de contraseñas o confirmación de emails; un sistema básico de login/logout será suficiente.
- **🛒 Carrito y Checkout**:
    
    La compra debe realizarse a través de un **carrito de compras**, es decir, debe permitir seleccionar una o más unidades/productos/servicios y proceder luego a un **checkout** con un resumen de la compra antes de iniciar el pago.
    
- **🔐 Login obligatorio solo para administradores**:
    
    La **autenticación de usuarios administradores es obligatoria**. El login para usuarios finales es **opcional**, dependiendo del tipo de aplicación. Se debe garantizar que los administradores tengan acceso seguro.
    
- **🧑‍💼 Funcionalidades del rol administrador**:
    
    El **usuario administrador** debe tener acceso a funcionalidades específicas para **gestionar los datos** de la aplicación (por ejemplo: productos, turnos, eventos) y **visualizar al menos un listado o reporte** relevante según el dominio de la aplicación (por ejemplo: ventas, reservas realizadas, historial de turnos, etc.).
    

---

### 📝 Operatoria

### **Entregables:**

- Código fuente del proyecto en un repositorio de GitHub cuyo nombre debe *incluir* la palabra `proyecto-nextjs`.
- Link a la aplicación desplegada en Vercel.

### Comisiones:

- El proyecto se realizará en comisiones de a 2 alumnos, las mismas que el proyecto anterior.
- Cada comisión debe registrarse en GitHub Classroom para obtener el repositorio con el enunciado.
- La cátedra le asignará un ayudante el cual será el encargado del seguimiento y la corrección del proyecto.

### Punto de Control:

- Será obligatorio un punto de control con el ayudante asignado, el cual puede realizarse el día Jueves 19 o Martes 24 de Junio.
- El objetivo del punto de control es explicar la idea a realizar del proyecto y el grado de avance en el momento de realizar el control.

### 📅 Fecha límite de entrega:

- La fecha de entrega del proyecto es el día Jueves 10 de Julio a las 23:59 hs.
- Todos los cambios realizados para el desarrollo del proyecto deben estar disponibles en la rama `main` del repositorio dentro de la organización de la materia.
- El Readme debe incluir en el mensaje un link al deploy funcional de Vercel (de producción, no preview)
- Además, se puede incluir cualquier nota que sea requerida en dicho archivo Readme.
- El no cumplimiento de alguno de los puntos anteriores invalida la entrega por completo del proyecto.

### Defensa:

- Se asignará un horario a cada comisión para la defensa del proyecto el día 15 o 17 de Julio, de 20 minutos.
- En dicha defensa deberán explicar el funcionamiento de su proyecto, tanto para el usuario final como para el administrador, y responder consultas de la cátedra respecto a la implementación del mismo

### **Criterios de Evaluación:**

- **Completitud:** Cumplimiento de todos los requerimientos listados.
- **Funcionalidad:** Correcto funcionamiento de todas las características implementadas.
- **Calidad del Código:** Organización, legibilidad y uso de buenas prácticas de programación.
- **Diseño y UX:** Atractivo visual y facilidad de uso de la aplicación.

---

### 🔧 Recursos Recomendados

### 📘 **Next.js**

- [Documentación oficial de Next.js](https://nextjs.org/docs)
- [Guía para crear una API en Next.js](https://nextjs.org/docs/api-routes/introduction)
- [Routing en Next.js](https://nextjs.org/docs/routing/introduction)
- [Tutorial de Next.js](https://nextjs.org/learn)

### 🛠️ **PostgreSQL**

- [Instalación y uso básico con pg (node-postgres)](https://node-postgres.com/)
- Base de datos gratis para desarrollo: [Railway](https://railway.app/), [Supabase](https://supabase.com/), [Neon](https://neon.tech/), [Postgres on Vercel](https://vercel.com/docs/postgres)

### 🔐 **Autenticación**

- [NextAuth.js – Documentación](https://next-auth.js.org/)
- [Autenticación con credenciales en NextAuth](https://next-auth.js.org/providers/credentials)

### 💳 **Mercado Pago**

- [Documentación oficial de integración Checkout Pro](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/overview)

### 🎨 **Estilado**

- [Tailwind CSS](https://tailwindcss.com/docs/installation)
- [Chakra UI](https://chakra-ui.com/docs/getting-started)
- [Bootstrap](https://getbootstrap.com/docs/5.3/getting-started/introduction/)

### 🌐 **Consumo de API externa**

- [Ejemplo: API pública de clima](https://open-meteo.com/)
- [Lista de APIs públicas gratuitas](https://github.com/public-apis/public-apis)
- [Guía Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

### ♿ **Accesibilidad**

- [Guía de accesibilidad en la web (Web.dev)](https://web.dev/accessibility/)
- [Herramientas para testeo de accesibilidad: Lighthouse](https://developer.chrome.com/docs/lighthouse/overview?hl=es-419)

---

### ❓ Preguntas Frecuentes (FAQs)

### 🛒 ¿Qué pasa si no llegamos a integrar Mercado Pago?

La integración con Mercado Pago es obligatoria, pero puede ser básica. Se espera que el flujo de pago esté implementado en modo **sandbox**, sin necesidad de opciones avanzadas. Si tienen dificultades, consulten al ayudante asignado.

### 🔄 ¿Podemos usar Prisma como ORM para PostgreSQL?

Sí, pueden usar **Prisma**, **Knex**, o trabajar directamente con `pg`. La elección de herramientas está abierta mientras se cumpla con el uso de **PostgreSQL** como base de datos.

### 🔑 ¿Tenemos que permitir registro de usuarios o solo login?

Solo es obligatorio tener un sistema básico de autenticación (login/logout). No se requiere registro de usuarios ni recuperación de contraseña, salvo que el proyecto lo justifique.

### 🚫 ¿Qué pasa si no llegamos con todas las funcionalidades?

Se evaluará el cumplimiento de los requisitos obligatorios. Si alguna funcionalidad está incompleta, debe estar debidamente documentada en el README para que la cátedra lo tenga en cuenta. Siempre es mejor entregar algo funcional que algo roto.

### 🧪 ¿Tenemos que hacer tests automatizados?

No es obligatorio realizar tests, pero si los incluyen serán valorados positivamente.

### 🧠 ¿Cómo podemos usar IA en el proyecto?

La integración de IA es opcional. Algunos ejemplos: generación de descripciones automáticas, sugerencias inteligentes de productos o turnos, o chatbots. No es necesario entrenar modelos propios, pueden usar APIs existentes (como OpenAI, Gemini, etc.).

### 📦 ¿Se puede usar Firebase u otro backend externo?

No para la base de datos principal. La persistencia debe estar en **PostgreSQL**. Sin embargo, sí se puede usar un servicio externo como Firebase solo para funcionalidades complementarias (por ejemplo, notificaciones o almacenamiento de archivos).

### 💡 ¿Podemos proponer una idea diferente a las opciones listadas?

Sí, siempre que respete la estructura base y los requisitos. Deberán explicarla en el punto de control y recibir aprobación de la cátedra.

### 👨‍💻 ¿El administrador debe tener una vista especial?

Sí. Aunque no se requiere un panel de administración completo, debe haber alguna forma de que un usuario administrador pueda gestionar productos, reservas o contenido.






# Deploy
**Link al deploy:**\
https://proyecto-2-dello-russo-gonzalez.vercel.app

---

### Usuario para ingresar

**Usuario común**\
**DNI**: 87654321\
**Contraseña**: 12345678

**Usuario administrador**\
**DNI**: 12367890\
**Contraseña**: 12345678

---

### Cuenta de Mercado Pago para comprar
Debido a que la integración con Mercado Pago Checkout Pro está en modo sandbox, la cuenta a la que está asociada la aplicación web es una cuenta de vendedor **de prueba**. Esto significa que sólo va a aceptar pagos de otras cuentas que sean también de prueba. Por esto, les brindamos la siguiente cuenta **comprador** de prueba:\
<br>
**Usuario**: TESTUSER39118323\
**Contraseña**: 4oQshal3MK\
<br>
Para utilizarla deberán loguearse en Mercado Pago (https://www.mercadopago.com.ar/) antes o durante la operación de pago. La aplicación está pensada para operar con pagos en efectivo, tarjeta de crédito o débito (no pagos offline).

---

### Detalles
**Implementación de IA**\
Para el próximo martes tendremos implementado un servicio de inteligencia artificial, preferentemente un chatbot con contexto y capaz de responder preguntas a los usuarios.\
**Fechas incorrectas**\
Por alguna razón, al momento de seleccionar la fecha para un turno, dicho turno aparecerá con la fecha del día anterior en el carrito (o en la lista de turnos confirmados). Desconocemos a qué se debe pero sospechamos que es a raíz de la ubicación en el mundo del servidor y de la base de datos (EEUU y Brazil).



.
