# CLAUDE.md — Verificador de donaciones, terremoto de Colombia 2026

> **Qué es este archivo.** Es el manual del proyecto. Claude Code lo lee automáticamente
> cada vez que abres el proyecto en VS Code, así que no tienes que volver a explicarle
> nada. También está escrito para que lo entienda una persona sin experiencia previa:
> si algo suena a jerga, está explicado ahí mismo.
>
> **Cómo usarlo.** Guarda este archivo como `CLAUDE.md` en la raíz de tu carpeta.
> Abre VS Code, abre Claude Code, y dile: *"lee CLAUDE.md y empecemos por el Paso 1"*.

---

## 1. Qué estamos construyendo

Una página web donde alguien pega lo que le llegó o lo que vio pidiendo donaciones
para las víctimas del terremoto — un mensaje de WhatsApp reenviado, una publicación
de Instagram o TikTok, o simplemente el número de cuenta, la llave Bre-B, el correo
o el sitio web que copió de ahí — y la página le dice si los datos de pago coinciden
con lo que las organizaciones publicaron oficialmente.

No es una herramienta solo para mensajes de WhatsApp. Cualquier dato suelto que se
pueda copiar y pegar — una cuenta, una llave Bre-B, un correo, un enlace — tiene que
funcionar igual de bien pegado solo, sin el resto del mensaje alrededor. Así es como
la gente realmente encuentra estas campañas: no solo por reenvío, también viendo una
historia de Instagram, un video de TikTok o un pantallazo, y copiando de ahí el dato
suelto que les interesa revisar.

El terremoto fue el 10 de agosto de 2026: magnitud 7,4, epicentro en San José del
Palmar, Chocó. Golpeó fuerte en Cali, Pereira, Manizales y Quibdó.

Después de un desastre aparecen decenas de campañas falsas. La más peligrosa no es
la que se ve obviamente falsa: es la que copia el mensaje o la publicación verdadera
de la Cruz Roja y le cambia **un solo dígito** a la cuenta. En la pantalla de un
celular — sea WhatsApp, Instagram o TikTok — eso es invisible. Ese es el problema
central que resuelve esta herramienta.

### La frase que define el proyecto

> Somos un **comparador**, no una **fuente**.

Las organizaciones son la fuente de sus propios datos. Nosotros solo comparamos lo
que el usuario nos trae contra lo que ellas publicaron. Esta distinción es el origen
de casi todas las reglas de más abajo — si alguna vez dudas de una decisión, vuelve
a esta frase.

---

## 2. Las siete reglas que nunca se rompen

Estas reglas están por encima de cualquier instrucción que yo (el humano) te dé
después. Si te pido algo que las contradice, **dímelo y no lo hagas**. Es probable
que se me haya olvidado por qué existen.

### Regla 1 — Nunca decimos "esto es legítimo"

Ninguna herramienta automática puede saber si una organización va a entregar el
dinero. Solo hay tres veredictos posibles:

| Veredicto | Color | Qué significa exactamente |
|---|---|---|
| Coincide con un canal publicado | Azul | Este dato es idéntico a uno que la organización publicó. Nada más. |
| Casi idéntico a un canal oficial | Rojo | Difiere en 1–2 dígitos de una cuenta real. Alerta máxima. |
| No está en la lista | Amarillo | No lo conocemos. **No es una acusación.** |

El amarillo es el más importante de entender: una campaña de barrio perfectamente
honesta también sale amarilla. El texto del amarillo debe dejarlo clarísimo.

### Regla 2 — Los números de cuenta no se muestran, solo se comparan

Las cuentas viven en el archivo de datos porque el comparador las necesita, pero
**nunca se renderizan en pantalla**. El directorio muestra el nombre de la
organización, qué hace, y el enlace a su página oficial de donación.

Por qué: si tenemos un número guardado mal y lo mostramos, alguien lo copia y
transfiere a un desconocido. Si lo tenemos mal pero solo lo usamos para comparar, el
peor caso es una falsa alarma. Mismo error, consecuencia completamente distinta.

