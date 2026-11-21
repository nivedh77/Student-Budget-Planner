/**
 * SPENDORA — Student Budget Planner
 * Professional Fintech Core Logic & State Management
 * Robust, bulletproof architecture with full exception handling.
 */

// =============================================================================
// STATE & SAFE STORAGE INITIALIZATION
// =============================================================================

const DEFAULT_CATEGORIES = [
  { name: 'Food', allocation: 30 },
  { name: 'Transport', allocation: 20 },
  { name: 'Shopping', allocation: 20 },
  { name: 'Study', allocation: 15 },
  { name: 'Entertainment', allocation: 15 }
];

let budget = 15000;
let categories = [...DEFAULT_CATEGORIES];
let expenses = [];
let userProfile = {
  name: '',
  tagline: 'Student Edition'
};

// Safe reader for localStorage to avoid crashing on SecurityError or corrupted JSON
function initStorage() {
  try {
    const savedBudget = localStorage.getItem('budget');
    if (savedBudget) {
      const parsedNum = Number(savedBudget);
      if (!isNaN(parsedNum) && parsedNum > 0) {
        budget = parsedNum;
      }
    }
  } catch (err) {
    console.warn('Storage read failed for budget:', err);
  }

  try {
    const savedCats = localStorage.getItem('categories');
    if (savedCats) {
      const parsed = JSON.parse(savedCats);
      if (Array.isArray(parsed) && parsed.length > 0) {
        categories = parsed;
      }
    }
  } catch (err) {
    console.warn('Storage read failed for categories, falling back to defaults:', err);
    categories = [...DEFAULT_CATEGORIES];
  }

  try {
    const savedExp = localStorage.getItem('expenses');
    if (savedExp) {
      const parsed = JSON.parse(savedExp);
      if (Array.isArray(parsed)) {
        expenses = parsed;
      }
    }
  } catch (err) {
    console.warn('Storage read failed for expenses:', err);
    expenses = [];
  }

  try {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsedProf = JSON.parse(savedProfile);
      if (parsedProf && typeof parsedProf === 'object') {
        userProfile = {
          name: parsedProf.name || '',
          tagline: parsedProf.tagline || 'Student Edition'
        };
      }
    }
  } catch (e) {
    console.warn('Storage read failed for userProfile:', e);
  }
}

initStorage();

// Safe saver for localStorage
function saveData() {
  try {
    localStorage.setItem('budget', String(budget));
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  } catch (err) {
    console.warn('Storage save failed:', err);
  }
}

// User Profile Customization
function saveUserProfile() {
  const nameInput = document.getElementById('userNameInput');
  const taglineInput = document.getElementById('userTaglineInput');
  if (!nameInput) return;

  userProfile.name = nameInput.value.trim();
  userProfile.tagline = taglineInput && taglineInput.value.trim() ? taglineInput.value.trim() : 'Student Edition';

  saveData();
  updateProfileDisplay();
  showToast('Profile updated');
}

function updateProfileDisplay() {
  const nameElem = document.getElementById('sidebarUserName');
  const tagElem = document.getElementById('sidebarUserTagline');
  const avatarElem = document.getElementById('sidebarUserAvatar');
  const greetingElem = document.getElementById('pageGreeting');
  const nameInput = document.getElementById('userNameInput');
  const taglineInput = document.getElementById('userTaglineInput');

  const displayName = userProfile.name || 'Student Plan';
  const displayTagline = userProfile.tagline || 'Student Edition';
  const initial = userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'S';

  if (nameElem) nameElem.textContent = displayName;
  if (tagElem) tagElem.textContent = displayTagline;
  if (avatarElem) avatarElem.textContent = initial;
  if (greetingElem) {
    greetingElem.textContent = userProfile.name ? `Welcome, ${userProfile.name} 👋` : 'Welcome back 👋';
  }

  if (nameInput && !nameInput.value && userProfile.name) {
    nameInput.value = userProfile.name;
  }
  if (taglineInput && !taglineInput.value && userProfile.tagline) {
    taglineInput.value = userProfile.tagline;
  }
}

// =============================================================================
// CATEGORY VISUAL METADATA (Icons & Colors)
// =============================================================================

const CATEGORY_MAP = {
  'Food': {
    icon: 'fa-solid fa-utensils',
    color: '#ea580c',
    bg: '#ffedd5'
  },
  'Transport': {
    icon: 'fa-solid fa-bus-simple',
    color: '#0284c7',
    bg: '#e0f2fe'
  },
  'Shopping': {
    icon: 'fa-solid fa-bag-shopping',
    color: '#db2777',
    bg: '#fce7f3'
  },
  'Study': {
    icon: 'fa-solid fa-book-open',
    color: '#16a34a',
    bg: '#dcfce7'
  },
  'Entertainment': {
    icon: 'fa-solid fa-gamepad',
    color: '#9333ea',
    bg: '#f3e8ff'
  }
};

