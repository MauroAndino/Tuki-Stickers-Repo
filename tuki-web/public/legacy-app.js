const STORAGE_KEY = "tuki-stickers-mvp";
const MATERIAL_OPTIONS = [
  "Vinilo blanco",
  "Tornasolado",
  "Gold",
  "Tornagold",
  "Glitter",
  "Transparente",
  "Suncatcher",
];

const seedProducts = [
  {
    sku: "TUKI-001",
    name: "Goku energia roja",
    theme: "Anime",
    character: "Si",
    material: "Tornasolado",
    color: "Rojo",
    price: 2500,
    stock: 6,
    minStock: 2,
    tags: "anime, rojo, energia, protagonista",
    image: "",
    createdAt: "2026-03-20",
    lastRestockAt: "2026-03-29",
  },
  {
    sku: "TUKI-002",
    name: "Hello Kitty glitter rosa",
    theme: "Kawaii",
    character: "Si",
    material: "Glitter",
    color: "Rosa",
    price: 2300,
    stock: 4,
    minStock: 2,
    tags: "cute, rosa, glitter, personaje",
    image: "",
    createdAt: "2026-03-23",
    lastRestockAt: "2026-03-23",
  },
  {
    sku: "TUKI-003",
    name: "Messi campeon",
    theme: "Futbol",
    character: "Si",
    material: "Vinilo blanco",
    color: "Celeste",
    price: 2500,
    stock: 8,
    minStock: 3,
    tags: "seleccion, deporte, idolo",
    image: "",
    createdAt: "2026-03-18",
    lastRestockAt: "2026-03-18",
  },
  {
    sku: "TUKI-004",
    name: "Itachi cuervo",
    theme: "Anime",
    character: "Si",
    material: "Tornasolado",
    color: "Negro",
    price: 2600,
    stock: 3,
    minStock: 2,
    tags: "anime, oscuro, sharingan",
    image: "",
    createdAt: "2026-04-01",
    lastRestockAt: "2026-04-01",
  },
  {
    sku: "TUKI-005",
    name: "Mate cat",
    theme: "Ilustracion",
    character: "No",
    material: "Vinilo blanco",
    color: "Verde",
    price: 2200,
    stock: 5,
    minStock: 2,
    tags: "gatito, argentina, mate",
    image: "",
    createdAt: "2026-03-25",
    lastRestockAt: "2026-03-25",
  },
];

const seedSales = [
  {
    id: makeId(),
    sku: "TUKI-001",
    channel: "Feria",
    quantity: 3,
    unitPrice: 2500,
    reference: "",
    date: "2026-04-02",
    notes: "",
  },
  {
    id: makeId(),
    sku: "TUKI-004",
    channel: "Online",
    quantity: 2,
    unitPrice: 2600,
    reference: "",
    date: "2026-04-03",
    notes: "",
  },
  {
    id: makeId(),
    sku: "TUKI-003",
    channel: "Local",
    quantity: 2,
    unitPrice: 2500,
    reference: "",
    date: "2026-04-04",
    notes: "",
  },
  {
    id: makeId(),
    sku: "TUKI-001",
    channel: "Feria",
    quantity: 1,
    unitPrice: 2500,
    reference: "",
    date: "2026-04-05",
    notes: "",
  },
];

const seedRestocks = [
  {
    id: makeId(),
    sku: "TUKI-001",
    quantity: 10,
    unitCost: 900,
    material: "Tornasolado",
    date: "2026-03-29",
    batch: "Pedido marzo Santa Fe",
  },
  {
    id: makeId(),
    sku: "TUKI-004",
    quantity: 5,
    unitCost: 950,
    material: "Tornasolado",
    date: "2026-04-01",
    batch: "Lote anime abril",
  },
];

const state = loadState();
const remoteConfig = getRemoteConfig();
const remoteState = {
  enabled: remoteConfig.enabled,
  ready: false,
  saveTimer: null,
  lastError: "",
  pollTimer: null,
  syncing: false,
  lastSyncedAt: 0,
};
const scannerState = {
  stream: null,
  engine: "",
  active: false,
  frameId: null,
  scanCanvas: null,
  scanContext: null,
  lastAttemptAt: 0,
  cart: [],
  lastScanValue: "",
  lastScanAt: 0,
};
let currentQrCanvasDataUrl = "";
let currentQrValue = "";
let toastTimer = null;
let lastCreatedSku = "";

const els = {
  navLinks: [...document.querySelectorAll(".nav-link")],
  views: [...document.querySelectorAll(".view")],
  sectionTabs: [...document.querySelectorAll(".section-tab")],
  tabPanels: [...document.querySelectorAll(".tab-panel")],
  productForm: document.getElementById("product-form"),
  themeForm: document.getElementById("theme-form"),
  saleForm: document.getElementById("sale-form"),
  restockForm: document.getElementById("restock-form"),
  catalogTable: document.getElementById("catalog-table"),
  catalogGalleryGrid: document.getElementById("catalog-gallery-grid"),
  catalogGallerySearch: document.getElementById("catalog-gallery-search"),
  catalogGalleryCount: document.getElementById("catalog-gallery-count"),
  themeList: document.getElementById("theme-list"),
  salesList: document.getElementById("sales-list"),
  restockList: document.getElementById("restock-list"),
  saleSku: document.getElementById("sale-sku"),
  salePricePreview: document.getElementById("sale-price-preview"),
  skuSuggestions: document.getElementById("sku-suggestions"),
  restockSku: document.getElementById("restock-sku"),
  topProductsChart: document.getElementById("top-products-chart"),
  salesChannelChart: document.getElementById("sales-channel-chart"),
  materialChart: document.getElementById("material-chart"),
  stockAlerts: document.getElementById("stock-alerts"),
  assistantReport: document.getElementById("assistant-report"),
  assistantThemeChart: document.getElementById("assistant-theme-chart"),
  assistantColorChart: document.getElementById("assistant-color-chart"),
  assistantTopTheme: document.getElementById("assistant-top-theme"),
  assistantTopThemeDetail: document.getElementById("assistant-top-theme-detail"),
  assistantTopMaterial: document.getElementById("assistant-top-material"),
  assistantTopMaterialDetail: document.getElementById("assistant-top-material-detail"),
  assistantTopColor: document.getElementById("assistant-top-color"),
  assistantTopColorDetail: document.getElementById("assistant-top-color-detail"),
  assistantLowStockCount: document.getElementById("assistant-low-stock-count"),
  quickSaleForm: document.getElementById("quick-sale-form"),
  quickSaleGrid: document.getElementById("quick-sale-grid"),
  quickSaleSku: document.getElementById("quick-sale-sku"),
  quickSaleQuantity: document.getElementById("quick-sale-quantity"),
  quickSalePricePreview: document.getElementById("quick-sale-price-preview"),
  quickSalePreview: document.getElementById("quick-sale-preview"),
  quickSaleChannel: document.getElementById("quick-sale-channel"),
  scannerChannel: document.getElementById("scanner-channel"),
  scannerVideo: document.getElementById("scanner-video"),
  scannerStatus: document.getElementById("scanner-status"),
  scannerLastRead: document.getElementById("scanner-last-read"),
  scannerCart: document.getElementById("scanner-cart"),
  scannerCartCount: document.getElementById("scanner-cart-count"),
  scannerCartTotal: document.getElementById("scanner-cart-total"),
  startScanner: document.getElementById("start-scanner"),
  stopScanner: document.getElementById("stop-scanner"),
  captureScannerFrame: document.getElementById("capture-scanner-frame"),
  uploadScannerImage: document.getElementById("upload-scanner-image"),
  scannerImageFile: document.getElementById("scanner-image-file"),
  clearScannerCart: document.getElementById("clear-scanner-cart"),
  confirmScannerSale: document.getElementById("confirm-scanner-sale"),
  productTheme: document.getElementById("product-theme"),
  productQrPreview: document.getElementById("product-qr-preview"),
  generateQrButton: document.getElementById("generate-qr-button"),
  verifyQrButton: document.getElementById("verify-qr-button"),
  downloadQrButton: document.getElementById("download-qr-button"),
  catalogSearch: document.getElementById("catalog-search"),
  catalogThemeFilter: document.getElementById("catalog-theme-filter"),
  catalogMaterialFilter: document.getElementById("catalog-material-filter"),
  catalogStockFilter: document.getElementById("catalog-stock-filter"),
  catalogDateFrom: document.getElementById("catalog-date-from"),
  catalogDateTo: document.getElementById("catalog-date-to"),
  catalogMinUnits: document.getElementById("catalog-min-units"),
  clearCatalogFilters: document.getElementById("clear-catalog-filters"),
  productMaterial: document.getElementById("product-material"),
  restockMaterial: document.getElementById("restock-material"),
  catalogCount: document.getElementById("catalog-count"),
  salesCount: document.getElementById("sales-count"),
  salesSearch: document.getElementById("sales-search"),
  salesChannelFilter: document.getElementById("sales-channel-filter"),
  salesDateFrom: document.getElementById("sales-date-from"),
  salesDateTo: document.getElementById("sales-date-to"),
  restockCount: document.getElementById("restock-count"),
  lastUpdated: document.getElementById("last-updated"),
  syncStatus: document.getElementById("sync-status"),
  statTotalStock: document.getElementById("stat-total-stock"),
  statActiveProducts: document.getElementById("stat-active-products"),
  statTotalSales: document.getElementById("stat-total-sales"),
  statRevenue: document.getElementById("stat-revenue"),
  seedButton: document.getElementById("seed-button"),
  resetButton: document.getElementById("reset-button"),
  exportButton: document.getElementById("export-button"),
  importButton: document.getElementById("import-button"),
  importFile: document.getElementById("import-file"),
  toast: document.getElementById("toast"),
  runtimeError: document.getElementById("runtime-error"),
  productDetailModal: document.getElementById("product-detail-modal"),
  closeProductDetail: document.getElementById("close-product-detail"),
  productDetailTitle: document.getElementById("product-detail-title"),
  productDetailImage: document.getElementById("product-detail-image"),
  productDetailQrPreview: document.getElementById("product-detail-qr-preview"),
  productDetailGenerateQr: document.getElementById("product-detail-generate-qr"),
  productDetailDownloadQr: document.getElementById("product-detail-download-qr"),
  productDetailDelete: document.getElementById("product-detail-delete"),
  productDetailForm: document.getElementById("product-detail-form"),
  productDetailTheme: document.getElementById("product-detail-theme"),
  productDetailMaterial: document.getElementById("product-detail-material"),
};