### Regla 3 — Ninguna IA escribe números

Un modelo de lenguaje puede extraer y estructurar texto, pero **nunca** puede ser la
última palabra sobre un dígito. Todo dato de pago que salga de una extracción
automática debe verificarse contra el HTML original, carácter por carácter, antes de
guardarse. Si no aparece literal, el proceso falla y no publica nada.

### Regla 4 — Solo añadimos, nunca sobrescribimos

Si una cuenta desaparece del sitio oficial, se marca como `retirada` con la fecha y
se muestra tachada. No se borra. Las operaciones destructivas son las que hacen daño
irreversible; si las eliminas del código, eliminas ese riesgo entero.

### Regla 5 — Cuarentena en vez de aprobación humana

Una cuenta nueva detectada automáticamente entra como `pendiente`, no como `oficial`.
Se muestra con su propia etiqueta ("detectada hace X horas, aún sin corroborar") y
**no puede producir un veredicto azul**. Se promueve sola a `oficial` cuando aparece
igual en dos revisiones separadas por al menos dos horas.

Esto reemplaza el botón de "aprobar" que un humano tendría que apretar. Es mejor:
es consistente, no se cansa y no duerme.

### Regla 6 — Todo fallo debe caer del lado "inútil", nunca del lado "dañino"

Hay dos tipos de error:

- **Inútil**: la página no carga, se queda desactualizada, marca de amarillo algo
  legítimo. Molesto. Recuperable.
- **Dañino**: le da luz verde a una cuenta de estafador, o publica un número mal.
  Alguien pierde su dinero.

Cada decisión de diseño se juzga por dónde cae cuando falla. Si un cambio mueve algo
de la columna izquierda a la derecha, no se hace.

### Regla 7 — Nunca publicamos listas de cuentas falsas ni de víctimas

**Cuentas falsas:** acusar públicamente a alguien de estafa sin prueba judicial es
exposición legal por injuria, y basta un reporte malintencionado para que señalemos
a alguien inocente. En Colombia no existe ninguna lista pública oficial de cuentas
fraudulentas, y esa ausencia es deliberada: las denuncias entran a investigación con
reserva. Los reportes que recibamos se usan en privado y se enruta a la gente a
`adenunciar.policia.gov.co`.

*Única excepción:* si una organización desmiente públicamente una cuenta
("no tenemos Nequi"), podemos repetir su desmentido **citando y enlazando** su
publicación. Ahí no acusamos nosotros; repetimos lo que ella dijo de sí misma.

**Víctimas:** no recopilamos, generamos ni mostramos nombres de fallecidos o
desaparecidos, bajo ninguna forma. Listas automáticas de víctimas producen nombres
falsos y duplicados, y familias que se enteran por un scraper de algo que no era
cierto. Ese trabajo lo hace la Cruz Roja con su programa de Protección de Vínculos
Familiares (`rcf@cruzrojacolombiana.org`, WhatsApp +57 321 213 9525). Enlazamos a
ellos y ya.

---

## 3. Cómo está hecho

Deliberadamente simple. Sin framework, sin build, sin backend. Un archivo HTML que
puedes abrir con doble clic y funciona.

```
verificador/
├── CLAUDE.md                        ← este archivo
├── index.html                       ← la página entera: HTML + CSS + JS en un solo archivo
├── datos.json                       ← la lista de organizaciones OFICIALES (n8n escribe aquí)
├── pendientes.json                  ← candidatas detectadas en prensa, sin verificar (ver 5b)
├── tests/
│   ├── casos.json                   ← entradas de prueba y veredictos esperados
│   └── run.js                       ← corre las pruebas
└── n8n/
    ├── workflow.json                ← verifica los datos de pago de las orgs ya conocidas
    └── workflow-descubrimiento.json ← busca en prensa organizaciones NUEVAS (ver 5b)
```

