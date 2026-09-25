/**
 * Admin Portal JavaScript
 * Role-Based Access Control (RBAC): SUPER_ADMIN, MANAGER
 * Complete Trilingual/Bilingual Language Support (Marathi & English)
 */

var currentAdminLang = localStorage.getItem('thoralya_admin_lang') || 'mr';
var currentUser = null;
var currentSessionToken = localStorage.getItem('thoralya_admin_token') || null;
var activeEvents = [];
var activeBoardMembers = [];
var activeUsers = [];

// Admin Translation Dictionary
var ADMIN_I18N = {
  mr: {
    portalBrandTitle: 'थोरल्या माँसाहेब जिजाऊ सेवा संस्था',
    portalBrandSub: 'सुरक्षित व्यवस्थापन व अ‍ॅडमिन पोर्टल (Admin Portal)',
    btnPublicSite: 'मुख्य संकेतस्थळ',
    btnLogout: 'लॉगआउट',
    loginHeading: 'अ‍ॅडमिन लॉगिन (Admin Sign In)',
    loginSub: 'केवळ अधिकृत सुपर अ‍ॅडमिन व संस्था व्यवस्थापकांसाठी',
    setupTitle: 'प्रथम सुपर अ‍ॅडमिन नोंदणी',
    setupDesc: 'संस्थेसाठी पहिले सुपर अ‍ॅडमिन खाते तयार करा. एकदा तयार झाल्यावर हे खाते सुरक्षित राहील.',
    lblLoginId: 'वापरकर्ता नाव किंवा ईमेल (Username / Email)',
    lblPassword: 'पासवर्ड (Password)',
    lblFullName: 'पूर्ण नाव (Full Name)',
    btnLogin: 'लॉगिन करा (Sign In)',
    helpCredsTitle: 'चाचणीसाठी अधिकृत खाती (Official Accounts):',
    welcomeLabel: 'स्वागत आहे,',
    roleSuperAdmin: 'सुपर अ‍ॅडमिन (Super Admin)',
    roleManager: 'कार्यक्रम व्यवस्थापक (Manager)',
    roleSuperDesc: 'सर्व विभागांचे व व्यवस्थापनाचे पूर्ण अधिकार',
    roleManagerDesc: 'आगामी कार्यक्रम जोडणे, बदलणे व प्रसिद्ध करण्याचे अधिकार',
    btnAddNewEvent: 'नवीन कार्यक्रम जोडा',
    btnViewLiveSite: 'थेट संकेतस्थळ पाहा',
    statEventsLabel: 'सक्रिय आगामी कार्यक्रम',
    statBoardLabel: 'संचालक मंडळ सदस्य (१४)',
    statManagersLabel: 'व्यवस्थापक व कर्मचारी खाती',
    tabEvents: 'आगामी कार्यक्रम व्यवस्थापन',
    tabBoard: 'संचालक मंडळ छायाचित्रे',
    tabUsers: 'व्यवस्थापक खाती (RBAC)',
    eventsManageHeading: 'आगामी कार्यक्रम व्यवस्थापन',
    eventsManageSub: 'येथे जोडलेले कार्यक्रम थेट मुख्य संकेतस्थळावर प्रसिद्ध होतात. कार्यक्रम हटवल्यास संकेतस्थळावरून तात्काळ निघून जातो.',
    btnAddEvent: 'नवीन कार्यक्रम जोडा',
    noEventsAdmin: 'सध्या कोणतेही आगामी कार्यक्रम नाहीत.',
    noEventsAdminSub: "नवीन कार्यक्रम जोडण्यासाठी वरील 'नवीन कार्यक्रम जोडा' बटणावर क्लिक करा.",
    btnAddFirstEvent: 'पहिला कार्यक्रम जोडा',
    thPhoto: 'छायाचित्र',
    thTitle: 'कार्यक्रमाचे नाव (मराठी व English)',
    thDate: 'दिनांक',
    thTime: 'वेळ',
    thLocation: 'स्थान',
    thActions: 'क्रिया (Actions)',
    boardManageHeading: 'संचालक मंडळ व्यवस्थापन (१४ संचालक सदस्य)',
    boardManageSub: "अधिकृत १४ संचालक सदस्यांचे तपशील व छायाचित्रे. छायाचित्र उपलब्ध झाल्यावर 'छायाचित्र बदला' बटण वापरून थेट अपलोड करा.",
    superAdminOnly: 'सुपर अ‍ॅडमिन अधिकार',
    btnChangePhoto: 'छायाचित्र बदला',
    usersManageHeading: 'व्यवस्थापक व कर्मचारी खाती (Role-Based Access Control)',
    usersManageSub: 'सुपर अ‍ॅडमिन पूर्ण अधिकार असलेले किंवा केवळ कार्यक्रम व्यवस्थापनासाठी व्यवस्थापक (Manager) खाती तयार व नियंत्रित करू शकतात.',
    btnCreateUser: 'नवीन खाते तयार करा',
    thUser: 'वापरकर्ता नाव',
    thName: 'नाव',
    thEmail: 'ईमेल',
    thRole: 'भूमिका',
    thStatus: 'स्थिती',
    statusActive: 'सक्रिय (Active)',
    statusInactive: 'निष्क्रिय (Inactive)',
    btnDeactivate: 'निष्क्रिय करा',
    btnActivate: 'सक्रिय करा',
    btnDelete: 'हटवा',
    fldTitleHeading: 'कार्यक्रमाचे नाव (Event Title)',
    fldDate: 'दिनांक (Date)',
    fldTime: 'वेळ (Time)',
    fldLocationHeading: 'स्थान / स्थळ (Event Location)',
    fldDescHeading: 'सविस्तर वर्णन (Description)',
    fldImage: 'कार्यक्रमाचे छायाचित्र (Event Image - पर्यायी)',
    btnCancel: 'रद्द करा',
    btnSaveEvent: 'कार्यक्रम जतन करा',
    lblSelectPhoto: 'नवीन छायाचित्र निवडा (Select Photo)',
    photoHint: 'JPG, PNG, WebP सपोर्टेड. फोटो आपोआप योग्य गुणोत्तरात सेट होईल.',
    btnUploadPhoto: 'छायाचित्र जतन करा',
    modalCreateUserTitle: 'नवीन व्यवस्थापक / अ‍ॅडमिन खाते तयार करा',
    lblNewUsername: 'वापरकर्ता नाव (Username)',
    lblNewFullName: 'पूर्ण नाव (Full Name)',
    lblNewEmail: 'ईमेल (Email)',
    lblNewPassword: 'पासवर्ड (Password)',
    lblNewRole: 'भूमिका व अधिकार (Role & Permissions)',
    btnSubmitCreateUser: 'खाते तयार करा',
    confirmDeleteEvent: 'तुम्हाला खात्री आहे की हा कार्यक्रम हटवायचा आहे?',
    confirmDeleteUser: 'तुम्हाला खात्री आहे की हे खाते हटवायचे आहे?',
    statGalleryLabel: 'गॅलरी छायाचित्रे',
    tabGallery: 'छायाचित्रे व्यवस्थापन (गॅलरी)',
    galleryManageHeading: 'छायाचित्रे व्यवस्थापन (Gallery Photos by Type)',
    galleryManageSub: 'छायाचित्रे त्यांच्या वर्गानुसार (उदा. वृद्धाश्रम इमारत, परिसर, सुविधा, भोजन, बालगृह उपक्रम, गोशाळा व क्षणचित्रे) जोडा, पहा व हटवा.',
    btnAddGalleryPhoto: 'नवीन छायाचित्र जोडा',
    modalAddPhotoTitle: 'नवीन छायाचित्र जोडा (Add Photo by Type)',
    btnSavePhoto: 'छायाचित्र जतन करा',
    confirmDeleteGalleryPhoto: 'तुम्हाला हे छायाचित्र गॅलरीतून हटवायचे आहे का?',
    statDonationsLabel: 'मदत / देणगी विनंत्या',
    tabDonations: 'मदत व देणगी विनंत्या',
    donationsManageHeading: 'मदत व देणगी विनंत्या (Donations & Support Requests)',
    donationsManageSub: 'नागरिकांनी देऊ केलेल्या प्रत्यक्ष उपयुक्त वस्तू (अन्न, कपडे, किराणा, औषधे इ.) दान नोंदी. प्रतिनिधीने संपर्क साधून स्थिती अद्यतनित करावी.',
    noDonationsAdmin: 'सध्या कोणत्याही देणगी विनंत्या नाहीत.',
    thDonor: 'अर्जदार व संपर्क (Donor)',
    thCategory: 'वर्ग (Category)',
    thDonationItems: 'देऊ इच्छित वस्तू (Items)',
    thMessage: 'अतिरिक्त माहिती (Note)',
    thSubmittedAt: 'दिनांक व वेळ (Date)',
    confirmDeleteDonation: 'तुम्हाला खात्री आहे की ही देणगी नोंद हटवायची आहे?'
  },
  en: {
    portalBrandTitle: 'Thoralya Mansaheb Jijau Seva Sanstha',
    portalBrandSub: 'Secure Management & Admin Portal',
    btnPublicSite: 'Main Website',
    btnLogout: 'Logout',
    loginHeading: 'Admin Sign In',
    loginSub: 'Authorized Super Admin and Sanstha Managers Only',
    setupTitle: 'Initial Super Admin Setup',
    setupDesc: 'Create the first Super Admin account for the organization. Once created, this account remains strictly secured.',
    lblLoginId: 'Username or Email',
    lblPassword: 'Password',
    lblFullName: 'Full Name',
    btnLogin: 'Sign In',
    helpCredsTitle: 'Authorized Demo Accounts:',
    welcomeLabel: 'Welcome,',
    roleSuperAdmin: 'Super Admin',
    roleManager: 'Event Manager',
    roleSuperDesc: 'Full administrative control over all modules and settings',
    roleManagerDesc: 'Authorized to add, edit, and publish upcoming events',
    btnAddNewEvent: 'Add New Event',
    btnViewLiveSite: 'View Live Website',
    statEventsLabel: 'Active Upcoming Events',
    statBoardLabel: 'Board Members (14)',
    statManagersLabel: 'Staff & Manager Accounts',
    tabEvents: 'Upcoming Events Management',
    tabBoard: 'Board Members Photos',
    tabUsers: 'Manager Accounts (RBAC)',
    eventsManageHeading: 'Upcoming Events Management',
    eventsManageSub: 'Events added here appear immediately on the live public website. Deleted events disappear instantly.',
    btnAddEvent: 'Add New Event',
    noEventsAdmin: 'No upcoming events at the moment.',
    noEventsAdminSub: "Click 'Add New Event' button above to create the first event.",
    btnAddFirstEvent: 'Add First Event',
    thPhoto: 'Photo',
    thTitle: 'Event Title (Marathi & English)',
    thDate: 'Date',
    thTime: 'Time',
    thLocation: 'Location',
    thActions: 'Actions',
    boardManageHeading: 'Board Members Management (14 Trustees)',
    boardManageSub: "Official 14 board members with details. Click 'Update Photo' to upload actual photograph when provided.",
    superAdminOnly: 'Super Admin Only',
    btnChangePhoto: 'Update Photo',
    usersManageHeading: 'Staff & Manager Accounts (RBAC)',
    usersManageSub: 'Super Admin can create and manage Manager accounts with restricted event management permissions.',
    btnCreateUser: 'Create New Account',
    thUser: 'Username',
    thName: 'Full Name',
    thEmail: 'Email',
    thRole: 'Role',
    thStatus: 'Status',
    statusActive: 'Active',
    statusInactive: 'Inactive',
    btnDeactivate: 'Deactivate',
    btnActivate: 'Activate',
    btnDelete: 'Delete',
    fldTitleHeading: 'Event Title (Bilingual)',
    fldDate: 'Date',
    fldTime: 'Time',
    fldLocationHeading: 'Event Location (Bilingual)',
    fldDescHeading: 'Event Description (Bilingual)',
    fldImage: 'Event Banner/Image (Optional)',
    btnCancel: 'Cancel',
    btnSaveEvent: 'Save Event',
    lblSelectPhoto: 'Select New Photograph',
    photoHint: 'JPG, PNG, WebP supported. Photo will be sized accurately without distortion.',
    btnUploadPhoto: 'Save Photograph',
    modalCreateUserTitle: 'Create New Staff / Manager Account',
    lblNewUsername: 'Username',
    lblNewFullName: 'Full Name',
    lblNewEmail: 'Email',
    lblNewPassword: 'Password',
    lblNewRole: 'Role & Permissions',
    btnSubmitCreateUser: 'Create Account',
    confirmDeleteEvent: 'Are you sure you want to delete this event?',
    confirmDeleteUser: 'Are you sure you want to delete this account?',
    statGalleryLabel: 'Gallery Photos',
    tabGallery: 'Photo Gallery Management',
    galleryManageHeading: 'Photo Gallery Management (By Type)',
    galleryManageSub: 'Upload, categorize and manage website photos by their respective type (Building, Campus, Facilities, Dining, Balgruha, Moments).',
    btnAddGalleryPhoto: 'Add New Photo',
    modalAddPhotoTitle: 'Add Photo by Type',
    btnSavePhoto: 'Save Photo',
    confirmDeleteGalleryPhoto: 'Are you sure you want to remove this photo from the gallery?',
    statDonationsLabel: 'Donation Requests',
    tabDonations: 'Donations & Support',
    donationsManageHeading: 'Donation & Support Requests',
    donationsManageSub: 'Records of physical items offered by citizens (food, clothes, groceries, medical supplies). Update status once contacted.',
    noDonationsAdmin: 'No donation requests found at the moment.',
    thDonor: 'Donor & Contact Details',
    thCategory: 'Category',
    thDonationItems: 'Items to Donate',
    thMessage: 'Message / Preferred Time',
    thSubmittedAt: 'Date & Time',
    confirmDeleteDonation: 'Are you sure you want to delete this donation record?'
  }
};

