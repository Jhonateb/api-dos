
link del video de youtube:
https://www.youtube.com/watch?v=Ak54kJNc6qM


# API REST Profesional con NestJS para Gestión de Productos 📦

Este repositorio contiene el código fuente de una API REST robusta para la gestión de productos, desarrollada con **NestJS**, **TypeORM** y **PostgreSQL**. El proyecto sigue una arquitectura por capas y utiliza **Docker** para la gestión de la base de datos, garantizando un entorno de desarrollo consistente y fácil de levantar.

---
## ✨ Características Principales

* **CRUD Completo:** Endpoints para Crear, Leer, Actualizar y Eliminar productos.
* **Arquitectura por Capas:** Código organizado en Controladores, Servicios y Entidades para una mejor mantenibilidad.
* **Validación de Datos:** Uso de DTOs (`Data Transfer Objects`) con `class-validator` para asegurar la integridad de los datos de entrada.
* **Reglas de Negocio:** Lógica implementada en la capa de servicio para manejar casos como:
    * SKU de producto único.
    * No se permite eliminar productos si tienen stock.
* **Búsqueda Avanzada:** Un endpoint `POST` que permite realizar búsquedas complejas con:
    * Filtros dinámicos (búsqueda por nombre, SKU, etc.).
    * Paginación de resultados.
    * Ordenamiento por diferentes campos.
* **Base de Datos con Docker:** Entorno de base de datos PostgreSQL gestionado a través de `docker-compose` para facilitar la configuración.

---
## 🛠️ Requisitos Previos

Asegúrate de tener instalado el siguiente software en tu máquina:
* [Node.js](https://nodejs.org/) (v18 o superior)
* [Docker](https://www.docker.com/products/docker-desktop/) y Docker Compose

---
## 🚀 Instalación y Puesta en Marcha

Sigue estos pasos para levantar el proyecto en tu entorno local:

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/tu-repositorio.git](https://github.com/tu-usuario/tu-repositorio.git)
    ```

2.  **Navega a la carpeta del proyecto:**
    ```bash
    cd tu-repositorio
    ```

3.  **Instala las dependencias de Node.js:**
    ```bash
    npm install
    ```

4.  **Crea el archivo de variables de entorno:**
    Copia el archivo `.env.example` y renómbralo a `.env`. Este archivo contiene las credenciales para la base de datos que usará Docker.
    ```bash
    cp .env.example .env
    ```

5.  **Levanta la base de datos con Docker:**
    Este comando leerá el archivo `docker-compose.yml` y creará y correrá el contenedor de PostgreSQL en segundo plano.
    ```bash
    docker-compose up -d
    ```

6.  **Inicia la aplicación de NestJS:**
    ```bash
    npm run start:dev
    ```

¡Y listo! La API estará corriendo en `http://localhost:3000`.

---
## 🔌 Documentación de Endpoints

### Productos

#### `POST /productos`
Crea un nuevo producto.
* **Body (JSON):**
    ```json
    {
      "nombre": "Producto de Ejemplo",
      "descripcion": "Descripción detallada del producto.",
      "precio": 99.99,
      "stock": 50,
      "sku": "SKU-UNICO-123"
    }
    ```

#### `GET /productos/:id`
Obtiene un producto específico por su ID.

#### `PATCH /productos/:id`
Actualiza parcialmente un producto.
* **Body (JSON):**
    ```json
    {
      "precio": 120.50,
      "stock": 45
    }
    ```

#### `DELETE /productos/:id`
Elimina un producto (solo si no tiene stock).

### Búsqueda Avanzada

#### `POST /productos/search`
Realiza una búsqueda avanzada con filtros, paginación y ordenamiento.
* **Body (JSON):**
    ```json
    {
      "page": 1,
      "limit": 10,
      "sortBy": "precio",
      "order": "DESC",
      "filters": {
        "nombre": "ejemplo"
      }
    }
    ```
* **Respuesta Exitosa:**
    ```json
    {
      "data": [ ... productos ... ],
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50
    }
    ```

---
### `.env.example`
Este es el contenido del archivo de ejemplo para las variables de entorno.