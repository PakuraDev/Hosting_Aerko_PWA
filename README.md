<div align="center">
  <h1>Aerko_</h1>
</div>

<div align="center">
  <img src="icon-512.png" alt="Logo de Aerko_" width="256">

 La aplicación web de fitness más avanzada de la historia.
</div>

---

Aerko_ es una aplicación web instalable nativamente como pwa que combina nutrición, entrenamiento y progreso avanzada con enfoque obsesivo a la privacidad local, rendimiento y usabilidad, todo con el unico objetivo de devolverle el respeto a los usuarios en un mercado lleno de simples CRUDs con suscripción mensual. Voy a hablar de todo esto en profundidad siguiendo el siquiente orden: 

### Índice
* [1. Filosofía de Diseño y UX](#1-filosofía-de-diseño-y-ux)
* [2. Funciones Principales](#2-funciones-principales)
* [3. Lenguajes y Personalidades](#3-lenguajes-y-personalidades)
* [4. Privacidad y Seguridad](#4-privacidad-y-seguridad)
* [5. Instalación y Uso (PWA)](#5-instalación-y-uso-pwa)
* [6. Arquitectura y Stack Tecnológico](#6-arquitectura-y-stack-tecnológico)
* [7. El Papel de la IA en el Desarrollo](#7-el-papel-de-la-ia-en-el-desarrollo)
* [8. Roadmap](#8-roadmap)
* [9. Agradecimientos y Créditos](#9-agradecimientos-y-créditos)

---

## 1. Filosofía de Diseño y UX

> **Aviso de mucho texto:** Como diseñador de producto, me voy a poner muy pesado por si queréis saltaros esta parte. Voy a usar términos y leyes de diseño que presupondré que conocéis perfectamente. Avisados quedáis y musho betis.

### Las Bases:
Para hacer la app no me dije: *"Oye, ¿qué me hace falta para entrenar?"*. De hecho, la realidad es más triste: empezó como mi TFM (Trabajo Fin de Máster). Pero, ¿pcor qué digo esto? Pues porque me voy por las ramas. Las bases del proyecto siguen un **Design Thinking** con metodología de **doble diamante** (adiós al 90% de las personas que estabais leyendo, os comprendo por pasar de largo) que realicé no solo buscando información para la netnografía, sino interactuando con la propia comunidad en Reddit. 

Desde publicaciones creadas específicamente para resolver preguntas iniciales o recopilar datos, hasta encuestas y pruebas de usabilidad *(tristemente solo he conseguido 2 miembros en Reddit, así que uníos a la comunidad. Gracias)*. Especifico esto para que sepáis que no he hecho lo que me ha salido de los huevos (que en parte sí, xd), sino que he construido una herramienta con funciones propuestas por la comunidad que realmente pienso que puede ser útil. Pero dejo de escribir tonterías y empezamos a hablar de lo que nos mola: lo visual.

### UI: 
Para la interfaz he usado una combinación entre **brutalismo** (o neo-brutalismo, depende de cómo lo veamos), utilitarismo y, finalmente, una **estética cyberpunk/terminal/IDE** que me encanta. Soy plenamente consciente de que la UI no le va a gustar a todo el mundo (específicamente a los *casuals* que llevan 3 días en el gym), pero aquí el diseñador soy yo >:)

* **Paleta de Colores (60-30-10):** 
    * ⬛ **Negro Suave** (`#1A1A1A`) - Fondo dominante.
    * ⬜ **Blanco** (`#FFFFFF`) - Texto y contrastes.
    * 🟩 **Verde Ácido** (`#CCFF00`) - Acento. 
    *(Cada uno con un color extra para el `hover`. Y sí, hice hovers en un proyecto mobile-first, no porque sea gilipollas (que también), sino porque tengo pensado hacer pantallas y funciones especiales para PC. Guardad los tomates).*
    
* **Tipografía y Jerarquía:** El amor de mi vida, **JetBrains Mono**, combinada con **Clash Display**. Como por motivos legales no podía meter los archivos de Clash Display en el repositorio, he metido de *fallback* **Space Grotesk**. Estas tipografías no solo evitan que os canséis de leer numeritos, sino que formalizan la propia jerarquía usando la **cuarta perfecta** como escala.

* **Contraste y Velocidad:** Este estilo tiene un contraste brutal tanto en gimnasios con mucha luz como en sótanos oscuros. Además, impone criterio (por si queréis presumir de que vuestro 1RM son 1521kg y que os crean, yo ya lo he hecho y no me creen, pero casi). Además, la sensación de velocidad extrema es algo que sinceramente me da mucha satisfacción.

### UX: 
Aquí vamos con la parte que más me gusta, **la app está hecha a prueba de tontos**. Exageraciones, bromas y ego aparte, la app intimida visualmente, pero esconde todos los cálculos difíciles detrás de funciones extremadamente sencillas (hasta el punto de que mis padres saben usar los módulos de nutrición y progreso). La única excepción es el entrenamiento debido a los términos científicos, pero una vez los conoces, vuelve a ser un paseo. Todo ha sido fríamente calculado por mi mente esquizofrénica basándome en los 5 componentes de usabilidad de Jakob Nielsen (que claramente conocéis), priorizando de forma absoluta la **Eficiencia**. 

* **Diseño para el Pulgar:** Como tengo las manos pequeñas, he usado mi propio pulgar como referencia. Si yo llego, tú llegas (ley de vida estudiada por la universidad de Harvard).

* **Teclado Personalizado Anti-Tembleque:** Diseñado para cuando acabas mareado después de una serie pesada de sentadillas *(porque hacéis pierna, ¿verdad?)*. Los botones son enormes (incluso diría que son gigantescos... Por si no lo pilláis, estoy haciendo una broma insinuando que mi miembro es del tamaño del botón. Sí, podéis reportarme) y llevan lógica *anti-tembleque* para evitar que pulses el mismo número dos veces en cuestión de milisegundos. A esto se le suman botones de otras secciones con padding exagerado para facilitar el alcance.

* **El Sacrificio de MediaPipe:** Una decisión por la que me vais a crucificar: MediaPipe solo funciona con grabaciones, no en directo. Esto no es por capricho sino para poder meter la optimización de la que hablaré más adelante con mucho orgullo y **no fundirte la batería fuera de casa**, y sí, esta decisión era estrictamente necesaria.

Pero dejemos de hablar de tonterías como esas que podeís entender fácilmente, vamos a la teoría. Como dije antes, se prioriza la eficiencia en toda la app. Podríamos definir la filosofía de la app como esforzarte una vez, y disfrutar el resto del tiempo.

* **Dieta y Rutina:** Haces tu dieta una vez, y hasta que no la cambies solo tienes que pulsar 3 botones al día (6 si pesas la comida xd). Con la rutina pasa igual.

* **Datos Transversales (El Iniesta de la app):** Todo está conectado. Si registras tu peso, la dieta se recalcula sola. Si registras una serie, la app te sugiere el peso óptimo para la siguiente sesión según el objetivo de tu mesociclo. Si fallas o acumulas fatiga, la app ajusta el peso basándose en tu historial y objetivos (mesociclos). 

(Y creo que voy a parar aquí antes de escribir una tesis explicando la Ley de Fitts, que ya sé que no os importa).

---

## 2. Funciones Principales

Bien, esta parte es muy larga, y no os voy a mentir, me da una pereza que no os podéis imaginar. Dicho esto, simplemente voy a hacer una lista cutre (bueno, al final he decidido meter emojis para que nos os quejéis, que amable soy) hasta que llegue alguna función de la que quiera presumir.

### 🍎 Nutrición

* **Wizard y calculadoras:**
    * **Cálculo científico base:** Si sois una persona normal y os da pereza calcular los macros, tranquilos, la app, a través de un wizard muy sencillo, recopila vuestros datos (esto ha sonado fatal) y usa la fórmula de Harris-Benedict (la de 1984, que como ya sabréis si leéis el código, soy muy retro) para calcular las calorías con un intervalo idóneo para que no os matéis a llegar a una cifra exacta (lo cual es estúpido). Los macros se calculan usando ratios científicos de una tal entidad llamada ISSN; a lo mejor os la habéis encontrado comprando el pan algún día.
    * **Modo Dios:** ¿Que mi wizard, la fórmula de Harris-Benedict o incluso mi app os da asco? Pues tranquilos, porque os dejo poner las calorías y macros a mano.
    * **Recálculo reactivo:** Si habéis hecho la dieta mediante wizard y registráis un nuevo peso corporal en el módulo de progreso, la dieta se recalcula sola. Si estáis en Modo Dios lo hacéis vosotros manualmente, por chulos.

* **La despensa (esperemos que llena):**
    * **Base de datos híbrida y escáner de código de barras:** Gracias a BEDCA, USDA y Open Food Facts (sin contar, claro está, mi esfuerzo por recopilar manualmente los alimentos y crear el `.json`) tenéis acceso a una base de datos local de, si no recuerdo mal, +340 alimentos. Igualmente, no os hará falta dado que tenemos la integración nativa de la API de OFF para leer códigos de barras y poner los alimentos automáticamente, sin que tengáis que escribir mucho.
    * **Gestión de grupos:** Además, todos sabemos que una comida no es "pechuga de pollo" y ya, un serranito lleva más cosas. Por eso, lo podéis combinar en un grupo para que no os explote la cabeza marcando 4 alimentos al mismo tiempo. 

* **Diseño modular y Smart Checks:**
    * **Dietas bases y notificaciones:** Inspirado directamente en los componentes madre de Figma y la ley de Pareto. Todas las personas comemos lo mismo, pero no exactamente lo mismo; por eso podéis configurar los alimentos que comáis normalmente, las comidas y el gramaje de cada alimento. Dicho esto, las comidas también tienen capacidad de enviar notificaciones vía *Notification Triggers API*, que viendo el nombre ya puedo adivinar que en iOS no funciona. Igualmente, no lo he probado, así que puede que en Android tampoco funcione. Muy profesional, lo sé.
    * **Gramajes fijos y variables:** Un alimento (independientemente de si es individual o miembro de un grupo) puede estar configurado como fijo (ej: siempre como 600g de pechuga de pollo), o variable. ¿Y qué es variable? Pues que cada día pones tú la cantidad.
    * **Flujo de fricción cero:** Tal cual. Una pantalla con un acordeón por comida, para que puedas marcar rápidamente los alimentos que has configurado anteriormente en velocidad récord (comparado con otras apps que te hacen buscar el alimento todos los días como si fueras...). Y ya está. 
    * **Dashboard visual:** Qué pereza añadir esto. Pues sí, una barra de progreso que cambia visualmente para indicar la cantidad de kcals. Esta cambia a una versión más amigable en el modo Zen. Además, también hay 3 barras lite para los macros.

### 🏋️ Entrenamiento 

* **Smart Flow y progresión:**
    * **Flujo con descansos nativos y ajustables:** Para que no tengáis que salir de la app, el flujo es tan simple como crear una rutina, empezar la dieta, ir haciendo los ejercicios, y poco más. En el descanso de cada ejercicio apuntas los datos, tienes cronómetro, te avisa si has hecho PR (según e1RM), y más (la forma más cutre de decir que no quiero escribir más).
    * **Motor de recomendación:** Pues sí, si configuras los mesociclos (tranquilos, solo es darle a dos botones, literalmente) la app aprende de ti. Ve qué tipo de series haces (planas o pirámide invertida), patrones de fatiga (dicho de forma clara, si la semana pasada bajaste de peso), y la siguiente vez que hagas ese ejercicio te recomienda el peso. Lo que se hace para no pensar, eh.

* **Análisis de volumen:**
    * **Volumen semanal científico (semáforos):** Cruza tus series efectivas (porque sí, es capaz de detectar calentamientos) con una base de datos anatómica maestra ("maestra" es la forma más bonita de marketing que he encontrado para no decir que pueden ser tan inexactas como las ecuaciones resueltas por un niño de primero de la ESO) que te dice exactamente en qué umbral estás para cada músculo (MV, MEV, MAV o MRV).
    * **Detector de Desequilibrios:** Nuevamente esto puede fallar por la base de datos, pero suponiendo que no pase porque le he puesto mucho amor, analiza el porcentaje de volumen que se lleva cada cabeza muscular, de forma que si notas que eres un gorila que no entrena gemelos, te lo va a decir para que lo corrijas. 

* **Planificación modular y calculadoras:**
    * Pues igual que antes, aquí simplemente creas la rutina con los ejercicios y ya. Puedes crear los ejercicios manualmente y poco más que me apetezca escribir.
    * **Calculadora 1RM adaptativa:** Una obra de arte. Usa la fórmula de Brzycki para menos de 5 repes, Epley para 6-10 repes, y Lombardi para el resto. 

#### 🦾 MediaPipe (La Joya de la Corona)
Aquí sí me voy a parar que es de lo que más orgulloso estoy. Grabas tus series de Sentadilla, Press Banca o Peso Muerto, y si lo has grabado bien, el modelo te da una puntuación del 0 al 100 realista. Ojo, digo *bien*, porque MediaPipe (en especial, muy en especial, y sobre todo el modelo Lite) no hace magia. Si para press banca te grabas de forma lateral no va a salir bien, y si para sentadilla te grabas frontalmente, MediaPipe va a dar volteretas. 

Pero como sé que sois unos cracks sé que lo haréis bien, y que, dependiendo del ejercicio, os medirá varias cosas, como el ROM, ángulos, *sticking points*, trayectoria de la barra, estabilidad del antebrazo, bloqueo, tempo, etc... 

Pero ojo, no he venido a decir esa mierda, sino a contar el orgasmo mental que tuve al hacer la optimización. Lo primero y más lógico es meter a MediaPipe dentro de un Web Worker para no congelar la pantalla, pero claro, ¿MediaPipe considera eso una posibilidad? Pues no, exige interactuar con el DOM. Así que para engañar al modelo (que aprenda su lugar) simplemente **construí un DOM fantasma**, y ea, domado. 

Pero aquí no acaba la cosa, porque si solo fuera eso no estaría escribiendo esto. Procesar un vídeo a 1080p 60fps es innecesario (el propio modelo reduce la resolución), por lo que, para quitar carga al modelo y mejorar la velocidad sin matar al procesador, hice una lógica similar a cómo funciona el Ping-Pong. Lo primero, el vídeo se reduce a 720p o 480p, no me acuerdo ahora, y se reduce la cantidad de fotogramas a 15-30fps mediante un controlador de tráfico que envía un fotograma, y espera al `"FRAME_DONE"` para enviar el siguiente. 

Posteriormente, para no poner un vídeo a 15fps, se interpolan los puntos matemáticamente (culpables del lag que veréis analizando vídeos, pero tranquilos porque solo afecta visualmente y no a los cálculos) y se le aplica un filtro EMA para suavizar las coordenadas entre fotogramas. ¿Qué significa esto? Que si el vídeo es bueno, la diferencia entre *Full* y *Heavy* es perceptible, pero muy poco. 

Pondría un benchmark, porque sí, lo probé con los 3 modelos, pero paso. Simplemente os digo las diferencias: si consideramos que *Heavy* es 100% exacto, *Full* es entre un 87% y un 94% exacto, mientras que *Lite*... Bueno, 59-71%. Todo esto basado en analizar el mismo vídeo 5 veces en cada modelo. Y aquí se acaba esta maravilla.

### 📈 Progreso

* **Sistema anti-obsesión:** Bastante triste que tenga que presumir de esto, pero sí, la app tiene *cooldown dinámico* (20 horas para modos Default y Tsundere, 1 semana para Zen) a la hora de registrar pesos. Esto es para evitar que los usuarios desarrollen el síndrome de *"¿Por qué he subido de peso si no he comido?"* y similares. 
* **Entrada de datos:** Se permite la entrada de datos a nivel de biometría básica (peso, altura, porcentaje de grasa, foto), medidas perimetrales y pliegues cutáneos. Todo esto dentro de la app de forma local. 
* **Calculadora de grasa científica:** Si usas un plicómetro, no tienes que hacer matemáticas. La app coge los pliegues que hayas metido (los puedes meter en el momento también) y, usando la fórmula de Jackson-Pollock 3/7, te calcula la densidad corporal junto a la ecuación de Siri. 
* **Dashboard visual:** Con todo el respeto, me da muchísima pereza escribir esto. Hay muchas gráficas y un *Wrapped* hecho de mala gana. Ya está.

### ⚙️ Sistema

* **Modos:** Hay 3 modos, cada uno con sus cosas.
* **Easter Eggs:** Comentarios internos en el código que hablan sobre mi vida personal, amorosa y más cosas, por si queréis cotillear. 
* **Datos transversales:** Esto ya lo expliqué antes con el ejemplo de la dieta (El Iniesta de la app).
* **Migración universal:** Puedes importar datos de Hevy, Strong, Lifta, Apple Health, Google Fit o Samsung Health (y obviamente de Aerko_) con *parsers* que se supone que son capaces de inyectarlos sin problema... aunque quién sabe, a lo mejor explotan. 
* **Privacidad y seguridad:** Lo que más pesadillas me ha dado por culpa de una secuencia de bugs randoms. Básicamente toda la app vive en IndexedDB, pero con la posibilidad de protegerla con criptografía pesada (`AES-GCM`). Básicamente usa la API nativa `window.crypto.subtle` con derivación de claves (`PBKDF2`), de forma que tu PIN de 4 dígitos pasa por 100,000 iteraciones matemáticas combinadas con una *salt* única generada en tu dispositivo. También hay un sistema de *auth canary* para verificar que el PIN es correcto sin exponer datos reales.
* **Aislamiento en RAM:** Como no soy idiota, no guardo la llave maestra en el disco duro, solo existe en la memoria volátil (RAM para los amigos) mientras tienes la sesión abierta.  
* **Pérdida de datos:** Eso sí, si os olvidáis el PIN, salvo que seáis aficionados de la fuerza bruta, os va a costar un pelín demasiado recuperar los datos. 
* **Exportación:** Puedes exportar todo lo que hayas hecho en un archivo `.json`. Si tenéis la encriptación activada, se desencriptan en la RAM para mantener la base de datos local blindada. Y recordad: si una app os pone *vendor-lock*, quemadla. 
* *No me acuerdo de más, pero estoy seguro de que hay algo más.*

---

## 3. Lenguajes y Personalidades

Obviamente, hacer una app y traducirla no es suficiente, eso es para *normies*. Yo además hice modos en los que no solo cambia el comportamiento de la app, sino también cómo te habla. En este caso, el modo Default está traducido al español (nativo), inglés, portugués, alemán y francés (estos últimos mediante IA). 

Pero antes de seguir, hablemos de las personalidades. Básicamente hay 3 modos:

* **Default:** Clásico, aburrido, directo.
* **Zen:** Diseñado específicamente para experiencias amables y evitar TCAs. Textos comprensivos, sin presiones y sin penalizaciones visuales.
* **Tsundere:** Realmente "Tsundere" es publicidad engañosa, pero si le pongo el nombre que debería, puede que me llegue una denuncia antes de lo previsto. Básicamente: hostilidad máxima, humor negro y humillación constante, te la merezcas o no. 

Eso sí, el motor (`i18n.service.js`) es inteligente por varios motivos que os voy a comentar con poca energía:

* **Carga dinámica:** Para no cargar todos los textos de todos los idiomas de todos los modos de todas las pantallas de golpe, la app solo importa el fragmento de texto de la pantalla exacta que el usuario está viendo en ese momento. 
* **Fallback inteligente y compatibilidad entre modos:** Aquí hay algo importante, y es que siempre carga primero el archivo base (Default) y luego intenta cargar el del modo específico. ¿Qué significa esto? Que podéis usar el modo Zen en inglés (por ejemplo) para aprovechar sus ventajas de UX y reglas de progreso, pero al no estar traducido, el sistema no se rompe: simplemente os mostrará los textos del modo Default. 

Podría seguir presumiendo de más cosas, como el sistema de colección de insultos aleatorios para el modo Tsundere, pero voy a dar las malas noticias: **los modos Tsundere y Zen no están traducidos al resto de idiomas** (solo en español). 

Lo siento muchísimo, pero comprendedme: si traduzco el humor negro o los chistes de gimnasio con una IA genérica, puede sacar barbaridades sin contexto que solo habrían hecho quedar mal a la app, hacerme perder el tiempo y encima para nada (ya que la app soporta los modos sin romper el texto gracias al fallback). Si queréis contribuir con el proyecto, esta es la mejor forma, la verdad.

---

## 4. Privacidad y Seguridad

Esto ya lo he explicado en parte, pero bueno, ¿vamos con más, no? Vamos poco a poco y con poca energía nuevamente porque podéis creerme que hacer READMEs de GitHub no es precisamente mi actividad favorita los domingos (soy más de hacerle fotos a gorriones con mi cámara, pero bueno, eso ya es demasiada información):

* **Offline-first y cero nube:** La app no tiene backend (y menos mal, porque como encima tenga que pagar un servidor, ni recopilando datos salen las cuentas). Absolutamente todo vive en el navegador a través de `IndexedDB`. Ahora bien, esto ya lo sabéis, vamos a hablar de la seguridad.
* **Criptografía nativa (Grado militar):** ¿Cómo os habéis quedado? Ese "Grado militar" es una clara *power word* que hace que ahora me veáis inteligente, ¿eh? Perdón por el delirio. Como expliqué antes, implementé la Web Crypto API nativa del navegador para usar el estándar de la industria `AES-GCM` de 256 bits.
* **Derivación de claves (`PBKDF2`):** Un simple PIN de 4 dígitos no es seguro *per se*, y por eso mismo el PIN pasa por el algoritmo `PBKDF2` con 100.000 iteraciones, y se combina con una *salt* generada aleatoriamente (como soy un pedante, ya lo digo: no es aleatorio, la aleatoriedad pura no existe en ordenadores. De nada) por vuestro móvil para crear una llave maestra. 
* **Aislamiento volátil (RAM):** Si es que esto ya lo expliqué antes, no sé qué hago. Básicamente, la llave solo existe en la RAM. Cuando cierras la pestaña la llave hace `rm -- "$0"` (por si no lo pilláis, eso hace que un script se borre a sí mismo después de ejecutarse, creo).
* **El canario:** Para comprobar que el PIN es correcto sin exponer datos reales, la app intenta descifrar un pequeño paquete que contiene el texto `'AERKO_SECURE'` (mala mía por no haber puesto un troleo fácil). 
* **Bóvedas segmentadas:** Todos los datos están divididos en bóvedas que se pueden encriptar (`user_vault`, `nutrition_vault`, `training_vault` y `progress_vault`) y un `public_store` para meter datos de configuración. 

Y ya está, menos mal porque vaya coñazo repetir lo mismo, que parece esto una presentación de biología.

---

## 5. Instalación y Uso (PWA)

Aerko_ es una aplicación web, pero no me jodáis, usarla desde el navegador es un insulto cuando está diseñada desde cero para ser una PWA nativa. Está pensada para vivir en vuestras pantallas de inicio (le guste o no a Tim Cook), ejecutarse a pantalla completa y funcionar 100% offline. 

### Android
Si la queréis instalar en Android podéis hacerlo desde los ajustes de la app (he puesto el botón), o si tenéis prisa, al entrar simplemente le dais a los **3 puntos** (menú del navegador) > **Añadir a pantalla de inicio** > **Instalar**. 

### El drama de iOS
Si la queréis instalar desde iOS... Bueno, vosotros sí os tenéis que comer los pasos manuales. Si leéis el código veréis que no me limité a hacer una simple pantalla con la explicación. Pero bueno, si no me equivoco, los pasos son:

1. Abrir la web desde **Safari** (obligatorio, cosas de Apple).
2. Tocar el botón de **Compartir** (el cuadradito con la flecha hacia arriba).
3. Seleccionar **Añadir a la pantalla de inicio**.

---

## 6. Arquitectura y Stack Tecnológico

Si esperabais entrar y encontraros con un `package.json` con 400 dependencias, una carpeta de `node_modules` o algo así, por favor, decid "musho betis" como disculpa. Odio la mayoría de frameworks; como mucho diría que me gusta Astro, pero no creo que en este caso haya sido siquiera posible usarlo. Podría criticar React, Angular u otros, pero ¿quién soy yo para hacerlo? En cualquier caso, he elegido el camino "difícil" (luego entenderéis por qué entre comillas) porque es el camino óptimo. 

### Stack
* **Vanilla JS:** Pongo "Vanilla", pero creo que el hecho de usar librerías ya hace que no sea Vanilla. Si es así, disculpadme, insultadme o reportadme, me lo merezco. 
* **Web Components Nativos:** Toda la interfaz modular se ha construido extendiendo la clase `HTMLElement` y usando la API nativa `customElements.define`. He usado una mezcla de Shadow DOM y Light DOM que, si os soy sincero, ni yo la entiendo, pero seguro que si le preguntáis a una IA os dice que tiene alguna clase de sentido (o eso espero). 
* **Base de datos nativa:** Pues sí, otra vez menciono que uso `IndexedDB`, pero aquí aclaro que he usado un *wrapper* asíncrono propio para no ahorcarme gestionando promesas. 
* **CSS Puro:** Obviamente, nada de Tailwind, Bootstrap o esas cosas raras. Archivos CSS nativos usando variables. 

### Librerías Clave
Solo las imprescindibles, y por favor, que nadie me diga que "podía haberlas escrito yo mismo".
* **MediaPipe Vision (`vision_bundle.js`):** La obra de arte de *computer vision* de Google (que no se note que estoy imitando a un lameculos), secuestrada y hackeada con éxito.
* **Chart.js:** Hubiese preferido poner un meme a escribir una librería en canvas para trazar radares biomecánicos y gráficas de doble eje desde cero. Lo siento, supongo. 
* **HTML5-QRCode:** Sí, sé que hay una API nativa para leer códigos de barras, pero nuevamente, no creo que sea muy compatible con iOS hasta 2034.
* **JSZip:** Fundamental para el sistema de importación sin obligar al usuario a descomprimir los archivos `.zip` manualmente.
* **SortableJS:** No soy Newton, así que con esto inyecto las físicas y leyes de la termodinámica del *drag & drop*.

---

## 7. El Papel de la IA en el Desarrollo

Ahora vais a entender las comillas en "difícil" por el gran papel que ha tenido la IA en este proyecto. Ya habéis leído lo de las traducciones del modo Default, pero vamos a ver en qué más. Eso sí, vamos a empezar por lo que es 100% humano para que no abandonéis el repo aquí:

### Lo 100% Humano
* **Design Thinking, UX y UI:** La investigación previa, el diseño, la heurística, la lógica y funciones, la estructuración de la información y un largo etc. nacieron puramente de mi cabeza, de la investigación del Design Thinking y de Figma. 
* **Arquitectura y Decisiones Técnicas:** La negativa rotunda a usar frameworks, el uso de `IndexedDB` (porque encima Gemini me recomendó usar SQLite compilado en WASM y dije que no), la optimización y un largo etcétera de decisiones arquitectónicas. 
* **Copywriting y Personalidades:** Las más de 1000 líneas de insultos, sarcasmos, humillaciones y líneas genéricas en español que casi me hacen romper el teclado (de hecho, la tecla "A" ya me suena raro), todo escrito por mí y sacado de mi cabeza. 

### El Código (La Magia de la IA)
Ahora vamos con el código, para el cual usé **Gemini 3.0 Pro** desde el inicio hasta aproximadamente la mitad del módulo de entrenamiento. Posteriormente salió **Gemini 3.1 Pro** y se ocupó desde MediaPipe hasta el final. 

Ahora bien, ¿cuánto código fue generado? Pues aproximadamente un **85-90% del código ha sido picado por IA**. Lo que menos he escrito yo ha sido el JS, dado que Gemini ha hecho un trabajo sorprendentemente bueno (también es verdad que las explicaciones que le daba eran bastante claras). Lo que más he tenido que tocar a mano ha sido el CSS. Todo es cierto: Gemini no tiene acceso a Figma ni a mis medidas y, por mucho que se las pase en texto, no las pilla del todo. 

**La supervisión ha sido extrema.** No utilicé prompts del tipo: *"Oye, continúa mi app. Gracias guapo <3"* (ojalá), sino que se le explicó de forma modular exactamente qué tenía que hacer a nivel técnico, y el propio modelo lo desarrolló. Por otro lado, puedo dar fe de que he leído y revisado casi todo el código, salvo un *fix* al final de la app que bueno... si funciona, no lo toques. 

Recordemos que soy, de primera profesión, Diseñador de Producto. La IA ha sido la gran culpable de que no haya tenido que gastar miles de euros en contratar a un equipo de desarrollo, ni me haya tirado 2 años picando código a mano (de hecho, me ha salido gratis gracias a Google One Students, aunque a nivel mental creo que he salido herido).

---

## 8. Roadmap (O lo que me gustaría hacer si tuviera tiempo)

Os adelanto algo: quiero desechar este código. Estoy traumado con él. Lo máximo que quiero hacer ahora mismo es arreglar bugs (de eso me responsabilizo hasta 2027), pero para la siguiente versión es un 99% probable que rehaga el código desde cero, pero mejor. 

Seguramente esperaré a que salga Gemini 3.2 o 3.3 Pro. Bueno, más que a que salga un modelo, esperaré a tener el dinero suficiente para poder estar 7 semanas desarrollando a tiempo completo, porque después de esta app empiezo a trabajar 💀

Pero bueno, ¿qué quiero meter en un futuro?

### Nutrición
* **Filtros en el buscador de alimentos:** El `.json` ya está preparado para esto, así que puede que os dé una sorpresa y lo actualice algún día de estos.
* **Planificador de macros y gramos idóneos:** Una especie de asistente que te recomiende cuánto comer basándose en tu dieta base y tus indicaciones (similar al futuro módulo "Proyecto").

### Entrenamiento y Progreso
* **Cardio y Resistencia:** Ahora mismo la mayor carencia de la app es que está pensada 100% para hipertrofia. Toca añadir un apartado de entrenamiento cardiovascular integrado.
* **Planificador de mesociclos a largo plazo:** Para organizar bloques de entrenamiento completos.
* **Rutinas predeterminadas e importables:** Para los que no quieren pensar y prefieren cargar un PPL (Push/Pull/Legs) ya hecho.
* **Hasta 3 cronómetros personalizables:** Porque a veces un solo *timer* de descanso no es suficiente.
* **El "Wrapped" real:** Por mucho que me duela, hacer un resumen anual en condiciones.

### La Experiencia PC (Próximo Nivel)
* **Módulo de progreso avanzado:** Lo que ya hay en móvil, pero aprovechando la pantalla grande con métricas mucho más detalladas.
* **Análisis de técnica avanzado (RTPose):** MediaPipe en web se queda corto para según qué cosas. Hay modelos como RTPose (o como se escriba) que son mucho más potentes y podrían correr en un PC corriente sin tanta limitación, permitiendo análisis biomecánicos aún más precisos.
* **Módulo "Proyecto":** Un sistema que te recomiende y cree rutinas específicas para conseguir un objetivo físico concreto.

### Sistema y Arquitectura
* **Modularidad extrema:** Poder elegir qué módulos instalar y cuáles no. Si solo usas la app para nutrición, o solo para entrenamiento, no tienes por qué cargar el resto.
* **Más contenido:** Añadir más alimentos a la base de datos local, más ejercicios y, por supuesto, más *copywriting* de insultos y sarcasmo.
* **Cloud opcional (Cloudflare):** Esto es muy difícil que lo meta porque me da una pereza increíble, pero puede que lo añada de forma opcional para que elijáis entre `IndexedDB` (local), conectar vuestra propia nube, o usar la mía por 2€/mes. Ojo, cobrar implica dar soporte, y dar soporte es trabajar, así que no esperéis esta última opción con muchas ganas.

> **Nota:** Si tenéis más sugerencias, estaré encantado de escucharlas (o leerlas en los *Issues*). Eso sí, por favor, que nadie me pida conectar básculas o relojes inteligentes vía Bluetooth; las empresas no son precisamente pro-estándares y es un infierno.

---

## 9. Agradecimientos y Créditos

No uso frameworks comerciales pesados, pero tampoco soy un desagradecido. Aerko_ no existiría con este nivel de precisión sin el trabajo de comunidades open-source y herramientas que realmente valen la pena.

### Bases de Datos (El combustible)
* Gracias infinitas a **OpenFoodFacts** por hacer posible el escáner de código de barras gratuito e independiente. 
* A la **USDA** y **BEDCA** por aportar la precisión científica y nutricional necesaria para construir la base de datos maestra (`master_foods.json`) sin envenenar a nadie.

### Tecnología (El motor)
* A **Google** por liberar las herramientas de visión de **MediaPipe** (aunque haya tenido que secuestrarlas e inyectarlas en un Web Worker a la fuerza para no derretir los móviles). 
* Y un respeto absoluto a los desarrolladores de las únicas librerías de terceros dignas de pisar este repositorio. Herramientas puras, útiles y sin dependencias tóxicas:
    * **Chart.js** (Nick Downie y comunidad)
    * **HTML5-QRCode** (Minhazav)
    * **JSZip** (Stuart Knightley)
    * **SortableJS** (Lebedev Konstantin / RubaXa)

### Créditos (SrPakura)
Y finalmente, a mí mismo. Como Diseñador de Producto, Arquitecto de Software, "Pastor de IAs" y escritor de experiencias personales profesional. Vaya ego hay que tener para poner esto en verdad jajaja. Pero bueno, gracias por leer, aquí termino de escribir de una vez.