// Board Member Designations & Cities translation dictionaries
var DESIGNATION_MAP = {
  mr: { 'अध्यक्ष': 'अध्यक्ष', 'सचिव': 'सचिव', 'कोषाध्यक्ष': 'कोषाध्यक्ष', 'विश्वस्त': 'विश्वस्त' },
  en: { 'अध्यक्ष': 'President', 'सचिव': 'Secretary', 'कोषाध्यक्ष': 'Treasurer', 'विश्वस्त': 'Trustee' }
};

var CITY_MAP = {
  mr: { 'नाशिक': 'नाशिक', 'मुंबई': 'मुंबई', 'अ. नगर': 'अ. नगर', 'पुणे': 'पुणे', 'ठाणे': 'ठाणे' },
  en: { 'नाशिक': 'Nashik', 'मुंबई': 'Mumbai', 'अ. नगर': 'Ahmednagar', 'पुणे': 'Pune', 'ठाणे': 'Thane' }
};

// Initialize Admin Portal
document.addEventListener('DOMContentLoaded', function () {
  applyAdminLanguage(currentAdminLang);
  checkAuthStatus();
});

function setAdminLanguage(lang) {
  currentAdminLang = lang === 'en' ? 'en' : 'mr';
  localStorage.setItem('thoralya_admin_lang', currentAdminLang);
  applyAdminLanguage(currentAdminLang);
  if (currentUser) {
    renderDashboard();
  }
}