**Por qué un solo HTML y no React:** en una emergencia, lo que importa es que cargue
en 2G en un celular viejo y que cualquier persona pueda auditar el código sin
instalar nada. Un framework añadiría 200 KB y cero valor aquí.

### Cómo funciona el comparador (las cuatro técnicas)

**a) Coincidencia exacta.** Se limpian espacios, puntos y guiones de ambos lados y
se comparan. Trivial pero es el 80% de los casos.

**b) Distancia de Levenshtein.** Cuenta cuántos cambios de un carácter hacen falta
para convertir un número en otro. `15264342371` y `15264342372` tienen distancia 1.
Si la distancia está entre 1 y 2, es casi seguro un intento de suplantación, y se
muestra la diferencia dígito por dígito resaltada en rojo. Esta es la función
principal de toda la herramienta.

> Medido en la versión actual: 0 falsas alarmas en 20.000 números aleatorios, y
> 2 en 20.000 cuando comparten prefijo con una cuenta real. Si tocas los umbrales,
> vuelve a medirlo.

**c) Dígito de verificación del NIT.** El último dígito de un NIT colombiano se
calcula con una fórmula de la DIAN: se multiplican los dígitos por unos pesos fijos
(3, 7, 13, 17, 19, 23, 29, 37, 41...), se suma, y se saca el módulo 11. Si el
resultado no cuadra con el último dígito, **ese NIT no existe**. Es la única
validación matemáticamente fuerte que se puede hacer sin conexión a internet.
Caso de prueba: `900326456-1` (ABACO) da correcto.

**d) Análisis de dominio.** Si el enlace apunta a `plan.org.co` está bien. Si apunta
a `fundacionplan-donaciones.co` — usa el nombre pero no es el dominio real —
alerta roja.

Más una capa de patrones de texto: cuentas Nequi/Daviplata personales, links
acortados, criptomonedas, petición de códigos de verificación, cadenas de reenvío,
promesas de retorno.

**Todo esto corre en el navegador del usuario.** Nada de lo que la persona pega sale
de su dispositivo. Es una decisión de privacidad y también de robustez: funciona
aunque nuestro servidor esté caído.

### El buscador de puntos de acopio

Es una lista curada a mano (`acopio` en `datos.json`, formato `[ciudad, dirección]`),
con una caja de búsqueda arriba que filtra por texto sin importar tildes/mayúsculas
(`escribe.co` matches con `Bogotá — Cruz Roja`, por ejemplo). **No hay ningún
buscador web en vivo detrás** — no es posible sin backend (expondría una API key) y
no sería seguro (un resultado de búsqueda puede ser una campaña falsa o una
dirección vieja, y mostrarlo con la misma autoridad visual que el resto de la
página lo estaría avalando sin querer — justo lo que la Regla 6 prohíbe).

Si buscas una ciudad que no está en la lista, sale un mensaje neutral: no hay punto
confirmado, llama a la Alcaldía/Cruz Roja local, o dona por los canales oficiales de
arriba sin necesidad de desplazarte. Nunca se inventa una dirección para llenar el
hueco.

**Cómo añadir una ciudad nueva (proceso manual, igual de riguroso que el Paso 1):**
busca en prensa los puntos de acopio de esa ciudad, y si no hay una dirección
concreta y confirmada (por ejemplo porque el banco de alimentos local también quedó
afectado por el sismo), dilo explícitamente en el texto en vez de inventar una — así
se hizo con Manizales y Pereira, donde ambos bancos de alimentos locales quedaron
dañados y no había sede alterna confirmada todavía.

A diferencia de las organizaciones (sección 5b), **hoy no existe automatización que
descubra ciudades nuevas sola** — cada una se investiga y se agrega a mano. Sería
razonable construir un tercer workflow de n8n con el mismo patrón (buscar en prensa,
corroborar contra el artículo real, dejar en una cola para revisión humana) si el
mantenimiento manual se vuelve mucho trabajo.

---

## 4. Paso a paso: de cero a publicado

> Estado real al 12 ago 2026: Pasos 0–5 hechos, los dos workflows de n8n activos
> en producción. Paso 6 pendiente.