const EXTRA_PALETTES = [
  { color: '#2563eb', bg: '#dbeafe' },
  { color: '#059669', bg: '#d1fae5' },
  { color: '#d97706', bg: '#fef3c7' },
  { color: '#7c3aed', bg: '#ede9fe' },
  { color: '#dc2626', bg: '#fee2e2' },
  { color: '#0891b2', bg: '#cffafe' },
  { color: '#4f46e5', bg: '#e0e7ff' },
  { color: '#c026d3', bg: '#fae8ff' }
];

function getCategoryMeta(categoryName) {
  if (categoryName && CATEGORY_MAP[categoryName]) {
    return CATEGORY_MAP[categoryName];
  }

  const lower = (categoryName || '').toLowerCase();
  let icon = 'fa-solid fa-tag';
  if (lower.includes('coffee') || lower.includes('tea') || lower.includes('cafe')) icon = 'fa-solid fa-mug-hot';
  else if (lower.includes('gym') || lower.includes('fitness') || lower.includes('health') || lower.includes('med')) icon = 'fa-solid fa-dumbbell';
  else if (lower.includes('book') || lower.includes('course') || lower.includes('tuition')) icon = 'fa-solid fa-book-open';
  else if (lower.includes('movie') || lower.includes('film') || lower.includes('game') || lower.includes('music')) icon = 'fa-solid fa-gamepad';
  else if (lower.includes('rent') || lower.includes('room') || lower.includes('hostel')) icon = 'fa-solid fa-house';
  else if (lower.includes('travel') || lower.includes('trip') || lower.includes('petrol') || lower.includes('fuel')) icon = 'fa-solid fa-car';
  else if (lower.includes('tech') || lower.includes('code') || lower.includes('gadget') || lower.includes('phone')) icon = 'fa-solid fa-laptop';
  else if (lower.includes('snack') || lower.includes('canteen')) icon = 'fa-solid fa-pizza-slice';

  let hash = 0;
  for (let i = 0; i < (categoryName || '').length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const paletteIndex = Math.abs(hash) % EXTRA_PALETTES.length;
  const chosen = EXTRA_PALETTES[paletteIndex];

  return {
    icon: icon,
    color: chosen.color,
    bg: chosen.bg
  };
}

// Currency Formatter
function formatINR(amount) {
  return '₹' + Number(amount || 0).toLocaleString('en-IN');
}

// Format date into human-readable string
function formatDateDisplay(dateString) {
  if (!dateString) return 'No Date';
  try {
    const parts = String(dateString).split('-');
    if (parts.length === 3) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      if (!isNaN(d.getTime())) {
        const today = new Date();
        if (d.toDateString() === today.toDateString()) return 'Today';
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      }
    }
  } catch (e) {}
  return dateString;
}

// Get Today's date in YYYY-MM-DD
function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// =============================================================================
// NOTIFICATION & TOAST
// =============================================================================

function showToast(message) {
  try {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');

    if (toastMsg) {
      toastMsg.innerText = message;
    } else if (toast) {
      toast.innerText = message;
    }

    if (toast) {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 2500);
    }
  } catch (e) {
    console.log('Toast:', message);
  }
}

// =============================================================================
// NAVIGATION & THEME CONTROLS
// =============================================================================

function openSection(id, element) {
  try {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const targetSection = document.getElementById(id);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Update active status on both sidebar and mobile navigation items
    document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(nav => {
      nav.classList.remove('active');
    });

    // Highlight active tab across desktop and mobile matching the section
    const sectionIndex = ['dashboard', 'expenses', 'reports', 'settings'].indexOf(id);
    if (sectionIndex !== -1) {
      const sidebarItems = document.querySelectorAll('.sidebar-nav .nav-item');
      if (sidebarItems[sectionIndex]) sidebarItems[sectionIndex].classList.add('active');

      const mobileItems = document.querySelectorAll('.mobile-nav .mobile-nav-item');
      if (mobileItems[sectionIndex]) mobileItems[sectionIndex].classList.add('active');
    }

    // If specific element passed, ensure it is active
    if (element && element.classList) {
      element.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error('Error in openSection:', err);
  }
}

function toggleTheme() {
  try {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch (e) {}

    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
      themeIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  } catch (err) {
    console.error('Error in toggleTheme:', err);
  }
}

// Restore saved theme on startup
try {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
      themeIcon.className = 'fa-solid fa-sun';
    }
  }
} catch (e) {}

