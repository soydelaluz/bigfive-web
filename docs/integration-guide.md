# Guía de Integración para el Agente de IA: Big Five en Manual de Perfiles Técnicos

Este documento detalla cómo integrar el sistema de test de personalidad Big Five (reestructurado) en la aplicación "Manual de Perfiles Técnicos".

## Cambios Realizados para Facilitar la Integración
1.  **Restricción de Idiomas:** Se han eliminado todos los idiomas excepto Inglés (en) y Español (es).
2.  **Limpieza de Interfaz:** Se han eliminado todos los enlaces externos a GitHub, redes sociales y referencias al proyecto original para evitar distracciones al usuario final.
3.  **Modularización:** Los componentes principales del test se han movido a `web/src/components/bigfive/`.
4.  **Capa de Servicios:** Se han creado `ResultService` y `FeedbackService` en `web/src/services/` para abstraer la base de datos (MongoDB). Esto permite cambiar fácilmente a PostgreSQL/Drizzle simplemente actualizando estos servicios.
5.  **Esquema de Base de Datos:** Se proporciona un esquema Drizzle en `docs/database-migration.md`.

## Instrucciones Explícitas para la Integración

### 1. Área de Exámenes (Portal del Usuario)
- **Implementación:** Utilizar el componente `Survey` de `web/src/components/bigfive/survey.tsx`.
- **Flujo:** Cuando el usuario completa el examen, el componente llama a la acción `saveTest`. Debes modificar esta acción para que, además de guardar el resultado, actualice el estado del examen del usuario en tu base de datos a "Completado".
- **Vista Final:** Al terminar, el usuario solo debe ver un mensaje confirmando que ha finalizado el test. No se le debe mostrar el reporte detallado ni el ID del resultado si quieres mantener el control administrativo.

### 2. Área de Performance (Panel Administrativo)
- **Implementación:** Al navegar por el perfil de un usuario/técnico en el área administrativa, utiliza los componentes de reporte.
- **Visualización:** Importa `BarChart` y `DomainTabs` (desde `web/src/components/bigfive/`) para mostrar los resultados completos.
- **Acceso a Datos:** Utiliza `ResultService.getById(id)` para recuperar los datos del test vinculados al `technician_id`.
- **Exportación:** El sistema ya soporta la generación de PDF mediante la funcionalidad de impresión del navegador o puedes integrar librerías como `jsPDF` usando la estructura de datos JSON que devuelve el servicio.
- **Privacidad:** Asegúrate de que estas rutas y componentes solo sean accesibles para roles con permisos de `admin_global` o `recursos_humanos`.

### 3. Sincronización de Datos
- Vincula la tabla de resultados del Big Five con tu tabla de técnicos mediante un `technician_id`.
- Cuando el usuario inicie el test, pasa su `technician_id` para que quede registrado en el resultado.

## Resumen Técnico de Archivos Clave
- `web/src/components/bigfive/`: Componentes UI listos para mover.
- `web/src/services/resultService.ts`: Lógica de acceso a datos para modificar.
- `docs/database-migration.md`: Referencia para tu base de datos PostgreSQL.