init().catch((error) => {
  console.error(error);
  showRuntimeError(error?.message || "No pude iniciar la app.");
});

async function init() {
  installRuntimeErrorReporter();
  registerServiceWorker();
  hydrateLegacyState();
  hydrateThemes();
  populateMaterialSelects();
  setTodayDefaults();
  bindEvents();
  if (!window.location.hash) {
    window.location.hash = "#dashboard";
  }
  syncNavigationFromHash();
  await initRemoteSync();
  render();
}

function bindEvents() {
  els.navLinks.forEach((button) => {
    bindPress(button, () => {
      const href = button.getAttribute("href") || "#view=dashboard";
      applyNavigationHref(href);
    });
  });

  els.sectionTabs.forEach((button) => {
    bindPress(button, () => {
      const href = button.getAttribute("href") || "#view=dashboard";
      applyNavigationHref(href);
    });
  });

  window.addEventListener("hashchange", syncNavigationFromHash);

  els.productForm.addEventListener("submit", handleProductSubmit);
  els.themeForm.addEventListener("submit", handleThemeSubmit);
  els.saleForm.addEventListener("submit", handleSaleSubmit);
  els.restockForm.addEventListener("submit", handleRestockSubmit);
  els.quickSaleForm.addEventListener("submit", handleQuickSaleSubmit);
  els.startScanner.addEventListener("click", startScanner);
  els.stopScanner.addEventListener("click", stopScanner);
  els.captureScannerFrame.addEventListener("click", captureScannerFrame);
  els.uploadScannerImage.addEventListener("click", () => els.scannerImageFile.click());
  els.scannerImageFile.addEventListener("change", handleScannerImageUpload);
  els.clearScannerCart.addEventListener("click", clearScannerCart);
  els.confirmScannerSale.addEventListener("click", confirmScannerSale);
  els.scannerCart.addEventListener("click", handleScannerCartClick);
  els.scannerCart.addEventListener("change", handleScannerCartChange);
  els.catalogGalleryGrid.addEventListener("click", handleCatalogGalleryClick);
  els.closeProductDetail.addEventListener("click", closeProductDetailModal);
  els.productDetailModal.addEventListener("click", handleProductDetailBackdrop);
  els.productDetailForm.addEventListener("submit", handleProductDetailSubmit);
  els.productDetailGenerateQr.addEventListener("click", handleProductDetailGenerateQr);
  els.productDetailDownloadQr.addEventListener("click", downloadCurrentQrPng);
  els.productDetailDelete.addEventListener("click", handleProductDelete);
  els.generateQrButton.addEventListener("click", handleGenerateQr);
  els.verifyQrButton.addEventListener("click", verifyCurrentQr);
  els.downloadQrButton.addEventListener("click", downloadCurrentQrPng);
  els.seedButton.addEventListener("click", seedDemoData);
  els.resetButton.addEventListener("click", resetAllData);
  els.exportButton.addEventListener("click", exportBackup);
  els.importButton.addEventListener("click", () => els.importFile.click());
  els.importFile.addEventListener("change", importBackup);
  els.quickSaleGrid.addEventListener("click", handleQuickSaleClick);

  [
    els.catalogSearch,
    els.catalogGallerySearch,
    els.catalogThemeFilter,
    els.catalogMaterialFilter,
    els.catalogStockFilter,
    els.catalogDateFrom,
    els.catalogDateTo,
    els.catalogMinUnits,
    els.quickSaleSku,
    els.quickSaleQuantity,
    els.quickSaleChannel,
    els.saleSku,
    els.salesSearch,
    els.salesChannelFilter,
    els.salesDateFrom,
    els.salesDateTo,
  ].forEach((element) => {
    element.addEventListener("input", render);
    element.addEventListener("change", render);
  });

  els.clearCatalogFilters.addEventListener("click", () => {
    els.catalogSearch.value = "";
    els.catalogThemeFilter.value = "all";
    els.catalogMaterialFilter.value = "all";
    els.catalogStockFilter.value = "all";
    els.catalogDateFrom.value = "";
    els.catalogDateTo.value = "";
    els.catalogMinUnits.value = "";
    render();
  });
}

function bindPress(element, handler) {
  element.addEventListener("click", (event) => {
    if (element.tagName !== "A") {
      event.preventDefault();
    }
    handler();
  });

  element.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handler();
  });
}

function syncNavigationFromHash() {
  const target = window.location.hash.replace(/^#/, "").trim() || "dashboard";

  if (["dashboard", "catalog", "sales", "restock", "assistant"].includes(target)) {
    activateView(target);
    if (target === "catalog") {
      activateSectionTab("catalog", "catalog-gallery");
    }
    if (target === "sales") {
      activateSectionTab("sales", "sales-fast");
    }
    return;
  }

  if (["catalog-gallery", "catalog-themes", "catalog-filters", "catalog-new"].includes(target)) {
    activateView("catalog");
    activateSectionTab("catalog", target);
    return;
  }

  if (["sales-fast", "sales-scan", "sales-manual", "sales-history"].includes(target)) {
    activateView("sales");
    activateSectionTab("sales", target);
    return;
  }

  activateView("dashboard");
}

function applyNavigationHref(href) {
  const hashValue = String(href || "#dashboard");
  if (window.location.hash !== hashValue) {
    window.location.hash = hashValue;
  }

  syncNavigationFromHash();
}

function hydrateLegacyState() {
  state.products = (state.products || []).map((product) => ({
    image: "",
    createdAt: product.createdAt || todayString(),
    lastRestockAt: product.lastRestockAt || product.createdAt || todayString(),
    character: product.character === "No" ? "No" : "Si",
    ...product,
  }));

  state.restocks = (state.restocks || []).map((restock) => ({
    material: restock.material || findProduct(restock.sku)?.material || "Vinilo blanco",
    ...restock,
  }));
}

function hydrateThemes() {
  const derivedThemes = [...new Set(state.products.map((product) => product.theme).filter(Boolean))];
  const storedThemes = Array.isArray(state.themes) ? state.themes : [];
  state.themes = [...new Set([...storedThemes, ...derivedThemes])].sort((a, b) =>
    a.localeCompare(b),
  );

  if (!state.themes.length) {
    state.themes = ["Anime", "Gaming", "Ilustracion", "Kawaii"];
  }
}

function populateMaterialSelects() {
  const options = MATERIAL_OPTIONS.map(
    (option) => `<option value="${option}">${option}</option>`,
  ).join("");

  els.productMaterial.innerHTML = options;
  els.restockMaterial.innerHTML = options;
}

function setTodayDefaults() {
  const today = todayString();
  els.saleForm.elements.date.value = today;
  els.restockForm.elements.date.value = today;
}

function activateView(viewId) {
  if (viewId !== "sales") {
    stopScanner();
  }

  els.navLinks.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewId);
  });

  els.views.forEach((view) => {
    view.classList.toggle("active", view.id === viewId);
  });
}

function activateSectionTab(group, tabId) {
  if (group === "sales" && tabId !== "sales-scan") {
    stopScanner();
  }

  els.sectionTabs.forEach((button) => {
    const isSameGroup = button.dataset.tabGroup === group;
    button.classList.toggle("active", isSameGroup && button.dataset.tab === tabId);
  });

  els.tabPanels.forEach((panel) => {
    const isSameGroup = panel.dataset.tabGroup === group;
    panel.classList.toggle("active", isSameGroup && panel.id === tabId);
  });

  if (group === "catalog" && tabId === "catalog-gallery") {
    renderCatalogGallery();
  }
}