// =============================================================================
// MODALS LOGIC
// =============================================================================

function openAddModal() {
  const modal = document.getElementById('addExpenseModal');
  if (!modal) return;

  const dateInput = document.getElementById('modalExpenseDate');
  if (dateInput && !dateInput.value) {
    dateInput.value = getTodayDateString();
  }

  modal.classList.add('show');
  setTimeout(() => {
    const amountInput = document.getElementById('modalExpenseAmount');
    if (amountInput) amountInput.focus();
  }, 100);
}

function openEditBudgetModal() {
  const modal = document.getElementById('editBudgetModal');
  if (!modal) return;
  const input = document.getElementById('modalBudgetInput');
  if (input) input.value = budget;
  modal.classList.add('show');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('show');
}

function closeModalOnBackdrop(event, modalId) {
  if (event && event.target && event.target.id === modalId) {
    closeModal(modalId);
  }
}

function setQuickAmount(val) {
  const input = document.getElementById('expenseAmount');
  if (input) {
    const current = Number(input.value) || 0;
    input.value = current + val;
  }
}

function setModalQuickAmount(val) {
  const input = document.getElementById('modalExpenseAmount');
  if (input) {
    const current = Number(input.value) || 0;
    input.value = current + val;
  }
}

function setBudgetPreset(val) {
  const input = document.getElementById('budgetInput');
  if (input) input.value = val;
}

