/**
 * थोरल्या माँसाहेब जिजाऊ सेवा संस्था (Thoralya Mansaheb Jijau Seva Sanstha)
 * Vanilla JavaScript Engine: js/script.js
 * Pure HTML5, CSS3, Vanilla JavaScript — zero React/TypeScript runtime dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initLanguageSwitcher();
  initNavbarBehavior();
  initAccessibilityFontSize();
  initWingsModal();
  initGalleryAndLightbox();
  initBackToTop();
  initScrollSpyAndSmoothScroll();
  renderOrganizationMembers(currentSiteLang);
  fetchAndRenderBoardMembers();
  fetchAndRenderEvents();
});

/**
 * Multi-Language Switcher (Marathi Default, English, Hindi)
 * Uses TRANSLATIONS dictionary loaded from js/translations.js
 */
function initLanguageSwitcher() {
  const langButtons = document.querySelectorAll('.lang-tab-btn');

  langButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedLang = e.currentTarget.getAttribute('data-lang');
      if (selectedLang) {
        applyLanguage(selectedLang);
      }
    });
  });

  // Default to Marathi ('mr') unless user previously selected another language
  const savedLang = localStorage.getItem('thoralya_jijau_lang_pref') || localStorage.getItem('matoshri_lang_pref') || 'mr';
  applyLanguage(savedLang);
}

/**
 * Apply translation across all DOM elements marked with [data-i18n]
 */