async function handleProductSubmit(event) {
  event.preventDefault();
  const formElement = event.currentTarget;
  const form = new FormData(formElement);
  const imageFile = form.get("image");
  const image = imageFile && imageFile.size ? await readFileAsDataUrl(imageFile) : "";
  const normalizedSku = sanitizeSku(form.get("sku"));

  if (!normalizedSku) {
    window.alert("Ingresa un SKU valido.");
    return;
  }

  await prepareRemoteMutation();

  const product = {
    sku: normalizedSku,
    name: String(form.get("name")).trim(),
    theme: String(form.get("theme")).trim() || "Sin tema",
    character: String(form.get("character")).trim() || "No",
    material: String(form.get("material")),
    color: String(form.get("color")).trim() || "Sin color",
    price: Number(form.get("price") || 0),
    stock: Number(form.get("stock") || 0),
    minStock: Number(form.get("minStock") || 0),
    tags: String(form.get("tags")).trim(),
    image,
    createdAt: todayString(),
    lastRestockAt: todayString(),
  };

  const existingProduct = findProduct(product.sku);
  if (existingProduct) {
    window.alert(`Ese SKU ya existe y pertenece a ${existingProduct.name}. Elegi uno distinto.`);
    return;
  }

  state.products.unshift(product);
  lastCreatedSku = product.sku;

  if (!state.themes.includes(product.theme)) {
    state.themes.push(product.theme);
    state.themes.sort((a, b) => a.localeCompare(b));
  }

  if (product.stock > 0) {
    state.restocks.unshift({
      id: makeId(),
      sku: product.sku,
      quantity: product.stock,
      unitCost: 0,
      material: product.material,
      date: todayString(),
      batch: "Stock inicial",
    });
  }

  await persistState({ immediateRemote: true });
  showToast(`Modelo ingresado: ${product.name}`);
  formElement.reset();
  setTodayDefaults();
  render();
}

async function handleThemeSubmit(event) {
  event.preventDefault();
  const formElement = event.currentTarget;
  const form = new FormData(formElement);
  const themeName = String(form.get("themeName")).trim();

  if (!themeName) {
    return;
  }

  if (state.themes.some((theme) => normalizeText(theme) === normalizeText(themeName))) {
    window.alert("Esa tematica ya existe.");
    return;
  }

  await prepareRemoteMutation();

  state.themes.push(themeName);
  state.themes.sort((a, b) => a.localeCompare(b));
  await persistState({ immediateRemote: true });
  formElement.reset();
  render();
  showToast(`Tematica agregada: ${themeName}`);
}

async function handleSaleSubmit(event) {
  event.preventDefault();
  const formElement = event.currentTarget;
  const form = new FormData(formElement);
  const product = findProduct(String(form.get("sku")));

  const success = await registerSale({
    sku: String(form.get("sku")),
    channel: String(form.get("channel")),
    quantity: Number(form.get("quantity") || 0),
    unitPrice: product?.price || 0,
    reference: "",
    date: String(form.get("date")),
    notes: String(form.get("notes")).trim(),
  });

  if (!success) {
    return;
  }

  formElement.reset();
  setTodayDefaults();
  render();
  showToast("Venta registrada");
}

async function handleRestockSubmit(event) {
  event.preventDefault();
  const formElement = event.currentTarget;
  const form = new FormData(formElement);
  const sku = String(form.get("sku"));
  const quantity = Number(form.get("quantity") || 0);
  const product = findProduct(sku);

  if (!product) {
    window.alert("Selecciona un modelo valido.");
    return;
  }

  if (quantity <= 0) {
    window.alert("La cantidad debe ser mayor a cero.");
    return;
  }

  await prepareRemoteMutation();
  const freshProduct = findProduct(sku);
  if (!freshProduct) {
    window.alert("No pude actualizar ese modelo antes de guardar el ingreso.");
    return;
  }

  freshProduct.stock += quantity;
  freshProduct.material = String(form.get("material"));
  freshProduct.lastRestockAt = String(form.get("date")) || todayString();

  state.restocks.unshift({
    id: makeId(),
    sku,
    quantity,
    unitCost: Number(form.get("unitCost") || 0),
    material: String(form.get("material")),
    date: String(form.get("date")),
    batch: String(form.get("batch")).trim(),
  });

  await persistState({ immediateRemote: true });
  formElement.reset();
  setTodayDefaults();
  render();
  showToast(`Ingreso registrado para ${freshProduct.name}`);
}

async function handleQuickSaleClick(event) {
  const button = event.target.closest("[data-quick-sale]");
  if (!button) {
    return;
  }

  const sku = button.dataset.sku;
  const quantity = Number(button.dataset.quantity);
  const product = findProduct(sku);

  if (!product) {
    return;
  }

  const success = await registerSale({
    sku,
    channel: els.quickSaleChannel.value,
    quantity,
    unitPrice: product.price,
    reference: "Venta rapida",
    date: todayString(),
    notes: "Carga rapida",
  });

  if (!success) {
    return;
  }

  render();
  focusQuickSaleSku();
}

async function handleQuickSaleSubmit(event) {
  event.preventDefault();
  const sku = sanitizeSku(els.quickSaleSku.value);
  const quantity = Number(els.quickSaleQuantity.value || 0);
  const product = findProduct(sku);

  if (!product) {
    window.alert("No encontre ese SKU o ID. Revisa el codigo.");
    return;
  }

  const success = await registerSale({
    sku,
    channel: els.quickSaleChannel.value,
    quantity,
    unitPrice: product.price,
    reference: "",
    date: todayString(),
    notes: "Carga rapida por SKU",
  });

  if (!success) {
    return;
  }

  els.quickSaleForm.reset();
  els.quickSaleQuantity.value = "1";
  els.quickSaleChannel.value = "Feria";
  render();
  focusQuickSaleSku();
}

async function startScanner() {
  if (scannerState.active) {
    return;
  }

  if (!window.isSecureContext) {
    setScannerStatus(
      "Camara bloqueada por seguridad",
      "En celular, la camara necesita abrir la app en HTTPS o localhost. Con una IP en HTTP el navegador la bloquea.",
    );
    return;
  }

  if (!("mediaDevices" in navigator) || !navigator.mediaDevices.getUserMedia) {
    setScannerStatus("Camara no disponible", "Este navegador no soporta acceso a la camara.");
    return;
  }

  if (typeof window.jsQR !== "function") {
    setScannerStatus(
      "Escaner no soportado",
      "No pude cargar el lector QR principal.",
    );
    return;
  }

  try {
    scannerState.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });
    els.scannerVideo.srcObject = scannerState.stream;
    await els.scannerVideo.play();
    scannerState.active = true;
    scannerState.engine = "jsqr";
    scannerState.lastAttemptAt = 0;
    ensureScannerCanvas();
    setScannerStatus("Camara activa", "Escaner QR listo para leer en tiempo real.");
    scanFrame();
  } catch (error) {
    console.error(error);
    setScannerStatus(
      "No pude iniciar la camara",
      `${error?.name || "Error"}${error?.message ? `: ${error.message}` : ""}`,
    );
  }
}

function stopScanner() {
  if (scannerState.frameId) {
    cancelAnimationFrame(scannerState.frameId);
    scannerState.frameId = null;
  }

  if (scannerState.stream) {
    scannerState.stream.getTracks().forEach((track) => track.stop());
    scannerState.stream = null;
  }

  scannerState.active = false;
  scannerState.engine = "";
  scannerState.lastAttemptAt = 0;
  if (els.scannerVideo) {
    els.scannerVideo.srcObject = null;
  }
  setScannerStatus("Camara inactiva", "Inicia la camara y apunta al codigo del sticker.");
}

async function scanFrame() {
  if (!scannerState.active || scannerState.engine !== "jsqr") {
    return;
  }

  try {
    const now = performance.now();
    if (now - scannerState.lastAttemptAt >= 120) {
      scannerState.lastAttemptAt = now;
      const qrValue = decodeQrFromVideo();
      if (qrValue) {
        processDetectedCode(qrValue);
      }
    }
  } catch (error) {
    console.error("Error al escanear", error);
  }

  scannerState.frameId = requestAnimationFrame(scanFrame);
}

function processDetectedCode(rawValue) {
  const code = sanitizeSku(rawValue);
  const now = Date.now();
  if (!code) {
    return;
  }

  if (scannerState.lastScanValue === code && now - scannerState.lastScanAt < 1200) {
    return;
  }

  scannerState.lastScanValue = code;
  scannerState.lastScanAt = now;

  const product = findProduct(code);
  if (!product) {
    setScannerLastRead(code, null, "Codigo no encontrado en catalogo.");
    renderScanner();
    return;
  }

  const added = addScannerItem(product.sku);
  renderScanner();
  if (!added) {
    return;
  }

  setScannerLastRead(code, product, "Sticker agregado a la venta.");
}