function setDatePreset(preset) {
  const input = document.getElementById('expenseDate');
  if (!input) return;
  const d = new Date();
  if (preset === 'yesterday') {
    d.setDate(d.getDate() - 1);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  input.value = `${year}-${month}-${day}`;
}

function setModalDatePreset(preset) {
  const input = document.getElementById('modalExpenseDate');
  if (!input) return;
  const d = new Date();
  if (preset === 'yesterday') {
    d.setDate(d.getDate() - 1);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  input.value = `${year}-${month}-${day}`;
}

function submitModalExpense() {
  const amountInput = document.getElementById('modalExpenseAmount');
  const catInput = document.getElementById('modalExpenseCategory');
  const dateInput = document.getElementById('modalExpenseDate');
  const noteInput = document.getElementById('modalExpenseNote');

  if (!amountInput || !catInput) return;

  const amount = Number(amountInput.value);
  const category = catInput.value;
  const date = (dateInput && dateInput.value) ? dateInput.value : getTodayDateString();
  const note = noteInput ? noteInput.value.trim() : '';

  if (amount <= 0 || isNaN(amount)) {
    showToast('Please enter a valid amount');
    return;
  }

  expenses.unshift({
    id: Date.now(),
    amount,
    category,
    date,
    note
  });

  saveData();
  updateUI();

  amountInput.value = '';
  if (noteInput) noteInput.value = '';
  closeModal('addExpenseModal');
  showToast('Expense added successfully');
}

function submitModalBudget() {
  const input = document.getElementById('modalBudgetInput');
  if (!input) return;
  const val = Number(input.value);

  if (val <= 0 || isNaN(val)) {
    showToast('Enter a valid budget limit');
    return;
  }

  budget = val;
  saveData();
  updateUI();
  closeModal('editBudgetModal');
  showToast('Monthly budget updated');
}

// =============================================================================
// CATEGORY CONTROLS
// =============================================================================

function renderCategoryOptions() {
  const selectExpense = document.getElementById('expenseCategory');
  const selectModal = document.getElementById('modalExpenseCategory');
  const selectFilter = document.getElementById('expenseFilterCategory');

  let optionsHTML = '';
  categories.forEach(cat => {
    optionsHTML += `<option value="${cat.name}">${cat.name}</option>`;
  });

  if (selectExpense) selectExpense.innerHTML = optionsHTML;
  if (selectModal) selectModal.innerHTML = optionsHTML;

  if (selectFilter) {
    const currentVal = selectFilter.value;
    selectFilter.innerHTML = '<option value="ALL">All Categories</option>' + optionsHTML;
    if (currentVal) selectFilter.value = currentVal;
  }
}

function addCategory() {
  const nameInput = document.getElementById('newCategory');
  const allocInput = document.getElementById('newAllocation');
  if (!nameInput || !allocInput) return;

  const name = nameInput.value.trim();
  const allocation = Number(allocInput.value);

  if (!name) {
    showToast('Please enter a category name');
    return;
  }

  if (allocation <= 0 || isNaN(allocation)) {
    showToast('Enter a valid percentage');
    return;
  }

  const existing = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    showToast('Category already exists');
    return;
  }

  const currentTotal = categories.reduce((sum, c) => sum + Number(c.allocation || 0), 0);
  if (currentTotal + allocation > 100) {
    showToast(`Total allocation would exceed 100% (Available: ${100 - currentTotal}%)`);
    return;
  }

  categories.push({ name, allocation });
  saveData();
  updateUI();

  nameInput.value = '';
  allocInput.value = '';
  showToast(`Category "${name}" added`);
}

function deleteCategory(index) {
  if (index < 0 || index >= categories.length) return;
  const catName = categories[index].name;

  if (categories.length <= 1) {
    showToast('You must keep at least 1 category');
    return;
  }

  const confirmed = confirm(`Are you sure you want to delete category "${catName}"?`);
  if (!confirmed) return;

  categories.splice(index, 1);
  saveData();
  updateUI();
  showToast(`Category "${catName}" removed`);
}

function renderCategoryManagerList() {
  const container = document.getElementById('categoryManagerList');
  if (!container) return;

  container.innerHTML = '';
  if (categories.length === 0) {
    container.innerHTML = '<p class="text-muted" style="padding: 10px;">No categories configured.</p>';
    return;
  }

  categories.forEach((cat, index) => {
    const meta = getCategoryMeta(cat.name);
    container.innerHTML += `
      <div class="category-manage-item">
        <div class="category-manage-left">
          <div class="category-icon-box" style="background-color: ${meta.bg}; color: ${meta.color}; width: 32px; height: 32px; font-size: 13px;">
            <i class="${meta.icon}"></i>
          </div>
          <div>
            <strong style="font-size: 13.5px;">${cat.name}</strong>
            <span style="font-size: 12px; color: var(--text-tertiary); margin-left: 6px;">(${cat.allocation}%)</span>
          </div>
        </div>
        <div>
          <button class="btn-icon-subtle text-danger" onclick="deleteCategory(${index})" title="Delete Category">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  });
}

function updateAllocation(index, value) {
  value = Number(value);
  if (isNaN(value) || value < 0) {
    showToast('Enter a valid allocation');
    updateUI();
    return;
  }

  const othersSum = categories.reduce((sum, c, i) => (i !== index ? sum + Number(c.allocation || 0) : sum), 0);

  if (othersSum + value > 100) {
    showToast(`Total allocation exceeds 100% (Max allowed: ${100 - othersSum}%)`);
    updateUI();
    return;
  }

  if (categories[index]) {
    categories[index].allocation = value;
  }
  saveData();
  updateUI();
  showToast('Allocation updated');
}

function renderCategories() {
  const container = document.getElementById('categoryAllocations');
  if (!container) return;

  container.innerHTML = '';

  if (categories.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon"><i class="fa-solid fa-folder-open"></i></div>
        <h4>No categories defined</h4>
        <p>Add budget categories in Settings.</p>
      </div>
    `;
    return;
  }

  categories.forEach((cat, index) => {
    const allocated = Math.round((budget * (Number(cat.allocation) || 0)) / 100);
    const spentCategory = expenses
      .filter(e => e.category === cat.name)
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const spentPercentage = allocated > 0 ? Math.min(100, Math.round((spentCategory / allocated) * 100)) : 0;
    const isExceeded = spentCategory > allocated;

    const meta = getCategoryMeta(cat.name);

    container.innerHTML += `
      <div class="category-item">
        <div class="category-header-row">
          <div class="category-badge-group">
            <span class="category-dot" style="background-color: ${meta.color};"></span>
            <div>
              <span class="category-title">${cat.name}</span>
              <div style="font-size: 11px; color: var(--text-tertiary); margin-top: 1px;">
                ${spentCategory > 0 ? formatINR(spentCategory) + ' spent of ' + formatINR(allocated) : formatINR(allocated) + ' cap'}
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <input
              type="number"
              class="allocation-input-pill"
              value="${cat.allocation}"
              min="0"
              max="100"
              onchange="updateAllocation(${index}, this.value)"
              title="Allocation Percentage"
            >
            <span style="font-size: 12px; font-weight: 700; color: var(--text-tertiary);">%</span>
          </div>
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill ${isExceeded ? 'danger' : spentPercentage > 80 ? 'warning' : 'positive'}"
            style="width: ${spentPercentage}%;"
          ></div>
        </div>
      </div>
    `;
  });
}

// =============================================================================
// BUDGET MANAGEMENT
// =============================================================================

function updateBudget() {
  const input = document.getElementById('budgetInput');
  if (!input) return;
  const value = Number(input.value);

  if (value <= 0 || isNaN(value)) {
    showToast('Please enter a valid budget amount');
    return;
  }

  budget = value;
  saveData();
  updateUI();
  input.value = '';
  showToast('Monthly budget updated');
}

// =============================================================================
// EXPENSE MANAGEMENT
// =============================================================================

function addExpense() {
  const amountInput = document.getElementById('expenseAmount');
  const catInput = document.getElementById('expenseCategory');
  const dateInput = document.getElementById('expenseDate');
  const noteInput = document.getElementById('expenseNote');

  if (!amountInput || !catInput) return;

  const amount = Number(amountInput.value);
  const category = catInput.value;
  const date = (dateInput && dateInput.value) ? dateInput.value : getTodayDateString();
  const note = noteInput ? noteInput.value.trim() : '';

  if (amount <= 0 || isNaN(amount)) {
    showToast('Please enter a valid expense amount');
    return;
  }

  expenses.unshift({
    id: Date.now(),
    amount,
    category,
    date,
    note
  });

  saveData();
  updateUI();

  amountInput.value = '';
  if (noteInput) noteInput.value = '';
  showToast('Expense recorded');
}

function deleteExpense(index) {
  if (confirm('Delete this expense?')) {
    expenses.splice(index, 1);
    saveData();
    updateUI();
    showToast('Expense deleted');
  }
}

function renderExpenses() {
  const recentContainer = document.getElementById('recentExpenses');

  // 1. Render Recent Expenses on Dashboard (max 5)
  if (recentContainer) {
    recentContainer.innerHTML = '';
    if (expenses.length === 0) {
      recentContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-receipt"></i></div>
          <h4>No expenses yet</h4>
          <p>Your recent transactions will appear here once logged.</p>
        </div>
      `;
    } else {
      expenses.slice(0, 5).forEach((exp, idx) => {
        const meta = getCategoryMeta(exp.category);
        recentContainer.innerHTML += `
          <div class="expense-item">
            <div class="expense-left">
              <div class="category-icon-box" style="background-color: ${meta.bg}; color: ${meta.color};">
                <i class="${meta.icon}"></i>
              </div>
              <div class="expense-meta">
                <div class="expense-category-name">${exp.note || exp.category}</div>
                <div class="expense-note">
                  <span>${exp.category}</span>
                  <span>•</span>
                  <span class="expense-date-badge">${formatDateDisplay(exp.date)}</span>
                </div>
              </div>
            </div>
            <div class="expense-right">
              <div class="expense-amount">- ${formatINR(exp.amount)}</div>
              <button class="btn-icon-subtle" onclick="deleteExpense(${idx})" title="Delete">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        `;
      });
    }
  }

  // 2. Render Full List on Expenses Page
  filterExpensesList();
}

// Filter and search on Expenses Page
function filterExpensesList() {
  const container = document.getElementById('expenseList');
  if (!container) return;

  const searchInput = document.getElementById('expenseSearch');
  const filterCat = document.getElementById('expenseFilterCategory');

  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const selectedCat = filterCat ? filterCat.value : 'ALL';

  const filtered = expenses.filter(exp => {
    const matchesCat = selectedCat === 'ALL' || exp.category === selectedCat;
    const matchesQuery = !query ||
      (exp.note && exp.note.toLowerCase().includes(query)) ||
      (exp.category && exp.category.toLowerCase().includes(query));
    return matchesCat && matchesQuery;
  });

  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
        <h4>No matching expenses</h4>
        <p>Try clearing your search query or category filter.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(exp => {
    const originalIndex = expenses.findIndex(e => e.id === exp.id);
    const meta = getCategoryMeta(exp.category);

    container.innerHTML += `
      <div class="expense-item">
        <div class="expense-left">
          <div class="category-icon-box" style="background-color: ${meta.bg}; color: ${meta.color};">
            <i class="${meta.icon}"></i>
          </div>
          <div class="expense-meta">
            <div class="expense-category-name">${exp.note || exp.category}</div>
            <div class="expense-note">
              <span>${exp.category}</span>
              <span>•</span>
              <span class="expense-date-badge">${formatDateDisplay(exp.date)}</span>
            </div>
          </div>
        </div>
        <div class="expense-right">
          <div class="expense-amount">- ${formatINR(exp.amount)}</div>
          <button class="btn-icon-subtle" onclick="deleteExpense(${originalIndex})" title="Delete">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
  });
}

// Export data to CSV
function exportExpensesToCSV() {
  if (expenses.length === 0) {
    showToast('No expenses to export');
    return;
  }

  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += 'ID,Date,Category,Amount,Note\n';

  expenses.forEach(e => {
    const noteSafe = (e.note || '').replace(/"/g, '""');
    csvContent += `"${e.id}","${e.date || ''}","${e.category}","${e.amount}","${noteSafe}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `spendora_expenses_${getTodayDateString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Expenses exported as CSV');
}

// =============================================================================
// STATS & METRICS ENGINE
// =============================================================================

function updateStats() {
  try {
    const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const remaining = budget - totalSpent;
    const savingsRate = budget > 0 ? Math.max(0, Math.round((remaining / budget) * 100)) : 0;
    const spentRate = budget > 0 ? Math.round((totalSpent / budget) * 100) : 0;

    // 1. Dashboard Values
    const budgetElem = document.getElementById('budgetDisplay');
    const spentElem = document.getElementById('spentDisplay');
    const remainingElem = document.getElementById('remainingDisplay');
    const savingsElem = document.getElementById('savingsDisplay');
    const savingsBar = document.getElementById('savingsBar');

    if (budgetElem) budgetElem.innerText = formatINR(budget);
    if (spentElem) spentElem.innerText = formatINR(totalSpent);
    if (remainingElem) remainingElem.innerText = formatINR(remaining);
    if (savingsElem) savingsElem.innerText = `${savingsRate}%`;

    if (savingsBar) {
      savingsBar.style.width = `${savingsRate}%`;
      savingsBar.className = `progress-fill ${savingsRate > 50 ? 'success' : savingsRate > 20 ? 'warning' : 'danger'}`;
    }

    // 2. Spent Badge & Burn Rate
    const spentBadge = document.getElementById('spentPercentageBadge');
    if (spentBadge) {
      spentBadge.innerText = `${spentRate}% of limit`;
      spentBadge.className = `metric-badge ${spentRate > 90 ? 'danger' : spentRate > 75 ? 'warning' : 'neutral'}`;
    }

    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const currentDay = new Date().getDate();
    const daysLeft = Math.max(1, daysInMonth - currentDay);
    const dailyBurn = Math.round(totalSpent / Math.max(1, currentDay));

    const burnRateElem = document.getElementById('dailyBurnRate');
    if (burnRateElem) burnRateElem.innerText = `~${formatINR(dailyBurn)}/day`;

    // 3. Remaining Status Badge
    const remBadge = document.getElementById('remainingStatusBadge');
    if (remBadge) {
      if (remaining < 0) {
        remBadge.innerText = 'Over Budget';
        remBadge.className = 'metric-badge danger';
      } else if (remaining < budget * 0.2) {
        remBadge.innerText = 'Low Cushion';
        remBadge.className = 'metric-badge warning';
      } else {
        remBadge.innerText = 'On Track';
        remBadge.className = 'metric-badge positive';
      }
    }

    // 4. Reports Tab Metrics
    const reportSpent = document.getElementById('reportSpent');
    if (reportSpent) reportSpent.innerText = formatINR(totalSpent);

    // Top Category Calculation
    let topCategoryName = 'None';
    const categoryTotals = {};

    expenses.forEach(exp => {
      const amt = Number(exp.amount || 0);
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + amt;
    });

    const catKeys = Object.keys(categoryTotals);
    if (catKeys.length > 0) {
      topCategoryName = catKeys.reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b);
    }

    const topCatElem = document.getElementById('topCategory');
    if (topCatElem) {
      topCatElem.innerText = topCategoryName !== 'None'
        ? `${topCategoryName} (${formatINR(categoryTotals[topCategoryName])})`
        : 'None';
    }

    // Budget Health Status
    let healthScore = 'Excellent';
    let healthClass = 'positive';

    if (remaining < 0) {
      healthScore = 'Deficit';
      healthClass = 'danger';
    } else if (savingsRate < 25) {
      healthScore = 'Tight';
      healthClass = 'warning';
    } else if (savingsRate < 50) {
      healthScore = 'Moderate';
      healthClass = 'warning';
    }

    const healthElem = document.getElementById('budgetHealth');
    const healthBadge = document.getElementById('budgetHealthBadge');
    if (healthElem) healthElem.innerText = healthScore;
    if (healthBadge) {
      healthBadge.innerText = healthScore === 'Excellent' ? 'Strong Buffer' : healthScore === 'Deficit' ? 'Exceeded Limit' : 'Watch Daily Spend';
      healthBadge.className = `metric-badge ${healthClass}`;
    }

    renderSuggestions(totalSpent, remaining, dailyBurn, daysLeft, topCategoryName);
    renderNotifications(totalSpent);
    renderAnalyticsBreakdown(totalSpent, categoryTotals);
  } catch (err) {
    console.error('Error in updateStats:', err);
  }
}

// =============================================================================
// SMART STUDENT ADVICE & INSIGHTS
// =============================================================================

function renderSuggestions(spent, remaining, dailyBurn, daysLeft, topCat) {
  const container = document.getElementById('suggestions');
  if (!container) return;

  container.innerHTML = '';
  const tips = [];

  const safeDailySpend = Math.max(0, Math.round(remaining / daysLeft));

  if (remaining <= 0) {
    tips.push({
      icon: 'fa-solid fa-triangle-exclamation',
      color: 'var(--danger)',
      text: `<strong>Budget Limit Reached:</strong> You have exceeded your ₹${budget.toLocaleString('en-IN')} target by ${formatINR(Math.abs(remaining))}. Pause discretionary expenses.`
    });
  } else {
    tips.push({
      icon: 'fa-solid fa-calculator',
      color: 'var(--brand-600)',
      text: `<strong>Daily Allowance:</strong> You can safely spend <strong>${formatINR(safeDailySpend)}/day</strong> over the next ${daysLeft} days to stay strictly within budget.`
    });
  }

  if (topCat && topCat !== 'None') {
    tips.push({
      icon: 'fa-solid fa-chart-pie',
      color: 'var(--warning)',
      text: `<strong>Primary Expense:</strong> Your highest outflow is <strong>${topCat}</strong>. Consider auditing non-essential spends in this category.`
    });
  }

  if (expenses.length >= 3 && spent < budget * 0.4 && daysLeft > 15) {
    tips.push({
      icon: 'fa-solid fa-medal',
      color: 'var(--success)',
      text: `<strong>Frugal Milestone:</strong> Great pacing! You have used under 40% of your budget midway through the month.`
    });
  }

  if (tips.length === 0) {
    tips.push({
      icon: 'fa-solid fa-info-circle',
      color: 'var(--info)',
      text: 'Log your daily canteen, travel, and project purchases for predictive student analytics.'
    });
  }

  tips.forEach(t => {
    container.innerHTML += `
      <div class="insight-card">
        <i class="${t.icon} insight-icon" style="color: ${t.color};"></i>
        <div>${t.text}</div>
      </div>
    `;
  });
}

// Notifications feed in Settings
function renderNotifications(spent) {
  const container = document.getElementById('notifications');
  if (!container) return;

  container.innerHTML = '';
  const notices = [];

  if (spent > budget) {
    notices.push({
      title: 'Monthly Budget Limit Exceeded',
      desc: `Total spending (${formatINR(spent)}) has surpassed your set limit of ${formatINR(budget)}.`,
      type: 'danger'
    });
  }

  categories.forEach(cat => {
    const allocated = (budget * (Number(cat.allocation) || 0)) / 100;
    const spentCategory = expenses
      .filter(e => e.category === cat.name)
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    if (spentCategory > allocated) {
      notices.push({
        title: `${cat.name} Allocation Overrun`,
        desc: `Spent ${formatINR(spentCategory)} vs ${formatINR(allocated)} allotted (${cat.allocation}% cap).`,
        type: 'warning'
      });
    }
  });

  if (notices.length === 0) {
    container.innerHTML = `
      <div style="padding: 18px; text-align: center; color: var(--text-tertiary); font-size: 13px;">
        <i class="fa-solid fa-circle-check" style="color: var(--success); margin-right: 6px;"></i>
        All spending is safely within your established budget limits.
      </div>
    `;
    return;
  }

  notices.forEach(n => {
    container.innerHTML += `
      <div class="insight-card" style="border-left: 3px solid ${n.type === 'danger' ? 'var(--danger)' : 'var(--warning)'}; margin-bottom: 10px;">
        <i class="fa-solid fa-circle-exclamation insight-icon" style="color: ${n.type === 'danger' ? 'var(--danger)' : 'var(--warning)'};"></i>
        <div>
          <strong style="color: var(--text-primary);">${n.title}</strong>
          <div style="margin-top: 3px; font-size: 12px; color: var(--text-secondary);">${n.desc}</div>
        </div>
      </div>
    `;
  });
}

// Analytics Tab Visual Breakdown
function renderAnalyticsBreakdown(totalSpent, categoryTotals) {
  const barsContainer = document.getElementById('analyticsCategoryBars');
  const adviceBody = document.getElementById('analyticsAdviceBody');

  if (barsContainer) {
    barsContainer.innerHTML = '';
    if (totalSpent === 0) {
      barsContainer.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-chart-column"></i></div>
          <h4>No data for analytics</h4>
          <p>Logged transactions will generate distribution charts here.</p>
        </div>
      `;
    } else {
      Object.keys(categoryTotals).forEach(catName => {
        const amt = categoryTotals[catName];
        const pct = Math.round((amt / totalSpent) * 100);
        const meta = getCategoryMeta(catName);

        barsContainer.innerHTML += `
          <div style="margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 6px;">
              <span style="display: flex; align-items: center; gap: 8px;">
                <span class="category-dot" style="background-color: ${meta.color};"></span>
                <span>${catName}</span>
              </span>
              <span>${formatINR(amt)} <span style="color: var(--text-tertiary); font-weight: 500;">(${pct}%)</span></span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill positive" style="width: ${pct}%;"></div>
            </div>
          </div>
        `;
      });
    }
  }

  if (adviceBody) {
    adviceBody.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div class="insight-card">
          <i class="fa-solid fa-shield-halved insight-icon"></i>
          <div>
            <strong>50-30-20 Rule for Students:</strong>
            Aim to allocate 50% for core needs (canteen, commute, study supplies), 30% for personal activities, and keep at least 20% untouched for emergencies or semester projects.
          </div>
        </div>
        <div class="insight-card">
          <i class="fa-solid fa-wallet insight-icon"></i>
          <div>
            <strong>Micro-Expense Control:</strong>
            Small daily cash spends (snacks, printing, short autos) compound quickly. Tracking every expense below ₹50 reveals up to 15-20% of untracked leakage.
          </div>
        </div>
      </div>
    `;
  }
}

// =============================================================================
// RESET DATA CONTROLLER
// =============================================================================

function resetAllData() {
  const confirmFirst = confirm('Are you sure you want to completely reset SPENDORA data?');
  if (!confirmFirst) return;

  const confirmSecond = confirm('This will permanently delete all expenses and restore default student categories. Proceed?');
  if (!confirmSecond) return;

  try {
    localStorage.clear();
  } catch (e) {}

  budget = 15000;
  categories = [...DEFAULT_CATEGORIES];
  expenses = [];
  userProfile = {
    name: '',
    tagline: 'Student Edition'
  };

  updateUI();
  showToast('All SPENDORA data has been reset to defaults');
}

// =============================================================================
// GLOBAL REFRESH ENGINE
// =============================================================================

function updateUI() {
  try {
    updateProfileDisplay();
    renderCategoryOptions();
    renderCategories();
    renderCategoryManagerList();
    renderExpenses();
    updateStats();
    saveData();
  } catch (err) {
    console.error('Error during updateUI:', err);
  }
}

// =============================================================================
// EXPLICIT GLOBAL WINDOW BINDINGS
// Ensures all handlers are reachable by inline onclick attributes in any environment
// =============================================================================

window.openSection = openSection;
window.openAddModal = openAddModal;
window.openEditBudgetModal = openEditBudgetModal;
window.closeModal = closeModal;
window.closeModalOnBackdrop = closeModalOnBackdrop;
window.addExpense = addExpense;
window.deleteExpense = deleteExpense;
window.updateBudget = updateBudget;
window.addCategory = addCategory;
window.deleteCategory = deleteCategory;
window.updateAllocation = updateAllocation;
window.resetAllData = resetAllData;
window.setQuickAmount = setQuickAmount;
window.setModalQuickAmount = setModalQuickAmount;
window.setBudgetPreset = setBudgetPreset;
window.setDatePreset = setDatePreset;
window.setModalDatePreset = setModalDatePreset;
window.saveUserProfile = saveUserProfile;
window.submitModalExpense = submitModalExpense;
window.submitModalBudget = submitModalBudget;
window.filterExpensesList = filterExpensesList;
window.exportExpensesToCSV = exportExpensesToCSV;
window.toggleTheme = toggleTheme;

// =============================================================================
// DOM READY & EVENT ATTACHMENT
// =============================================================================

function attachEventListeners() {
  // Theme toggle button
  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    themeBtn.onclick = toggleTheme;
  }

  // Set default expense date
  const expenseDateInput = document.getElementById('expenseDate');
  if (expenseDateInput && !expenseDateInput.value) {
    expenseDateInput.value = getTodayDateString();
  }

  const modalDateInput = document.getElementById('modalExpenseDate');
  if (modalDateInput && !modalDateInput.value) {
    modalDateInput.value = getTodayDateString();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    attachEventListeners();
    updateUI();
  });
} else {
  attachEventListeners();
  updateUI();
}
