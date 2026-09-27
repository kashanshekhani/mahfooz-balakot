import { INITIAL_DATA } from './data.js';

const STORAGE_KEY = 'mahfooz_balakot_state_v1';

class StateManager {
  constructor() {
    this.listeners = [];
    this.state = this.loadInitialState();
  }

  loadInitialState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_DATA,
          ...parsed,
          hazardReports: parsed.hazardReports || INITIAL_DATA.hazardReports,
          safeZones: parsed.safeZones || INITIAL_DATA.safeZones,
          resources: parsed.resources || INITIAL_DATA.resources,
          volunteers: parsed.volunteers || INITIAL_DATA.volunteers,
          familyMembers: parsed.familyMembers || INITIAL_DATA.familyMembers,
          activityFeed: parsed.activityFeed || INITIAL_DATA.activityFeed,
          checklistItems: parsed.checklistItems || INITIAL_DATA.checklistItems,
          userStatus: parsed.userStatus || { isSafe: false, lastCheckIn: null, battery: '85%' },
          language: parsed.language || 'en',
          communityStatus: parsed.communityStatus || 'normal', // 'normal' | 'alert'
          activeTab: parsed.activeTab || 'dashboard'
        };
      }
    } catch (e) {
      console.warn('Could not load from localStorage:', e);
    }

    return {
      ...INITIAL_DATA,
      userStatus: { isSafe: false, lastCheckIn: null, battery: '85%' },
      language: 'en',
      communityStatus: 'normal',
      activeTab: 'dashboard'
    };
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  getState() {
    return this.state;
  }

  // --- ACTIONS ---

  setLanguage(lang) {
    if (['en', 'ur', 'ps'].includes(lang)) {
      this.state.language = lang;
      document.documentElement.lang = lang;
      document.documentElement.dir = (lang === 'ur' || lang === 'ps') ? 'rtl' : 'ltr';
      this.saveState();
    }
  }

  setActiveTab(tabName) {
    this.state.activeTab = tabName;
    this.saveState();
  }

  toggleCommunityStatus() {
    this.state.communityStatus = this.state.communityStatus === 'normal' ? 'alert' : 'normal';
    
    // Add activity feed entry
    const newActivity = {
      id: 'act-' + Date.now(),
      type: 'report',
      icon: 'alert-circle',
      badgeClass: this.state.communityStatus === 'alert' ? 'badge-danger' : 'badge-safe',
      categoryText: this.state.communityStatus === 'alert' ? 'Alert Triggered' : 'Status Normal',
      summary: this.state.communityStatus === 'alert' 
        ? 'Community advisory level raised due to reported tremor.'
        : 'Community advisory restored to Normal. No active hazards pending.',
      location: 'Balakot Valley',
      time: 'Just now',
      verified: true
    };
    this.state.activityFeed.unshift(newActivity);
    this.saveState();
  }

  setUserSafe(isSafe, locationNote = 'Balakot, KP') {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.state.userStatus = {
      isSafe: isSafe,
      lastCheckIn: timeString,
      locationNote: locationNote,
      battery: '88%',
      timestamp: Date.now()
    };

    if (isSafe) {
      const feedItem = {
        id: 'act-' + Date.now(),
        type: 'checkin',
        icon: 'check-circle',
        badgeClass: 'badge-safe',
        categoryText: 'Self Check-In',
        summary: `You marked yourself as Safe (${timeString})`,
        location: locationNote,
        time: 'Just now',
        verified: true
      };
      this.state.activityFeed.unshift(feedItem);
    }

    this.saveState();
  }

  addHazardReport(reportData) {
    const newId = 'haz-' + Date.now();
    const newReport = {
      id: newId,
      category: reportData.category || 'unsafe_building',
      title: reportData.title || 'Reported Hazard',
      description: reportData.description || '',
      locationName: reportData.locationName || 'Balakot Area',
      lat: Number(reportData.lat) || (34.5484 + (Math.random() - 0.5) * 0.015),
      lng: Number(reportData.lng) || (73.3533 + (Math.random() - 0.5) * 0.015),
      urgency: reportData.urgency || 'high',
      photoUrl: reportData.photoUrl || null,
      reportedBy: reportData.reportedBy || 'Community Resident',
      status: 'unverified',
      verifiedCount: 1,
      createdAt: 'Just now',
      timestamp: Date.now()
    };

    this.state.hazardReports.unshift(newReport);

    // Add to activity feed
    const categoryLabels = {
      unsafe_building: 'Damaged Building',
      blocked_road: 'Blocked Road',
      unsafe_bridge: 'Unsafe Bridge',
      fire_gas: 'Gas / Fire Risk',
      landslide: 'Landslide',
      other: 'Hazard Report'
    };

    const feedItem = {
      id: 'act-' + Date.now(),
      type: 'report',
      icon: 'alert-triangle',
      badgeClass: 'badge-danger',
      categoryText: categoryLabels[newReport.category] || 'Hazard Reported',
      summary: `${newReport.title} reported at ${newReport.locationName}`,
      location: newReport.locationName,
      time: 'Just now',
      verified: false
    };
    this.state.activityFeed.unshift(feedItem);

    this.saveState();
    return newReport;
  }

  verifyHazardReport(reportId) {
    const report = this.state.hazardReports.find(r => r.id === reportId);
    if (report) {
      report.verifiedCount = (report.verifiedCount || 1) + 1;
      if (report.verifiedCount >= 3) {
        report.status = 'verified';
      }
      this.saveState();
    }
  }

  resolveHazardReport(reportId) {
    const report = this.state.hazardReports.find(r => r.id === reportId);
    if (report) {
      report.status = 'resolved';
      
      const feedItem = {
        id: 'act-' + Date.now(),
        type: 'report',
        icon: 'check',
        badgeClass: 'badge-safe',
        categoryText: 'Hazard Resolved',
        summary: `Issue resolved: ${report.title}`,
        location: report.locationName,
        time: 'Just now',
        verified: true
      };
      this.state.activityFeed.unshift(feedItem);
      
      this.saveState();
    }
  }

  addFamilyMember(member) {
    const newMember = {
      id: 'fam-' + Date.now(),
      name: member.name,
      relation: member.relation || 'Family Member',
      status: member.status || 'safe',
      locationNote: member.locationNote || 'Balakot',
      battery: member.battery || '90%',
      lastUpdated: 'Just now',
      timestamp: Date.now()
    };
    this.state.familyMembers.push(newMember);
    this.saveState();
  }

  updateFamilyMemberStatus(memberId, status, locationNote) {
    const member = this.state.familyMembers.find(m => m.id === memberId);
    if (member) {
      member.status = status;
      if (locationNote) member.locationNote = locationNote;
      member.lastUpdated = 'Just now';
      member.timestamp = Date.now();
      this.saveState();
    }
  }

  addVolunteer(volunteer) {
    const newVol = {
      id: 'vol-' + Date.now(),
      name: volunteer.name,
      role: volunteer.role || 'general',
      roleLabel: volunteer.roleLabel || 'Volunteer Responder',
      phone: volunteer.phone,
      area: volunteer.area || 'Balakot',
      availability: 'Available',
      verified: true,
      skills: volunteer.skills || ['Community First Response'],
      vehicle: volunteer.vehicle || null,
      joinedDate: 'Joined Today'
    };
    this.state.volunteers.unshift(newVol);

    const feedItem = {
      id: 'act-' + Date.now(),
      type: 'volunteer_joined',
      icon: 'user-plus',
      badgeClass: 'badge-purple',
      categoryText: 'Volunteer Registered',
      summary: `${newVol.name} registered for ${newVol.roleLabel}`,
      location: newVol.area,
      time: 'Just now',
      verified: true
    };
    this.state.activityFeed.unshift(feedItem);

    this.saveState();
    return newVol;
  }

  toggleChecklistItem(id) {
    const item = this.state.checklistItems.find(i => i.id === id);
    if (item) {
      item.completed = !item.completed;
      this.saveState();
    }
  }

  // --- DERIVED METRICS ---

  getMetrics() {
    const activeHazards = this.state.hazardReports.filter(r => r.status !== 'resolved');
    const unsafeBuildings = activeHazards.filter(r => r.category === 'unsafe_building').length;
    const blockedRoads = activeHazards.filter(r => r.category === 'blocked_road' || r.category === 'landslide' || r.category === 'unsafe_bridge').length;
    const safeZonesCount = this.state.safeZones.length;
    const waterPointsCount = this.state.resources.filter(r => r.type === 'water').length;
    const volunteersCount = this.state.volunteers.length;
    
    const checklistTotal = this.state.checklistItems.length;
    const checklistCompleted = this.state.checklistItems.filter(i => i.completed).length;
    const checklistPercent = Math.round((checklistCompleted / checklistTotal) * 100);

    return {
      unsafeBuildings,
      blockedRoads,
      safeZonesCount,
      waterPointsCount,
      volunteersCount,
      checklistTotal,
      checklistCompleted,
      checklistPercent
    };
  }
}

export const appState = new StateManager();