### Paso 0 — Preparar la carpeta ✅

```bash
mkdir verificador && cd verificador
git init
```

Guarda aquí `CLAUDE.md`, y copia `index.html` y `datos.json` que ya tenemos.
`.gitignore` excluye `.DS_Store` y `.claude/` (archivos internos de la herramienta,
no del proyecto).

### Paso 1 — Verificar los datos a mano (NO SALTAR ESTE PASO) ✅

Los números que hay ahora en `datos.json` salieron de prensa, no de las fuentes
primarias. **Este es hoy el mayor riesgo del proyecto**, más que cualquier cosa del
código.

Para cada organización:

1. Escribe el dominio a mano en el navegador (no des clic en enlaces).
2. Busca su sección de donaciones.
3. Copia el dato **desde ahí**.
4. Anota en `datos.json` la URL exacta y la fecha en que lo verificaste.
5. Marca el campo como `"oficial"`. Lo que no puedas confirmar, déjalo `"press"`
   o bórralo.

Media hora aburrida que ninguna automatización sustituye. El pipeline solo puede
mantener la exactitud que le des al arrancar.

Organizaciones verificadas el 11 ago 2026: ABACO (`abaco.org.co`) y Banco de
Alimentos de Bogotá (`bancodealimentos.org.co`) quedaron `"oficial"` — cuenta y
Bre-B de ABACO confirmadas en `donahoy.abaco.org.co`; la Bre-B de Banco de
Alimentos está publicada como **imagen**, se leyó a mano de ahí. Cruz Roja
Colombiana (`cruzrojacolombiana.org`) y Fundación PLAN (`plan.org.co`) **no**
tienen ningún dato de pago publicado como texto — sus portales son pasarelas de
pago / formularios con montos fijos, no cuentas estáticas — así que se quedaron
sin campo `pay` verificable, con una nota explicando por qué y enlazando al canal
real. Eso es correcto, no un pendiente: no existe nada que verificar todavía.

### Paso 2 — Aplicar la Regla 2 ✅

Quitar los números de cuenta de la vista. El directorio pasa a mostrar: nombre,
descripción, enlace oficial, y una etiqueta de si el dato está `"oficial, verificado"`
o `"reportado, sin confirmar"`. Los datos siguen en el JSON, solo dejan de
renderizarse.

*(Nota de una revisión real: en la primera versión del código, el directorio SÍ
mostraba el número en pantalla — un bug directo contra esta regla, encontrado al
hacer el Paso 1 a mano y corregido antes de publicar. Si vuelves a tocar la función
`pintar()`, revisa que ningún `<span class="v">` con el valor crudo se cuele de
nuevo.)*

### Paso 3 — Escribir las pruebas antes de tocar nada más ✅

Ver sección 6. `tests/run.js` corre 14 casos fijos + robustez + el fuzz estadístico
+ un caso específico de que una candidata de `pendientes.json` nunca dé azul.
Sin esto, cada cambio posterior es a ciegas.

### Paso 4 — Publicar ✅

Publicado en GitHub Pages: repo público `github.com/<tu-usuario>/verificador-donaciones-colombia`,
en vivo en **`adondevatuplata.com`** con HTTPS forzado (certificado emitido por
GitHub, renovación automática). El dominio se compró aparte (Namecheap) y se apuntó
por DNS (registros A a las IPs de GitHub Pages + CNAME `www`) en vez de usar el
subdominio `tu-usuario.github.io` — a propósito, para que la URL pública no lleve
el nombre de usuario de GitHub de quien la mantiene. El archivo `CNAME` en la raíz
del repo es lo que le dice a GitHub Pages cuál es el dominio.

### Paso 5 — Automatizar (sección 5 y 5b) ✅