function applyAdminLanguage(lang) {
  var dict = ADMIN_I18N[lang] || ADMIN_I18N.mr;

  document.querySelectorAll('[data-admin-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-admin-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Toggle active language button in header
  var btnMr = document.getElementById('btnAdminLangMr');
  var btnEn = document.getElementById('btnAdminLangEn');
  if (btnMr && btnEn) {
    if (lang === 'mr') {
      btnMr.classList.add('active');
      btnEn.classList.remove('active');
    } else {
      btnEn.classList.add('active');
      btnMr.classList.remove('active');
    }
  }

  // Update HTML lang attribute
  document.documentElement.lang = lang;
}

function showToast(message, isError) {
  var toastEl = document.getElementById('adminToast');
  var msgEl = document.getElementById('adminToastMsg');
  if (!toastEl || !msgEl) return;

  msgEl.textContent = message;
  toastEl.className = 'toast align-items-center text-white border-0 ' + (isError ? 'bg-danger' : 'bg-success');
  var toast = new bootstrap.Toast(toastEl, { delay: 4000 });
  toast.show();
}

function getAuthHeaders() {
  var headers = { 'Content-Type': 'application/json' };
  if (currentSessionToken) {
    headers['Authorization'] = 'Bearer ' + currentSessionToken;
  }
  return headers;
}

// Check Authentication Status
async function checkAuthStatus() {
  try {
    var headers = {};
    if (currentSessionToken) {
      headers['Authorization'] = 'Bearer ' + currentSessionToken;
    }
    var res = await fetch('/api/auth/status', { headers: headers });
    var data = await res.json();

    if (data.authenticated && data.user) {
      currentUser = data.user;
      showDashboardView();
    } else {
      currentUser = null;
      showLoginView(data.needsSetup);
    }
  } catch (err) {
    console.error('Error checking auth', err);
    showLoginView(false);
  }
}

function showLoginView(needsSetup) {
  document.getElementById('viewLogin').classList.remove('d-none');
  document.getElementById('viewDashboard').classList.add('d-none');
  document.getElementById('adminUserPill').classList.add('d-none');

  var setupAlert = document.getElementById('setupAlert');
  var setupExtra = document.getElementById('setupExtraFields');
  var btnSubmit = document.getElementById('btnLoginText');

  if (needsSetup) {
    setupAlert.classList.remove('d-none');
    setupExtra.classList.remove('d-none');
    btnSubmit.textContent = currentAdminLang === 'en' ? 'Setup Super Admin' : 'सुपर अ‍ॅडमिन तयार करा';
  } else {
    setupAlert.classList.add('d-none');
    setupExtra.classList.add('d-none');
    btnSubmit.textContent = ADMIN_I18N[currentAdminLang].btnLogin;
  }
}

function showDashboardView() {
  document.getElementById('viewLogin').classList.add('d-none');
  document.getElementById('viewDashboard').classList.remove('d-none');
  document.getElementById('adminUserPill').classList.remove('d-none');

  document.getElementById('adminUserName').textContent = currentUser.name;
  document.getElementById('dashUserGreeting').textContent = currentUser.name;

  var isSuper = currentUser.role === 'SUPER_ADMIN';
  var roleBadge = document.getElementById('dashRoleBadge');
  var roleText = document.getElementById('dashRoleText');
  var roleDesc = document.getElementById('dashRoleDesc');

  if (isSuper) {
    roleBadge.className = 'role-badge-super';
    roleText.textContent = ADMIN_I18N[currentAdminLang].roleSuperAdmin;
    roleDesc.textContent = ADMIN_I18N[currentAdminLang].roleSuperDesc;
    // Show super admin features
    document.getElementById('statCardBoardMembers').classList.remove('d-none');
    document.getElementById('statCardManagers').classList.remove('d-none');
    document.getElementById('tabBtnBoard').classList.remove('d-none');
    document.getElementById('tabBtnUsers').classList.remove('d-none');
  } else {
    roleBadge.className = 'role-badge-manager';
    roleText.textContent = ADMIN_I18N[currentAdminLang].roleManager;
    roleDesc.textContent = ADMIN_I18N[currentAdminLang].roleManagerDesc;
    // Hide super admin only features for Manager
    document.getElementById('statCardBoardMembers').classList.add('d-none');
    document.getElementById('statCardManagers').classList.add('d-none');
    document.getElementById('tabBtnBoard').classList.add('d-none');
    document.getElementById('tabBtnUsers').classList.add('d-none');
  }

  // Switch to default events tab
  switchDashboardTab('events');
  loadEvents();
  loadAdminGallery();
  loadDonations();
  if (isSuper) {
    loadBoardMembers();
    loadUsers();
  }
}

// Auto fill demo credentials for quick convenience
function fillTestCreds(u, p) {
  document.getElementById('loginId').value = u;
  document.getElementById('loginPassword').value = p;
}

function togglePasswordVisibility(inputId, iconId) {
  var input = document.getElementById(inputId);
  var icon = document.getElementById(iconId);
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'bi bi-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'bi bi-eye';
  }
}

