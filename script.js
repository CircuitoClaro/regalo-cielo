/* ============================================================
   🌌 GALAXIA CON CORAZONES DE AMOR & POLAROIDS 3D ✨
   Inspirado en el video de AlexDev (@alexx.dev)
   Three.js 3D Interactive Cosmos
   ============================================================ */

/* ============================================================
   1. CONFIGURACIÓN PERSONALIZABLE (Fácil de editar)
   ============================================================ */
const CONFIG = {
  friendName: "PARA CIELO",
  subtitle: "«Entre millones de estrellas en el cielo, tú eres mi favorita»",
  
  // Recuerdos y fotos que orbitan la galaxia (Estilo Polaroid)
  cards: [
    {
      img: '0.png',
      caption: 'Cielo, mi universo 🪐',
      title: 'Cielo, Mi Universo Entero ✨',
      desc: 'Tener tu amistad es como haber encontrado la estrella más brillante de todo el cosmos. Gracias por ser tan genial, Cielo.'
    },
    {
      img: '1.png',
      caption: 'Para ti, Cielo 💕',
      title: 'Tu Luz Incomparable ✨',
      desc: 'Haces honor a tu nombre, Cielo: tan infinita, hermosa y llena de luz. Siempre estaré agradecido de tenerte en mi vida.'
    },
    {
      img: '2.png',
      caption: 'Te quiero, Cielo 💖',
      title: 'Amistad Incondicional 💖',
      desc: 'Por todas las risas, las pláticas interminables y los momentos compartidos que hacen que cada día sea especial.'
    },
    {
      img: '3.png',
      caption: 'Preciosa Cielo 🌹',
      title: 'Brillas con Luz Propia 🌹',
      desc: 'Tu forma de ser, tu empatía y tu alegría iluminan cualquier rincón. Nunca dejes de sonreír, Cielo.'
    },
    {
      img: '4.png',
      caption: 'Siempre juntos, Cielo 💫',
      title: 'Amistad Infinita 💫',
      desc: 'No importa la distancia ni el tiempo; las verdaderas conexiones como la nuestra no se borran jamás.'
    },
    {
      img: '5.png',
      caption: 'Mi persona favorita 🧸',
      title: 'Cielo, Mi Persona Favorita 🧸',
      desc: 'Gracias por escucharme, aconsejarme y apoyarme siempre. Eres de las personas más leales y bonitas que conozco.'
    },
    {
      img: '6.png',
      caption: 'Un abrazo al Cielo 💌',
      title: 'Un Abrazo Cósmico 💌',
      desc: 'Que este pequeño detalle digital te recuerde siempre lo querida, única y especial que eres para mí, Cielo.'
    },
    {
      img: '7.png',
      caption: 'I Love You, Cielo ✨',
      title: 'Para Ti, Cielo ✨',
      desc: 'Un rincón de estrellas programado con mucho cariño para recordarte lo mucho que vales todos los días.'
    },
    {
      img: '8.png',
      caption: 'Recuerdos Eternos 💕',
      title: 'Por Siempre, Cielo 💕',
      desc: 'Por muchos años más de momentos inolvidables, risas y aventuras en esta y todas las galaxias.'
    }
  ]
};

/* ============================================================
   2. VARIABLES GLOBALES DE THREE.JS
   ============================================================ */
let scene, camera, renderer;
let blackHoleGroup, accretionDisk, lensingHalo, spiralGalaxyPoints;
let orbitCardGroups = [];
let raycaster, mousePointer;
let hoveredCard = null;

// Control de cámara esférica suave
const cameraControl = {
  radius: 65,
  targetRadius: 65,
  minRadius: 28,
  maxRadius: 130,
  theta: Math.PI / 4,
  targetTheta: Math.PI / 4,
  phi: Math.PI / 2.6,
  targetPhi: Math.PI / 2.6,
  isDragging: false,
  prevMouseX: 0,
  prevMouseY: 0,
  autoRotateSpeed: 0.0018,
  lastInteractionTime: performance.now()
};