function addScannerItem(sku) {
  const product = findProduct(sku);
  if (!product || product.stock <= 0) {
    if (product) {
      setScannerLastRead(product.sku, product, "No hay stock disponible para agregar este sticker.");
    }
    return false;
  }

  const existingItem = scannerState.cart.find((item) => item.sku === product.sku);
  const currentQty = existingItem ? existingItem.quantity : 0;
  if (currentQty >= product.stock) {
    setScannerLastRead(product.sku, product, "No puedes superar el stock disponible.");
    return false;
  }

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    scannerState.cart.push({ sku: product.sku, quantity: 1 });
  }

  return true;
}

function clearScannerCart() {
  scannerState.cart = [];
  renderScanner();
}

function handleScannerCartClick(event) {
  const removeButton = event.target.closest("[data-remove-sku]");
  if (!removeButton) {
    return;
  }

  removeScannerItem(removeButton.dataset.removeSku);
}

function handleScannerCartChange(event) {
  const quantityInput = event.target.closest("[data-quantity-sku]");
  if (!quantityInput) {
    return;
  }

  updateScannerItemQuantity(quantityInput.dataset.quantitySku, Number(quantityInput.value));
}

function removeScannerItem(sku) {
  scannerState.cart = scannerState.cart.filter((item) => item.sku !== sku);
  renderScanner();
}

function updateScannerItemQuantity(sku, quantity) {
  const product = findProduct(sku);
  const item = scannerState.cart.find((entry) => entry.sku === sku);
  if (!product || !item) {
    return;
  }

  const safeQuantity = Number.isFinite(quantity) ? Math.max(0, Math.floor(quantity)) : item.quantity;
  if (safeQuantity === 0) {
    removeScannerItem(sku);
    return;
  }

  item.quantity = Math.min(safeQuantity, product.stock);
  renderScanner();
}