// Handle Login or Initial Setup Form Submit
async function handleAdminLogin(event) {
  event.preventDefault();
  var errorAlert = document.getElementById('loginErrorAlert');
  var errorText = document.getElementById('loginErrorText');
  var spinner = document.getElementById('btnLoginSpinner');
  var btnText = document.getElementById('btnLoginText');

  errorAlert.classList.add('d-none');
  spinner.classList.remove('d-none');

  var loginId = document.getElementById('loginId').value.trim();
  var password = document.getElementById('loginPassword').value;
  var setupExtra = document.getElementById('setupExtraFields');
  var isSetupMode = !setupExtra.classList.contains('d-none');

  try {
    var url = isSetupMode ? '/api/auth/setup' : '/api/auth/login';
    var payload = isSetupMode
      ? {
          username: loginId,
          password: password,
          name: document.getElementById('setupName').value.trim() || 'सुपर अ‍ॅडमिन',
          email: loginId.includes('@') ? loginId : `${loginId}@thoralya-jijau.org`
        }
      : { loginId: loginId, password: password };

    var res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    var data = await res.json();
    spinner.classList.add('d-none');

    if (!res.ok) {
      errorText.textContent = currentAdminLang === 'en' ? (data.messageEn || data.error) : (data.messageMr || data.error);
      errorAlert.classList.remove('d-none');
      return;
    }

    if (isSetupMode) {
      // Created initial admin, now login
      showToast(currentAdminLang === 'en' ? 'Super Admin created! Logging in...' : 'सुपर अ‍ॅडमिन तयार झाले! लॉगिन होत आहे...');
      document.getElementById('setupAlert').classList.add('d-none');
      setupExtra.classList.add('d-none');
      // login automatically
      var loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginId: loginId, password: password })
      });
      var loginData = await loginRes.json();
      if (loginData.token) {
        currentSessionToken = loginData.token;
        currentUser = loginData.user;
        localStorage.setItem('thoralya_admin_token', currentSessionToken);
        showDashboardView();
      }
      return;
    }

    // Normal Login Success
    currentSessionToken = data.token;
    currentUser = data.user;
    localStorage.setItem('thoralya_admin_token', currentSessionToken);
    showToast(currentAdminLang === 'en' ? data.messageEn : data.messageMr);
    showDashboardView();
  } catch (err) {
    spinner.classList.add('d-none');
    errorText.textContent = 'Server connection error. Please try again.';
    errorAlert.classList.remove('d-none');
  }
}

// Handle Logout
async function handleAdminLogout() {
  try {
    if (currentSessionToken) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getAuthHeaders()
      });
    }
  } catch (e) {
    console.error(e);
  }
  currentSessionToken = null;
  currentUser = null;
  localStorage.removeItem('thoralya_admin_token');
  showLoginView(false);
  showToast(currentAdminLang === 'en' ? 'Logged out successfully' : 'यशस्वीरीत्या लॉगआउट झाले');
}