/* ============================================================
   3. INICIALIZACIÓN
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  initThree();
  initUI();
  initFloatingHearts();
  initShootingStars();
  initCursorStardust();
  animate();
});

function initThree() {
  const canvas = document.getElementById('galaxyCanvas');

  // Escena
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05020a, 0.004);

  // Cámara
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  updateCameraPosition();

  // Renderizador con antialiasing
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Luces
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const pinkPointLight = new THREE.PointLight(0xff2a85, 4, 150, 0.8);
  pinkPointLight.position.set(0, 0, 0);
  scene.add(pinkPointLight);

  // Raycaster para interactividad con las polaroids
  raycaster = new THREE.Raycaster();
  mousePointer = new THREE.Vector2();

  // Construcción del universo
  createBlackHoleAndAccretion();
  createHeartSpiralGalaxy();
  createBackgroundStarfield();
  createOrbitingPolaroids();

  // Event Listeners
  window.addEventListener('resize', onWindowResize);
  setupCameraInput(canvas);
}

/* ============================================================
   4. GENERADORES DE TEXTURAS PROCEDURALES (Cero dependencias)
   ============================================================ */

// Textura de brillo radial suave
function getRadialGlowTexture(colorInner, colorOuter) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, colorInner);
  grad.addColorStop(0.3, colorInner);
  grad.addColorStop(0.7, colorOuter);
  grad.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

// Textura de partículas en forma de corazón brillante
function getHeartParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  ctx.translate(32, 28);
  ctx.beginPath();
  // Dibujar corazón
  ctx.moveTo(0, 8);
  ctx.bezierCurveTo(-18, -14, -30, 8, 0, 30);
  ctx.bezierCurveTo(30, 8, 18, -14, 0, 8);
  ctx.closePath();

  const grad = ctx.createRadialGradient(0, 10, 0, 0, 10, 26);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.4, '#ff2a85');
  grad.addColorStop(0.8, '#e024c3');
  grad.addColorStop(1, 'rgba(255, 42, 133, 0)');

  ctx.fillStyle = grad;
  ctx.shadowColor = '#ff2a85';
  ctx.shadowBlur = 10;
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

