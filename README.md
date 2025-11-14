# Asistente de IA por Voz para Control de PC

Un asistente de IA de escritorio, controlado por voz y texto, diseñado para ayudar a usuarios con movilidad reducida a controlar su PC con Windows mediante lenguaje natural. La aplicación puede generar comandos para el Símbolo del sistema (CMD) y para la herramienta de accesibilidad Windows Voice Access.

## ✨ Características

-   **Doble Modo de Operación:**
    -   **Modo CMD:** Genera comandos de consola para tareas como abrir aplicaciones (`start chrome`), gestionar el sistema (`taskmgr`), etc.
    -   **Modo Voice Access:** Genera frases en lenguaje natural para controlar cualquier aplicación, hacer clic en botones, dictar texto, gestionar ventanas y más.
-   **Interfaz Futurista:** Diseño visual atractivo con animaciones y efectos.
-   **Entrada Dual:** Interactúa mediante comandos de voz o escribiendo en el chat.
-   **Respuesta por Voz:** El asistente lee sus respuestas en voz alta para una experiencia manos libres.
-   **Seguro y Local:** Se ejecuta como una aplicación de escritorio. Tu clave de API se almacena localmente y nunca sale de tu equipo.
-   **Multiplataforma (con Electron):** Empaquetado para una fácil instalación en Windows.

## 🚀 Requisitos Previos

-   [Node.js](https://nodejs.org/) (versión 18.x o superior)
-   [npm](https://www.npmjs.com/) (generalmente viene con Node.js)
-   Una clave de API de [Google AI Studio (Gemini)](https://aistudio.google.com/app/apikey).

## ⚙️ Instalación y Configuración

1.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/asistente-ia-voz.git
    cd asistente-ia-voz
    ```

2.  **Instalar Dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar la Clave de API:**
    -   Busca el archivo llamado `.env.example` en la raíz del proyecto.
    -   Crea una copia de este archivo y renómbrala a `.env`.
    -   Abre el nuevo archivo `.env` y reemplaza `"YOUR_GEMINI_API_KEY"` con tu clave de API real de Google Gemini.

    ```
    # Contenido de tu archivo .env
    API_KEY="aqui_va_tu_clave_real_de_gemini"
    ```

## ▶️ Uso (Modo Desarrollo)

Para ejecutar la aplicación en modo de desarrollo, que te permite ver los cambios en tiempo real:

1.  **Iniciar el Entorno de Desarrollo:**
    ```bash
    npm run dev
    ```
    Este comando compila el código de Electron y luego inicia el servidor de desarrollo de Vite para la interfaz y la aplicación Electron al mismo tiempo.

2.  **Interactuar con el Asistente:**
    -   Usa el micrófono o el campo de texto para dar tus instrucciones.
    -   Cambia entre "Modo CMD" y "Modo Voice Access" según tus necesidades.

## 📦 Crear el Ejecutable Instalable (Producción)

Para empaquetar la aplicación en un archivo `.exe` instalable para Windows:

1.  **Construir la Aplicación:**
    ```bash
    npm run dist
    ```

2.  **Encontrar el Instalador:**
    -   El comando creará una carpeta `release` en la raíz del proyecto.
    -   Dentro de `release`, encontrarás el archivo de instalación (ej. `Asistente de IA por Voz Setup 1.0.0.exe`).
    -   Puedes distribuir y ejecutar este archivo para instalar la aplicación en cualquier PC con Windows.

## ⌨️ Atajos de Teclado

-   `Ctrl + M`: Activar/Desactivar el micrófono.
-   `Ctrl + 1`: Cambiar a Modo CMD.
-   `Ctrl + 2`: Cambiar a Modo Voice Access.
