import { appState } from './state.js';
import { TRANSLATIONS } from './i18n.js';
import { BalakotMap } from './map.js';
import { loadRuntimeConfig } from './config.js';

class MahfoozApp {
  constructor() {
    this.dashboardMap = null;
    this.fullscreenMap = null;
    this.currentContactTab = 'all';
    this.currentGuideTab = 'before';
    this.currentReportFilter = 'all';
    this.activeMapFilter = 'all';
  }

  async init() {
    await loadRuntimeConfig();

    this.setupNavigation();
    this.setupLanguageSwitcher();
    this.setupModals();
    this.setupQuickActions();
    this.setupGlobalEvents();
    
    appState.subscribe((state) => {
      this.render();
    });

    this.render();

    setTimeout(() => {
      this.initMaps();
    }, 200);
  }

  initMaps() {
    if (document.getElementById('dashboardMap') && !this.dashboardMap) {
      this.dashboardMap = new BalakotMap('dashboardMap', {
        onVerifyClick: (id) => this.handleVerifyReport(id)
      });
      this.dashboardMap.init();
      this.dashboardMap.renderData(appState.getState());
    }

    if (document.getElementById('fullscreenMap') && !this.fullscreenMap) {
      this.fullscreenMap = new BalakotMap('fullscreenMap', {
        onVerifyClick: (id) => this.handleVerifyReport(id),
        onMapClick: (lat, lng) => this.openReportModalWithCoords(lat, lng)
      });
      this.fullscreenMap.init();
      this.fullscreenMap.renderData(appState.getState());
    }
  }