// Dashboard Tabs Switching
function switchDashboardTab(tabName) {
  var tabs = ['events', 'donations', 'board', 'gallery', 'users'];
  tabs.forEach(function (t) {
    var btn = document.getElementById('tabBtn' + capitalize(t));
    var content = document.getElementById('tabContent' + capitalize(t));
    if (btn && content) {
      if (t === tabName) {
        btn.classList.add('active');
        content.classList.remove('d-none');
      } else {
        btn.classList.remove('active');
        content.classList.add('d-none');
      }
    }
  });
  if (tabName === 'gallery') {
    loadAdminGallery();
  }
  if (tabName === 'donations') {
    loadDonations();
  }
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ==============================================================
// 1. UPCOMING EVENTS MANAGEMENT (CRUD)
// ==============================================================
async function loadEvents() {
  try {
    var res = await fetch('/api/events');
    activeEvents = await res.json();
    renderEvents();
  } catch (err) {
    console.error('Failed to load events', err);
  }
}

function renderEvents() {
  var tbody = document.getElementById('eventsTableBody');
  var emptyState = document.getElementById('eventsEmptyState');
  var tableWrap = document.getElementById('eventsTableWrap');
  var statCount = document.getElementById('statEventsCount');

  if (statCount) statCount.textContent = activeEvents.length;

  if (!activeEvents || activeEvents.length === 0) {
    emptyState.classList.remove('d-none');
    tableWrap.classList.add('d-none');
    return;
  }

  emptyState.classList.add('d-none');
  tableWrap.classList.remove('d-none');

  tbody.innerHTML = '';
  activeEvents.forEach(function (evt) {
    var tr = document.createElement('tr');

    var imgHtml = evt.imageUrl
      ? `<img src="${evt.imageUrl}" alt="" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; border: 1px solid #E5E7EB;" />`
      : `<div style="width: 50px; height: 50px; background: #F3F4F6; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #9CA3AF;"><i class="bi bi-calendar-event fs-5"></i></div>`;

    var titlePrimary = currentAdminLang === 'en' ? evt.titleEn : evt.titleMr;
    var titleSecondary = currentAdminLang === 'en' ? evt.titleMr : evt.titleEn;
    var locationDisplay = currentAdminLang === 'en' ? evt.locationEn : evt.locationMr;

    tr.innerHTML = `
      <td>${imgHtml}</td>
      <td>
        <div class="fw-bold text-dark">${escapeHtml(titlePrimary)}</div>
        <small class="text-muted">${escapeHtml(titleSecondary)}</small>
      </td>
      <td>
        <span class="badge bg-light text-dark border">
          <i class="bi bi-calendar3 me-1 text-success"></i> ${escapeHtml(evt.date || '-')}
        </span>
      </td>
      <td><small class="text-muted"><i class="bi bi-clock me-1"></i> ${escapeHtml(evt.time || '-')}</small></td>
      <td><small class="text-muted">${escapeHtml(locationDisplay || '-')}</small></td>
      <td style="text-align: right;">
        <button class="btn btn-sm btn-outline-primary me-1" onclick="openEditEventModal('${evt.id}')" title="Edit">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger" onclick="handleDeleteEvent('${evt.id}')" title="Delete">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openAddEventModal() {
  document.getElementById('eventEditId').value = '';
  document.getElementById('eventTitleMr').value = '';
  document.getElementById('eventTitleEn').value = '';
  document.getElementById('eventDate').value = '';
  document.getElementById('eventTime').value = '';
  document.getElementById('eventLocationMr').value = 'थोरल्या माँसाहेब जिजाऊ सेवा संस्था, सामनगाव, नाशिक';
  document.getElementById('eventLocationEn').value = 'Thoralya Mansaheb Jijau Seva Sanstha, Samangaon, Nashik';
  document.getElementById('eventDescMr').value = '';
  document.getElementById('eventDescEn').value = '';
  document.getElementById('eventImageUrl').value = '';
  document.getElementById('eventImageFileInput').value = '';
  document.getElementById('eventImgPreviewWrap').classList.add('d-none');
  document.getElementById('btnRemoveEventImg').classList.add('d-none');

  document.getElementById('modalEventHeadingText').textContent =
    currentAdminLang === 'en' ? 'Add New Upcoming Event' : 'नवीन आगामी कार्यक्रम जोडा';

  var modal = new bootstrap.Modal(document.getElementById('modalEvent'));
  modal.show();
}

function openEditEventModal(id) {
  var evt = activeEvents.find(e => e.id === id);
  if (!evt) return;

  document.getElementById('eventEditId').value = evt.id;
  document.getElementById('eventTitleMr').value = evt.titleMr || '';
  document.getElementById('eventTitleEn').value = evt.titleEn || '';
  document.getElementById('eventDate').value = evt.date || '';
  document.getElementById('eventTime').value = evt.time || '';
  document.getElementById('eventLocationMr').value = evt.locationMr || '';
  document.getElementById('eventLocationEn').value = evt.locationEn || '';
  document.getElementById('eventDescMr').value = evt.descMr || '';
  document.getElementById('eventDescEn').value = evt.descEn || '';
  document.getElementById('eventImageUrl').value = evt.imageUrl || '';
  document.getElementById('eventImageFileInput').value = '';

  var previewWrap = document.getElementById('eventImgPreviewWrap');
  var previewImg = document.getElementById('eventImgPreview');
  var removeBtn = document.getElementById('btnRemoveEventImg');

  if (evt.imageUrl) {
    previewImg.src = evt.imageUrl;
    previewWrap.classList.remove('d-none');
    removeBtn.classList.remove('d-none');
  } else {
    previewWrap.classList.add('d-none');
    removeBtn.classList.add('d-none');
  }

  document.getElementById('modalEventHeadingText').textContent =
    currentAdminLang === 'en' ? 'Edit Upcoming Event' : 'आगामी कार्यक्रम संपादित करा';

  var modal = new bootstrap.Modal(document.getElementById('modalEvent'));
  modal.show();
}

function handleEventImageFileSelect(event) {
  var file = event.target.files && event.target.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = async function (e) {
    var dataUrl = e.target.result;
    try {
      // Upload image to backend
      var uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ dataUrl: dataUrl, filename: file.name })
      });
      var uploadData = await uploadRes.json();
      if (uploadData.url) {
        document.getElementById('eventImageUrl').value = uploadData.url;
        document.getElementById('eventImgPreview').src = uploadData.url;
        document.getElementById('eventImgPreviewWrap').classList.remove('d-none');
        document.getElementById('btnRemoveEventImg').classList.remove('d-none');
        showToast(currentAdminLang === 'en' ? 'Image uploaded!' : 'छायाचित्र अपलोड झाले!');
      }
    } catch (err) {
      console.error('Upload error', err);
      showToast('Image upload failed', true);
    }
  };
  reader.readAsDataURL(file);
}

function removeEventImage() {
  document.getElementById('eventImageUrl').value = '';
  document.getElementById('eventImageFileInput').value = '';
  document.getElementById('eventImgPreviewWrap').classList.add('d-none');
  document.getElementById('btnRemoveEventImg').classList.add('d-none');
}

async function handleSaveEvent(event) {
  event.preventDefault();
  var editId = document.getElementById('eventEditId').value;
  var payload = {
    titleMr: document.getElementById('eventTitleMr').value.trim(),
    titleEn: document.getElementById('eventTitleEn').value.trim(),
    date: document.getElementById('eventDate').value,
    time: document.getElementById('eventTime').value.trim(),
    locationMr: document.getElementById('eventLocationMr').value.trim(),
    locationEn: document.getElementById('eventLocationEn').value.trim(),
    descMr: document.getElementById('eventDescMr').value.trim(),
    descEn: document.getElementById('eventDescEn').value.trim(),
    imageUrl: document.getElementById('eventImageUrl').value || null
  };

  try {
    var url = editId ? `/api/events/${editId}` : '/api/events';
    var method = editId ? 'PUT' : 'POST';

    var res = await fetch(url, {
      method: method,
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    var data = await res.json();
    if (!res.ok) {
      showToast(currentAdminLang === 'en' ? (data.messageEn || data.error) : (data.messageMr || data.error), true);
      return;
    }

    showToast(currentAdminLang === 'en' ? data.messageEn : data.messageMr);
    // Close modal
    var modalEl = document.getElementById('modalEvent');
    var modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    // Reload events
    loadEvents();
  } catch (err) {
    showToast('Failed to save event', true);
  }
}

async function handleDeleteEvent(id) {
  var confirmMsg = ADMIN_I18N[currentAdminLang].confirmDeleteEvent;
  if (!confirm(confirmMsg)) return;

  try {
    var res = await fetch(`/api/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    var data = await res.json();
    if (!res.ok) {
      showToast(currentAdminLang === 'en' ? (data.messageEn || data.error) : (data.messageMr || data.error), true);
      return;
    }
    showToast(currentAdminLang === 'en' ? data.messageEn : data.messageMr);
    loadEvents();
  } catch (err) {
    showToast('Failed to delete event', true);
  }
}

// ==============================================================
// 2. BOARD MEMBERS MANAGEMENT (SUPER ADMIN ONLY)
// ==============================================================
async function loadBoardMembers() {
  try {
    var res = await fetch('/api/board-members');
    activeBoardMembers = await res.json();
    renderBoardMembers();
  } catch (err) {
    console.error('Failed to load board members', err);
  }
}

function renderBoardMembers() {
  var grid = document.getElementById('adminBoardMembersGrid');
  if (!grid) return;
  grid.innerHTML = '';

  activeBoardMembers.forEach(function (member) {
    var col = document.createElement('div');
    col.className = 'col-sm-6 col-md-4 col-lg-3';

    var photoSrc = member.photoUrl || '/images/board-member-placeholder.jpg';
    var designationText = DESIGNATION_MAP[currentAdminLang][member.designationKey] || member.designationKey;
    var cityText = CITY_MAP[currentAdminLang][member.cityKey] || member.cityKey;

    col.innerHTML = `
      <div class="member-admin-card">
        <span class="badge bg-secondary mb-2 position-absolute top-0 start-0 m-2">#${member.id}</span>
        <img src="${photoSrc}" alt="${escapeHtml(member.name)}" class="member-admin-photo" />
        <h5 class="h6 fw-bold text-dark mb-1">${escapeHtml(member.name)}</h5>
        <span class="badge bg-success bg-opacity-10 text-success mb-1">${escapeHtml(designationText)}</span>
        <small class="text-muted mb-3"><i class="bi bi-geo-alt me-1"></i> ${escapeHtml(cityText)}</small>
        <button class="btn btn-sm btn-outline-dark w-100" onclick="openBoardPhotoModal(${member.id})">
          <i class="bi bi-camera me-1"></i> ${ADMIN_I18N[currentAdminLang].btnChangePhoto}
        </button>
      </div>
    `;
    grid.appendChild(col);
  });
}

function openBoardPhotoModal(memberId) {
  var member = activeBoardMembers.find(m => m.id === memberId);
  if (!member) return;

  document.getElementById('boardMemberId').value = member.id;
  document.getElementById('boardMemberModalName').textContent = member.name;
  var desig = DESIGNATION_MAP[currentAdminLang][member.designationKey] || member.designationKey;
  var city = CITY_MAP[currentAdminLang][member.cityKey] || member.cityKey;
  document.getElementById('boardMemberModalRole').textContent = `${desig} • ${city}`;
  document.getElementById('boardPhotoCurrentPreview').src = member.photoUrl || '/images/board-member-placeholder.jpg';
  document.getElementById('boardPhotoFileInput').value = '';
  document.getElementById('boardPhotoDataUrl').value = '';

  var modal = new bootstrap.Modal(document.getElementById('modalBoardPhoto'));
  modal.show();
}

function handleBoardPhotoFileSelect(event) {
  var file = event.target.files && event.target.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = async function (e) {
    var dataUrl = e.target.result;
    document.getElementById('boardPhotoCurrentPreview').src = dataUrl;
    try {
      var uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ dataUrl: dataUrl, filename: 'member_' + file.name })
      });
      var uploadData = await uploadRes.json();
      if (uploadData.url) {
        document.getElementById('boardPhotoDataUrl').value = uploadData.url;
      }
    } catch (err) {
      console.error(err);
    }
  };
  reader.readAsDataURL(file);
}