// Textura para el anillo del disco de acreción del agujero negro
function getAccretionRingTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(256, 256, 70, 256, 256, 256);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.15, 'rgba(255, 255, 255, 0.95)');
  grad.addColorStop(0.28, 'rgba(255, 42, 133, 0.9)');
  grad.addColorStop(0.5, 'rgba(224, 36, 195, 0.6)');
  grad.addColorStop(0.75, 'rgba(157, 78, 221, 0.3)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Agregar remolinos estelares al disco
  for (let i = 0; i < 360; i += 2) {
    const angle = (i * Math.PI) / 180;
    const r1 = 90 + Math.random() * 140;
    const x = 256 + Math.cos(angle) * r1;
    const y = 256 + Math.sin(angle) * r1;
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.4})`;
    ctx.fillRect(x, y, 2, 2);
  }

  return new THREE.CanvasTexture(canvas);
}

/* ============================================================
   5. AGUJERO NEGRO CÓSMICO (Gargantua Rosada / Black Hole)
   ============================================================ */
function createBlackHoleAndAccretion() {
  blackHoleGroup = new THREE.Group();

  // 1. Esfera central de sombra (Horizonte de eventos negro absoluto)
  const sphereGeo = new THREE.SphereGeometry(5.2, 48, 48);
  const sphereMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const eventHorizon = new THREE.Mesh(sphereGeo, sphereMat);
  blackHoleGroup.add(eventHorizon);

  // 2. Anillo de fotones interior (Photon Ring súper brillante blanco/fucsia)
  const photonRingGeo = new THREE.RingGeometry(5.2, 5.8, 64);
  const photonRingMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending
  });
  const photonRing = new THREE.Mesh(photonRingGeo, photonRingMat);
  photonRing.rotation.x = Math.PI / 2;
  blackHoleGroup.add(photonRing);

  // 3. Disco de acreción horizontal (Accretion Disk)
  const diskGeo = new THREE.PlaneGeometry(36, 36);
  const diskMat = new THREE.MeshBasicMaterial({
    map: getAccretionRingTexture(),
    side: THREE.DoubleSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  accretionDisk = new THREE.Mesh(diskGeo, diskMat);
  accretionDisk.rotation.x = Math.PI / 2;
  blackHoleGroup.add(accretionDisk);

  // 4. Halo de lente gravitacional vertical (Gravitational Lensing Halo tipo Interstellar)
  const haloGeo = new THREE.RingGeometry(5.5, 9.8, 64);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xff2a85,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  lensingHalo = new THREE.Mesh(haloGeo, haloMat);
  blackHoleGroup.add(lensingHalo);

  // 5. Resplandor radial cósmico (Aura externa fucsia y magenta)
  const glowMat = new THREE.SpriteMaterial({
    map: getRadialGlowTexture('rgba(255, 42, 133, 0.85)', 'rgba(157, 78, 221, 0.1)'),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const blackHoleGlow = new THREE.Sprite(glowMat);
  blackHoleGlow.scale.set(45, 45, 1);
  blackHoleGroup.add(blackHoleGlow);

  scene.add(blackHoleGroup);
}

/* ============================================================
   6. ESPIRAL DE PARTÍCULAS: CORAZONES Y ESTRELLAS
   ============================================================ */
function createHeartSpiralGalaxy() {
  const particleCount = 6500;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  const palette = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xff4d94),
    new THREE.Color(0xff2a85),
    new THREE.Color(0xe024c3),
    new THREE.Color(0xc77dff),
    new THREE.Color(0x9d4edd)
  ];

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const arms = 2; // Dos brazos espirales simétricos
    const armIndex = i % arms;

    // Distribución espiral logarítmica
    const dist = Math.pow(Math.random(), 1.4) * 55 + 7;
    const angle = dist * 0.14 + (armIndex * Math.PI);

    // Dispersión suave alrededor de los brazos
    const spreadX = (Math.random() - 0.5) * (dist * 0.28);
    const spreadY = (Math.random() - 0.5) * (dist * 0.12);
    const spreadZ = (Math.random() - 0.5) * (dist * 0.28);

    positions[i3] = Math.cos(angle) * dist + spreadX;
    positions[i3 + 1] = spreadY;
    positions[i3 + 2] = Math.sin(angle) * dist + spreadZ;

    // Color con gradiente según distancia al núcleo
    const colorIndex = Math.min(palette.length - 1, Math.floor((dist / 55) * palette.length));
    const col = palette[colorIndex].clone();
    // Mezcla con blanco cerca del centro
    if (dist < 18) col.lerp(new THREE.Color(0xffffff), 0.5);

    colors[i3] = col.r;
    colors[i3 + 1] = col.g;
    colors[i3 + 2] = col.b;

    sizes[i] = Math.random() * 1.8 + 0.8;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 2.2,
    map: getHeartParticleTexture(),
    transparent: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  spiralGalaxyPoints = new THREE.Points(geometry, material);
  scene.add(spiralGalaxyPoints);
}

/* ============================================================
   7. CAMPO DE ESTRELLAS DE FONDO (Starfield)
   ============================================================ */
function createBackgroundStarfield() {
  const starCount = 2000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    const r = Math.random() * 250 + 80;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.cos(phi);
    positions[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const isPinkStar = Math.random() > 0.6;
    colors[i3] = isPinkStar ? 1.0 : 0.85;
    colors[i3 + 1] = isPinkStar ? 0.6 : 0.85;
    colors[i3 + 2] = isPinkStar ? 0.9 : 1.0;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 1.2,
    map: getRadialGlowTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0.1)'),
    transparent: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const starField = new THREE.Points(geometry, starMat);
  scene.add(starField);
}

/* ============================================================
   8. POLAROIDS 3D FLOTANTES EN ÓRBITA (Matching TikTok Video)
   ============================================================ */

// Genera el canvas con la foto y la dedicatoria estilo Polaroid
function createPolaroidCanvasTexture(photoSrc, captionText, callback) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 620;
  const ctx = canvas.getContext('2d');

  function renderPolaroid(img) {
    // 1. Fondo blanco de cartón Polaroid con sutil gradiente
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(16, 16, 480, 588, 16);
    ctx.fill();

    // Sutil textura y sombra interior
    ctx.strokeStyle = '#e6e6e6';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 2. Ventana de la fotografía
    const photoX = 40;
    const photoY = 40;
    const photoW = 432;
    const photoH = 432;

    ctx.fillStyle = '#100618';
    ctx.fillRect(photoX, photoY, photoW, photoH);

    if (img && img.complete && img.naturalWidth > 0) {
      // Ajustar imagen centrada
      const scale = Math.max(photoW / img.width, photoH / img.height);
      const nw = img.width * scale;
      const nh = img.height * scale;
      const ox = photoX + (photoW - nw) / 2;
      const oy = photoY + (photoH - nh) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.rect(photoX, photoY, photoW, photoH);
      ctx.clip();
      ctx.drawImage(img, ox, oy, nw, nh);
      ctx.restore();
    } else {
      // Placeholder estético cósmico con corazón
      ctx.fillStyle = 'linear-gradient(135deg, #2b0838 0%, #11031c 100%)';
      ctx.fillRect(photoX, photoY, photoW, photoH);
      ctx.font = '80px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💖', photoX + photoW / 2, photoY + photoH / 2);
    }

    // 3. Pin / cinta superior bonita
    ctx.fillStyle = '#ff2a85';
    ctx.beginPath();
    ctx.arc(256, 32, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 4. Texto de la dedicatoria en la base (estilo caligráfico elegante)
    ctx.fillStyle = '#1a0524';
    ctx.font = 'bold 36px "Dancing Script", cursive, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(captionText || 'Mi universo 🪐', 256, 535);

    // Decoración de corazón al pie
    ctx.fillStyle = '#ff2a85';
    ctx.font = '24px sans-serif';
    ctx.fillText('✨', 440, 545);

    try {
      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      if (callback) callback(texture);
    } catch (e) {
      console.warn("Canvas texture fallback:", e);
      if (callback) callback(null);
    }
  }

  const img = new Image();
  if (window.location.protocol.startsWith('http')) {
    img.crossOrigin = 'anonymous';
  }
  img.onload = () => renderPolaroid(img);
  img.onerror = () => renderPolaroid(null);
  img.src = photoSrc;
}

function createOrbitingPolaroids() {
  orbitCardGroups = [];

  CONFIG.cards.forEach((cardData, index) => {
    const cardGroup = new THREE.Group();

    // Distribuir en radios de órbita y alturas escalonadas
    const totalCards = CONFIG.cards.length;
    const baseAngle = (index / totalCards) * Math.PI * 2;
    // Distancia orbital entre 22 y 42
    const orbitRadius = 24 + (index % 3) * 8;
    const orbitHeight = (Math.sin(index * 1.5) * 5) + ((index % 2 === 0) ? 2 : -2);
    const orbitSpeed = 0.003 + (index % 3) * 0.001;

    // Plano del Polaroid 3D (proporción 512x620)
    const cardWidth = 7.5;
    const cardHeight = 9.0;
    const planeGeo = new THREE.PlaneGeometry(cardWidth, cardHeight);

    // Material inicial con placeholder
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true
    });

    const cardMesh = new THREE.Mesh(planeGeo, planeMat);
    cardGroup.add(cardMesh);

    // Aura de resplandor neón en la parte trasera
    const glowMat = new THREE.SpriteMaterial({
      map: getRadialGlowTexture('rgba(255, 42, 133, 0.65)', 'rgba(255, 42, 133, 0)'),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const backGlow = new THREE.Sprite(glowMat);
    backGlow.scale.set(cardWidth * 1.6, cardHeight * 1.6, 1);
    backGlow.position.z = -0.15;
    cardGroup.add(backGlow);

    // Cargar la textura con la imagen y el texto
    createPolaroidCanvasTexture(cardData.img, cardData.caption, (loadedTexture) => {
      cardMesh.material.map = loadedTexture;
      cardMesh.material.needsUpdate = true;
    });

    // Guardar datos para interactividad y órbita
    cardGroup.userData = {
      index: index,
      data: cardData,
      mesh: cardMesh,
      backGlow: backGlow,
      radius: orbitRadius,
      height: orbitHeight,
      angle: baseAngle,
      speed: orbitSpeed,
      wobbleOffset: index * 0.8
    };

    scene.add(cardGroup);
    orbitCardGroups.push(cardGroup);
  });
}

/* ============================================================
   9. INTERACCIÓN DE CÁMARA (Mouse, Touch & Giro 3D)
   ============================================================ */
function setupCameraInput(canvas) {
  let isPointerDown = false;
  let startX = 0, startY = 0;
  let moved = false;

  // Mouse
  canvas.addEventListener('mousedown', (e) => {
    isPointerDown = true;
    moved = false;
    startX = e.clientX;
    startY = e.clientY;
    cameraControl.prevMouseX = e.clientX;
    cameraControl.prevMouseY = e.clientY;
    cameraControl.isDragging = true;
    cameraControl.lastInteractionTime = performance.now();
  });

  window.addEventListener('mousemove', (e) => {
    // Actualizar raycaster con la posición del ratón
    mousePointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    checkCardHover();

    if (!isPointerDown) return;
    const dx = e.clientX - cameraControl.prevMouseX;
    const dy = e.clientY - cameraControl.prevMouseY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;

    cameraControl.targetTheta -= dx * 0.006;
    cameraControl.targetPhi = Math.max(0.15, Math.min(Math.PI - 0.15, cameraControl.targetPhi + dy * 0.006));

    cameraControl.prevMouseX = e.clientX;
    cameraControl.prevMouseY = e.clientY;
    cameraControl.lastInteractionTime = performance.now();
  });

  window.addEventListener('mouseup', (e) => {
    if (isPointerDown && !moved) {
      handleSceneClick(e.clientX, e.clientY);
    }
    isPointerDown = false;
    cameraControl.isDragging = false;
  });

  // Zoom con la rueda
  window.addEventListener('wheel', (e) => {
    cameraControl.targetRadius = Math.max(
      cameraControl.minRadius,
      Math.min(cameraControl.maxRadius, cameraControl.targetRadius + e.deltaY * 0.05)
    );
    cameraControl.lastInteractionTime = performance.now();
  }, { passive: true });

  // Touch para Celulares / Tablets
  let initialTouchDist = 0;

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isPointerDown = true;
      moved = false;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      cameraControl.prevMouseX = e.touches[0].clientX;
      cameraControl.prevMouseY = e.touches[0].clientY;
    } else if (e.touches.length === 2) {
      initialTouchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
    cameraControl.lastInteractionTime = performance.now();
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1 && isPointerDown) {
      const dx = e.touches[0].clientX - cameraControl.prevMouseX;
      const dy = e.touches[0].clientY - cameraControl.prevMouseY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) moved = true;

      cameraControl.targetTheta -= dx * 0.007;
      cameraControl.targetPhi = Math.max(0.15, Math.min(Math.PI - 0.15, cameraControl.targetPhi + dy * 0.007));

      cameraControl.prevMouseX = e.touches[0].clientX;
      cameraControl.prevMouseY = e.touches[0].clientY;
    } else if (e.touches.length === 2 && initialTouchDist > 0) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const diff = initialTouchDist - currentDist;
      cameraControl.targetRadius = Math.max(
        cameraControl.minRadius,
        Math.min(cameraControl.maxRadius, cameraControl.targetRadius + diff * 0.15)
      );
      initialTouchDist = currentDist;
    }
    cameraControl.lastInteractionTime = performance.now();
  }, { passive: true });

  canvas.addEventListener('touchend', (e) => {
    if (isPointerDown && !moved && e.changedTouches.length === 1) {
      handleSceneClick(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
    isPointerDown = false;
    initialTouchDist = 0;
  });
}

function updateCameraPosition() {
  const x = cameraControl.radius * Math.sin(cameraControl.phi) * Math.sin(cameraControl.theta);
  const y = cameraControl.radius * Math.cos(cameraControl.phi);
  const z = cameraControl.radius * Math.sin(cameraControl.phi) * Math.cos(cameraControl.theta);
  camera.position.set(x, y, z);
  camera.lookAt(0, 0, 0);
}

/* ============================================================
   10. HOVER Y CLIC EN POLAROIDS 3D
   ============================================================ */
function checkCardHover() {
  if (cameraControl.isDragging) return;

  raycaster.setFromCamera(mousePointer, camera);
  const cardMeshes = orbitCardGroups.map(g => g.userData.mesh);
  const intersects = raycaster.intersectObjects(cardMeshes);

  const canvas = document.getElementById('galaxyCanvas');

  if (intersects.length > 0) {
    const hitMesh = intersects[0].object;
    const hitGroup = hitMesh.parent;

    if (hoveredCard !== hitGroup) {
      if (hoveredCard) resetCardVisual(hoveredCard);
      hoveredCard = hitGroup;
      // Escalar ligeramente y aumentar brillo
      hoveredCard.scale.set(1.15, 1.15, 1.15);
      hoveredCard.userData.backGlow.scale.set(15, 18, 1);
    }
    canvas.style.cursor = 'pointer';
  } else {
    if (hoveredCard) {
      resetCardVisual(hoveredCard);
      hoveredCard = null;
    }
    canvas.style.cursor = 'grab';
  }
}

function resetCardVisual(group) {
  group.scale.set(1, 1, 1);
  group.userData.backGlow.scale.set(7.5 * 1.6, 9.0 * 1.6, 1);
}

function handleSceneClick(clientX, clientY) {
  mousePointer.x = (clientX / window.innerWidth) * 2 - 1;
  mousePointer.y = -(clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mousePointer, camera);
  const cardMeshes = orbitCardGroups.map(g => g.userData.mesh);
  const intersects = raycaster.intersectObjects(cardMeshes);

  if (intersects.length > 0) {
    const hitGroup = intersects[0].object.parent;
    openPolaroidModal(hitGroup.userData.data);
  } else {
    // Al tocar el cielo o espacio cósmico, flotan frases y estrellas dedicadas a Cielo
    spawnCosmicClickBubble(clientX, clientY);
  }
}

/* ============================================================
   11. LOOP DE ANIMACIÓN
   ============================================================ */
function animate() {
  requestAnimationFrame(animate);

  const time = performance.now() * 0.001;

  // Inercia y rotación automática de la cámara
  cameraControl.radius += (cameraControl.targetRadius - cameraControl.radius) * 0.06;
  cameraControl.phi += (cameraControl.targetPhi - cameraControl.phi) * 0.06;

  // Si no se arrastra activamente, giro cinemático constante
  if (!cameraControl.isDragging && (performance.now() - cameraControl.lastInteractionTime) > 1200) {
    cameraControl.targetTheta += cameraControl.autoRotateSpeed;
  }
  cameraControl.theta += (cameraControl.targetTheta - cameraControl.theta) * 0.06;

  updateCameraPosition();

  // Rotación del disco de acreción y lente del agujero negro
  if (accretionDisk) {
    accretionDisk.rotation.z += 0.005;
  }
  if (lensingHalo) {
    // El halo gravitario siempre mira a la cámara simulando distorsión óptica de la luz
    lensingHalo.quaternion.copy(camera.quaternion);
  }

  // Rotación de la espiral de corazones
  if (spiralGalaxyPoints) {
    spiralGalaxyPoints.rotation.y += 0.0015;
  }

  // Movimiento orbital y orientación de las polaroids
  orbitCardGroups.forEach((group) => {
    const data = group.userData;

    // Actualizar ángulo orbital
    data.angle += data.speed;

    const x = Math.cos(data.angle) * data.radius;
    const z = Math.sin(data.angle) * data.radius;
    const y = data.height + Math.sin(time * 1.8 + data.wobbleOffset) * 0.8;

    group.position.set(x, y, z);

    // Que cada polaroid siempre mire de frente a la cámara suavemente
    group.quaternion.copy(camera.quaternion);
  });

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

/* ============================================================
   12. INTERFAZ DE USUARIO, MODALES & AUDIO
   ============================================================ */
function initUI() {
  const introModal = document.getElementById('introModal');
  const enterUniverseBtn = document.getElementById('enterUniverseBtn');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const bgMusic = document.getElementById('bgMusic');
  const polaroidModal = document.getElementById('polaroidModal');
  const polaroidCloseBtn = document.getElementById('polaroidCloseBtn');
  const titleText = document.getElementById('titleText');
  const subtitleText = document.getElementById('subtitleText');

  // Modal de Carta para Cielo
  const letterOpenBtn = document.getElementById('letterOpenBtn');
  const letterModal = document.getElementById('letterModal');
  const letterCloseBtn = document.getElementById('letterCloseBtn');

  // Inicializar textos configurados
  if (titleText) titleText.textContent = CONFIG.friendName;
  if (subtitleText) subtitleText.textContent = CONFIG.subtitle;

  // 1. Entrar al universo y activar música
  if (enterUniverseBtn) {
    enterUniverseBtn.addEventListener('click', () => {
      introModal.classList.add('hidden');
      playMusic();

      // Desvanecer pista de instrucción a los 6 segundos
      setTimeout(() => {
        const hint = document.getElementById('instructionHint');
        if (hint) hint.classList.add('fade-out');
      }, 6000);
    });
  }

  function playMusic() {
    bgMusic.play().then(() => {
      audioToggleBtn.classList.add('playing');
    }).catch(() => {
      console.log("Audio waiting for explicit user interaction");
    });
  }

  // 2. Botón de música (Play / Pause)
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.play();
        audioToggleBtn.classList.add('playing');
      } else {
        bgMusic.pause();
        audioToggleBtn.classList.remove('playing');
      }
    });
  }

  // 3. Abrir / Cerrar Carta Especial para Cielo
  if (letterOpenBtn && letterModal) {
    letterOpenBtn.addEventListener('click', () => {
      letterModal.classList.add('active');
      spawnHeartBurst();
    });
  }

  if (letterCloseBtn && letterModal) {
    letterCloseBtn.addEventListener('click', () => {
      letterModal.classList.remove('active');
    });
  }

  if (letterModal) {
    letterModal.addEventListener('click', (e) => {
      if (e.target === letterModal) {
        letterModal.classList.remove('active');
      }
    });
  }

  // 4. Cerrar modal de Polaroid
  if (polaroidCloseBtn && polaroidModal) {
    polaroidCloseBtn.addEventListener('click', () => {
      polaroidModal.classList.remove('active');
    });
  }

  if (polaroidModal) {
    polaroidModal.addEventListener('click', (e) => {
      if (e.target === polaroidModal) {
        polaroidModal.classList.remove('active');
      }
    });
  }
}

function openPolaroidModal(data) {
  const polaroidModal = document.getElementById('polaroidModal');
  const polaroidImg = document.getElementById('polaroidImg');
  const polaroidTitle = document.getElementById('polaroidTitle');
  const polaroidDesc = document.getElementById('polaroidDesc');

  polaroidImg.src = data.img;
  polaroidTitle.textContent = data.title;
  polaroidDesc.textContent = data.desc;

  polaroidModal.classList.add('active');

  // Lanzar explosión de corazones flotantes
  spawnHeartBurst();
}

/* ============================================================
   13. EFECTOS ESPECIALES & DETALLES MÁGICOS PARA CIELO
   ============================================================ */
function initFloatingHearts() {
  const container = document.getElementById('heartsContainer');
  if (!container) return;
  const heartIcons = ['💖', '💕', '✨', '🪐', '❤️', '🌸', '💫'];

  setInterval(() => {
    if (document.hidden) return;
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    heart.style.left = `${Math.random() * 96}%`;
    heart.style.animationDuration = `${6 + Math.random() * 6}s`;
    heart.style.fontSize = `${0.9 + Math.random() * 1.4}rem`;

    container.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 12000);
  }, 850);
}

function spawnHeartBurst() {
  const container = document.getElementById('heartsContainer');
  if (!container) return;
  const heartIcons = ['💖', '💕', '✨', '❤️', '🪐'];

  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];
      heart.style.left = `${25 + Math.random() * 50}%`;
      heart.style.bottom = '25%';
      heart.style.animationDuration = `${3 + Math.random() * 3}s`;
      heart.style.fontSize = `${1.2 + Math.random() * 1.3}rem`;
      container.appendChild(heart);
      setTimeout(() => heart.remove(), 6000);
    }, i * 50);
  }
}

/* 14. BURBUJAS INTERACTIVAS AL CLICAR EL CIELO/ESPACIO */
const COSMIC_MESSAGES = [
  "Cielo ✨",
  "Te quiero un montón 💖",
  "🪐 Mi universo favorito",
  "Brillas con luz propia 🌟",
  "¡La mejor amiga! 🌸",
  "💫 Amistad infinita",
  "Preciosa 🌹",
  "Gracias por existir 🧸",
  "Eres magia pura ✨",
  "Siempre contigo 💕"
];

function spawnCosmicClickBubble(clientX, clientY) {
  const bubble = document.createElement('div');
  bubble.className = 'cosmic-click-bubble';
  bubble.textContent = COSMIC_MESSAGES[Math.floor(Math.random() * COSMIC_MESSAGES.length)];
  bubble.style.left = `${clientX}px`;
  bubble.style.top = `${clientY}px`;
  document.body.appendChild(bubble);

  setTimeout(() => {
    bubble.remove();
  }, 1900);
}

/* 15. ESTRELLAS FUGACES CÓSMICAS PERIÓDICAS */
function initShootingStars() {
  const container = document.getElementById('shootingStarsContainer');
  if (!container) return;

  function createStar() {
    if (document.hidden) return;
    const star = document.createElement('div');
    star.className = 'shooting-star';

    const startX = Math.random() * (window.innerWidth * 0.75);
    const startY = Math.random() * (window.innerHeight * 0.45);
    const length = 90 + Math.random() * 110;
    const dx = 200 + Math.random() * 180;
    const dy = dx * (0.45 + Math.random() * 0.35);

    star.style.left = `${startX}px`;
    star.style.top = `${startY}px`;
    star.style.width = `${length}px`;
    star.style.setProperty('--dx', `${dx}px`);
    star.style.setProperty('--dy', `${dy}px`);

    container.appendChild(star);

    setTimeout(() => {
      star.remove();
    }, 1800);
  }

  function scheduleNext() {
    const delay = 1800 + Math.random() * 2600;
    setTimeout(() => {
      createStar();
      scheduleNext();
    }, delay);
  }
  scheduleNext();
}

/* 16. POLVO ESTELAR QUE SIGUE AL CURSOR */
function initCursorStardust() {
  let lastSpawn = 0;
  window.addEventListener('pointermove', (e) => {
    const now = performance.now();
    if (now - lastSpawn < 50) return;
    lastSpawn = now;

    const spark = document.createElement('div');
    spark.className = 'cursor-stardust';
    spark.style.left = `${e.clientX}px`;
    spark.style.top = `${e.clientY}px`;
    document.body.appendChild(spark);

    setTimeout(() => {
      spark.remove();
    }, 700);
  });
}