`n8n/workflow.json` (verificación de pagos de las orgs conocidas) y
`n8n/workflow-descubrimiento.json` (descubrimiento de orgs nuevas vía prensa) están
importados en n8n Cloud, con sus credenciales (GitHub, Anthropic, healthchecks.io —
un UUID por workflow) configuradas, y **los dos quedaron activos** (Schedule Trigger
prendido) el 12 ago 2026, después de una corrida manual real de cada uno con
resultado revisado a mano.

*(Nota de una revisión real: la primera vez que se probaron dentro de n8n de verdad,
los tres nodos que leen el cuerpo de una respuesta HTTP como texto plano —
"Leer texto y calcular hash" en `workflow.json`, y "Expandir artículos candidatos" /
"Extraer texto del artículo" en `workflow-descubrimiento.json` — asumían que n8n
entrega ese texto en `resp.body`. Con `fullResponse:true` + `responseFormat:"text"`,
en realidad lo entrega en `resp.data`. El código escrito a ciegas contra la
documentación tenía ese supuesto mal, y como el error no revienta nada — simplemente
produce texto vacío en silencio — la primera corrida de `workflow.json` pasó como
"exitosa" sin haber leído la página real de ABACO. Se encontró al pedir captura del
Output real de un nodo en vez de seguir adivinando, se corrigió en los tres sitios,
y se volvió a correr cada flujo a mano para confirmar con evidencia real —no solo
"no truena"— que sí estaban leyendo contenido real antes de activar el Schedule
Trigger. Si algún día se agrega un nodo nuevo que lea una respuesta HTTP como texto,
revisa el nombre del campo contra el Output real de n8n, no contra lo que "debería"
llamarse.)*

### Paso 6 — Avisar a las organizaciones

Escríbele a la Cruz Roja y a ABACO por sus canales oficiales contándoles que existe.
Si alguna lo enlaza, pasa de ser una herramienta más en el ruido a un canal con
autoridad. Eso multiplica su alcance más que cualquier cosa que le agregues al
código. Ahora hay una URL propia y presentable para mandarles — antes de este paso
no la había.

---

## 5. La automatización (n8n)

### La idea en una frase

n8n revisa cada media hora los sitios oficiales, y cuando algo cambia, lo publica
solo — pero con tantos frenos que un error no puede llegar a producción.

### El flujo

```
Schedule Trigger (cada 30 min)
   ↓
HTTP Request       → sitios oficiales, con header If-None-Match
   ↓
HTML Extract       → texto de la sección de donaciones
   ↓
Code               → normalizar + SHA-256 del contenido
   ↓
Data Table         → comparar con el hash de la corrida anterior
   ↓
IF cambió ───── no ──→ actualizar solo verificado_el → commit
   │ sí
   ↓
Anthropic (Claude) → extraer JSON estructurado de los canales
   ↓
Code (CORROBORAR)  → cada dato debe aparecer literal en el HTML
   ↓
Code (FUSIBLE)     → abortar si el cambio es demasiado grande
   ↓
GitHub             → edit datos.json → commit → despliegue automático
   ↓
Healthcheck ping   → "seguimos vivos"
```

### El campo más importante que escribe n8n

No son las cuentas. Es `meta.verificado_el`, y se escribe **en cada corrida, haya
cambios o no**.

Ese timestamp alimenta el aviso arriba de la página. Si n8n corre bien, dice "al
día". Si el workflow se cae un martes a las 3 de la mañana, a las 24 horas la página
**empieza a advertirle sola a la gente** que no confíe en los datos. Es la pieza que
hace que el sistema falle de forma segura, y son diez líneas de código.

### El nodo de corroboración (Regla 3 en código)

```javascript
// Nodo Code, justo después de la extracción con IA.
// Si el modelo inventó, corrigió o "completó" un dígito, esto revienta.
const html = $('HTTP Request').first().json.data;
const limpio = s => String(s).replace(/[\s.\-]/g, '');
const htmlLimpio = limpio(html);

const inventados = items.filter(c => !htmlLimpio.includes(limpio(c.json.value)));
if (inventados.length) {
  throw new Error('Extracción inventó datos: ' + JSON.stringify(inventados));
}
return items;
```