function applyLanguage(lang) {
  const translationsSource = (typeof window !== 'undefined' && window.TRANSLATIONS) ? window.TRANSLATIONS : (typeof TRANSLATIONS !== 'undefined' ? TRANSLATIONS : null);
  if (!translationsSource || !translationsSource[lang]) return;
  const dict = translationsSource[lang];

  // Set HTML root lang attribute
  document.documentElement.lang = lang;

  // Translate all marked elements
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) {
      const textVal = dict[key];
      // If the translation contains HTML tags (like <strong> or <i>), preserve them
      if (typeof textVal === 'string' && textVal.includes('<') && textVal.includes('>')) {
        el.innerHTML = textVal;
      } else {
        el.textContent = textVal;
      }
    }
  });

  // Translate placeholders marked with [data-i18n-ph]
  const phElements = document.querySelectorAll('[data-i18n-ph]');
  phElements.forEach(el => {
    const phKey = el.getAttribute('data-i18n-ph');
    if (dict[phKey] !== undefined) {
      el.setAttribute('placeholder', dict[phKey]);
    }
  });

  // Update Page Title
  if (dict.pageTitle) {
    document.title = dict.pageTitle;
  }

  // Update Meta Description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && dict.metaDescription) {
    metaDesc.setAttribute('content', dict.metaDescription);
  }

  // Update Active States across all language switcher buttons
  const allLangButtons = document.querySelectorAll('.lang-tab-btn');
  allLangButtons.forEach(btn => {
    const btnLang = btn.getAttribute('data-lang');
    const isActive = (btnLang === lang);
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Update dynamic gallery counter text
  updateGalleryPhotosCounter();

  // Update dynamic board members and events language
  currentSiteLang = lang;
  updateBoardMembersLanguage(lang);
  renderDynamicEvents(cachedEvents, lang);
  updateGalleryLanguage(lang);

  // Persist preference
  localStorage.setItem('thoralya_jijau_lang_pref', lang);
}

/**
 * Global cache for dynamic content
 */
let cachedBoardMembers = [];
let cachedEvents = [];
let cachedServerGallery = [];
let currentSiteLang = 'mr';

/**
 * Data-Driven Organization Members (14 Members)
 * Single source of truth containing exact spellings, multilingual designations, and cities.
 */
const organizationMembers = [
  {
    id: 1,
    name: {
      mr: "कांतीलाल चोपडा",
      en: "Kantilal Chopra",
      hi: "कांतीलाल चोपड़ा"
    },
    designation: {
      mr: "अध्यक्ष",
      en: "President",
      hi: "अध्यक्ष"
    },
    location: {
      mr: "नाशिक",
      en: "Nashik",
      hi: "नाशिक"
    },
    photo: "/images/board-member-placeholder.jpg"
  },
  {
    id: 2,
    name: {
      mr: "अनिल खिंवसरा",
      en: "Anil Khinwasara",
      hi: "अनिल खिंवसरा"
    },
    designation: {
      mr: "सचिव",
      en: "Secretary",
      hi: "सचिव"
    },
    location: {
      mr: "मुंबई",
      en: "Mumbai",
      hi: "मुंबई"
    },
    photo: "/images/board-member-placeholder.jpg"
  },
  {
    id: 3,
    name: {
      mr: "सुनील बंब",
      en: "Sunil Bamb",
      hi: "सुनील बंब"
    },
    designation: {
      mr: "कोषाध्यक्ष",
      en: "Treasurer",
      hi: "कोषाध्यक्ष"
    },
    location: {
      mr: "मुंबई",
      en: "Mumbai",
      hi: "मुंबई"
    },
    photo: "/images/board-member-placeholder.jpg"
  },
  {
    id: 4,
    name: {
      mr: "सुभाषचन्द्र रुणवाल",
      en: "Subhashchandra Runwal",
      hi: "सुभाषचन्द्र रुणवाल"
    },
    designation: {
      mr: "विश्वस्त",
      en: "Trustee",
      hi: "विश्वस्त"
    },
    location: {
      mr: "मुंबई",
      en: "Mumbai",
      hi: "मुंबई"
    },
    photo: "/images/board-member-placeholder.jpg"
  },
  {
    id: 5,
    name: {
      mr: "रमेश फिरोदिया",
      en: "Ramesh Firodia",
      hi: "रमेश फिरोदिया"
    },
    designation: {
      mr: "विश्वस्त",
      en: "Trustee",
      hi: "विश्वस्त"
    },
    location: {
      mr: "अ.नगर",
      en: "Ahmednagar",
      hi: "अ.नगर"
    },
    photo: "/images/board-member-placeholder.jpg"
  },
  {
    id: 6,
    name: {
      mr: "रमणलाल लुंकड",
      en: "Ramanlal Lunkad",
      hi: "रमणलाल लुंकड"
    },
    designation: {
      mr: "विश्वस्त",
      en: "Trustee",
      hi: "विश्वस्त"
    },
    location: {
      mr: "पुणे",
      en: "Pune",
      hi: "पुणे"
    },
    photo: "/images/board-member-placeholder.jpg"
  },
  {
    id: 7,
    name: {
      mr: "सुमतीलाल कर्णावट",
      en: "Sumatilal Karnawat",
      hi: "सुमतीलाल कर्णावट"
    },
    designation: {
      mr: "विश्वस्त",
      en: "Trustee",
      hi: "विश्वस्त"
    },
    location: {
      mr: "ठाणे",
      en: "Thane",
      hi: "ठाणे"
    },
    photo: "/images/board-member-placeholder.jpg"
  },
  {
    id: 8,
    name: {
      mr: "जयंतभाई शहा",
      en: "Jayantbhai Shah",
      hi: "जयंतभाई शाह"
    },
    designation: {
      mr: "विश्वस्त",
      en: "Trustee",
      hi: "विश्वस्त"
    },
    location: {
      mr: "पुणे",
      en: "Pune",
      hi: "पुणे"
    },
    photo: "/images/board-member-placeholder.jpg"
  },
  {
    id: 9,
    name: {
      mr: "पारस मोदी",
      en: "Paras Modi",
      hi: "पारस मोदी"
    },
    designation: {
      mr: "विश्वस्त",
      en: "Trustee",
      hi: "विश्वस्त"
    },
    location: {
      mr: "मुंबई",
      en: "Mumbai",
      hi: "मुंबई"
    },
    photo: "/images/board-member-placeholder.jpg"
  },
  {
    id: 10,
    name: {
      mr: "प्रकाश दुगाड",
      en: "Prakash Dugad",
      hi: "प्रकाश दुगाड"
    },
    designation: {
      mr: "विश्वस्त",
      en: "Trustee",
      hi: "विश्वस्त"
    },
    location: {
      mr: "पुणे",
      en: "Pune",
      hi: "पुणे"
    },
    photo: "/images/board-member-placeholder.jpg"
  },
  {
    id: 11,
    name: {
      mr: "अमरचंद छाजेड",
      en: "Amarchand Chhajed",
      hi: "अमरचंद छाजेड"
    },
    designation: {
      mr: "विश्वस्त",
      en: "Trustee",
      hi: "विश्वस्त"
    },
    location: {
      mr: "मुंबई",
      en: "Mumbai",
      hi: "मुंबई"
    },
    photo: "/images/board-member-placeholder.jpg"
  },
  {
    id: 12,
    name: {
      mr: "निलेश छाजेड",
      en: "Nilesh Chhajed",
      hi: "निलेश छाजेड"
    },
    designation: {
      mr: "विश्वस्त",
      en: "Trustee",
      hi: "विश्वस्त"
    },
    location: {
      mr: "मुंबई",
      en: "Mumbai",
      hi: "मुंबई"
    },
    photo: "/images/board-member-placeholder.jpg"
  },
  {
    id: 13,
    name: {
      mr: "जितेश छाजेड",
      en: "Jitesh Chhajed",
      hi: "जितेश छाजेड"
    },
    designation: {
      mr: "विश्वस्त",
      en: "Trustee",
      hi: "विश्वस्त"
    },
    location: {
      mr: "मुंबई",
      en: "Mumbai",
      hi: "मुंबई"
    },
    photo: "/images/board-member-placeholder.jpg"
  },
  {
    id: 14,
    name: {
      mr: "मोतीलाल छाजेड",
      en: "Motilal Chhajed",
      hi: "मोतीलाल छाजेड"
    },
    designation: {
      mr: "विश्वस्त",
      en: "Trustee",
      hi: "विश्वस्त"
    },
    location: {
      mr: "मुंबई",
      en: "Mumbai",
      hi: "मुंबई"
    },
    photo: "/images/board-member-placeholder.jpg"
  }
];

/**
 * Switch between Sanstha Tabs: 'lead' (संस्था चालक / व्यवस्थापक) and 'board' (संचालक मंडळ)
 */
function switchSansthaTab(tab) {
  const leadBtn = document.getElementById('tabSansthaLeadBtn');
  const boardBtn = document.getElementById('tabSansthaBoardBtn');
  const leadPane = document.getElementById('sansthaLeadPane');
  const boardPane = document.getElementById('sansthaBoardPane');

  if (tab === 'lead') {
    if (leadBtn) {
      leadBtn.classList.add('active');
      leadBtn.setAttribute('aria-selected', 'true');
    }
    if (boardBtn) {
      boardBtn.classList.remove('active');
      boardBtn.setAttribute('aria-selected', 'false');
    }
    if (leadPane) leadPane.classList.remove('d-none');
    if (boardPane) boardPane.classList.add('d-none');
  } else {
    if (boardBtn) {
      boardBtn.classList.add('active');
      boardBtn.setAttribute('aria-selected', 'true');
    }
    if (leadBtn) {
      leadBtn.classList.remove('active');
      leadBtn.setAttribute('aria-selected', 'false');
    }
    if (leadPane) leadPane.classList.add('d-none');
    if (boardPane) boardPane.classList.remove('d-none');
  }
}
window.switchSansthaTab = switchSansthaTab;

/**
 * Render dynamic organization member cards
 * Structure: Photo, Full Name, Designation badge, 📍 Location
 * Responsive Grid:
 * - Desktop: 3-4 cards per row (col-lg-4 col-xl-3)
 * - Tablet: 2 cards per row (col-sm-6 col-md-6)
 * - Mobile: 1 card per row (col-12)
 */
function renderOrganizationMembers(lang) {
  const container = document.getElementById('boardMembersContainer');
  if (!container) return;

  const validLang = (lang === 'en' || lang === 'hi' || lang === 'mr') ? lang : 'mr';

  container.innerHTML = organizationMembers.map(member => {
    const name = member.name[validLang] || member.name.mr;
    const designation = member.designation[validLang] || member.designation.mr;
    const location = member.location[validLang] || member.location.mr;
    const photo = member.photo || '/images/board-member-placeholder.jpg';
    const altText = `${name} — ${designation}`;

    let desigClass = 'designation-trustee';
    if (member.id === 1) desigClass = 'designation-president';
    else if (member.id === 2) desigClass = 'designation-secretary';
    else if (member.id === 3) desigClass = 'designation-treasurer';

    return `
      <div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3" data-member-id="${member.id}">
        <div class="board-member-card h-100">
          <div class="board-member-photo-wrap">
            <img 
              src="${photo}" 
              alt="${escapeHtml(altText)}" 
              class="board-member-photo" 
              loading="lazy" 
              referrerpolicy="no-referrer"
              onerror="this.src='/images/board-member-placeholder.jpg'"
            />
          </div>
          <div class="board-member-name">${escapeHtml(name)}</div>
          <div class="board-member-designation ${desigClass}" data-member-desig="${escapeHtml(member.designation.mr)}">
            ${escapeHtml(designation)}
          </div>
          <div class="board-member-city" data-member-city="${escapeHtml(member.location.mr)}">
            <i class="bi bi-geo-alt-fill text-danger me-1"></i>
            <span>${escapeHtml(location)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
window.renderOrganizationMembers = renderOrganizationMembers;

/**
 * Update board members designations and cities based on current language
 */
function updateBoardMembersLanguage(lang) {
  renderOrganizationMembers(lang);
}

/**
 * Fetch Board Members from backend and update photos or metadata
 */
async function fetchAndRenderBoardMembers() {
  try {
    const res = await fetch('/api/board-members');
    if (!res.ok) {
      renderOrganizationMembers(currentSiteLang);
      return;
    }
    const members = await res.json();
    if (Array.isArray(members) && members.length > 0) {
      cachedBoardMembers = members;
      members.forEach(serverMember => {
        const local = organizationMembers.find(m => m.id === serverMember.id);
        if (local && serverMember.photoUrl) {
          local.photo = serverMember.photoUrl;
        }
      });
    }
    renderOrganizationMembers(currentSiteLang);
  } catch (err) {
    console.warn('Board members fetch note:', err);
    renderOrganizationMembers(currentSiteLang);
  }
}

/**
 * Safely escape HTML to prevent XSS
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Render dynamic events matching website aesthetics
 */
function renderDynamicEvents(events, lang) {
  const emptyState = document.getElementById('eventsEmptyState');
  const grid = document.getElementById('dynamicEventsGrid');
  if (!emptyState || !grid) return;

  if (!events || events.length === 0) {
    emptyState.classList.remove('d-none');
    grid.classList.add('d-none');
    grid.innerHTML = '';
    return;
  }

  emptyState.classList.add('d-none');
  grid.classList.remove('d-none');

  grid.innerHTML = events.map(evt => {
    let title = evt.title || '';
    if (lang === 'en' && evt.titleEn) title = evt.titleEn;
    else if (evt.titleMr) title = evt.titleMr;

    let desc = evt.description || evt.desc || '';
    if (lang === 'en' && evt.descEn) desc = evt.descEn;
    else if (evt.descMr) desc = evt.descMr;

    const dateVal = evt.date ? escapeHtml(evt.date) : (lang === 'en' ? 'Upcoming' : 'आगामी');
    const timeVal = evt.time ? `<div class="dynamic-event-meta-item"><i class="bi bi-clock me-1 text-primary"></i>${escapeHtml(evt.time)}</div>` : '';
    const locVal = evt.location ? `<div class="dynamic-event-meta-item"><i class="bi bi-geo-alt me-1 text-danger"></i>${escapeHtml(evt.location)}</div>` : '';
    const photoHtml = evt.photoUrl ? `
      <div class="dynamic-event-img-wrap">
        <img src="${escapeHtml(evt.photoUrl)}" alt="${escapeHtml(title)}" class="dynamic-event-img" loading="lazy" referrerpolicy="no-referrer" />
        <div class="dynamic-event-date-badge"><i class="bi bi-calendar3 me-1"></i> ${dateVal}</div>
      </div>` : `
      <div class="dynamic-event-img-wrap d-flex align-items-center justify-content-center">
        <i class="bi bi-calendar-event text-muted" style="font-size: 3rem;"></i>
        <div class="dynamic-event-date-badge"><i class="bi bi-calendar3 me-1"></i> ${dateVal}</div>
      </div>`;

    return `
      <article class="dynamic-event-card" id="eventCard-${evt.id}">
        ${photoHtml}
        <div class="dynamic-event-body">
          <h3 class="dynamic-event-title">${escapeHtml(title)}</h3>
          <div class="dynamic-event-meta">
            ${timeVal}
            ${locVal}
          </div>
          <p class="dynamic-event-desc">${escapeHtml(desc)}</p>
        </div>
      </article>
    `;
  }).join('');
}

/**
 * Fetch Events from backend /api/events
 */
async function fetchAndRenderEvents() {
  try {
    const res = await fetch('/api/events');
    if (!res.ok) {
      renderDynamicEvents([], currentSiteLang);
      return;
    }
    const events = await res.json();
    cachedEvents = Array.isArray(events) ? events : [];
    renderDynamicEvents(cachedEvents, currentSiteLang);
  } catch (err) {
    console.warn('Events fetch error:', err);
    renderDynamicEvents([], currentSiteLang);
  }
}

/**
 * Navbar collapse on mobile click & scroll shadow
 */
function initNavbarBehavior() {
  const navbarCollapse = document.getElementById('navbarMatoshriNav');
  const navLinks = document.querySelectorAll('.navbar-matoshri .nav-link, .navbar-matoshri .btn-nav-call');
  const navbar = document.querySelector('.navbar-matoshri');

  // Auto-close menu when link clicked on mobile
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 992 && navbarCollapse && navbarCollapse.classList.contains('show')) {
        if (window.bootstrap && window.bootstrap.Collapse) {
          const bsCollapse = window.bootstrap.Collapse.getInstance(navbarCollapse) || new window.bootstrap.Collapse(navbarCollapse);
          bsCollapse.hide();
        } else {
          navbarCollapse.classList.remove('show');
        }
      }
    });
  });

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });
}

/**
 * Elder-friendly font size controls: Normal (1x), Large (1.15x), Extra-large (1.30x)
 */
function initAccessibilityFontSize() {
  const fontButtons = document.querySelectorAll('[data-font-size], #font-size-normal, #font-size-large, #font-size-larger');

  function setFontSize(size) {
    const rootEl = document.documentElement;
    const bodyEl = document.body;

    rootEl.classList.remove('font-size-large', 'font-size-larger', 'font-large', 'font-larger');
    bodyEl.classList.remove('font-size-large', 'font-size-larger', 'font-large', 'font-larger');

    if (size === 'large') {
      rootEl.classList.add('font-size-large', 'font-large');
      bodyEl.classList.add('font-size-large', 'font-large');
    } else if (size === 'larger') {
      rootEl.classList.add('font-size-larger', 'font-larger');
      bodyEl.classList.add('font-size-larger', 'font-larger');
    }

    fontButtons.forEach(btn => {
      const btnSize = btn.getAttribute('data-font-size') || 
                      (btn.id === 'font-size-large' ? 'large' : 
                      (btn.id === 'font-size-larger' ? 'larger' : 'normal'));
      btn.classList.toggle('active', btnSize === size);
    });

    localStorage.setItem('thoralya_jijau_font_pref', size);
  }

  fontButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const size = btn.getAttribute('data-font-size') || 
                   (btn.id === 'font-size-large' ? 'large' : 
                   (btn.id === 'font-size-larger' ? 'larger' : 'normal'));
      setFontSize(size);
    });
  });

  const savedPref = localStorage.getItem('thoralya_jijau_font_pref') || 'normal';
  setFontSize(savedPref);
}

/**
 * Interactive Modal for "सेवेची तीन दालने" (Three Wings of Service)
 */
function initWingsModal() {
  const moreButtons = document.querySelectorAll('.btn-wing-more');
  const modalEl = document.getElementById('wingsDetailModal');

  if (!modalEl) return;

  moreButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const wingTarget = btn.getAttribute('data-wing') || 'elderly';
      
      // Highlight targeted section inside modal if needed
      const elderBox = document.getElementById('modalWingElderly');
      const childBox = document.getElementById('modalWingChild');
      const goshalaBox = document.getElementById('modalWingGoshala');

      [elderBox, childBox, goshalaBox].forEach(b => {
        if (b) {
          b.classList.remove('border', 'border-warning', 'bg-warning-subtle');
        }
      });

      let targetEl = null;
      if (wingTarget === 'elderly' && elderBox) targetEl = elderBox;
      if (wingTarget === 'child' && childBox) targetEl = childBox;
      if (wingTarget === 'goshala' && goshalaBox) targetEl = goshalaBox;

      if (targetEl) {
        targetEl.classList.add('border', 'border-warning', 'bg-warning-subtle');
      }

      if (window.bootstrap && window.bootstrap.Modal) {
        const bsModal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        bsModal.show();
      }
    });
  });
}

// Global state for gallery
let userUploadedPhotos = [];
let currentCategoryFilter = 'all';

// IndexedDB storage for real user-added photos
const PHOTO_DB_NAME = 'thoralya_jijau_gallery_db';
const PHOTO_STORE_NAME = 'photos';
const PHOTO_DB_VERSION = 1;

function openPhotoDB() {
  return new Promise((resolve) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const req = indexedDB.open(PHOTO_DB_NAME, PHOTO_DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(PHOTO_STORE_NAME)) {
        db.createObjectStore(PHOTO_STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = () => resolve(null);
  });
}

async function saveUserUploadsToStorage() {
  try {
    const db = await openPhotoDB();
    if (db) {
      const tx = db.transaction(PHOTO_STORE_NAME, 'readwrite');
      const store = tx.objectStore(PHOTO_STORE_NAME);
      await new Promise((res) => {
        const clr = store.clear();
        clr.onsuccess = () => res();
        clr.onerror = () => res();
      });
      for (const photo of userUploadedPhotos) {
        store.put(photo);
      }
      await new Promise((res) => {
        tx.oncomplete = () => res();
        tx.onerror = () => res();
      });
    }
  } catch (err) {
    console.warn('IndexedDB save error:', err);
  }

  try {
    localStorage.setItem('thoralya_jijau_uploads', JSON.stringify(userUploadedPhotos));
  } catch (err) {
    // Large photos safely kept in IndexedDB
  }
}

async function loadUserUploadsFromStorage() {
  try {
    const db = await openPhotoDB();
    if (db) {
      const tx = db.transaction(PHOTO_STORE_NAME, 'readonly');
      const store = tx.objectStore(PHOTO_STORE_NAME);
      const items = await new Promise((res) => {
        const req = store.getAll();
        req.onsuccess = () => res(req.result || []);
        req.onerror = () => res([]);
      });
      if (items && items.length > 0) {
        return items.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0) || a.timestamp - b.timestamp);
      }
    }
  } catch (err) {
    console.warn('IndexedDB load error:', err);
  }

  try {
    const raw = localStorage.getItem('thoralya_jijau_uploads') || localStorage.getItem('matoshri_user_uploads');
    if (raw) return JSON.parse(raw) || [];
  } catch (err) {
    console.warn('localStorage parse error:', err);
  }
  return [];
}

/**
 * Toast notification helper
 */
function showToast(message) {
  const toastEl = document.getElementById('photoActionToast');
  const msgEl = document.getElementById('photoToastMessage');
  if (!toastEl || !msgEl) return;
  msgEl.textContent = message;

  if (window.bootstrap && window.bootstrap.Toast) {
    const toast = window.bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3500 });
    toast.show();
  } else {
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 3500);
  }
}

/**
 * Dynamic photo counter updater
 */
function updateGalleryPhotosCounter() {
  const galleryGrid = document.getElementById('galleryGrid');
  const counterEl = document.getElementById('galleryPhotosCount');
  if (!galleryGrid || !counterEl) return;

  const totalCards = galleryGrid.querySelectorAll('.gallery-card').length;
  const lang = localStorage.getItem('thoralya_jijau_lang_pref') || 'mr';
  const translationsSource = (typeof window !== 'undefined' && window.TRANSLATIONS) ? window.TRANSLATIONS : (typeof TRANSLATIONS !== 'undefined' ? TRANSLATIONS : null);
  const dict = (translationsSource && translationsSource[lang]) ? translationsSource[lang] : {};
  const label = dict.photoCountLabel || 'उपलब्ध छायाचित्रे:';

  counterEl.textContent = `${label} ${totalCards}`;
}

/**
 * Compress image using canvas
 */
function compressImage(file, maxWidth = 1600, quality = 0.85) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Create DOM Card element for server-provided categorized photo
 */
function createServerGalleryCardElement(item) {
  const card = document.createElement('div');
  card.className = 'gallery-card server-gallery-card';
  card.tabIndex = 0;
  card.setAttribute('data-category', item.category || 'वृद्धाश्रम');
  card.setAttribute('role', 'button');

  const lang = localStorage.getItem('thoralya_jijau_lang_pref') || 'mr';
  const captionText = (lang === 'en' && item.titleEn) ? item.titleEn : (item.titleMr || item.titleEn || 'छायाचित्र');
  card.setAttribute('aria-label', `${captionText} - छायाचित्र`);

  card.innerHTML = `
    <img src="${item.imageUrl}" alt="${captionText}" loading="lazy" referrerpolicy="no-referrer" onerror="if (this.src.indexOf('ashram-campus.jpg') === -1 && this.src.indexOf('134325477') !== -1) { this.src='/images/ashram-campus.jpg'; } else if (this.src.indexOf('ashram-building.jpg') === -1 && this.src.indexOf('133931861') !== -1) { this.src='/images/ashram-building.jpg'; } else if (this.src.indexOf('gallery-campus.jpg') === -1 && '${item.category}' === 'परिसर') { this.src='/images/gallery-campus.jpg'; } else { this.src='/images/ashram-building.jpg'; }" />
    <div class="gallery-card-overlay">
      <div>
        <span class="gallery-card-caption">${captionText}</span>
      </div>
      <span class="gallery-zoom-icon"><i class="bi bi-arrows-fullscreen"></i></span>
    </div>
  `;

  const photoCat = item.category || 'वृद्धाश्रम';
  if (currentCategoryFilter !== 'all' && photoCat !== currentCategoryFilter) {
    card.style.display = 'none';
  } else {
    card.style.display = 'block';
  }

  return card;
}

function updateGalleryLanguage(lang) {
  const galleryGrid = document.getElementById('galleryGrid');
  if (!galleryGrid || !cachedServerGallery || cachedServerGallery.length === 0) return;
  const cards = galleryGrid.querySelectorAll('.server-gallery-card');
  cards.forEach((card, idx) => {
    const item = cachedServerGallery[idx];
    if (item) {
      const captionText = (lang === 'en' && item.titleEn) ? item.titleEn : (item.titleMr || item.titleEn || 'छायाचित्र');
      const captionEl = card.querySelector('.gallery-card-caption');
      if (captionEl) captionEl.textContent = captionText;
      card.setAttribute('aria-label', `${captionText} - छायाचित्र`);
    }
  });
}

/**
 * Create DOM Card element for uploaded photo
 */
function createUploadedCardElement(photo) {
  const card = document.createElement('div');
  card.className = 'gallery-card user-uploaded-card';
  card.tabIndex = 0;
  card.setAttribute('data-category', photo.category || 'वृद्धाश्रम');
  card.setAttribute('data-upload-id', photo.id);
  card.setAttribute('aria-label', `${photo.name} - छायाचित्र`);

  card.innerHTML = `
    <img src="${photo.dataUrl}" alt="${photo.name}" loading="lazy" referrerpolicy="no-referrer" />
    <div class="gallery-card-overlay">
      <div>
        <span class="gallery-card-caption">${photo.name}</span>
      </div>
      <span class="gallery-zoom-icon"><i class="bi bi-arrows-fullscreen"></i></span>
    </div>
  `;

  // Apply current active category filter
  const photoCat = photo.category || 'वृद्धाश्रम';
  if (currentCategoryFilter !== 'all' && photoCat !== currentCategoryFilter) {
    card.style.display = 'none';
  } else {
    card.style.display = 'block';
  }

  return card;
}

/**
 * Gallery Filtering, Interactive Fullscreen Lightbox & Photo Upload Handling
 */
async function initGalleryAndLightbox() {
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const btnClose = document.getElementById('lightboxClose');
  const btnPrev = document.getElementById('lightboxPrev');
  const btnNext = document.getElementById('lightboxNext');
  const fileInput = document.getElementById('adminPhotoInput');

  let currentIndex = 0;

  function getVisibleCards() {
    if (!galleryGrid) return [];
    return Array.from(galleryGrid.querySelectorAll('.gallery-card')).filter(card => card.style.display !== 'none');
  }

  // 1. Category Filtering
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter') || 'all';
      currentCategoryFilter = filter;

      if (galleryGrid) {
        const allCards = galleryGrid.querySelectorAll('.gallery-card');
        allCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      }
    });
  });

  // 2. Lightbox navigation functions
  function showImage(index) {
    const visibleCards = getVisibleCards();
    if (visibleCards.length === 0) return;
    if (index < 0) index = visibleCards.length - 1;
    if (index >= visibleCards.length) index = 0;
    currentIndex = index;

    const card = visibleCards[currentIndex];
    const img = card.querySelector('img');
    const captionEl = card.querySelector('.gallery-card-caption');

    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || 'थोरल्या माँसाहेब जिजाऊ सेवा संस्था छायाचित्र';
    }

    if (captionEl && lightboxCaption) {
      lightboxCaption.textContent = captionEl.textContent;
    }

    if (lightbox) {
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // Delegation on gallery grid
  if (galleryGrid) {
    galleryGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.gallery-card');
      if (!card) return;

      const visibleCards = getVisibleCards();
      const idx = visibleCards.indexOf(card);
      if (idx !== -1) {
        showImage(idx);
      }
    });

    galleryGrid.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.gallery-card');
        if (card) {
          e.preventDefault();
          const visibleCards = getVisibleCards();
          const idx = visibleCards.indexOf(card);
          if (idx !== -1) {
            showImage(idx);
          }
        }
      }
    });
  }

  if (btnClose) btnClose.addEventListener('click', closeLightbox);
  if (btnPrev) btnPrev.addEventListener('click', () => showImage(currentIndex - 1));
  if (btnNext) btnNext.addEventListener('click', () => showImage(currentIndex + 1));

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-container')) {
        closeLightbox();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    else if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  // Mobile Touch Swipe support in Lightbox
  let touchStartX = 0;
  let touchEndX = 0;
  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) showImage(currentIndex + 1);
      if (touchEndX > touchStartX + swipeThreshold) showImage(currentIndex - 1);
    }, { passive: true });
  }

  // 3. Load photos from Server API
  try {
    const res = await fetch('/api/gallery');
    if (res.ok) {
      const serverItems = await res.json();
      if (serverItems && serverItems.length > 0 && galleryGrid) {
        cachedServerGallery = serverItems;
        galleryGrid.innerHTML = '';
        serverItems.forEach(item => {
          const card = createServerGalleryCardElement(item);
          galleryGrid.appendChild(card);
        });
      }
    }
  } catch (err) {
    console.warn('Could not load server gallery:', err);
  }

  // Also load any local uploads from IndexedDB
  userUploadedPhotos = await loadUserUploadsFromStorage();
  if (userUploadedPhotos.length > 0 && galleryGrid) {
    userUploadedPhotos.forEach(photo => {
      const card = createUploadedCardElement(photo);
      galleryGrid.appendChild(card);
    });
  }

  // Update dynamic count
  updateGalleryPhotosCounter();

  // 4. File input change event for new photo uploads
  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
      if (files.length === 0) return;
      await handleUploadedFiles(files);
      fileInput.value = '';
    });
  }
}

/**
 * Handle files uploaded via file selector or drag-drop
 */
async function handleUploadedFiles(files) {
  const galleryGrid = document.getElementById('galleryGrid');
  const categories = ['वृद्धाश्रम', 'परिसर', 'सुविधा', 'उपक्रम', 'क्षणचित्रे'];

  showToast('छायाचित्रे जोडली जात आहेत...');

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const compressedDataUrl = await compressImage(file, 1600, 0.85);
      const photoId = 'upload_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, ' ') || `छायाचित्र ${userUploadedPhotos.length + 1}`;
      const catIndex = userUploadedPhotos.length % categories.length;

      const photoObj = {
        id: photoId,
        name: cleanName,
        dataUrl: compressedDataUrl,
        category: categories[catIndex],
        orderIndex: userUploadedPhotos.length,
        timestamp: Date.now() + i
      };

      userUploadedPhotos.push(photoObj);

      if (galleryGrid) {
        const card = createUploadedCardElement(photoObj);
        galleryGrid.appendChild(card);
      }
    } catch (err) {
      console.error('Error handling uploaded image:', err);
    }
  }

  await saveUserUploadsToStorage();
  updateGalleryPhotosCounter();
  showToast('छायाचित्रे यशस्वीरीत्या जोडली गेली आहेत!');
}

/**
 * Back to top floating button
 */
function initBackToTop() {
  const btn = document.getElementById('btnBackToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Active navigation indicator using IntersectionObserver
 */
function initScrollSpyAndSmoothScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-matoshri .nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/**
 * Handle Donation / Support Form Submission (Physical Items)
 */
async function handleDonationSubmit(event) {
  event.preventDefault();

  const successAlert = document.getElementById('donationSuccessAlert');
  const errorAlert = document.getElementById('donationErrorAlert');
  const errorMsgText = document.getElementById('donationErrorMsgText');
  const btnSubmit = document.getElementById('btnDonationSubmit');
  const btnText = document.getElementById('btnDonationSubmitText');
  const spinner = document.getElementById('btnDonationSpinner');

  const nameInput = document.getElementById('donorName');
  const phoneInput = document.getElementById('donorPhone');
  const emailInput = document.getElementById('donorEmail');
  const categorySelect = document.getElementById('donorCategory');
  const itemsInput = document.getElementById('donorItems');
  const messageInput = document.getElementById('donorMessage');

  const nameFeedback = document.getElementById('donorNameFeedback');
  const phoneFeedback = document.getElementById('donorPhoneFeedback');
  const emailFeedback = document.getElementById('donorEmailFeedback');
  const itemsFeedback = document.getElementById('donorItemsFeedback');

  // Reset states
  if (successAlert) successAlert.classList.add('d-none');
  if (errorAlert) errorAlert.classList.add('d-none');
  [nameInput, phoneInput, emailInput, itemsInput].forEach(inp => {
    if (inp) {
      inp.classList.remove('is-invalid');
      inp.classList.remove('is-valid');
    }
  });
  [nameFeedback, phoneFeedback, emailFeedback, itemsFeedback].forEach(fb => {
    if (fb) fb.classList.add('d-none');
  });

  const lang = (typeof currentSiteLang !== 'undefined' && currentSiteLang) ? currentSiteLang : 'mr';
  const dict = (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[lang]) ? TRANSLATIONS[lang] : {};

  // Form values
  const name = nameInput ? nameInput.value.trim() : '';
  const phoneRaw = phoneInput ? phoneInput.value.trim() : '';
  const phoneClean = phoneRaw.replace(/[\s\-]/g, '');
  const email = emailInput ? emailInput.value.trim() : '';
  const category = categorySelect ? categorySelect.value : 'इतर';
  const items = itemsInput ? itemsInput.value.trim() : '';
  const message = messageInput ? messageInput.value.trim() : '';

  let hasError = false;

  // Validate Name
  if (!name || name.length < 2) {
    if (nameInput) nameInput.classList.add('is-invalid');
    if (nameFeedback) {
      nameFeedback.textContent = dict.donErrName || 'कृपया आपले पूर्ण नाव प्रविष्ट करा.';
      nameFeedback.classList.remove('d-none');
    }
    hasError = true;
  } else if (nameInput) {
    nameInput.classList.add('is-valid');
  }

  // Validate Phone (Accepts Indian formats, +91 optional, 10 digits)
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  if (!phoneClean || !phoneRegex.test(phoneClean)) {
    if (phoneInput) phoneInput.classList.add('is-invalid');
    if (phoneFeedback) {
      phoneFeedback.textContent = dict.donErrPhone || 'कृपया वैध १० अंकी भारतीय मोबाईल क्रमांक प्रविष्ट करा.';
      phoneFeedback.classList.remove('d-none');
    }
    hasError = true;
  } else if (phoneInput) {
    phoneInput.classList.add('is-valid');
  }

  // Validate Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    if (emailInput) emailInput.classList.add('is-invalid');
    if (emailFeedback) {
      emailFeedback.textContent = dict.donErrEmail || 'कृपया वैध ई-मेल पत्ता प्रविष्ट करा.';
      emailFeedback.classList.remove('d-none');
    }
    hasError = true;
  } else if (emailInput) {
    emailInput.classList.add('is-valid');
  }

  // Validate Donation Items Description
  if (!items || items.length < 2) {
    if (itemsInput) itemsInput.classList.add('is-invalid');
    if (itemsFeedback) {
      itemsFeedback.textContent = dict.donErrItems || 'कृपया आपण काय दान करू इच्छिता याचे तपशील प्रविष्ट करा.';
      itemsFeedback.classList.remove('d-none');
    }
    hasError = true;
  } else if (itemsInput) {
    itemsInput.classList.add('is-valid');
  }

  if (hasError) {
    if (errorAlert && errorMsgText) {
      errorMsgText.textContent = dict.donErrGeneric || 'कृपया आवश्यक रकाने योग्य प्रकारे भरा.';
      errorAlert.classList.remove('d-none');
    }
    return;
  }

  // Set loading state
  if (btnSubmit) btnSubmit.disabled = true;
  if (spinner) spinner.classList.remove('d-none');
  if (btnText) btnText.textContent = dict.donBtnSubmitting || 'पाठवत आहे...';

  try {
    const response = await fetch('/api/donations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        phone: phoneClean,
        email,
        donationCategory: category,
        donationItem: items,
        message
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      if (successAlert) {
        const msgEl = document.getElementById('donationSuccessMsgText');
        let successMsg = dict.donSuccessMsg;
        if (!successMsg) {
          if (lang === 'en') successMsg = data.messageEn;
          else if (lang === 'hi') successMsg = data.messageHi;
          else successMsg = data.messageMr;
        }
        if (msgEl) {
          msgEl.textContent = successMsg || 'धन्यवाद! आपल्या मदतीच्या इच्छेबद्दल धन्यवाद. संस्थेचा प्रतिनिधी आपल्याशी लवकरच संपर्क साधेल.';
        }
        successAlert.classList.remove('d-none');
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Reset form
      const form = document.getElementById('donationForm');
      if (form) form.reset();
      [nameInput, phoneInput, emailInput, itemsInput].forEach(inp => {
        if (inp) {
          inp.classList.remove('is-valid');
          inp.classList.remove('is-invalid');
        }
      });
    } else {
      let errMsg = dict.donErrGeneric || 'माहिती पाठवताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.';
      if (data) {
        if (lang === 'en' && data.messageEn) errMsg = data.messageEn;
        else if (lang === 'hi' && data.messageHi) errMsg = data.messageHi;
        else if (data.messageMr) errMsg = data.messageMr;
      }
      if (errorAlert && errorMsgText) {
        errorMsgText.textContent = errMsg;
        errorAlert.classList.remove('d-none');
      }
    }
  } catch (err) {
    console.error('Donation submission error:', err);
    if (errorAlert && errorMsgText) {
      errorMsgText.textContent = dict.donErrGeneric || 'इंटरनेट किंवा सर्व्हर समस्या आली. कृपया नंतर पुन्हा प्रयत्न करा.';
      errorAlert.classList.remove('d-none');
    }
  } finally {
    if (btnSubmit) btnSubmit.disabled = false;
    if (spinner) spinner.classList.add('d-none');
    if (btnText) btnText.textContent = dict.donBtnSubmit || 'मदतीची माहिती पाठवा';
  }
}