async function handleSaveBoardPhoto(event) {
  event.preventDefault();
  var memberId = document.getElementById('boardMemberId').value;
  var photoUrl = document.getElementById('boardPhotoDataUrl').value;

  if (!photoUrl) {
    showToast(currentAdminLang === 'en' ? 'Please select a photo first' : 'कृपया आधी छायाचित्र निवडा', true);
    return;
  }

  try {
    var res = await fetch(`/api/board-members/${memberId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ photoUrl: photoUrl })
    });
    var data = await res.json();
    if (!res.ok) {
      showToast('Failed to update photo', true);
      return;
    }
    showToast(currentAdminLang === 'en' ? data.messageEn : data.messageMr);
    var modalEl = document.getElementById('modalBoardPhoto');
    var modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    loadBoardMembers();
  } catch (err) {
    showToast('Failed to update board member photo', true);
  }
}

// ==============================================================
// 3. USER MANAGEMENT (RBAC) (SUPER ADMIN ONLY)
// ==============================================================
async function loadUsers() {
  try {
    var res = await fetch('/api/users', { headers: getAuthHeaders() });
    if (!res.ok) return;
    activeUsers = await res.json();
    renderUsers();
  } catch (err) {
    console.error('Failed to load users', err);
  }
}

function renderUsers() {
  var tbody = document.getElementById('usersTableBody');
  var statManagers = document.getElementById('statManagersCount');
  if (statManagers) statManagers.textContent = activeUsers.length;
  if (!tbody) return;

  tbody.innerHTML = '';
  activeUsers.forEach(function (user) {
    var tr = document.createElement('tr');

    var isSuper = user.role === 'SUPER_ADMIN';
    var roleBadge = isSuper
      ? `<span class="role-badge-super"><i class="bi bi-shield-check"></i> SUPER ADMIN</span>`
      : `<span class="role-badge-manager"><i class="bi bi-person-badge"></i> MANAGER</span>`;

    var statusBadge = user.active
      ? `<span class="badge bg-success-subtle text-success">${ADMIN_I18N[currentAdminLang].statusActive}</span>`
      : `<span class="badge bg-danger-subtle text-danger">${ADMIN_I18N[currentAdminLang].statusInactive}</span>`;

    var isSelf = currentUser && currentUser.id === user.id;

    var toggleBtn = isSelf
      ? ''
      : `<button class="btn btn-sm btn-outline-secondary me-1" onclick="handleToggleUserStatus('${user.id}', ${!user.active})">
          ${user.active ? ADMIN_I18N[currentAdminLang].btnDeactivate : ADMIN_I18N[currentAdminLang].btnActivate}
        </button>`;

    var deleteBtn = isSelf
      ? ''
      : `<button class="btn btn-sm btn-outline-danger" onclick="handleDeleteUser('${user.id}')" title="Delete">
          <i class="bi bi-trash"></i>
        </button>`;

    tr.innerHTML = `
      <td><strong>${escapeHtml(user.username)}</strong></td>
      <td>${escapeHtml(user.name)}</td>
      <td><small class="text-muted">${escapeHtml(user.email)}</small></td>
      <td>${roleBadge}</td>
      <td>${statusBadge}</td>
      <td style="text-align: right;">${toggleBtn} ${deleteBtn}</td>
    `;
    tbody.appendChild(tr);
  });
}

function openAddUserModal() {
  document.getElementById('newUsername').value = '';
  document.getElementById('newFullName').value = '';
  document.getElementById('newEmail').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('newRole').value = 'MANAGER';

  var modal = new bootstrap.Modal(document.getElementById('modalUser'));
  modal.show();
}

async function handleCreateUser(event) {
  event.preventDefault();
  var payload = {
    username: document.getElementById('newUsername').value.trim(),
    name: document.getElementById('newFullName').value.trim(),
    email: document.getElementById('newEmail').value.trim(),
    password: document.getElementById('newPassword').value,
    role: document.getElementById('newRole').value
  };

  try {
    var res = await fetch('/api/users', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    var data = await res.json();
    if (!res.ok) {
      showToast(currentAdminLang === 'en' ? (data.messageEn || data.error) : (data.messageMr || data.error), true);
      return;
    }
    showToast(currentAdminLang === 'en' ? data.messageEn : data.messageMr);
    var modalEl = document.getElementById('modalUser');
    var modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
    loadUsers();
  } catch (err) {
    showToast('Failed to create account', true);
  }
}

async function handleToggleUserStatus(id, newStatus) {
  try {
    var res = await fetch(`/api/users/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ active: newStatus })
    });
    var data = await res.json();
    if (!res.ok) {
      showToast(currentAdminLang === 'en' ? (data.messageEn || data.error) : (data.messageMr || data.error), true);
      return;
    }
    showToast(currentAdminLang === 'en' ? data.messageEn : data.messageMr);
    loadUsers();
  } catch (err) {
    showToast('Failed to update status', true);
  }
}

async function handleDeleteUser(id) {
  var confirmMsg = ADMIN_I18N[currentAdminLang].confirmDeleteUser;
  if (!confirm(confirmMsg)) return;

  try {
    var res = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    var data = await res.json();
    if (!res.ok) {
      showToast(currentAdminLang === 'en' ? (data.messageEn || data.error) : (data.messageMr || data.error), true);
      return;
    }
    showToast(currentAdminLang === 'en' ? data.messageEn : data.messageMr);
    loadUsers();
  } catch (err) {
    showToast('Failed to delete account', true);
  }
}

// Security: Escape HTML strings to prevent XSS
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==============================================================
// GALLERY MANAGEMENT (CATEGORIZED BY TYPE)
// ==============================================================
var cachedGallery = [];
var currentAdminGalFilter = 'all';
var selectedGalFileBase64 = null;

var CATEGORY_BADGE_CLASSES = {
  'वृद्धाश्रम': 'badge bg-primary',
  'परिसर': 'badge bg-success',
  'सुविधा': 'badge bg-info text-dark',
  'भोजन': 'badge bg-warning text-dark',
  'उपक्रम': 'badge bg-secondary',
  'क्षणचित्रे': 'badge bg-danger'
};

async function loadAdminGallery() {
  try {
    var res = await fetch('/api/gallery');
    if (!res.ok) throw new Error('Failed to fetch gallery');
    cachedGallery = await res.json();

    // Update stat card
    var statCount = document.getElementById('statGalleryCount');
    if (statCount) {
      statCount.textContent = cachedGallery.length;
    }

    renderAdminGallery();
  } catch (err) {
    console.error('Error loading gallery', err);
  }
}

