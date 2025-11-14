# Asistente de IA por Voz para Control de PC (Versión Web)

Un asistente de IA web, controlado por voz y texto, diseñado para ayudar a usuarios con movilidad reducida a controlar su PC con Windows mediante lenguaje natural. La aplicación puede generar comandos para el Símbolo del sistema (CMD) y para la herramienta de accesibilidad Windows Voice Access.

## ✨ Características

-   **Doble Modo de Operación:**
    -   **Modo CMD:** Genera comandos de consola para tareas como abrir aplicaciones (`start chrome`), gestionar el sistema (`taskmgr`), etc.
    -   **Modo Voice Access:** Genera frases en lenguaje natural para controlar cualquier aplicación, hacer clic en botones, dictar texto, gestionar ventanas y más.
-   **Interfaz Futurista:** Diseño visual atractivo con animaciones y efectos.
-   **Entrada Dual:** Interactúa mediante comandos de voz o escribiendo en el chat.
-   **Respuesta por Voz:** El asistente lee sus respuestas en voz alta para una experiencia manos libres.
-   **Seguro y Privado:** La aplicación se ejecuta 100% en tu navegador. Tu clave de API se almacena localmente en `localStorage` y nunca se envía a ningún servidor que no sea el de la API de Google.

## 🚀 Requisitos

-   Un navegador web moderno (Chrome, Firefox, Edge, Safari).
-   Un micrófono para los comandos de voz.
-   Una clave de API de [Google AI Studio (Gemini)](https://aistudio.google.com/app/apikey).

## ⚙️ Uso

1.  Abre la aplicación en tu navegador.
2.  La primera vez, se te pedirá que introduzcas tu clave de API de Google Gemini. Pégala en el campo y haz clic en "Guardar".
3.  Tu clave se guardará de forma segura en el almacenamiento local de tu navegador para futuras visitas.
4.  ¡Listo! Ya puedes empezar a interactuar con el asistente.


## 🔑 Configuración de la API Key

Para que el asistente funcione correctamente, necesitas configurar tu clave de API de Google Gemini:

### Obtener la API Key:
1. Visita [Google AI Studio](https://aistudio.google.com/app/api-keys)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Crear clave de API"
4. Copia la clave generada

### Configurar localmente:
1. En la raíz del proyecto, crea un archivo `.env`:
   ```bash
   copy .env.example .env
   ```
2. Abre el archivo `.env` y reemplaza `your_api_key_here` con tu clave de API:
   ```
   VITE_GEMINI_API_KEY=tu_clave_api_aqui
   ```

**⚠️ IMPORTANTE:** Nunca compartas tu clave de API ni la subas a repositorios públicos. El archivo `.env` está incluido en `.gitignore` para proteger tus credenciales.
## ▶️ Desarrollo Local

Si quieres ejecutar el proyecto en tu máquina local:

1.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/asistente-ia-voz.git
    cd asistente-ia-voz
    ```

2.  **Instalar Dependencias:**
    ```bash
    npm install
    ```

3.  **Iniciar el Servidor de Desarrollo:**
    ```bash
    npm run dev
    ```
    La aplicación se abrirá en tu navegador en `http://localhost:5173`.