async function captureScannerFrame() {
  if (!els.scannerVideo.videoWidth || !els.scannerVideo.videoHeight) {
    window.alert("La camara no esta lista para capturar.");
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = els.scannerVideo.videoWidth;
  canvas.height = els.scannerVideo.videoHeight;
  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  context.drawImage(els.scannerVideo, 0, 0, canvas.width, canvas.height);
  await decodeCanvasForScanner(canvas, "Lectura desde captura");
}

async function handleScannerImageUpload(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  try {
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = imageUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    if (!context) {
      URL.revokeObjectURL(imageUrl);
      return;
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(imageUrl);
    await decodeCanvasForScanner(canvas, "Lectura desde imagen");
  } catch (error) {
    console.error(error);
    window.alert("No pude leer esa imagen.");
  } finally {
    event.target.value = "";
  }
}

function ensureScannerCanvas() {
  if (!scannerState.scanCanvas) {
    scannerState.scanCanvas = document.createElement("canvas");
    scannerState.scanContext = scannerState.scanCanvas.getContext("2d", { willReadFrequently: true });
  }
}

function decodeQrFromVideo() {
  if (!els.scannerVideo.videoWidth || !els.scannerVideo.videoHeight) {
    return null;
  }

  ensureScannerCanvas();
  const maxWidth = 960;
  const scale = Math.min(1, maxWidth / els.scannerVideo.videoWidth);
  const width = Math.max(320, Math.floor(els.scannerVideo.videoWidth * scale));
  const height = Math.max(320, Math.floor(els.scannerVideo.videoHeight * scale));
  scannerState.scanCanvas.width = width;
  scannerState.scanCanvas.height = height;
  scannerState.scanContext.drawImage(els.scannerVideo, 0, 0, width, height);
  return decodeQrFromCanvas(scannerState.scanCanvas);
}

function decodeQrFromCanvas(canvas) {
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return null;
  }

  const { width, height } = canvas;
  const imageData = context.getImageData(0, 0, width, height);
  const result = window.jsQR(imageData.data, width, height, {
    inversionAttempts: "attemptBoth",
  });
  return result?.data || null;
}

async function decodeCanvasForScanner(canvas, sourceLabel) {
  try {
    const qrValue = decodeQrFromCanvas(canvas);
    if (qrValue) {
      processDetectedCode(qrValue);
      setScannerStatus("Lectura exitosa", `${sourceLabel} encontro un QR.`);
      return;
    }

    setScannerStatus("Sin lectura", `${sourceLabel} no encontro ningun QR.`);
  } catch (error) {
    console.error(error);
    setScannerStatus("Error de lectura", `${sourceLabel} no pudo decodificar el QR.`);
  }
}

async function confirmScannerSale() {
  if (!scannerState.cart.length) {
    window.alert("Todavia no hay stickers escaneados.");
    return;
  }

  for (const item of scannerState.cart) {
    const product = findProduct(item.sku);
    const success = await registerSale({
      sku: item.sku,
      channel: els.scannerChannel.value,
      quantity: item.quantity,
      unitPrice: product?.price || 0,
      reference: "",
      date: todayString(),
      notes: "Venta confirmada por escaner",
    });

    if (!success) {
      return;
    }
  }

  scannerState.cart = [];
  setScannerLastRead("", null, "Venta confirmada y stock actualizado.");
  render();
}

async function registerSale({ sku, channel, quantity, unitPrice, reference, date, notes }) {
  await prepareRemoteMutation();
  const product = findProduct(sku);

  if (!product) {
    window.alert("Selecciona un modelo valido.");
    return false;
  }

  if (quantity <= 0) {
    window.alert("La cantidad debe ser mayor a cero.");
    return false;
  }

  if (product.stock < quantity) {
    window.alert("No hay stock suficiente para registrar esa venta.");
    return false;
  }

  product.stock -= quantity;
  state.sales.unshift({
    id: makeId(),
    sku,
    channel,
    quantity,
    unitPrice: unitPrice || product.price,
    reference,
    date: date || todayString(),
    notes,
  });

  await persistState({ immediateRemote: true });
  return true;
}

function render() {
  renderSelects();
  renderThemes();
  renderCatalogGallery();
  renderCatalog();
  renderQuickSale();
  renderScanner();
  renderSales();
  renderRestocks();
  renderDashboard();
  renderAssistant();
  renderLastUpdated();
}

async function handleGenerateQr() {
  const skuInput = els.productForm.elements.sku?.value;
  const sku = sanitizeSku(skuInput);
  if (!sku) {
    window.alert("Ingresa primero un SKU para generar el QR.");
    return;
  }
  await renderQrForSku(sku);
}

function renderSelects() {
  const products = getSortedProducts();
  const options = products
    .map(
      (product) =>
        `<option value="${product.sku}">${product.name} - ${product.sku} - stock ${product.stock}</option>`,
    )
    .join("");

  const placeholder = `<option value="">Selecciona un modelo</option>`;
  els.saleSku.innerHTML = placeholder + options;
  els.restockSku.innerHTML = placeholder + options;
  els.skuSuggestions.innerHTML = products
    .map((product) => `<option value="${product.sku}">${product.name}</option>`)
    .join("");
  els.productTheme.innerHTML = state.themes
    .map((theme) => `<option value="${theme}">${theme}</option>`)
    .join("");
  els.productDetailTheme.innerHTML = state.themes
    .map((theme) => `<option value="${theme}">${theme}</option>`)
    .join("");
  els.productDetailMaterial.innerHTML = MATERIAL_OPTIONS.map(
    (material) => `<option value="${material}">${material}</option>`,
  ).join("");
  populateCatalogFilters();
  updateSalePricePreview();
}

function renderThemes() {
  els.themeList.innerHTML = state.themes.length
    ? state.themes
        .map(
          (theme) =>
            `<article class="list-item"><strong>${theme}</strong><div class="hint">Disponible para nuevos modelos</div></article>`,
        )
        .join("")
    : "<p>No hay tematicas cargadas todavia.</p>";
}

function populateCatalogFilters() {
  const themes = [...new Set(state.products.map((product) => product.theme))].sort();
  const materials = [...new Set(state.products.map((product) => product.material))].sort();

  const themeValue = els.catalogThemeFilter.value || "all";
  const materialValue = els.catalogMaterialFilter.value || "all";

  els.catalogThemeFilter.innerHTML =
    `<option value="all">Todas</option>` +
    themes.map((theme) => `<option value="${theme}">${theme}</option>`).join("");
  els.catalogMaterialFilter.innerHTML =
    `<option value="all">Todos</option>` +
    materials.map((material) => `<option value="${material}">${material}</option>`).join("");

  els.catalogThemeFilter.value = themes.includes(themeValue) ? themeValue : "all";
  els.catalogMaterialFilter.value = materials.includes(materialValue) ? materialValue : "all";
}

function renderCatalog() {
  const filteredProducts = getFilteredCatalogProducts();
  els.catalogCount.textContent = `${filteredProducts.length} modelos visibles`;

  if (!filteredProducts.length) {
    els.catalogTable.innerHTML = "<p>No hay modelos que coincidan con los filtros.</p>";
    return;
  }

  els.catalogTable.innerHTML = filteredProducts
    .map((product) => {
      const stockClass = product.stock <= product.minStock ? "low" : "good";
      return `
        <article class="catalog-card">
          ${renderProductImage(product)}
          <div>
            <div class="panel-header">
              <div>
                <strong>${product.name}</strong>
                <div class="hint">${product.sku}</div>
              </div>
              <span class="status-tag ${stockClass}">${product.stock} u.</span>
            </div>
            <div class="catalog-meta">
              <span class="status-tag accent">${product.theme}</span>
              <span class="status-tag">Personaje ${product.character}</span>
              <span class="status-tag">${product.material}</span>
              <span class="status-tag">${product.color}</span>
            </div>
            <p class="hint">Ingreso: ${formatDate(product.lastRestockAt)} - Minimo ${product.minStock}</p>
            <p class="hint">${product.tags || "Sin tags"}</p>
            <strong>${formatCurrency(product.price)}</strong>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderCatalogGallery() {
  const search = normalizeText(els.catalogGallerySearch.value);
  const products = getSortedProducts().filter((product) => {
    if (!search) {
      return true;
    }

    return normalizeText(`${product.name} ${product.sku}`).includes(search);
  });

  els.catalogGalleryCount.textContent = `${products.length} modelos`;
  els.catalogGalleryGrid.innerHTML = products.length
    ? products
        .map(
          (product) => `
            <article class="magazine-card ${sanitizeSku(product.sku) === sanitizeSku(lastCreatedSku) ? "just-added" : ""}" role="button" tabindex="0" data-open-product="${product.sku}">
              ${renderProductImage(product)}
              <div>
                <strong>${product.name}</strong>
                <div class="hint">${product.sku}</div>
              </div>
              <div class="catalog-meta">
                <span class="status-tag accent">${product.theme}</span>
                <span class="status-tag">${product.material}</span>
                <span class="status-tag ${product.stock <= product.minStock ? "low" : "good"}">${product.stock} u.</span>
              </div>
            </article>
          `,
        )
        .join("")
    : "<p>No hay stickers que coincidan con esa busqueda.</p>";
}

function renderQuickSale() {
  const lookupSku = sanitizeSku(els.quickSaleSku.value);
  const previewProduct = findProduct(lookupSku);
  els.quickSalePricePreview.textContent = previewProduct
    ? formatCurrency(previewProduct.price)
    : "$0";

  els.quickSalePreview.innerHTML = previewProduct
    ? `
      <article class="list-item">
        <div>
          <strong>${previewProduct.name}</strong>
          <div class="hint">${previewProduct.sku} - personaje ${previewProduct.character}</div>
        </div>
        <div>
          <span class="status-tag ${previewProduct.stock <= previewProduct.minStock ? "low" : "good"}">${previewProduct.stock} unidades</span>
          <div class="hint">${previewProduct.material} - ${formatCurrency(previewProduct.price)}</div>
        </div>
      </article>
    `
    : "<p>Escribe un SKU para ver el modelo antes de registrar la venta.</p>";

  const products = getSortedProducts()
    .filter((product) => product.stock > 0)
    .sort((a, b) => {
      const soldA = getSoldUnitsForSku(a.sku);
      const soldB = getSoldUnitsForSku(b.sku);
      return soldB - soldA || a.name.localeCompare(b.name);
    });

  if (!products.length) {
    els.quickSaleGrid.innerHTML = "<p>No hay modelos con stock para venta rapida.</p>";
    return;
  }

  els.quickSaleGrid.innerHTML = products
    .slice(0, 9)
    .map(
      (product) => `
        <article class="quick-sale-card">
          <div class="panel-header">
            <div>
              <strong>${product.name}</strong>
              <div class="hint">${product.sku}</div>
            </div>
            <span class="status-tag ${product.stock <= product.minStock ? "low" : "good"}">${product.stock} u.</span>
          </div>
          <div class="quick-sale-meta">
            <span class="status-tag">${product.material}</span>
            <span class="status-tag">${product.color}</span>
            <span class="status-tag">${formatCurrency(product.price)}</span>
          </div>
          <div class="quick-sale-actions">
            <button class="quick-sale-button" data-quick-sale="true" data-sku="${product.sku}" data-quantity="1">Vender 1</button>
            <button class="quick-sale-button" data-quick-sale="true" data-sku="${product.sku}" data-quantity="2" ${product.stock < 2 ? "disabled" : ""}>Vender 2</button>
            <button class="quick-sale-button" data-quick-sale="true" data-sku="${product.sku}" data-quantity="3" ${product.stock < 3 ? "disabled" : ""}>Vender 3</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderScanner() {
  const enrichedCart = scannerState.cart
    .map((item) => ({ ...item, product: findProduct(item.sku) }))
    .filter((item) => item.product);

  const totalUnits = enrichedCart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = enrichedCart.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0,
  );

  els.scannerCartCount.textContent = String(totalUnits);
  els.scannerCartTotal.textContent = formatCurrency(totalAmount);

  els.scannerCart.innerHTML = enrichedCart.length
    ? enrichedCart
        .map(
          (item) => `
            <article class="list-item">
              <div>
                <strong>${item.product.name}</strong>
                <div class="hint">${item.product.sku} - ${item.product.material} - stock ${item.product.stock}</div>
              </div>
              <div class="scanner-cart-controls">
                <label class="scanner-quantity-field">
                  <span class="hint">Cantidad</span>
                  <input
                    type="number"
                    min="0"
                    max="${item.product.stock}"
                    step="1"
                    value="${item.quantity}"
                    data-quantity-sku="${item.product.sku}"
                  />
                </label>
                <div class="scanner-item-meta">
                  <span class="status-tag good">${formatCurrency(item.product.price)} c/u</span>
                  <button type="button" class="ghost-button" data-remove-sku="${item.product.sku}">Quitar</button>
                </div>
              </div>
            </article>
          `,
        )
        .join("")
    : "<p>No hay stickers escaneados todavia.</p>";

  if (!els.scannerLastRead.innerHTML.trim()) {
    els.scannerLastRead.innerHTML = "<p>El ultimo codigo escaneado aparecera aqui.</p>";
  }
}

function renderSales() {
  const search = normalizeText(els.salesSearch.value);
  const channel = els.salesChannelFilter.value;
  const dateFrom = els.salesDateFrom.value;
  const dateTo = els.salesDateTo.value;

  const filteredSales = state.sales.filter((sale) => {
    const product = findProduct(sale.sku);
    const haystack = normalizeText(`${sale.sku} ${product?.name || ""} ${sale.notes || ""}`);
    const matchesSearch = !search || haystack.includes(search);
    const matchesChannel = channel === "all" || sale.channel === channel;
    const matchesFrom = !dateFrom || sale.date >= dateFrom;
    const matchesTo = !dateTo || sale.date <= dateTo;
    return matchesSearch && matchesChannel && matchesFrom && matchesTo;
  });

  els.salesCount.textContent = `${filteredSales.length} movimientos`;

  if (!filteredSales.length) {
    els.salesList.innerHTML = "<p>No hay ventas registradas todavia.</p>";
    return;
  }

  els.salesList.innerHTML = `
    <div class="table-scroll">
      <table class="data-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Modelo</th>
            <th>SKU</th>
            <th>Canal</th>
            <th>Unidad</th>
            <th>Precio</th>
            <th>Total</th>
            <th>Notas</th>
          </tr>
        </thead>
        <tbody>
          ${filteredSales
    .map((sale) => {
      const product = findProduct(sale.sku);
      return `
        <tr>
          <td>${formatDate(sale.date)}</td>
          <td>${product ? product.name : "Modelo eliminado"}</td>
          <td>${sale.sku}</td>
          <td>${sale.channel}</td>
          <td>${sale.quantity}</td>
          <td>${formatCurrency(sale.unitPrice)}</td>
          <td>${formatCurrency((sale.unitPrice || 0) * (sale.quantity || 0))}</td>
          <td>${sale.notes || "-"}</td>
        </tr>
      `;
    })
    .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderRestocks() {
  els.restockCount.textContent = `${state.restocks.length} movimientos`;

  if (!state.restocks.length) {
    els.restockList.innerHTML = "<p>No hay ingresos registrados todavia.</p>";
    return;
  }

  els.restockList.innerHTML = state.restocks
    .slice(0, 10)
    .map((restock) => {
      const product = findProduct(restock.sku);
      return `
        <article class="list-item">
          <div>
            <strong>${product ? product.name : restock.sku}</strong>
            <div class="hint">${restock.batch || "Sin lote"} - ${restock.material}</div>
          </div>
          <div>
            <span class="status-tag good">+${restock.quantity} unidades</span>
            <div class="hint">${formatDate(restock.date)} - costo ${formatCurrency(restock.unitCost)}</div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderDashboard() {
  const totalStock = state.products.reduce((sum, product) => sum + product.stock, 0);
  const activeProducts = state.products.filter((product) => product.stock > 0).length;
  const totalSales = state.sales.reduce((sum, sale) => sum + sale.quantity, 0);
  const revenue = state.sales.reduce((sum, sale) => sum + sale.quantity * sale.unitPrice, 0);
  const lowStock = state.products
    .filter((product) => product.stock <= product.minStock)
    .sort((a, b) => a.stock - b.stock);

  els.statTotalStock.textContent = String(totalStock);
  els.statActiveProducts.textContent = String(activeProducts);
  els.statTotalSales.textContent = String(totalSales);
  els.statRevenue.textContent = formatCurrency(revenue);

  renderChart(
    els.topProductsChart,
    aggregateSalesBy((sale) => findProduct(sale.sku)?.name || sale.sku),
    "Aun no hay ventas para rankear modelos.",
  );
  renderChart(
    els.salesChannelChart,
    aggregateSalesBy((sale) => sale.channel),
    "Todavia no hay datos de canales.",
  );
  renderChart(
    els.materialChart,
    aggregateSalesBy((sale) => findProduct(sale.sku)?.material || "Sin material"),
    "Todavia no hay ventas por vinilo.",
  );

  els.stockAlerts.innerHTML = lowStock.length
    ? lowStock
        .map(
          (product) => `
            <article class="list-item">
              <div>
                <strong>${product.name}</strong>
                <div class="hint">${product.sku} - ${product.theme}</div>
              </div>
              <div>
                <span class="status-tag low">${product.stock} en stock</span>
                <div class="hint">Minimo recomendado ${product.minStock}</div>
              </div>
            </article>
          `,
        )
        .join("")
    : "<p>No hay alertas de stock por ahora.</p>";
}

function renderAssistant() {
  const topProductEntry = firstEntry(aggregateSalesBy((sale) => sale.sku));
  const topThemeEntry = firstEntry(
    aggregateSalesBy((sale) => findProduct(sale.sku)?.theme || "Sin tema"),
  );
  const topMaterialEntry = firstEntry(
    aggregateSalesBy((sale) => findProduct(sale.sku)?.material || "Sin material"),
  );
  const topColorEntry = firstEntry(
    aggregateSalesBy((sale) => findProduct(sale.sku)?.color || "Sin color"),
  );
  const lowStock = state.products.filter((product) => product.stock <= product.minStock);

  updateAssistantStat(
    els.assistantTopTheme,
    els.assistantTopThemeDetail,
    topThemeEntry,
    "unidades vendidas",
  );
  updateAssistantStat(
    els.assistantTopMaterial,
    els.assistantTopMaterialDetail,
    topMaterialEntry,
    "unidades vendidas",
  );
  updateAssistantStat(
    els.assistantTopColor,
    els.assistantTopColorDetail,
    topColorEntry,
    "unidades vendidas",
  );
  els.assistantLowStockCount.textContent = String(lowStock.length);

  renderChart(
    els.assistantThemeChart,
    aggregateSalesBy((sale) => findProduct(sale.sku)?.theme || "Sin tema"),
    "Todavia no hay ventas por tematica.",
  );
  renderChart(
    els.assistantColorChart,
    aggregateSalesBy((sale) => findProduct(sale.sku)?.color || "Sin color"),
    "Todavia no hay ventas por color.",
  );

  if (!state.products.length) {
    els.assistantReport.innerHTML =
      "<p>Carga algunos modelos para empezar a generar recomendaciones.</p>";
    return;
  }

  const blocks = [];

  if (topProductEntry) {
    const product = findProduct(topProductEntry.label);
    blocks.push(`
      <article class="assistant-block">
        <strong>Modelo con mejor salida</strong>
        <p>${product ? product.name : topProductEntry.label} vendio ${topProductEntry.value} unidades. Si estas por pedir reposicion, es uno de los candidatos mas fuertes para imprimir otra vez.</p>
      </article>
    `);
  }

  blocks.push(`
    <article class="assistant-block">
      <strong>Lectura de tendencia</strong>
      <p>${topThemeEntry ? `La tematica con mejor desempeno es ${topThemeEntry.label}.` : "Todavia no hay suficiente informacion de tematicas."} ${topMaterialEntry ? `El vinilo que mas rota es ${topMaterialEntry.label}.` : ""} ${topColorEntry ? `El color mas presente entre los vendidos es ${topColorEntry.label}.` : ""}</p>
    </article>
  `);

  blocks.push(`
    <article class="assistant-block">
      <strong>Decision sugerida para el proximo pedido</strong>
      <p>${buildRecommendation(lowStock, topThemeEntry, topMaterialEntry, topColorEntry)}</p>
    </article>
  `);

  els.assistantReport.innerHTML = blocks.join("");
}

function updateAssistantStat(valueElement, detailElement, entry, suffix) {
  if (!entry) {
    valueElement.textContent = "-";
    detailElement.textContent = "Sin datos";
    return;
  }

  valueElement.textContent = entry.label;
  detailElement.textContent = `${entry.value} ${suffix}`;
}

function buildRecommendation(lowStock, topThemeEntry, topMaterialEntry, topColorEntry) {
  if (!state.sales.length) {
    return "Todavia no hay ventas suficientes. Usa esta etapa para cargar catalogo y empezar a registrar movimientos diarios.";
  }

  if (!lowStock.length) {
    return `No hay quiebres urgentes de stock. Podrias priorizar nuevos modelos en ${topThemeEntry?.label || "las tematicas que mejor funcionen"} y sostener presencia en ${topMaterialEntry?.label || "el vinilo mejor posicionado"}.`;
  }

  const urgentNames = lowStock
    .slice(0, 3)
    .map((product) => product.name)
    .join(", ");

  return `Conviene reponer primero ${urgentNames}. Ademas, para aumentar probabilidad de venta, vale la pena sumar opciones en ${topMaterialEntry?.label || "el vinilo mas demandado"} con presencia de ${topColorEntry?.label || "los colores que mejor rotan"} dentro de ${topThemeEntry?.label || "la tematica lider"}.`;
}

function renderChart(container, entries, emptyMessage) {
  if (!entries.length) {
    container.innerHTML = `<p>${emptyMessage}</p>`;
    return;
  }

  const max = entries[0].value;
  container.innerHTML = entries
    .slice(0, 5)
    .map(
      (entry) => `
        <div class="chart-row">
          <span>${entry.label}</span>
          <div class="chart-bar-track">
            <div class="chart-bar" style="width: ${(entry.value / max) * 100}%"></div>
          </div>
          <strong>${entry.value}</strong>
        </div>
      `,
    )
    .join("");
}

function aggregateSalesBy(getLabel) {
  const totals = new Map();

  state.sales.forEach((sale) => {
    const label = getLabel(sale);
    const current = totals.get(label) || 0;
    totals.set(label, current + sale.quantity);
  });

  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

function getFilteredCatalogProducts() {
  const search = normalizeText(els.catalogSearch.value);
  const themeFilter = els.catalogThemeFilter.value || "all";
  const materialFilter = els.catalogMaterialFilter.value || "all";
  const stockFilter = els.catalogStockFilter.value || "all";
  const minUnits = Number(els.catalogMinUnits.value || 0);
  const dateFrom = els.catalogDateFrom.value;
  const dateTo = els.catalogDateTo.value;

  return getSortedProducts().filter((product) => {
    const textMatch =
      !search ||
      normalizeText(
        `${product.sku} ${product.name} ${product.character} ${product.theme} ${product.tags}`,
      ).includes(search);

    const themeMatch = themeFilter === "all" || product.theme === themeFilter;
    const materialMatch = materialFilter === "all" || product.material === materialFilter;
    const unitsMatch = product.stock >= minUnits;
    const stockMatch =
      stockFilter === "all" ||
      (stockFilter === "low" && product.stock <= product.minStock) ||
      (stockFilter === "available" && product.stock > 0) ||
      (stockFilter === "out" && product.stock === 0);

    const lastRestock = product.lastRestockAt || product.createdAt;
    const dateFromMatch = !dateFrom || lastRestock >= dateFrom;
    const dateToMatch = !dateTo || lastRestock <= dateTo;

    return (
      textMatch &&
      themeMatch &&
      materialMatch &&
      unitsMatch &&
      stockMatch &&
      dateFromMatch &&
      dateToMatch
    );
  });
}

function getSortedProducts() {
  return state.products.slice().sort((a, b) => a.name.localeCompare(b.name));
}

function renderProductImage(product) {
  if (product.image) {
    return `<img class="catalog-image" src="${product.image}" alt="${product.name}" />`;
  }

  return `<div class="catalog-image-placeholder">Sin imagen</div>`;
}

function getSoldUnitsForSku(sku) {
  return state.sales
    .filter((sale) => sale.sku === sku)
    .reduce((sum, sale) => sum + sale.quantity, 0);
}

function firstEntry(entries) {
  return entries.length ? entries[0] : null;
}

function findProduct(sku) {
  const normalizedSku = sanitizeSku(sku);
  return state.products.find((product) => sanitizeSku(product.sku) === normalizedSku);
}

function updateSalePricePreview() {
  const selectedProduct = findProduct(els.saleSku.value);
  els.salePricePreview.textContent = selectedProduct ? formatCurrency(selectedProduct.price) : "$0";
}

async function renderQrForSku(sku) {
  await renderQrIntoElement(els.productQrPreview, sku);
}

async function renderQrIntoElement(targetElement, sku) {
  if (!window.QRCode?.toCanvas) {
    targetElement.innerHTML = "<p>No pude cargar el generador de QR.</p>";
    currentQrCanvasDataUrl = "";
    currentQrValue = "";
    return;
  }

  try {
    const wrapper = document.createElement("div");
    const canvas = document.createElement("canvas");
    await window.QRCode.toCanvas(canvas, sku, {
      width: 320,
      margin: 3,
      color: {
        dark: "#111111",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    });
    canvas.className = "qr-canvas";

    const title = document.createElement("div");
    title.className = "hint";
    title.textContent = `Contenido del QR: ${sku}`;

    wrapper.appendChild(canvas);
    wrapper.appendChild(title);
    targetElement.innerHTML = "";
    targetElement.appendChild(wrapper);
    currentQrCanvasDataUrl = canvas.toDataURL("image/png");
    currentQrValue = sku;
  } catch (error) {
    console.error(error);
    targetElement.innerHTML = "<p>No pude generar el QR con ese SKU.</p>";
    currentQrCanvasDataUrl = "";
    currentQrValue = "";
  }
}

function downloadCurrentQrPng() {
  if (!currentQrCanvasDataUrl) {
    window.alert("Primero genera un QR.");
    return;
  }
  const image = new Image();
  image.onerror = () => {
    window.alert("No pude convertir el QR a PNG en este navegador.");
  };
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const link = document.createElement("a");
    const sku =
      currentQrValue || sanitizeSku(els.productForm.elements.sku?.value) || "tuki-qr";
    link.href = canvas.toDataURL("image/png");
    link.download = `${sku}.png`;
    link.click();
  };
  image.src = currentQrCanvasDataUrl;
}

async function verifyCurrentQr() {
  if (!currentQrCanvasDataUrl || !currentQrValue) {
    window.alert("Primero genera un QR.");
    return;
  }

  if (typeof window.jsQR !== "function") {
    window.alert("No pude cargar el verificador QR.");
    return;
  }

  try {
    const image = new Image();

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = currentQrCanvasDataUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      window.alert("No pude preparar la verificacion del QR.");
      return;
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const qrValue = decodeQrFromCanvas(canvas);

    if (sanitizeSku(qrValue) === sanitizeSku(currentQrValue)) {
      window.alert(`QR valido. Texto leido: ${qrValue}`);
      return;
    }

    window.alert(`El QR se genero, pero se leyo distinto: ${qrValue || "sin lectura"}`);
  } catch (error) {
    console.error(error);
    window.alert("No pude verificar ese QR internamente.");
  }
}

function setScannerStatus(title, detail) {
  els.scannerStatus.innerHTML = `<strong>${title}</strong><span class="hint">${detail}</span>`;
}

function setScannerLastRead(code, product, message) {
  els.scannerLastRead.innerHTML = `
    <article class="list-item">
      <div>
        <strong>${product ? product.name : code || "Sin lectura"}</strong>
        <div class="hint">${product ? product.sku : "Codigo no identificado"}</div>
      </div>
      <div>
        <span class="status-tag ${product ? "good" : "low"}">${message}</span>
      </div>
    </article>
  `;
}

function focusQuickSaleSku() {
  window.requestAnimationFrame(() => {
    els.quickSaleSku.focus();
    els.quickSaleSku.select();
  });
}

function loadState() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createEmptyState();
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      products: parsed.products || [],
      themes: parsed.themes || [],
      sales: parsed.sales || [],
      restocks: parsed.restocks || [],
      updatedAt: parsed.updatedAt || null,
    };
  } catch (error) {
    console.error("No se pudo leer el estado guardado", error);
    return createEmptyState();
  }
}

async function persistState(options = {}) {
  state.updatedAt = new Date().toISOString();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return queueRemotePersist(options);
}

async function initRemoteSync() {
  if (!remoteState.enabled) {
    setSyncStatus("Modo local", "Sin sincronizacion remota.");
    return;
  }

  setSyncStatus("Conectando", "Buscando datos compartidos...");
  try {
    const remoteSnapshot = await fetchRemoteSnapshot();
    if (remoteSnapshot) {
      applyStateSnapshot(remoteSnapshot);
    } else {
      await pushRemoteSnapshot();
    }

    remoteState.ready = true;
    remoteState.lastError = "";
    remoteState.lastSyncedAt = Date.now();
    setSyncStatus("Sync activa", "Compu y celu comparten los mismos datos.");
    startRemotePolling();
  } catch (error) {
    console.error(error);
    remoteState.lastError = error?.message || "No pude conectar con la base remota.";
    setSyncStatus("Modo local", remoteState.lastError);
  }
}

function startRemotePolling() {
  if (!remoteState.enabled) {
    return;
  }

  if (remoteState.pollTimer) {
    window.clearInterval(remoteState.pollTimer);
  }

  window.addEventListener("focus", syncFromRemoteIfNeeded);
  window.addEventListener("pageshow", () => {
    syncFromRemoteIfNeeded();
    window.setTimeout(syncFromRemoteIfNeeded, 250);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      syncFromRemoteIfNeeded();
      window.setTimeout(syncFromRemoteIfNeeded, 250);
    }
  });

  remoteState.pollTimer = window.setInterval(syncFromRemoteIfNeeded, 1000);
}

async function queueRemotePersist(options = {}) {
  if (!remoteState.enabled || !remoteState.ready) {
    return;
  }

  if (remoteState.saveTimer) {
    window.clearTimeout(remoteState.saveTimer);
  }

  if (options.immediateRemote) {
    setSyncStatus("Sincronizando", "Guardando cambios remotos...");
    try {
      await pushRemoteSnapshot();
      state.updatedAt = new Date().toISOString();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      remoteState.lastSyncedAt = Date.now();
      setSyncStatus("Sync activa", "Cambios guardados en compu y celu.");
    } catch (error) {
      console.error(error);
      remoteState.lastError = error?.message || "No pude guardar cambios remotos.";
      setSyncStatus("Modo local", remoteState.lastError);
    }
    return;
  }

  setSyncStatus("Sincronizando", "Guardando cambios remotos...");
  remoteState.saveTimer = window.setTimeout(async () => {
    try {
      await pushRemoteSnapshot();
      state.updatedAt = new Date().toISOString();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      remoteState.lastSyncedAt = Date.now();
      setSyncStatus("Sync activa", "Cambios guardados en compu y celu.");
    } catch (error) {
      console.error(error);
      remoteState.lastError = error?.message || "No pude guardar cambios remotos.";
      setSyncStatus("Modo local", remoteState.lastError);
    }
  }, 350);
}

async function fetchRemoteSnapshot() {
  const rowId = encodeURIComponent(remoteConfig.stateRowId);
  const url = `${remoteConfig.supabaseUrl}/rest/v1/app_state?id=eq.${rowId}&select=payload`;
  let lastError = null;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        cache: "no-store",
        headers: buildRemoteHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(
          `No pude leer el estado remoto (${response.status}${errorText ? `: ${errorText}` : ""}).`,
        );
      }

      const rows = await response.json();
      return rows[0]?.payload || null;
    } catch (error) {
      lastError = error;
      if (attempt < 2) {
        await wait(350 * (attempt + 1));
      }
    }
  }

  throw lastError || new Error("No pude leer el estado remoto.");
}

