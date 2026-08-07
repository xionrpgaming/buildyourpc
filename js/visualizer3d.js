/* ============================================================
   XION GAMING — VISUALIZER 3D (generik, bukan render produk asli)
   ------------------------------------------------------------
   Dipakai bareng oleh builder.html & hasil.html. Butuh Three.js
   + OrbitControls sudah ter-load duluan (lihat urutan <script> di
   kedua file HTML itu).

   createXionVisualizer(containerEl) -> { update(single, multi), dispose() }

   Bentuknya SENGAJA generik (bukan model produk asli per SKU) —
   case, GPU, RAM di sini cuma representasi visual, bukan replika
   akurat dari barang yang dijual. Yang bereaksi ke pilihan user:
     - Ukuran case  <- formFactor casing yang dipilih
     - Kecerlangan/​jumlah glow <- makin banyak kategori terisi
     - GPU generik muncul kalau minimal 1 VGA dipilih
     - RAM generik jumlahnya ikut berapa RAM berbeda yang dipilih
   ============================================================ */
function createXionVisualizer(containerEl){
  if(!containerEl || typeof THREE === "undefined"){
    return { update(){}, dispose(){} };
  }

  const FORM_FACTOR_SCALE = {
    "Mini-ITX": 0.8, "MicroATX": 0.9, "ATX": 1.0, "EATX": 1.12
  };

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(5.2, 2.6, 6.2);

  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  containerEl.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 4;
  controls.maxDistance = 10;
  controls.target.set(0, 1.0, 0);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.9;

  scene.add(new THREE.AmbientLight(0x404050, 1.3));
  const keyLight = new THREE.PointLight(0xffffff, 0.55);
  keyLight.position.set(4, 6, 4);
  scene.add(keyLight);

  let glowColor = new THREE.Color(0x7c5cff);
  const glowMats = [];
  function glowMaterial(){
    const mat = new THREE.MeshStandardMaterial({
      color:0x111318, emissive: glowColor.clone(), emissiveIntensity: 0.15,
      metalness:0.3, roughness:0.5
    });
    glowMats.push(mat);
    return mat;
  }

  const caseGroup = new THREE.Group();
  const shellMat = new THREE.MeshStandardMaterial({ color:0x181c26, metalness:0.4, roughness:0.6 });
  const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(3.2, 4.4, 3.2));
  caseGroup.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color:0x3a4257 })));

  const backPanel = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.4, 0.08), shellMat);
  backPanel.position.z = -1.56;
  caseGroup.add(backPanel);
  const topPanel = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.08, 3.2), shellMat);
  topPanel.position.y = 2.2;
  caseGroup.add(topPanel);
  const botPanel = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.08, 3.2), shellMat);
  botPanel.position.y = -2.2;
  caseGroup.add(botPanel);

  const glassMat = new THREE.MeshPhysicalMaterial({ color:0x1a2030, transparent:true, opacity:0.2, roughness:0.05, metalness:0 });
  const glassPanel = new THREE.Mesh(new THREE.BoxGeometry(0.06, 4.4, 3.2), glassMat);
  glassPanel.position.x = -1.6;
  caseGroup.add(glassPanel);

  const trayMat = glowMaterial();
  const tray = new THREE.Mesh(new THREE.BoxGeometry(0.06, 3.6, 2.6), trayMat);
  tray.position.set(1.0, 0, 0);
  caseGroup.add(tray);

  // ---- GPU generik: muncul kalau ada VGA dipilih ----
  const gpuMat = glowMaterial();
  const gpuMesh = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.32, 0.9), gpuMat);
  gpuMesh.position.set(0.2, -0.6, 0.4);
  gpuMesh.visible = false;
  caseGroup.add(gpuMesh);

  // ---- RAM generik: jumlah batang ikut berapa RAM unik dipilih (maks 4 biar muat) ----
  const ramSlots = [];
  for(let i=0;i<4;i++){
    const ram = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.1, 0.5), glowMaterial());
    ram.position.set(0.55 + i*0.16, 0.5, -0.55 + i*0.05);
    ram.visible = false;
    caseGroup.add(ram);
    ramSlots.push(ram);
  }

  // ---- Storage generik: muncul kalau ada storage dipilih ----
  const storageMat = glowMaterial();
  const storageMesh = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.08), storageMat);
  storageMesh.position.set(1.1, -1.5, 1.1);
  storageMesh.visible = false;
  caseGroup.add(storageMesh);

  // ---- Fan (selalu ada 3, selalu berputar — representasi casing) ----
  const fans = [];
  function makeFan(radius){
    const group = new THREE.Group();
    const ringMat = new THREE.MeshStandardMaterial({ color:0x20242f, metalness:0.5, roughness:0.5 });
    group.add(new THREE.Mesh(new THREE.TorusGeometry(radius, 0.045, 8, 28), ringMat));
    const bladeMat = glowMaterial();
    const bladeCount = 7;
    for(let i=0;i<bladeCount;i++){
      const blade = new THREE.Mesh(new THREE.BoxGeometry(radius*0.85, 0.035, 0.14), bladeMat);
      blade.rotation.z = (i / bladeCount) * Math.PI * 2;
      blade.geometry.translate(radius*0.42, 0, 0);
      group.add(blade);
    }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.18, 16), ringMat);
    hub.rotation.x = Math.PI/2;
    group.add(hub);
    return group;
  }
  for(let i=0;i<3;i++){
    const fan = makeFan(0.58);
    fan.position.set(-1.55, 1.35 - i*1.35, 0.85);
    fan.rotation.y = Math.PI/2;
    caseGroup.add(fan);
    fans.push(fan);
  }

  caseGroup.position.y = 0.15;
  scene.add(caseGroup);

  // ---------- render loop ----------
  let running = true;
  const clock = new THREE.Clock();
  let targetGlow = 0.15;
  let currentGlow = 0.15;

  function resize(){
    const w = containerEl.clientWidth || 300;
    const h = containerEl.clientHeight || 260;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(containerEl);
  resize();

  function animate(){
    if(!running) return;
    requestAnimationFrame(animate);
    const dt = clock.getDelta();
    const t = clock.getElapsedTime();
    fans.forEach((fan,i)=> fan.rotateOnAxis(new THREE.Vector3(0,0,1), dt * (2.4 + i*0.3)));
    currentGlow += (targetGlow - currentGlow) * 0.08;
    glowMats.forEach((m,i)=>{
      m.emissiveIntensity = currentGlow + Math.sin(t*2 + i) * 0.12 * (currentGlow > 0.2 ? 1 : 0.2);
      m.emissive = glowColor;
    });
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  function update(single, multi){
    // ukuran case ikut form factor casing yang dipilih
    const casing = single && single.casing ? byIdShared(single.casing) : null;
    const scale = (casing && FORM_FACTOR_SCALE[casing.formFactor]) || 1.0;
    caseGroup.scale.setScalar(scale);

    // GPU generik
    const gpuList = multi ? Object.keys(multi.gpu || {}).filter(id => multi.gpu[id] > 0) : [];
    gpuMesh.visible = gpuList.length > 0;

    // RAM generik
    const ramList = multi ? Object.keys(multi.ram || {}).filter(id => multi.ram[id] > 0) : [];
    ramSlots.forEach((slot,i)=> slot.visible = i < Math.min(ramList.length, 4));

    // Storage generik
    const storageList = multi ? Object.keys(multi.storage || {}).filter(id => multi.storage[id] > 0) : [];
    storageMesh.visible = storageList.length > 0;

    // makin banyak kategori terisi, makin terang glow-nya (reward kelengkapan build)
    const cats = ["cpu","motherboard","psu","casing"];
    const singleFilled = cats.filter(c => single && single[c]).length;
    const multiFilled = ["ram","gpu","storage"].filter(c => multi && Object.values(multi[c]||{}).some(q=>q>0)).length;
    const totalFilled = singleFilled + multiFilled;
    targetGlow = 0.12 + (totalFilled / 7) * 0.85;
  }

  function dispose(){
    running = false;
    resizeObserver.disconnect();
    controls.dispose();
    renderer.dispose();
    if(renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
  }

  return { update, dispose };
}