function filterAdminGallery(filterType, btnEl) {
  currentAdminGalFilter = filterType;
  var btns = document.querySelectorAll('.admin-gal-filter-btn');
  btns.forEach(function (b) {
    b.classList.remove('active', 'btn-dark');
    b.classList.add('btn-outline-secondary');
  });
  if (btnEl) {
    btnEl.classList.remove('btn-outline-secondary');
    btnEl.classList.add('active', 'btn-dark');
  }
  renderAdminGallery();
}

function renderAdminGallery() {
  var grid = document.getElementById('adminGalleryGrid');
  if (!grid) return;

  var items = cachedGallery;
  if (currentAdminGalFilter !== 'all') {
    items = items.filter(function (g) {
      return g.category === currentAdminGalFilter;
    });
  }

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="col-12 py-5 text-center text-muted">
        <i class="bi bi-images display-5 d-block mb-3 text-secondary"></i>
        <p class="fw-semibold mb-1">या प्रकारात अद्याप छायाचित्रे नाहीत.</p>
        <p class="small text-muted mb-0">छायाचित्र जोडण्यासाठी वरील 'नवीन छायाचित्र जोडा' बटण वापरा.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = items.map(function (item) {
    var badgeClass = CATEGORY_BADGE_CLASSES[item.category] || 'badge bg-secondary';
    var title = currentAdminLang === 'en' ? (item.titleEn || item.titleMr) : item.titleMr;
    var safeImg = escapeHtml(item.imageUrl);
    var safeTitle = escapeHtml(title);
    var safeCat = escapeHtml(item.category);

    return `
      <div class="col-sm-6 col-md-4 col-xl-3">
        <div class="card h-100 border shadow-sm rounded-3 overflow-hidden">
          <div style="height: 180px; background: #f1f5f9; position: relative; overflow: hidden;">
            <img src="${safeImg}" alt="${safeTitle}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/images/ashram-building.jpg'" />
            <span class="${badgeClass} position-absolute top-0 start-0 m-2 shadow-sm">${safeCat}</span>
          </div>
          <div class="card-body p-3 d-flex flex-column">
            <h6 class="card-title fw-bold text-dark mb-1 text-truncate" title="${safeTitle}">${safeTitle}</h6>
            <small class="text-muted text-truncate mb-3">${escapeHtml(item.titleEn || '')}</small>
            <div class="mt-auto d-flex justify-content-between align-items-center pt-2 border-top">
              <span class="text-muted" style="font-size: 0.75rem;">
                <i class="bi bi-calendar3 me-1"></i>${item.createdAt ? item.createdAt.substring(0, 10) : ''}
              </span>
              <button class="btn btn-sm btn-outline-danger" onclick="handleDeleteGalleryPhoto('${item.id}')" title="छायाचित्र हटवा">
                <i class="bi bi-trash me-1"></i>हटवा
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openAddGalleryModal() {
  document.getElementById('formGalleryPhoto').reset();
  selectedGalFileBase64 = null;
  var previewWrap = document.getElementById('galPreviewWrap');
  var previewImg = document.getElementById('galPhotoPreview');
  if (previewWrap && previewImg) {
    previewWrap.classList.add('d-none');
    previewImg.src = '';
  }
  var modalEl = document.getElementById('modalGalleryPhoto');
  var modal = new bootstrap.Modal(modalEl);
  modal.show();
}

function handleGalleryPhotoFileSelect(event) {
  var file = event.target.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = function (e) {
    selectedGalFileBase64 = e.target.result;
    var previewWrap = document.getElementById('galPreviewWrap');
    var previewImg = document.getElementById('galPhotoPreview');
    if (previewWrap && previewImg) {
      previewImg.src = selectedGalFileBase64;
      previewWrap.classList.remove('d-none');
    }
  };
  reader.readAsDataURL(file);
}

function updateGalleryPreviewFromUrl(url) {
  var previewWrap = document.getElementById('galPreviewWrap');
  var previewImg = document.getElementById('galPhotoPreview');
  if (url && url.trim()) {
    previewImg.src = url.trim();
    previewWrap.classList.remove('d-none');
    selectedGalFileBase64 = null;
  } else if (!selectedGalFileBase64) {
    previewWrap.classList.add('d-none');
  }
}

async function handleSaveGalleryPhoto(event) {
  event.preventDefault();
  var btnSubmit = document.getElementById('btnSubmitGalPhoto');
  btnSubmit.disabled = true;

  try {
    var category = document.getElementById('galPhotoCategory').value;
    var titleMr = document.getElementById('galPhotoTitleMr').value.trim();
    var titleEn = document.getElementById('galPhotoTitleEn').value.trim();
    var imageUrl = document.getElementById('galPhotoUrl').value.trim();

    // If a file was selected, upload it first to /api/upload
    if (selectedGalFileBase64) {
      var uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          dataUrl: selectedGalFileBase64,
          filename: 'gallery_' + category
        })
      });
      var uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.error || 'Failed to upload photo');
      }
      imageUrl = uploadData.url;
    }

    if (!imageUrl) {
      alert('कृपया छायाचित्र निवडा किंवा URL द्या.');
      btnSubmit.disabled = false;
      return;
    }

    var res = await fetch('/api/gallery', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        category: category,
        titleMr: titleMr,
        titleEn: titleEn,
        imageUrl: imageUrl
      })
    });

    var data = await res.json();
    if (!res.ok) {
      throw new Error(data.messageMr || data.error);
    }

    showToast(currentAdminLang === 'en' ? data.messageEn : data.messageMr);

    var modalEl = document.getElementById('modalGalleryPhoto');
    var modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    await loadAdminGallery();
  } catch (err) {
    alert('त्रुटी: ' + (err.message || 'छायाचित्र जतन करता आले नाही.'));
  } finally {
    btnSubmit.disabled = false;
  }
}

async function handleDeleteGalleryPhoto(id) {
  var confirmMsg = ADMIN_I18N[currentAdminLang].confirmDeleteGalleryPhoto || 'तुम्हाला हे छायाचित्र गॅलरीतून हटवायचे आहे का?';
  if (!confirm(confirmMsg)) return;

  try {
    var res = await fetch('/api/gallery/' + id, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    var data = await res.json();
    if (!res.ok) {
      showToast(currentAdminLang === 'en' ? (data.messageEn || data.error) : (data.messageMr || data.error), true);
      return;
    }
    showToast(currentAdminLang === 'en' ? data.messageEn : data.messageMr);
    await loadAdminGallery();
  } catch (err) {
    showToast('Failed to delete photo', true);
  }
}

// ==============================================================
// 5. DONATION & PHYSICAL SUPPORT REQUESTS MANAGEMENT
// ==============================================================
var activeDonations = [];
var currentDonationFilter = 'ALL';
var currentDonationSearch = '';

async function loadDonations() {
  try {
    var res = await fetch('/api/donations', {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      console.warn('Failed to fetch donations:', res.status);
      return;
    }
    activeDonations = await res.json();

    // Update Counter Stat
    var statCount = document.getElementById('statDonationsCount');
    if (statCount) {
      statCount.textContent = activeDonations.length;
    }

    applyDonationFiltersAndRender();
  } catch (err) {
    console.error('Error loading donations:', err);
  }
}

function filterDonationsByStatus(status) {
  currentDonationFilter = status;

  // Toggle filter button styles
  var btnAll = document.getElementById('donFilterBtnAll');
  var btnPending = document.getElementById('donFilterBtnPending');
  var btnContacted = document.getElementById('donFilterBtnContacted');
  var btnCompleted = document.getElementById('donFilterBtnCompleted');

  [btnAll, btnPending, btnContacted, btnCompleted].forEach(function (b) {
    if (b) b.classList.remove('active');
  });

  if (status === 'ALL' && btnAll) btnAll.classList.add('active');
  else if (status === 'PENDING' && btnPending) btnPending.classList.add('active');
  else if (status === 'CONTACTED' && btnContacted) btnContacted.classList.add('active');
  else if (status === 'COMPLETED' && btnCompleted) btnCompleted.classList.add('active');

  applyDonationFiltersAndRender();
}

function handleDonationSearch(query) {
  currentDonationSearch = (query || '').toLowerCase().trim();
  applyDonationFiltersAndRender();
}

function applyDonationFiltersAndRender() {
  var filtered = activeDonations.slice();

  // Status Filter
  if (currentDonationFilter !== 'ALL') {
    filtered = filtered.filter(function (d) {
      return d.status === currentDonationFilter;
    });
  }

  // Search Filter
  if (currentDonationSearch) {
    filtered = filtered.filter(function (d) {
      var nameMatch = (d.name || '').toLowerCase().includes(currentDonationSearch);
      var phoneMatch = (d.phone || '').toLowerCase().includes(currentDonationSearch);
      var emailMatch = (d.email || '').toLowerCase().includes(currentDonationSearch);
      var itemMatch = (d.donationItem || '').toLowerCase().includes(currentDonationSearch);
      var catMatch = (d.donationCategory || '').toLowerCase().includes(currentDonationSearch);
      return nameMatch || phoneMatch || emailMatch || itemMatch || catMatch;
    });
  }

  renderDonations(filtered);
}

function renderDonations(donations) {
  var tbody = document.getElementById('donationsTableBody');
  var emptyState = document.getElementById('donationsEmptyState');
  var tableWrap = document.getElementById('donationsTableWrap');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!donations || donations.length === 0) {
    if (emptyState) emptyState.classList.remove('d-none');
    if (tableWrap) tableWrap.classList.add('d-none');
    return;
  }

  if (emptyState) emptyState.classList.add('d-none');
  if (tableWrap) tableWrap.classList.remove('d-none');

  donations.forEach(function (d) {
    var tr = document.createElement('tr');

    // Format date
    var formattedDate = '—';
    if (d.submissionDate) {
      try {
        var dt = new Date(d.submissionDate);
        formattedDate = dt.toLocaleDateString('mr-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) + ' ' + dt.toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' });
      } catch (e) {
        formattedDate = d.submissionDate.substring(0, 10);
      }
    }

    // Status pill & selector
    var badgeClass = 'bg-warning text-dark';
    var statusLabel = 'प्रलंबित (Pending)';
    if (d.status === 'CONTACTED') {
      badgeClass = 'bg-info text-dark';
      statusLabel = 'संपर्क केला (Contacted)';
    } else if (d.status === 'COMPLETED') {
      badgeClass = 'bg-success text-white';
      statusLabel = 'पूर्ण / स्वीकृत (Completed)';
    }

    tr.innerHTML = `
      <td>
        <div class="fw-bold text-dark fs-6">${escapeHtml(d.name)}</div>
        <div class="small mt-1">
          <a href="tel:${escapeHtml(d.phone)}" class="text-success text-decoration-none fw-medium me-2">
            <i class="bi bi-telephone-fill me-1"></i>${escapeHtml(d.phone)}
          </a>
        </div>
        <div class="small text-muted">
          <a href="mailto:${escapeHtml(d.email)}" class="text-muted text-decoration-none">
            <i class="bi bi-envelope-fill me-1"></i>${escapeHtml(d.email)}
          </a>
        </div>
      </td>
      <td>
        <span class="badge bg-secondary bg-opacity-10 text-dark border px-2 py-1">${escapeHtml(d.donationCategory || 'इतर')}</span>
      </td>
      <td>
        <div class="fw-medium text-dark" style="max-width: 280px; white-space: normal; line-height: 1.4;">
          ${escapeHtml(d.donationItem || '—')}
        </div>
      </td>
      <td>
        <div class="small text-muted" style="max-width: 220px; white-space: normal; line-height: 1.4;">
          ${d.message ? escapeHtml(d.message) : '<span class="opacity-50">—</span>'}
        </div>
      </td>
      <td>
        <div class="small text-muted text-nowrap">${escapeHtml(formattedDate)}</div>
      </td>
      <td>
        <div class="mb-1">
          <span class="badge ${badgeClass}">${escapeHtml(statusLabel)}</span>
        </div>
        <select class="form-select form-select-sm mt-1" style="font-size: 0.8rem; padding: 2px 6px;" onchange="updateDonationStatus('${d.id}', this.value)">
          <option value="PENDING" ${d.status === 'PENDING' ? 'selected' : ''}>प्रलंबित (Pending)</option>
          <option value="CONTACTED" ${d.status === 'CONTACTED' ? 'selected' : ''}>संपर्क केला (Contacted)</option>
          <option value="COMPLETED" ${d.status === 'COMPLETED' ? 'selected' : ''}>स्वीकृत / पूर्ण (Completed)</option>
        </select>
      </td>
      <td style="text-align: right;">
        <button class="btn btn-sm btn-outline-danger" title="हटवा (Delete)" onclick="deleteDonation('${d.id}')">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function updateDonationStatus(id, newStatus) {
  try {
    var res = await fetch('/api/donations/' + id + '/status', {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: newStatus })
    });
    var data = await res.json();
    if (!res.ok) {
      showToast(currentAdminLang === 'en' ? (data.messageEn || data.error) : (data.messageMr || data.error), true);
      return;
    }
    showToast(currentAdminLang === 'en' ? data.messageEn : data.messageMr);
    await loadDonations();
  } catch (err) {
    showToast('Failed to update status', true);
  }
}

async function deleteDonation(id) {
  var confirmMsg = ADMIN_I18N[currentAdminLang].confirmDeleteDonation || 'तुम्हाला खात्री आहे की ही देणगी नोंद हटवायची आहे?';
  if (!confirm(confirmMsg)) return;

  try {
    var res = await fetch('/api/donations/' + id, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    var data = await res.json();
    if (!res.ok) {
      showToast(currentAdminLang === 'en' ? (data.messageEn || data.error) : (data.messageMr || data.error), true);
      return;
    }
    showToast(currentAdminLang === 'en' ? data.messageEn : data.messageMr);
    await loadDonations();
  } catch (err) {
    showToast('Failed to delete donation record', true);
  }
}