async function syncFromRemoteIfNeeded() {
  if (!remoteState.enabled || !remoteState.ready || remoteState.syncing) {
    return;
  }

  remoteState.syncing = true;

  try {
    const remoteSnapshot = await fetchRemoteSnapshot();
    if (!remoteSnapshot) {
      remoteState.syncing = false;
      return;
    }

    const remoteUpdatedAt = remoteSnapshot.updatedAt || "";
    const localUpdatedAt = state.updatedAt || "";
    if (remoteUpdatedAt && remoteUpdatedAt === localUpdatedAt) {
      return;
    }

    applyStateSnapshot(remoteSnapshot);
    render();
    remoteState.lastSyncedAt = Date.now();
    setSyncStatus("Sync activa", "Datos remotos actualizados.");
  } catch (error) {
    console.error(error);
    remoteState.lastError = error?.message || "No pude actualizar datos remotos.";
    setSyncStatus("Modo local", remoteState.lastError);
  } finally {
    remoteState.syncing = false;
  }
}

async function pushRemoteSnapshot() {
  const response = await fetch(`${remoteConfig.supabaseUrl}/rest/v1/app_state?on_conflict=id`, {
    method: "POST",
    cache: "no-store",
    headers: {
      ...buildRemoteHeaders(),
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
    body: JSON.stringify([
      {
        id: remoteConfig.stateRowId,
        payload: cloneData(state),
        updated_at: new Date().toISOString(),
      },
    ]),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `No pude guardar el estado remoto (${response.status}${errorText ? `: ${errorText}` : ""}).`,
    );
  }
}

async function prepareRemoteMutation() {
  if (!remoteState.enabled || !remoteState.ready) {
    return;
  }

  const staleForMs = Date.now() - (remoteState.lastSyncedAt || 0);
  if (staleForMs < 1200) {
    return;
  }

  await syncFromRemoteIfNeeded();
}

function buildRemoteHeaders() {
  return {
    apikey: remoteConfig.supabaseAnonKey,
    Authorization: `Bearer ${remoteConfig.supabaseAnonKey}`,
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  };
}

function applyStateSnapshot(snapshot) {
  state.products = Array.isArray(snapshot.products) ? snapshot.products : [];
  state.themes = Array.isArray(snapshot.themes) ? snapshot.themes : [];
  state.sales = Array.isArray(snapshot.sales) ? snapshot.sales : [];
  state.restocks = Array.isArray(snapshot.restocks) ? snapshot.restocks : [];
  state.updatedAt = snapshot.updatedAt || null;
  hydrateLegacyState();
  hydrateThemes();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setSyncStatus(title, detail) {
  if (!els.syncStatus) {
    return;
  }

  els.syncStatus.textContent = `${title}. ${detail}`;
}

function seedDemoData() {
  state.products = cloneData(seedProducts);
  state.themes = ["Anime", "Futbol", "Ilustracion", "Kawaii"];
  state.sales = cloneData(seedSales);
  state.restocks = cloneData(seedRestocks);
  persistState();
  render();
}

function exportBackup() {
  const backup = {
    exportedAt: new Date().toISOString(),
    data: state,
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `tuki-backup-${todayString()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function importBackup(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  try {
    const raw = await file.text();
    const parsed = JSON.parse(raw);
    const imported = parsed.data || parsed;

    state.products = imported.products || [];
    state.themes = imported.themes || [];
    state.sales = imported.sales || [];
    state.restocks = imported.restocks || [];
    persistState();
    hydrateLegacyState();
    hydrateThemes();
    render();
  } catch (error) {
    console.error(error);
    window.alert("No pude importar ese archivo.");
  } finally {
    event.target.value = "";
  }
}

function resetAllData() {
  const confirmed = window.confirm("Esto borrara los datos guardados en este navegador. Queres seguir?");
  if (!confirmed) {
    return;
  }

  state.products = [];
  state.themes = [];
  state.sales = [];
  state.restocks = [];
  persistState();
  render();
}

function renderLastUpdated() {
  els.lastUpdated.textContent = state.updatedAt
    ? `Ultimo cambio guardado: ${formatDateTime(state.updatedAt)}`
    : "Sin cambios guardados todavia.";
}

function showToast(message) {
  if (!els.toast) {
    return;
  }

  els.toast.classList.remove("visible");
  els.toast.hidden = true;
  els.toast.textContent = message;
  if (toastTimer) {
    window.clearTimeout(toastTimer);
  }

  requestAnimationFrame(() => {
    els.toast.hidden = false;
    els.toast.classList.add("visible");
    toastTimer = window.setTimeout(() => {
      els.toast.classList.remove("visible");
      window.setTimeout(() => {
        els.toast.hidden = true;
      }, 180);
    }, 2400);
  });
}

function handleCatalogGalleryClick(event) {
  const card = event.target.closest("[data-open-product]");
  if (!card) {
    return;
  }

  openProductDetail(card.dataset.openProduct);
}

function handleProductDetailBackdrop(event) {
  if (event.target.dataset.closeModal === "true") {
    closeProductDetailModal();
  }
}

function openProductDetail(sku) {
  const product = findProduct(sku);
  if (!product) {
    return;
  }

  els.productDetailTitle.textContent = product.name;
  els.productDetailForm.elements.skuOriginal.value = product.sku;
  els.productDetailForm.elements.sku.value = product.sku;
  els.productDetailForm.elements.name.value = product.name;
  els.productDetailForm.elements.theme.value = product.theme;
  els.productDetailForm.elements.character.value = product.character;
  els.productDetailForm.elements.material.value = product.material;
  els.productDetailForm.elements.color.value = product.color;
  els.productDetailForm.elements.price.value = product.price;
  els.productDetailForm.elements.stock.value = product.stock;
  els.productDetailForm.elements.minStock.value = product.minStock;
  els.productDetailForm.elements.tags.value = product.tags || "";
  els.productDetailForm.elements.image.value = "";
  els.productDetailForm.elements.removeImage.checked = false;
  els.productDetailImage.innerHTML = renderProductImage(product);
  renderQrIntoElement(els.productDetailQrPreview, product.sku);
  els.productDetailModal.hidden = false;
}

function closeProductDetailModal() {
  els.productDetailModal.hidden = true;
}

function handleProductDetailGenerateQr() {
  const sku = sanitizeSku(els.productDetailForm.elements.sku?.value);
  if (!sku) {
    window.alert("Ingresa un SKU valido.");
    return;
  }

  renderQrIntoElement(els.productDetailQrPreview, sku);
}

function handleProductDelete() {
  const originalSku = sanitizeSku(els.productDetailForm.elements.skuOriginal?.value);
  const product = findProduct(originalSku);
  if (!product) {
    window.alert("No pude encontrar ese modelo.");
    return;
  }

  const confirmed = window.confirm(
    `Vas a eliminar el modelo ${product.name} (${product.sku}). Esta accion no se puede deshacer.`,
  );
  if (!confirmed) {
    return;
  }

  state.products = state.products.filter((item) => sanitizeSku(item.sku) !== originalSku);
  state.restocks = state.restocks.filter((entry) => sanitizeSku(entry.sku) !== originalSku);
  state.sales = state.sales.filter((entry) => sanitizeSku(entry.sku) !== originalSku);
  scannerState.cart = scannerState.cart.filter((entry) => sanitizeSku(entry.sku) !== originalSku);
  if (sanitizeSku(lastCreatedSku) === originalSku) {
    lastCreatedSku = "";
  }

  persistState();
  closeProductDetailModal();
  render();
  showToast(`Modelo eliminado: ${product.name}`);
}

async function handleProductDetailSubmit(event) {
  event.preventDefault();
  const formElement = event.currentTarget;
  const form = new FormData(formElement);
  const originalSku = sanitizeSku(form.get("skuOriginal"));
  const updatedSku = sanitizeSku(form.get("sku"));
  const product = findProduct(originalSku);

  if (!product) {
    window.alert("No pude encontrar ese modelo.");
    return;
  }

  const duplicate = state.products.find(
    (item) => sanitizeSku(item.sku) === updatedSku && sanitizeSku(item.sku) !== originalSku,
  );
  if (duplicate) {
    window.alert(`Ese SKU ya existe y pertenece a ${duplicate.name}.`);
    return;
  }

  product.sku = updatedSku;
  product.name = String(form.get("name")).trim();
  product.theme = String(form.get("theme")).trim() || "Sin tema";
  product.character = String(form.get("character")).trim() || "No";
  product.material = String(form.get("material")).trim();
  product.color = String(form.get("color")).trim() || "Sin color";
  product.price = Number(form.get("price") || 0);
  product.stock = Number(form.get("stock") || 0);
  product.minStock = Number(form.get("minStock") || 0);
  product.tags = String(form.get("tags")).trim();

  const imageFile = form.get("image");
  const removeImage = form.get("removeImage") === "yes";
  if (removeImage) {
    product.image = "";
  } else if (imageFile && imageFile.size) {
    product.image = await readFileAsDataUrl(imageFile);
  }

  state.sales.forEach((sale) => {
    if (sanitizeSku(sale.sku) === originalSku) {
      sale.sku = updatedSku;
    }
  });
  state.restocks.forEach((restock) => {
    if (sanitizeSku(restock.sku) === originalSku) {
      restock.sku = updatedSku;
    }
  });
  scannerState.cart.forEach((item) => {
    if (sanitizeSku(item.sku) === originalSku) {
      item.sku = updatedSku;
    }
  });

  if (!state.themes.includes(product.theme)) {
    state.themes.push(product.theme);
    state.themes.sort((a, b) => a.localeCompare(b));
  }

  persistState();
  render();
  openProductDetail(updatedSku);
  showToast(`Modelo actualizado: ${product.name}`);
}

function createEmptyState() {
  return {
    products: [],
    themes: [],
    sales: [],
    restocks: [],
    updatedAt: null,
  };
}

function getRemoteConfig() {
  const config = window.TUKI_REMOTE_CONFIG || {};
  const supabaseUrl = String(config.supabaseUrl || "").replace(/\/+$/, "");
  const supabaseAnonKey = String(config.supabaseAnonKey || "");
  const stateRowId = String(config.stateRowId || "main");

  return {
    enabled: Boolean(config.enabled && supabaseUrl && supabaseAnonKey),
    supabaseUrl,
    supabaseAnonKey,
    stateRowId,
  };
}

function makeId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function cloneData(value) {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function sanitizeSku(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/_/g, "-");
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatDate(value) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister());
    });
  });
}

function installRuntimeErrorReporter() {
  window.addEventListener("error", (event) => {
    showRuntimeError(event.message || "Error desconocido en la app.");
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    showRuntimeError(reason?.message || String(reason || "Promesa rechazada"));
  });
}

function showRuntimeError(message) {
  if (!els.runtimeError) {
    return;
  }

  els.runtimeError.hidden = false;
  els.runtimeError.textContent = `Error de ejecucion: ${message}`;
}
