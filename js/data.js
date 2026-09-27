// Initial seed dataset for Mahfooz Balakot - Community Earthquake Network
// All coordinates are accurate to Balakot, Khyber Pakhtunkhwa (Valley Center: 34.5484, 73.3533)

export const INITIAL_DATA = {
  hazardReports: [
    {
      id: 'haz-101',
      category: 'unsafe_building',
      title: 'Structural Cracks on Old Plaza Wall',
      description: 'Major shear cracks visible on the 2nd floor exterior brick wall facing the main street. Avoid walking underneath.',
      locationName: 'Main Bazaar, Near Kunhar Bridge',
      lat: 34.5492,
      lng: 73.3528,
      urgency: 'high',
      photoUrl: 'assets/hazard_crack.jpg',
      reportedBy: 'Kashif Mehmood',
      status: 'verified',
      verifiedCount: 14,
      createdAt: '25 minutes ago',
      timestamp: Date.now() - 25 * 60 * 1000
    },
    {
      id: 'haz-102',
      category: 'blocked_road',
      title: 'Rockfall on Kaghan Highway Section',
      description: 'Loose rocks and debris fallen across single lane. 4x4 vehicles can pass slowly, sedans blocked.',
      locationName: 'Kaghan Highway, 1.5km North of Bypass',
      lat: 34.5582,
      lng: 73.3614,
      urgency: 'high',
      photoUrl: null,
      reportedBy: 'Zahid Khan (Driver)',
      status: 'verified',
      verifiedCount: 22,
      createdAt: '45 minutes ago',
      timestamp: Date.now() - 45 * 60 * 1000
    },
    {
      id: 'haz-103',
      category: 'unsafe_bridge',
      title: 'Footbridge Timber Loose near Riverbank',
      description: 'Pedestrian wooden suspension bridge railing and 2 planks damaged after tremor. Safe for single person only with caution.',
      locationName: 'Lower Kunhar Foot Crossing, Garlat',
      lat: 34.5410,
      lng: 73.3485,
      urgency: 'medium',
      photoUrl: null,
      reportedBy: 'Amjad Ali',
      status: 'unverified',
      verifiedCount: 5,
      createdAt: '1 hour ago',
      timestamp: Date.now() - 60 * 60 * 1000
    },
    {
      id: 'haz-104',
      category: 'landslide',
      title: 'Minor Slump on Hillside Terrace',
      description: 'Soil shift behind residential cluster on upper terrace. Retaining wall holding but needs visual check.',
      locationName: 'Upper Sangar Terraces',
      lat: 34.5630,
      lng: 73.3440,
      urgency: 'medium',
      photoUrl: null,
      reportedBy: 'Gulzar Bibi',
      status: 'verified',
      verifiedCount: 8,
      createdAt: '2 hours ago',
      timestamp: Date.now() - 120 * 60 * 1000
    },
    {
      id: 'haz-105',
      category: 'fire_gas',
      title: 'LPG Cylinder Leak Smelled at Tea Stall',
      description: 'Valve leak noticed at commercial tea stall near junction. Surrounding shops notified to extinguish open flames.',
      locationName: 'College Road Junction',
      lat: 34.5450,
      lng: 73.3560,
      urgency: 'high',
      photoUrl: null,
      reportedBy: 'Shabbir Shah',
      status: 'resolved',
      verifiedCount: 19,
      createdAt: '3 hours ago',
      timestamp: Date.now() - 180 * 60 * 1000
    }
  ],

  safeZones: [
    {
      id: 'sz-1',
      name: 'Government High School Playfield',
      locationName: 'College Road, Central Balakot',
      lat: 34.5465,
      lng: 73.3545,
      capacityNote: 'Open meadow, 800+ capacity, clear of high-rise structures',
      status: 'active',
      availableSpace: '75% Capacity Free',
      distance: '450 meters',
      walkTime: '6 mins walk',
      facilities: ['First Aid Post', 'Clean Water Tank', 'Solar Floodlights', 'Emergency Tents'],
      elevation: '985m (Zero Kunhar River Flood Risk)',
      verifiedBy: 'Community Council'
    },
    {
      id: 'sz-2',
      name: 'Sangar Hill Assembly Ground',
      locationName: 'Upper Sangar Ridge',
      lat: 34.5615,
      lng: 73.3480,
      capacityNote: 'Wide flat plateau, bedrock foundation, ideal for hillside residents',
      status: 'active',
      availableSpace: '85% Capacity Free',
      distance: '1.2 km',
      walkTime: '15 mins walk',
      facilities: ['Emergency Radio Point', 'Community Tents', 'Spring Water Tap'],
      elevation: '1,120m (High & Stable Ground)',
      verifiedBy: 'Sangar Youth Committee'
    },
    {
      id: 'sz-3',
      name: 'Balakot Municipal Sports Ground',
      locationName: 'Old Balakot Bypass Road',
      lat: 34.5535,
      lng: 73.3580,
      capacityNote: 'Expansive turf field with direct 4x4 road access',
      status: 'active',
      availableSpace: '60% Capacity Free',
      distance: '850 meters',
      walkTime: '11 mins walk',
      facilities: ['4x4 Vehicle Staging', 'Paramedic Post', 'Food Distribution Area', 'Water Tanker'],
      elevation: '990m (Open Perimeter)',
      verifiedBy: 'Rescue Volunteer Unit'
    },
    {
      id: 'sz-4',
      name: 'Hasamabad Open Pine Meadow',
      locationName: 'Hasamabad Sector',
      lat: 34.5380,
      lng: 73.3510,
      capacityNote: 'Gentle grassy clearing away from cliff edges',
      status: 'active',
      availableSpace: '90% Capacity Free',
      distance: '1.6 km',
      walkTime: '20 mins walk',
      facilities: ['First Aid Kit Box', 'Fresh Mountain Stream (Filtered)'],
      elevation: '1,010m (Safe Open Terrain)',
      verifiedBy: 'Hasamabad Elders'
    }
  ],

  resources: [
    {
      id: 'res-1',
      type: 'water',
      name: 'Gravity Spring Water Tap (Tested Clean)',
      locationName: 'Sangar Lower Trailhead',
      lat: 34.5570,
      lng: 73.3505,
      verified: true,
      notes: 'Natural mountain spring, 24/7 continuous flow, tested for turbidity.',
      updatedAt: '30m ago'
    },
    {
      id: 'res-2',
      type: 'water',
      name: 'Community Water Storage Tank (5,000L)',
      locationName: 'Govt High School Ground',
      lat: 34.5468,
      lng: 73.3541,
      verified: true,
      notes: 'Filled daily by solar pump, boil-free drinking water.',
      updatedAt: '1h ago'
    },
    {
      id: 'res-3',
      type: 'medical',
      name: 'Balakot Community First Aid Station',
      locationName: 'Near Main Mosque Plaza',
      lat: 34.5498,
      lng: 73.3538,
      verified: true,
      notes: 'Splints, sterile bandages, antiseptics, pain relief, burn care.',
      updatedAt: '15m ago'
    },
    {
      id: 'res-4',
      type: 'medical',
      name: 'Mobile Health Clinic Van (Dr. Farooq)',
      locationName: 'Sports Ground Entrance',
      lat: 34.5530,
      lng: 73.3575,
      verified: true,
      notes: 'Doctor and 2 nurse volunteers on site. Minor trauma treatment.',
      updatedAt: '40m ago'
    },
    {
      id: 'res-5',
      type: 'food',
      name: 'Community Dry Food & Ration Point',
      locationName: 'Central Bazaar Relief Hall',
      lat: 34.5480,
      lng: 73.3522,
      verified: true,
      notes: 'Biscuits, bottled water packs, ORS packets, baby formula available.',
      updatedAt: '2h ago'
    }
  ],

  volunteers: [
    {
      id: 'vol-1',
      name: 'Dr. Tariq Farooq',
      role: 'doctor',
      roleLabel: 'Medical Doctor / Trauma Care',
      phone: '+92 300 5678123',
      area: 'Main Bazaar & Hospital Road',
      availability: 'On Duty at Relief Post',
      verified: true,
      skills: ['Emergency Medicine', 'Triage', 'Suturing'],
      joinedDate: 'Registered Volunteer'
    },
    {
      id: 'vol-2',
      name: 'Hamza Abbasi',
      role: 'driver',
      roleLabel: '4x4 Offroad Driver & Evacuation',
      phone: '+92 312 9845112',
      area: 'Sangar & Kaghan Highway',
      availability: 'Available with Hilux 4x4',
      verified: true,
      skills: ['Rough Terrain Driving', 'Winch Rescue', 'Transport'],
      joinedDate: 'Registered Volunteer'
    },
    {
      id: 'vol-3',
      name: 'Fatima Noor',
      role: 'first_aid',
      roleLabel: 'Certified First Aid Responder',
      phone: '+92 333 4129876',
      area: 'College Road & Garlat',
      availability: 'Active Responder',
      verified: true,
      skills: ['Red Crescent Certified', 'Bleeding Control', 'CPR'],
      joinedDate: 'Registered Volunteer'
    },
    {
      id: 'vol-4',
      name: 'Bilal Khan Swati',
      role: 'rescue',
      roleLabel: 'Search & Structural Rescue',
      phone: '+92 345 7789012',
      area: 'Upper Sangar Terraces',
      availability: 'On Standby with Gear',
      verified: true,
      skills: ['Rope Access', 'Debris Clearing', 'Ladder Rescue'],
      joinedDate: 'Registered Volunteer'
    },
    {
      id: 'vol-5',
      name: 'Rashid Mehmood',
      role: 'driver',
      roleLabel: 'Ambulance & Van Transport',
      phone: '+92 301 8890234',
      area: 'Bypass & Sports Ground',
      availability: 'Available 24/7',
      verified: true,
      skills: ['Patient Transfer', 'High-Roof Van', 'Oxygen Cylinder equipped'],
      joinedDate: 'Registered Volunteer'
    },
    {
      id: 'vol-6',
      name: 'Zainab Bibi',
      role: 'first_aid',
      roleLabel: 'Community Health Worker',
      phone: '+92 313 6543210',
      area: 'Hasamabad Sector',
      availability: 'On Call',
      verified: true,
      skills: ['Maternal & Child First Aid', 'Vital Signs Monitoring', 'ORS Prep'],
      joinedDate: 'Registered Volunteer'
    }
  ],

  emergencyHotlines: [
    {
      title: 'Rescue 1122 (KP Emergency Service)',
      number: '1122',
      category: 'Emergency Dispatch',
      badge: 'Toll-Free 24/7',
      icon: 'ambulance'
    },
    {
      title: 'Edhi Emergency Ambulance Balakot',
      number: '115',
      category: 'Ambulance & Transport',
      badge: 'Free Hotline',
      icon: 'heart-pulse'
    },
    {
      title: 'Balakot Police Station Emergency',
      number: '+92 997 450123',
      category: 'Local Security & Traffic',
      badge: 'Direct Line',
      icon: 'shield'
    },
    {
      title: 'DHQ Hospital Mansehra Emergency Desk',
      number: '+92 997 300456',
      category: 'Nearest Major Trauma Center',
      badge: '24/7 Operations',
      icon: 'hospital'
    }
  ],

  familyMembers: [
    {
      id: 'fam-1',
      name: 'Amina Bibi (Mother)',
      relation: 'Mother',
      status: 'safe',
      locationNote: 'At Home (Sangar Sector)',
      battery: '82%',
      lastUpdated: '12 minutes ago',
      timestamp: Date.now() - 12 * 60 * 1000
    },
    {
      id: 'fam-2',
      name: 'Usman Ali (Brother)',
      relation: 'Brother',
      status: 'safe',
      locationNote: 'At Govt High School Ground',
      battery: '64%',
      lastUpdated: '28 minutes ago',
      timestamp: Date.now() - 28 * 60 * 1000
    },
    {
      id: 'fam-3',
      name: 'Nadia Khan (Sister)',
      relation: 'Sister',
      status: 'safe',
      locationNote: 'College Road, Safe with Colleagues',
      battery: '91%',
      lastUpdated: '40 minutes ago',
      timestamp: Date.now() - 40 * 60 * 1000
    },
    {
      id: 'fam-4',
      name: 'Kamran (Uncle)',
      relation: 'Uncle',
      status: 'unknown',
      locationNote: 'Last seen near Main Bazaar 3h ago',
      battery: 'Unknown',
      lastUpdated: 'Status not confirmed yet',
      timestamp: Date.now() - 180 * 60 * 1000
    }
  ],

  activityFeed: [
    {
      id: 'act-1',
      type: 'report',
      icon: 'alert-triangle',
      badgeClass: 'badge-danger',
      categoryText: 'Hazard Reported',
      summary: 'Structural cracks reported on old plaza wall near Kunhar Bridge',
      location: 'Main Bazaar',
      time: '18 minutes ago',
      verified: true
    },
    {
      id: 'act-2',
      type: 'checkin',
      icon: 'check-circle',
      badgeClass: 'badge-safe',
      categoryText: 'Safe Check-In',
      summary: '14 households in Sangar Sector confirmed Safe',
      location: 'Sangar',
      time: '26 minutes ago',
      verified: true
    },
    {
      id: 'act-3',
      type: 'volunteer_joined',
      icon: 'user-plus',
      badgeClass: 'badge-purple',
      categoryText: 'Volunteer Joined',
      summary: 'Hamza Abbasi registered with 4x4 vehicle for mountain transport',
      location: 'Balakot',
      time: '41 minutes ago',
      verified: true
    },
    {
      id: 'act-4',
      type: 'resource_verified',
      icon: 'droplet',
      badgeClass: 'badge-water',
      categoryText: 'Resource Verified',
      summary: 'Drinking water gravity tap at Sangar Trailhead tested clean and functional',
      location: 'Sangar Trailhead',
      time: '1 hour ago',
      verified: true
    },
    {
      id: 'act-5',
      type: 'report',
      icon: 'truck',
      badgeClass: 'badge-orange',
      categoryText: 'Road Update',
      summary: 'Rockfall cleared for 1 lane on Kaghan Highway North',
      location: 'Kaghan Highway',
      time: '2 hours ago',
      verified: true
    }
  ],

  checklistItems: [
    {
      id: 'chk-1',
      category: 'kit',
      title: 'Emergency Grab Bag Prepared',
      description: 'Backpack containing 3-day non-perishable food, water bottles, flashlight, batteries, and whistle.',
      completed: true,
      priority: 'critical'
    },
    {
      id: 'chk-2',
      category: 'kit',
      title: 'First Aid Kit & Essential Medicines',
      description: 'Sterile gauze, antiseptic liquid, pain relievers, ORS sachets, and 7-day personal prescription medications.',
      completed: true,
      priority: 'critical'
    },
    {
      id: 'chk-3',
      category: 'plan',
      title: 'Family Meeting Point Agreed',
      description: 'Agreed on Government High School ground as safe meeting spot if mobile networks fail.',
      completed: true,
      priority: 'high'
    },
    {
      id: 'chk-4',
      category: 'home',
      title: 'Gas Cylinder & Stove Valves Known',
      description: 'All family members know how to turn off the LPG cylinder regulator immediately after tremor.',
      completed: true,
      priority: 'high'
    },
    {
      id: 'chk-5',
      category: 'home',
      title: 'Heavy Furniture & Overhead Items Secured',
      description: 'Heavy wardrobes, water heaters, and hanging mirrors bolted to walls away from beds.',
      completed: false,
      priority: 'medium'
    },
    {
      id: 'chk-6',
      category: 'docs',
      title: 'Vital Documents in Waterproof Pouch',
      description: 'Photocopies of CNIC, property papers, birth certificates, and vaccination cards in sealed bag.',
      completed: true,
      priority: 'high'
    },
    {
      id: 'chk-7',
      category: 'comms',
      title: 'Emergency Contacts Written on Paper Card',
      description: 'Physical card with phone numbers of local doctor, 1122, and relatives kept in wallet.',
      completed: true,
      priority: 'medium'
    },
    {
      id: 'chk-8',
      category: 'water',
      title: 'Household Emergency Water Stored',
      description: 'At least 15 liters of clean covered water stored in durable containers for drinking.',
      completed: false,
      priority: 'critical'
    },
    {
      id: 'chk-9',
      category: 'plan',
      title: 'Drop, Cover, Hold-On Practiced',
      description: 'Conducted family earthquake drill: protect head, get under sturdy wooden table, hold tight.',
      completed: false,
      priority: 'high'
    },
    {
      id: 'chk-10',
      category: 'network',
      title: 'App Installed & Family Linked on Mahfooz',
      description: 'Bookmarked Mahfooz Balakot web app on family phones for instant one-tap check-in.',
      completed: true,
      priority: 'medium'
    }
  ],

  earthquakeGuides: {
    before: [
      {
        title: 'Identify Safe Spots in Every Room',
        desc: 'Locate interior load-bearing walls, sturdy wooden tables, and avoid glass windows, heavy chandeliers, and exterior stone facades.'
      },
      {
        title: 'Prepare Mountain Grab Bag',
        desc: 'Keep warm shawls, waterproof jackets, sturdy walking boots, flashlight with spare cells, and whistle near your home exit.'
      },
      {
        title: 'Map Multiple Evacuation Routes',
        desc: 'Know at least two paths to your nearest open ground safe zone, avoiding narrow alleys bordered by unreinforced stone walls.'
      },
      {
        title: 'Store Emergency Cash & Offline Numbers',
        desc: 'ATMs and digital payments may go down. Keep small cash notes and a physical card with phone numbers of local rescue volunteers.'
      }
    ],
    during: [
      {
        title: 'DROP, COVER, and HOLD ON',
        desc: 'Drop onto hands and knees. Cover head and neck under sturdy desk or table. Hold on until the shaking completely stops.'
      },
      {
        title: 'If Indoors: DO NOT Rush for Exits During Shaking',
        desc: 'Falling bricks, masonry, and roof tiles at doorways cause majority of injuries. Stay sheltered until shaking ceases.'
      },
      {
        title: 'If Outdoors: Move Away from Cliffs and Tall Facades',
        desc: 'Move immediately to an open field or ridge away from steep slope edges, overhead wires, and multi-story masonry.'
      },
      {
        title: 'If in a Vehicle: Pull Over Safely',
        desc: 'Stop away from bridges, steep hillside cuttings prone to rockfall, and utility poles. Stay inside vehicle with hazard lights.'
      }
    ],
    after: [
      {
        title: 'Check for Injuries and Gas Leaks',
        desc: 'Apply first aid to urgent bleeding. Turn off LPG gas cylinder valves immediately. Never light matches or lighters.'
      },
      {
        title: 'Evacuate Calmly to Nearest Safe Zone',
        desc: 'Wear sturdy shoes to protect against shattered glass and sharp debris. Walk, do not run. Assist elderly neighbors.'
      },
      {
        title: 'Expect and Prepare for Aftershocks',
        desc: 'Secondary tremors can collapse already-weakened structures. Do not re-enter damaged buildings to retrieve belongings.'
      },
      {
        title: 'Tap "I Am Safe" on Mahfooz Balakot',
        desc: 'Update your safety status in one tap to reassure family and free up phone lines for critical emergency rescues.'
      }
    ]
  }
};
