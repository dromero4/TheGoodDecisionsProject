# TheGoodDecisions - Customization Market

Proyecto final de desarrollo de una plataforma e-commerce orientada a la compra y personalización de productos textiles.

La aplicación permite consultar un catálogo de prendas base, seleccionar color, talla y cantidad, aplicar personalizaciones visuales, añadir productos al carrito, gestionar datos de usuario y dirección de entrega, realizar el pago mediante Stripe y recibir una confirmación de pedido por email.

---

## Descripción del proyecto

El objetivo principal del proyecto es simular un flujo real de compra y personalización textil dentro de una plataforma web moderna.

El usuario puede seleccionar una prenda base, escoger variantes disponibles, configurar cantidades por talla, comprobar stock, aplicar técnicas de personalización y completar el proceso de compra mediante una pasarela de pago externa.

El proyecto está desarrollado con una arquitectura full-stack basada en Next.js, integrando frontend, backend, base de datos, autenticación, pagos y envío de emails.

---

## Funcionalidades principales

- Catálogo de productos textiles.
- Ficha individual de producto.
- Selección de color, talla y cantidad.
- Control de stock por variante.
- Precios por volumen.
- Personalizador visual por zonas.
- Añadir texto o imágenes sobre la prenda.
- Selección de técnicas de personalización.
- Cálculo automático del precio base y de personalización.
- Carrito lateral responsive.
- Registro, login y logout de usuarios.
- Perfil de usuario.
- Gestión de dirección de entrega.
- Checkout con Stripe.
- Webhook de confirmación de pago.
- Envío automático de email de confirmación con Resend.
- Persistencia de pedidos en base de datos.

---

## Tecnologías utilizadas

### Frontend

- Next.js
- React
- Tailwind CSS
- React Context API
- React RND
- next/image

### Backend

- Next.js API Routes
- Node.js
- Prisma ORM
- PostgreSQL
- JWT
- bcryptjs

### Servicios externos

- Neon PostgreSQL
- Stripe Checkout
- Stripe Webhooks
- Resend
- Vercel

### Herramientas

- Git
- GitHub
- Visual Studio Code
- Prisma Studio

---

## Estructura principal del proyecto

```txt
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── checkout/
│   │   ├── me/
│   │   └── webhooks/
│   ├── components/
│   │   └── pageComponents/
│   ├── context/
│   ├── lib/
│   │   ├── auth/
│   │   ├── orders/
│   │   └── prisma.js
│   └── product/
├── prisma/
│   └── schema.prisma
└── public/
```
---

# Credenciales de prueba

Para facilitar la revisión del proyecto, se ha habilitado una cuenta de prueba con la que se puede acceder a la aplicación y comprobar el flujo completo de usuario.
Aunque para testear el envio del correo necesitareis crear una cuenta, porque _test@test.es_ es un correo de prueba.

### Cuenta de usuario
Email: cuenta@test.es <br>
Contraseña: cuentaTestTheGoodDecisions <br>

### Tarjeta de test
Número de tarjeta: 4242 4242 4242 4242 <br>
Fecha de caducidad: 12/34 <br>
CVC: 123 <br>
Titular de la tarjeta: Pere pi

#### Realmente si pones como numero de tarjeta el de arriba, puedes poner lo que quieras. Lo importante es que el numero de tarjeta sea ese.