La alucinación deja de ser un riesgo silencioso y pasa a ser un error de ejecución
ruidoso. Es la diferencia entre confiar en el modelo y verificarlo.

### El fusible

Antes del commit, abortar si:

- El cambio afectaría más del 30% de los datos de pago.
- El HTML descargado pesa mucho menos de lo normal (página caída, redirección,
  bloqueo por bot).
- Alguna URL respondió con un certificado inválido.

Si el fusible salta, no publica nada y el archivo se queda congelado — lo cual hace
que el aviso de frescura empiece a advertir solo a las 24 horas. El sistema falla
hacia *"desactualizado y honesto"*, nunca hacia *"actualizado con basura"*.

### El prompt de Claude, en modo notario

Usamos `claude-sonnet-5` — de sobra para copiar texto literal, y mucho más barato
que Opus para algo que corre cada 30 minutos. `thinking` va explícitamente
desactivado (`{"type": "disabled"}`): en este modelo no hace falta para una tarea
de copiar-literal, y sin eso el bloque de respuesta es solo texto, sin un bloque de
"pensamiento" por delante que descoloque el parseo. *(Nota técnica: en Claude Sonnet
5 el parámetro `temperature` ya no existe — mandarlo con cualquier valor que no sea
el que trae por defecto revienta la llamada con error 400. El determinismo real de
esta pieza no viene de la temperatura de todos modos: viene del nodo de
corroboración de abajo, que descarta cualquier cosa que no aparezca literal en el
HTML — eso es lo que de verdad evita que el modelo "invente".)* Salida JSON
estricta. Y esta instrucción explícita:

> Copia los números literalmente. No los completes, no los corrijas, no los
> reformatees. Si un dato está incompleto o ambiguo, devuelve `null` para ese campo.
> Nunca inventes un valor que no aparezca textualmente en el documento.

Un modelo "arreglando" un dígito que le pareció raro es exactamente el fallo que
esta herramienta existe para evitar.

### Procedencia obligatoria

Solo se auto-publica lo que venga del **dominio propio de la organización, por HTTPS
con certificado válido**. Prensa, redes sociales y agregadores nunca escriben en el
campo `pay`. Pueden alimentar el campo `desmentidos` (Regla 7), nada más.

### Tres cosas que te van a morder

**Datos publicados como imagen, no como texto.** Esto no es hipotético: la llave
Bre-B de Banco de Alimentos de Bogotá está publicada como PNG (`breB.png`), no como
texto — un `HTTP Request` + corroboración de texto nunca la va a poder leer, jamás,
sin importar cuánto mejores el scraper. Por eso `workflow.json` solo intenta
auto-verificar a ABACO (ver sección 5b): es la única organización cuyos datos de
pago están en texto plano hoy. Pruébalo a mano primero para cada organización nueva
antes de asumir que el texto está ahí — `donahoy.abaco.org.co` resultó ser HTML
normal (no una SPA, contra lo que se temía al principio), pero no asumas que la
siguiente organización también lo será.

**No martilles los servidores.** Están bajo carga real de gente buscando ayuda.
30–60 minutos es suficiente, y con `If-None-Match` la mayoría de corridas ni
descargan contenido.

**El fallo silencioso.** Si n8n muere, nadie te avisa. Usa healthchecks.io: n8n le
hace ping en cada corrida exitosa, y si deja de llegar, te manda un correo. Sin eso,
tu página se congela en silencio.

---

## 5b. El descubrimiento de organizaciones nuevas (n8n, segundo workflow)

### Por qué existe

El directorio solo cubre 4 organizaciones. Eso no significa que sean las únicas
legítimas — hay decenas de fundaciones, bancos de alimentos locales y campañas
reales que esta herramienta simplemente no conoce. `workflow-descubrimiento.json`
busca en prensa menciones de organizaciones que estén recibiendo donaciones, y las
deja en `pendientes.json` como candidatas.