  setupNavigation() {
    document.querySelectorAll('.sidebar-nav .nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const tab = link.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    document.querySelectorAll('.bottom-nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const tab = item.getAttribute('data-tab');
        if (tab === 'more') {
          this.openModal('modalMobileMore');
        } else {
          this.switchTab(tab);
        }
      });
    });

    document.addEventListener('click', (e) => {
      const navBtn = e.target.closest('[data-navigate]');
      if (navBtn) {
        const targetTab = navBtn.getAttribute('data-navigate');
        this.closeModal('modalMobileMore');
        this.switchTab(targetTab);
      }
    });

    const btnMobilePocket = document.getElementById('btnMobilePocketCard');
    if (btnMobilePocket) {
      btnMobilePocket.addEventListener('click', () => {
        this.closeModal('modalMobileMore');
        this.openModal('modalPocketCard');
      });
    }

    const btnMobileSos = document.getElementById('btnMobileSosModal');
    if (btnMobileSos) {
      btnMobileSos.addEventListener('click', () => {
        this.closeModal('modalMobileMore');
        this.openModal('modalEmergencySOS');
      });
    }
  }

  switchTab(tabName) {
    appState.setActiveTab(tabName);

    document.querySelectorAll('.sidebar-nav .nav-link').forEach(l => {
      l.classList.toggle('active', l.getAttribute('data-tab') === tabName);
    });
    document.querySelectorAll('.bottom-nav-item').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
    });

    document.querySelectorAll('.page-view').forEach(p => {
      p.style.display = p.id === `page-${tabName}` ? 'block' : 'none';
    });

    if (tabName === 'map' && this.fullscreenMap) {
      this.fullscreenMap.invalidate();
    } else if (tabName === 'dashboard' && this.dashboardMap) {
      this.dashboardMap.invalidate();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setupLanguageSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        appState.setLanguage(lang);
      });
    });

    const mobileSelect = document.getElementById('mobileLangSelect');
    if (mobileSelect) {
      mobileSelect.addEventListener('change', (e) => {
        appState.setLanguage(e.target.value);
      });
    }
  }

  setupQuickActions() {
    document.querySelectorAll('.btn-action-report').forEach(btn => {
      btn.addEventListener('click', () => this.openModal('modalReportHazard'));
    });

    document.querySelectorAll('.btn-action-safe').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTab('checkin');
      });
    });

    document.querySelectorAll('.btn-action-zone').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTab('safezones');
      });
    });

    document.querySelectorAll('.btn-action-help, .btn-sos-top, .btn-mobile-sos').forEach(btn => {
      btn.addEventListener('click', () => this.openModal('modalEmergencySOS'));
    });

    const btnToggleAlert = document.getElementById('btnToggleAlert');
    if (btnToggleAlert) {
      btnToggleAlert.addEventListener('click', () => {
        appState.toggleCommunityStatus();
        this.showToast('Community advisory status updated.', 'info');
      });
    }
  }

  setupModals() {
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          this.closeModal(backdrop.id);
        }
      });
    });

    document.querySelectorAll('.btn-modal-close, .btn-modal-cancel').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = btn.closest('.modal-backdrop');
        if (modal) this.closeModal(modal.id);
      });
    });

    const reportForm = document.getElementById('hazardReportForm');
    if (reportForm) {
      reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = document.getElementById('reportCategory').value;
        const title = document.getElementById('reportTitleInput').value;
        const description = document.getElementById('reportDescInput').value;
        const locationName = document.getElementById('reportLocationInput').value;
        const urgency = document.getElementById('reportUrgency').value;
        const photoDemo = document.getElementById('reportPhotoPreview').getAttribute('data-has-photo') === 'true'
          ? 'assets/hazard_crack.jpg'
          : null;

        const report = appState.addHazardReport({
          category,
          title,
          description,
          locationName,
          urgency,
          photoUrl: photoDemo
        });

        this.closeModal('modalReportHazard');
        reportForm.reset();
        document.getElementById('reportPhotoPreview').innerHTML = '';
        document.getElementById('reportPhotoPreview').removeAttribute('data-has-photo');

        this.showToast(`Report submitted: "${title}" is now visible to the community.`, 'success');

        if (this.fullscreenMap) {
          this.fullscreenMap.renderData(appState.getState());
          this.fullscreenMap.centerOn(report.lat, report.lng, 15);
        }
        if (this.dashboardMap) {
          this.dashboardMap.renderData(appState.getState());
        }
      });
    }

    const btnUploadPhoto = document.getElementById('btnUploadPhoto');
    const photoInput = document.getElementById('photoInput');
    if (btnUploadPhoto && photoInput) {
      btnUploadPhoto.addEventListener('click', () => photoInput.click());
      photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const preview = document.getElementById('reportPhotoPreview');
        if (file) {
          const reader = new FileReader();
          reader.onload = (re) => {
            preview.innerHTML = `<img src="${re.target.result}" style="width:100%; height:120px; object-fit:cover; border-radius:8px; margin-top:8px;" />`;
            preview.setAttribute('data-has-photo', 'true');
          };
          reader.readAsDataURL(file);
        } else {
          preview.innerHTML = `<img src="assets/hazard_crack.jpg" style="width:100%; height:120px; object-fit:cover; border-radius:8px; margin-top:8px;" />`;
          preview.setAttribute('data-has-photo', 'true');
        }
      });
    }

    const btnUseSamplePhoto = document.getElementById('btnUseSamplePhoto');
    if (btnUseSamplePhoto) {
      btnUseSamplePhoto.addEventListener('click', () => {
        const preview = document.getElementById('reportPhotoPreview');
        preview.innerHTML = `<img src="assets/hazard_crack.jpg" style="width:100%; height:120px; object-fit:cover; border-radius:8px; margin-top:8px;" />`;
        preview.setAttribute('data-has-photo', 'true');
      });
    }

    const volForm = document.getElementById('volunteerForm');
    if (volForm) {
      volForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('volNameInput').value;
        const phone = document.getElementById('volPhoneInput').value;
        const role = document.getElementById('volRoleInput').value;
        const area = document.getElementById('volAreaInput').value;
        const vehicle = document.getElementById('volVehicleInput').value;

        const roleLabels = {
          first_aid: 'Certified First Aid Responder',
          driver: '4x4 Evacuation Driver',
          doctor: 'Medical Practitioner / Doctor',
          rescue: 'Search & Structural Rescue',
          general: 'Community Relief Volunteer'
        };

        appState.addVolunteer({
          name,
          phone,
          role,
          roleLabel: roleLabels[role] || 'Volunteer',
          area,
          vehicle
        });

        this.closeModal('modalJoinVolunteer');
        volForm.reset();
        this.showToast(`Thank you ${name}! You are registered with Balakot Responders.`, 'success');
      });
    }

    const familyForm = document.getElementById('addFamilyForm');
    if (familyForm) {
      familyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('famNameInput').value;
        const relation = document.getElementById('famRelationInput').value;
        const locationNote = document.getElementById('famLocationInput').value;

        appState.addFamilyMember({
          name,
          relation,
          status: 'safe',
          locationNote
        });

        this.closeModal('modalAddFamily');
        familyForm.reset();
        this.showToast(`${name} added to your Family Safety Circle.`, 'success');
      });
    }
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('open');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('open');
  }

  openReportModalWithCoords(lat, lng) {
    const inputLoc = document.getElementById('reportLocationInput');
    if (inputLoc) {
      inputLoc.value = `Map Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
    this.openModal('modalReportHazard');
  }

  setupGlobalEvents() {
    const btnMarkSafeBig = document.getElementById('btnMarkSafeBig');
    if (btnMarkSafeBig) {
      btnMarkSafeBig.addEventListener('click', () => {
        const state = appState.getState();
        const nextState = !state.userStatus.isSafe;
        appState.setUserSafe(nextState, 'Balakot Valley');
        this.showToast(nextState ? 'Alhamdulillah, you are marked Safe!' : 'Status reset.', 'success');
      });
    }

    const btnShareWhatsApp = document.getElementById('btnShareWhatsApp');
    if (btnShareWhatsApp) {
      btnShareWhatsApp.addEventListener('click', () => {
        const state = appState.getState();
        const text = encodeURIComponent(`I am in Balakot, KP and I have marked myself SAFE on the Mahfooz Balakot Emergency Network at ${state.userStatus.lastCheckIn || 'just now'}. Stay safe!`);
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
      });
    }

    document.addEventListener('click', (e) => {
      const row = e.target.closest('.checklist-row');
      if (row) {
        const itemId = row.getAttribute('data-id');
        if (itemId) {
          appState.toggleChecklistItem(itemId);
        }
      }
    });

    document.querySelectorAll('.contacts-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.contacts-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentContactTab = btn.getAttribute('data-tab');
        this.renderContacts();
      });
    });

    document.querySelectorAll('.guide-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.guide-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentGuideTab = btn.getAttribute('data-tab');
        this.renderGuideSteps();
      });
    });

    document.querySelectorAll('.map-filter-bar .filter-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const filter = chip.getAttribute('data-filter');
        chip.parentElement.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        
        this.activeMapFilter = filter;
        if (this.fullscreenMap) {
          this.fullscreenMap.setFilter(filter);
          this.fullscreenMap.renderData(appState.getState());
        }
        if (this.dashboardMap) {
          this.dashboardMap.setFilter(filter);
          this.dashboardMap.renderData(appState.getState());
        }
      });
    });

    const mapSearch = document.getElementById('mapSearchInput');
    if (mapSearch) {
      mapSearch.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase().trim();
        if (!q) return;
        const state = appState.getState();
        const match = state.safeZones.find(s => s.name.toLowerCase().includes(q) || s.locationName.toLowerCase().includes(q))
                   || state.hazardReports.find(h => h.title.toLowerCase().includes(q) || h.locationName.toLowerCase().includes(q));
        if (match && this.fullscreenMap) {
          this.fullscreenMap.centerOn(match.lat, match.lng, 16);
        }
      });
    }

    const btnRecenter = document.getElementById('btnMapRecenter');
    if (btnRecenter) {
      btnRecenter.addEventListener('click', () => {
        if (this.fullscreenMap) this.fullscreenMap.recenter();
      });
    }

    document.querySelectorAll('.reports-filter-tabs .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.reports-filter-tabs .tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentReportFilter = btn.getAttribute('data-status');
        this.renderCommunityReports();
      });
    });

    const btnOpenVolModal = document.getElementById('btnOpenVolunteerModal');
    if (btnOpenVolModal) {
      btnOpenVolModal.addEventListener('click', () => this.openModal('modalJoinVolunteer'));
    }

    const btnOpenFamModal = document.getElementById('btnOpenAddFamilyModal');
    if (btnOpenFamModal) {
      btnOpenFamModal.addEventListener('click', () => this.openModal('modalAddFamily'));
    }

    const btnPrintCard = document.getElementById('btnPrintPocketCard');
    if (btnPrintCard) {
      btnPrintCard.addEventListener('click', () => this.openModal('modalPocketCard'));
    }
    const btnPrintNow = document.getElementById('btnPrintNowAction');
    if (btnPrintNow) {
      btnPrintNow.addEventListener('click', () => window.print());
    }
  }

  handleVerifyReport(reportId) {
    appState.verifyHazardReport(reportId);
    this.showToast('Thank you! Your community verification has been added.', 'success');
  }

  handleResolveReport(reportId) {
    appState.resolveHazardReport(reportId);
    this.showToast('Hazard marked as resolved. Community updated.', 'info');
  }

  render() {
    const state = appState.getState();
    const lang = state.language;
    const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.textContent = t[key];
      }
    });

    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
    const mobileSelect = document.getElementById('mobileLangSelect');
    if (mobileSelect) mobileSelect.value = lang;

    this.renderStatusBanner(state, t);
    this.renderMetrics(state);
    this.renderActivityFeed(state);
    this.renderChecklist(state);
    this.renderSafeCheckin(state, t);
    this.renderContacts();
    this.renderSafeZones(state);
    this.renderVolunteers(state);
    this.renderGuideSteps();
    this.renderCommunityReports();

    if (this.dashboardMap) {
      this.dashboardMap.renderData(state);
    }
    if (this.fullscreenMap) {
      this.fullscreenMap.renderData(state);
    }
  }

  renderStatusBanner(state, t) {
    const banner = document.getElementById('communityStatusBanner');
    const badge = document.getElementById('topStatusBadge');
    const isNormal = state.communityStatus === 'normal';

    if (banner) {
      banner.className = `status-banner ${isNormal ? 'normal' : 'alert'}`;
      const titleEl = banner.querySelector('.status-title');
      const subEl = banner.querySelector('.status-sub');
      const iconEl = banner.querySelector('.status-icon-badge');

      if (titleEl) titleEl.textContent = isNormal ? t.statusNormal : t.statusAlert;
      if (subEl) subEl.textContent = isNormal ? t.statusNormalSub : t.statusAlertSub;
      if (iconEl) {
        iconEl.innerHTML = isNormal 
          ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
          : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
      }
    }

    if (badge) {
      badge.className = `status-badge-pill ${isNormal ? 'status-normal' : 'status-alert'}`;
      badge.innerHTML = `<span class="pulse-dot"></span><span>${isNormal ? t.statusNormal : t.statusAlert}</span>`;
    }
  }

  renderMetrics(state) {
    const metrics = appState.getMetrics();
    const map = {
      'count-unsafe': metrics.unsafeBuildings,
      'count-blocked': metrics.blockedRoads,
      'count-safezones': metrics.safeZonesCount,
      'count-water': metrics.waterPointsCount,
      'count-volunteers': metrics.volunteersCount
    };

    for (const [id, val] of Object.entries(map)) {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    }
  }

  renderActivityFeed(state) {
    const feedContainer = document.getElementById('recentActivityList');
    if (!feedContainer) return;

    const items = state.activityFeed.slice(0, 5);
    feedContainer.innerHTML = items.map(item => `
      <div class="activity-item">
        <div class="activity-icon-badge ${item.badgeClass || 'badge-safe'}">
          ${this.getCategoryIconSvg(item.type)}
        </div>
        <div class="activity-content">
          <div class="activity-top">
            <span class="activity-type-badge">${item.categoryText}</span>
            <span class="activity-time">${item.time}</span>
          </div>
          <p class="activity-summary">${item.summary}</p>
          <div class="activity-location">
            <span>📍 ${item.location}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  getCategoryIconSvg(type) {
    if (type === 'checkin') {
      return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6L9 17l-5-5"/></svg>';
    } else if (type === 'volunteer_joined') {
      return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>';
    } else if (type === 'resource_verified') {
      return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>';
    } else {
      return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
    }
  }

  renderChecklist(state) {
    const metrics = appState.getMetrics();

    const miniContainer = document.getElementById('miniChecklistList');
    const miniFill = document.getElementById('prepProgressFill');
    const miniPercent = document.getElementById('prepPercentText');

    if (miniFill) miniFill.style.width = `${metrics.checklistPercent}%`;
    if (miniPercent) miniPercent.textContent = `${metrics.checklistPercent}%`;

    if (miniContainer) {
      const miniItems = state.checklistItems.slice(0, 4);
      miniContainer.innerHTML = miniItems.map(item => `
        <div class="checklist-row ${item.completed ? 'checked' : ''}" data-id="${item.id}">
          <div class="custom-checkbox">
            ${item.completed ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
          </div>
          <span class="checklist-text">${item.title}</span>
        </div>
      `).join('');
    }

    const fullContainer = document.getElementById('fullChecklistList');
    const fullFill = document.getElementById('fullPrepProgressFill');
    const fullScore = document.getElementById('fullPrepScoreBadge');

    if (fullFill) fullFill.style.width = `${metrics.checklistPercent}%`;
    if (fullScore) fullScore.textContent = `${metrics.checklistCompleted}/${metrics.checklistTotal} Done (${metrics.checklistPercent}%)`;

    if (fullContainer) {
      fullContainer.innerHTML = state.checklistItems.map(item => `
        <div class="checklist-row ${item.completed ? 'checked' : ''}" data-id="${item.id}" style="padding: 12px 14px; background: #FFF; border: 1px solid var(--border-light); border-radius: var(--radius-md); margin-bottom: 8px;">
          <div class="custom-checkbox">
            ${item.completed ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
          </div>
          <div style="flex-grow: 1;">
            <div class="checklist-text" style="font-weight: 700;">${item.title}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">${item.description}</div>
          </div>
          <span class="badge ${item.priority === 'critical' ? 'badge-danger' : 'badge-safe'}" style="font-size: 0.7rem;">${item.priority.toUpperCase()}</span>
        </div>
      `).join('');
    }
  }

  renderSafeCheckin(state, t) {
    const btn = document.getElementById('btnMarkSafeBig');
    const statusText = document.getElementById('mySafetyStatusText');
    const lastCheckinTime = document.getElementById('myLastCheckinTime');
    const isSafe = state.userStatus.isSafe;

    if (btn) {
      btn.className = `btn-big-safe-cta ${isSafe ? 'is-safe' : ''}`;
      btn.innerHTML = isSafe 
        ? `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg><span>${t.btnMarkedSafe}</span>`
        : `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>${t.btnMarkSafe}</span>`;
    }

    if (statusText) {
      statusText.textContent = isSafe ? t.statusSafe : t.statusUnknown;
      statusText.className = isSafe ? 'status-badge safe' : 'status-badge unknown';
    }

    if (lastCheckinTime) {
      lastCheckinTime.textContent = state.userStatus.lastCheckIn 
        ? `Last confirmed today at ${state.userStatus.lastCheckIn}` 
        : 'Tap button above to mark safe';
    }

    const familyGrid = document.getElementById('familyMembersGrid');
    if (familyGrid) {
      familyGrid.innerHTML = state.familyMembers.map(m => `
        <div class="family-member-card">
          <div class="member-info">
            <h4>${m.name}</h4>
            <p>📍 ${m.locationNote}</p>
            <p style="font-size:0.72rem; color:var(--text-muted); margin-top:2px;">🕒 ${m.lastUpdated} • Battery ${m.battery}</p>
          </div>
          <span class="status-badge ${m.status === 'safe' ? 'safe' : 'unknown'}">
            ${m.status === 'safe' ? '✓ ' + t.statusSafe : '• ' + t.statusUnknown}
          </span>
        </div>
      `).join('');
    }
  }

  renderContacts() {
    const state = appState.getState();
    const container = document.getElementById('emergencyContactsGrid');
    if (!container) return;

    let filteredVolunteers = state.volunteers;
    if (this.currentContactTab === 'doctors') {
      filteredVolunteers = state.volunteers.filter(v => v.role === 'doctor');
    } else if (this.currentContactTab === 'drivers') {
      filteredVolunteers = state.volunteers.filter(v => v.role === 'driver');
    } else if (this.currentContactTab === 'volunteers') {
      filteredVolunteers = state.volunteers.filter(v => v.role === 'first_aid' || v.role === 'rescue' || v.role === 'general');
    }

    let cardsHtml = '';

    if (this.currentContactTab === 'all' || this.currentContactTab === 'hotlines') {
      state.emergencyHotlines.forEach(h => {
        cardsHtml += `
          <div class="contact-card" style="border-left: 4px solid var(--red-alert);">
            <div class="contact-header">
              <div class="contact-avatar" style="background: var(--red-subtle); color: var(--red-alert);">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div class="contact-details">
                <h4>${h.title}</h4>
                <span class="contact-role" style="color: var(--red-alert);">${h.category}</span>
              </div>
            </div>
            <div class="contact-meta">
              <span>📞 Hotline: <b>${h.number}</b></span>
              <span class="badge badge-danger" style="align-self: flex-start;">${h.badge}</span>
            </div>
            <div class="contact-actions">
              <a href="tel:${h.number}" class="btn-call" style="grid-column: span 2;">
                📞 Direct Call (${h.number})
              </a>
            </div>
          </div>
        `;
      });
    }

    if (this.currentContactTab !== 'hotlines') {
      filteredVolunteers.forEach(v => {
        const initials = v.name.split(' ').map(n => n[0]).join('').substring(0, 2);
        cardsHtml += `
          <div class="contact-card">
            <div class="contact-header">
              <div class="contact-avatar">${initials}</div>
              <div class="contact-details">
                <h4>${v.name}</h4>
                <span class="contact-role">${v.roleLabel}</span>
              </div>
            </div>
            <div class="contact-meta">
              <span>📍 Area: ${v.area}</span>
              <span>⚡ Status: <b>${v.availability}</b></span>
              <span>🛠️ Skills: ${v.skills.join(', ')}</span>
            </div>
            <div class="contact-actions">
              <a href="tel:${v.phone}" class="btn-call">
                📞 Call
              </a>
              <a href="https://wa.me/${v.phone.replace(/[^0-9]/g, '')}" target="_blank" class="btn-whatsapp">
                💬 WhatsApp
              </a>
            </div>
          </div>
        `;
      });
    }

    container.innerHTML = cardsHtml;
  }

  renderSafeZones(state) {
    const container = document.getElementById('safeZonesDirectoryGrid');
    if (!container) return;

    container.innerHTML = state.safeZones.map(sz => `
      <div class="safezone-detailed-card">
        <div>
          <div class="safezone-head">
            <h4>${sz.name}</h4>
            <span class="safezone-dist-badge">📍 ${sz.distance} (${sz.walkTime})</span>
          </div>
          <p style="font-size: 0.82rem; color: var(--text-secondary); margin: 6px 0;">${sz.capacityNote}</p>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px;">
            <div>📍 Location: <b>${sz.locationName}</b></div>
            <div>⛰️ Elevation: <b>${sz.elevation}</b></div>
            <div>🛡️ Verified by: <b>${sz.verifiedBy}</b></div>
          </div>
          <div class="safezone-facilities-wrap">
            ${sz.facilities.map(f => `<span class="facility-chip">✓ ${f}</span>`).join('')}
          </div>
        </div>
        <button class="btn-navigate-safezone" data-lat="${sz.lat}" data-lng="${sz.lng}" data-name="${sz.name}">
          🚶 View Walking Path on Map
        </button>
      </div>
    `).join('');

    container.querySelectorAll('.btn-navigate-safezone').forEach(btn => {
      btn.addEventListener('click', () => {
        const lat = parseFloat(btn.getAttribute('data-lat'));
        const lng = parseFloat(btn.getAttribute('data-lng'));
        const name = btn.getAttribute('data-name');
        
        this.switchTab('map');
        setTimeout(() => {
          if (this.fullscreenMap) {
            this.fullscreenMap.drawWalkingRoute(lat, lng, name);
          }
        }, 300);
      });
    });
  }

  renderVolunteers(state) {
    const container = document.getElementById('volunteersRosterGrid');
    if (!container) return;

    container.innerHTML = state.volunteers.map(v => {
      const initials = v.name.split(' ').map(n => n[0]).join('').substring(0, 2);
      return `
        <div class="contact-card">
          <div class="contact-header">
            <div class="contact-avatar" style="background: var(--navy-primary);">${initials}</div>
            <div class="contact-details">
              <h4>${v.name}</h4>
              <span class="contact-role">${v.roleLabel}</span>
            </div>
          </div>
          <div class="contact-meta">
            <span>📍 Neighborhood: <b>${v.area}</b></span>
            <span>📱 Mobile: <b>${v.phone}</b></span>
            <span>🛠️ Skills: ${v.skills.join(', ')}</span>
            ${v.vehicle ? `<span>🚐 Vehicle: ${v.vehicle}</span>` : ''}
          </div>
          <div class="contact-actions">
            <a href="tel:${v.phone}" class="btn-call">📞 Call</a>
            <a href="https://wa.me/${v.phone.replace(/[^0-9]/g, '')}" target="_blank" class="btn-whatsapp">💬 WhatsApp</a>
          </div>
        </div>
      `;
    }).join('');
  }

  renderGuideSteps() {
    const state = appState.getState();
    const container = document.getElementById('guideStepsContainer');
    if (!container) return;

    const steps = state.earthquakeGuides[this.currentGuideTab] || state.earthquakeGuides.before;
    container.innerHTML = steps.map((s, idx) => `
      <div class="guide-step-card">
        <h5>${idx + 1}. ${s.title}</h5>
        <p>${s.desc}</p>
      </div>
    `).join('');
  }

  renderCommunityReports() {
    const state = appState.getState();
    const container = document.getElementById('communityReportsTimeline');
    if (!container) return;

    let reports = state.hazardReports;
    if (this.currentReportFilter === 'unverified') {
      reports = reports.filter(r => r.status === 'unverified');
    } else if (this.currentReportFilter === 'verified') {
      reports = reports.filter(r => r.status === 'verified');
    } else if (this.currentReportFilter === 'resolved') {
      reports = reports.filter(r => r.status === 'resolved');
    }

    container.innerHTML = reports.map(r => `
      <div class="activity-item" style="padding: 14px; margin-bottom: 10px; background:#FFF;">
        <div class="activity-icon-badge ${r.category === 'unsafe_building' ? 'badge-danger' : 'badge-orange'}">
          ${this.getCategoryIconSvg(r.category)}
        </div>
        <div class="activity-content">
          <div class="activity-top">
            <span class="badge ${r.status === 'verified' ? 'badge-safe' : (r.status === 'resolved' ? 'badge-purple' : 'badge-orange')}">
              ${r.status.toUpperCase()}
            </span>
            <span class="activity-time">🕒 ${r.createdAt}</span>
          </div>
          <h4 style="font-size: 0.95rem; font-weight:700; color:var(--navy-primary); margin: 4px 0 2px 0;">${r.title}</h4>
          <p style="font-size: 0.8rem; color:var(--text-secondary); margin-bottom: 6px;">${r.description}</p>
          
          ${r.photoUrl ? `<div style="margin: 6px 0; border-radius:8px; overflow:hidden; max-height:140px;"><img src="${r.photoUrl}" style="width:100%; height:100%; object-fit:cover;" /></div>` : ''}

          <div style="font-size: 0.74rem; color:var(--text-muted); display:flex; gap:12px; margin-bottom: 8px; flex-wrap:wrap;">
            <span>📍 ${r.locationName}</span>
            <span>👤 By: ${r.reportedBy}</span>
            <span>👍 Verified: ${r.verifiedCount || 1}</span>
          </div>

          <div style="display: flex; gap: 6px; flex-wrap:wrap;">
            ${r.status !== 'resolved' ? `
              <button class="btn-popup-verify btn-verify-report-action" data-id="${r.id}" style="padding: 6px 10px;">
                👍 Confirm (+1)
              </button>
              <button class="btn-popup-verify btn-resolve-report-action" data-id="${r.id}" style="padding: 6px 10px;">
                ✓ Resolved
              </button>
            ` : '<span style="font-size:0.75rem; color:var(--green-safe); font-weight:700;">✓ Resolved</span>'}
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.btn-verify-report-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.handleVerifyReport(id);
      });
    });

    container.querySelectorAll('.btn-resolve-report-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.handleResolveReport(id);
      });
    });
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✓' : (type === 'danger' ? '⚠️' : 'ℹ️')}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

window.app = new MahfoozApp();
document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