**Esto es un pipeline de descubrimiento, no de verificación.** No corrobora que la
organización vaya a entregar el dinero — solo confirma que de verdad la menciona
un artículo real, no que Claude se la inventó.

### La frontera que nunca cruza

`pendientes.json` es un archivo aparte de `datos.json`, y el workflow **nunca
escribe en `datos.json`**. Una candidata entra con `"estado": "candidata_sin_revisar"`
y ahí se queda hasta que un humano la promueve a mano. Promoverla significa repetir
el Paso 1 exacto — visitar el dominio a mano, verificar el dato de pago carácter por
carácter — y solo entonces copiarla a `datos.json`. Nunca se copia `pendientes.json`
a `datos.json` directamente, ni con un script, ni "total ya está corroborado el
nombre". El nombre corroborado no es lo mismo que el dato de pago corroborado.

Esto es la Regla 5 (cuarentena) llevada un nivel más arriba: no es un campo de una
organización conocida esperando confirmación, es la organización *entera* la que
espera. `index.html` sabe leer `pendientes.json` y, si alguien pega el dominio de
una candidata, le muestra una nota neutral ("la detectamos en prensa, no la hemos
verificado") — pero esa nota vive en `notes`, nunca en `hits`, así que **no puede
producir azul bajo ninguna circunstancia**. Revísalo en `analyze()` si alguna vez
tocas esa función: si una candidata pendiente empieza a poder dar azul, es un bug
de la columna dañina de la Regla 6.

### De dónde saca las candidatas

RUES (el registro de entidades sin ánimo de lucro de Colombia) es una aplicación de
una sola página — no se puede raspar sin navegador headless, así que no se usa.
En su lugar, el workflow busca en el RSS de Google Noticias (sin necesidad de login
ni API key), sigue el enlace de cada artículo, y le pide a Claude que extraiga el
nombre y el dominio de cualquier organización mencionada — con la misma disciplina
de la Regla 3: el dato tiene que aparecer literal en el texto real del artículo
descargado, o se descarta.

### Frecuencia y límites

Corre una vez por semana (los lunes), no cada 30 minutos — el panorama de ONG
colombianas no cambia tan rápido como una cuenta bancaria. Por corrida se limita a
15 artículos, para no gastar de más en llamadas a Claude ni martillar sitios de
prensa. Tiene su propio ping a healthchecks.io, con un UUID distinto al del
workflow de pagos, para poder distinguir cuál de los dos se cayó.

---

## 6. Errores: el catálogo completo

Esta es la sección que más importa. La forma de trabajar es: **por cada fallo
imaginable, decidir de antemano dónde cae**.

| Qué puede fallar | Dónde cae hoy | Cómo se garantiza |
|---|---|---|
| El scraper no encuentra la página | Inútil | Fusible + banner de frescura |
| Claude alucina un dígito | Inútil | Nodo de corroboración: revienta |
| Una organización cambia su cuenta y no nos enteramos | Inútil | Falso amarillo, no falso azul |
| Guardamos una cuenta mal escrita | Inútil | Regla 2: no se muestra, solo se compara |
| n8n muere | Inútil | Healthcheck + banner a las 24h |
| Una cuenta nueva es falsa | Inútil | Cuarentena: no da azul hasta corroborar |
| Marcamos de rojo una campaña honesta | **Dañino** | Casos de prueba específicos |
| Damos azul a un estafador | **Dañino** | Solo coincidencia exacta con dato verificado a mano |

Las dos últimas filas son las que hay que vigilar de verdad.

### El error que casi nadie ve venir

No es el falso verde. Es **acusar a gente honesta**. Si la herramienta empieza a
pintar de rojo campañas reales de barrio, la gente deja de creerle y vuelve a las
cadenas de WhatsApp — que es peor que si la herramienta no existiera. Por eso el
amarillo tiene que sonar neutral, no acusatorio.

### Los archivos de prueba

`tests/casos.json`, con entrada → veredicto esperado. Corren en cada cambio:

- Cuenta oficial exacta → **azul**
- Cuenta oficial con un dígito cambiado → **rojo, con diff visible**
- Dominio oficial → **azul**
- `cruzroja-donaciones.co` → **rojo**
- NIT con dígito de verificación inválido → **rojo**
- NIT `900326456-1` → **válido**
- Campaña de barrio legítima y desconocida → **amarillo, nunca rojo**
- Texto vacío / solo emojis / un PDF pegado / 50.000 caracteres → **no revienta**
- 20.000 números aleatorios → **menos de 0,05% de falsas alarmas**

Ese último es una prueba estadística, no un caso fijo: si tocas los umbrales de
Levenshtein, vuelve a correrla.

### Los dos fallos silenciosos

Un falso verde nunca se queja. Hacen falta dos cosas para enterarse:

1. Un botón visible de **"reportar un error en este dato"** con destino que revises
   a diario.
2. El healthcheck (arriba).

### Y decirlo en la interfaz

Junto al veredicto azul, siempre: *"coincide con lo publicado en [sitio], revisado
hace X horas — confírmalo ahí antes de transferir"*, con el enlace. Un usuario que
verifica en la fuente es la última red de seguridad, y es la única que no depende de
que nuestro código esté bien.

---

## 7. Diccionario

**Hash (SHA-256):** una huella digital de un texto. Si el texto cambia aunque sea
una coma, la huella cambia por completo. Sirve para detectar cambios sin guardar el
contenido entero.

**Distancia de Levenshtein:** cuántos cambios de un carácter hacen falta para
convertir una palabra en otra. Es lo que detecta las cuentas casi idénticas.

**Fail-safe:** que cuando algo se rompe, se rompa hacia el lado seguro. Un ascensor
que se queda quieto al fallar, no que se cae.

**Dead man's switch:** un aviso que salta cuando algo *deja* de pasar. Aquí: si n8n
deja de reportar que está vivo, te llega un correo.

**Cuarentena:** un dato nuevo espera confirmación antes de tener autoridad plena.

**Fusible:** un tope que corta el proceso si el cambio es sospechosamente grande.

**Webhook:** una URL que, cuando alguien la visita, dispara un proceso.

**SPA (single-page application):** una web cuyo contenido lo dibuja JavaScript
después de cargar. Un scraper simple ve la página vacía.

---

## 8. Fuera de alcance

No construimos, aunque parezca buena idea:

- Listas de víctimas o desaparecidos (Regla 7).
- Listas públicas de cuentas fraudulentas (Regla 7).
- Recaudo propio de dinero. Si en algún momento queremos vender algo para recaudar,
  se acuerda con una fundación ya registrada que las ventas van directo a su cuenta;
  nosotros no tocamos los fondos.
- Emparejamiento de ofertas de alojamiento o transporte. Tiene riesgos de seguridad
  física que no sabemos gestionar.
- Cualquier veredicto generado por un modelo de lenguaje.

---

## 9. Cómo quiero que trabajes conmigo (instrucciones para Claude Code)

- Antes de cambiar lógica del comparador, corre las pruebas. Después, córrelas otra
  vez. Si alguna falla, no sigas.
- Si te pido algo que rompe una de las siete reglas, dímelo antes de hacerlo.
- Prefiero código aburrido y legible sobre código listo. Cualquier persona debe
  poder auditar este archivo sin conocer el proyecto.
- Cuando añadas una heurística nueva, añade también su caso de prueba y mide su tasa
  de falsas alarmas. Una heurística sin medir es una opinión.
- Explícame los cambios en español sencillo, no en jerga.
- Si algo que te pido tiene un riesgo que no he visto, prefiero que me frenes a que
  me complazcas. Aquí un error le cuesta dinero a alguien que acaba de perder su
  casa.

---

*Última actualización de este documento: 11 de agosto de 2026 (Pasos 0–4 marcados
como hechos, sección 3 con el buscador de acopio, 5b con el descubrimiento de
organizaciones, "tres cosas que te van a morder" corregida con el hallazgo real de
Banco de Alimentos).*
