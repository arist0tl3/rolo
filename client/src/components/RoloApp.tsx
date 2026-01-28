import React, { useEffect, useMemo, useState } from 'react';
import PlacesAutocomplete from './PlacesAutocomplete';

type Shift = 'morning' | 'afternoon' | 'evening';
type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

type Contact = {
  id: string;
  firstName: string;
  restaurant?: string;
  phone?: string;
  instagram?: string;
  place?: Place;
  shifts?: Partial<Record<Day, Shift[]>>;
  notes?: string;
};

type Place = {
  coordinates: {
    lat: number;
    lng: number;
  };
  formattedAddress: string;
  googlePlaceId: string;
  locationName: string;
};

type LegacyContact = {
  _id?: string;
  firstName?: string;
  notes?: string;
  shifts?: number[];
  place?: Place;
};

type ContactFormState = {
  firstName: string;
  restaurant: string;
  phone: string;
  instagram: string;
  place?: Place;
  shifts: Partial<Record<Day, Shift[]>>;
  notes: string;
};

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const ROLO_STORAGE_KEY = 'rolo-contacts-v2';
const LEGACY_STORAGE_KEY = 'contacts';
const MIGRATION_KEY = 'rolo-migrated-v2';
const PWA_DISMISS_KEY = 'rolo-pwa-dismissed';

const DAYS: Day[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SHIFT_OPTIONS: Shift[] = ['morning', 'afternoon', 'evening'];
const SHIFT_LABELS = ['AM', 'PM', 'Eve'];

const ALPHABET_TABS = ['A-C', 'D-F', 'G-I', 'J-L', 'M-O', 'P-R', 'S-U', 'V-Z'];
const TAB_COLORS = ['#D35F2E', '#E87A2A', '#D4A84B', '#C9B458', '#B8A94D', '#A89B42', '#9A8B38', '#8B7C2E'];

const sanitizeInstagram = (value: string) => value.replace('@', '').replace(/\s/g, '');

const isValidPhone = (value: string) => {
  if (!value.trim()) return true;
  return /^[0-9+()\-.\s]{7,}$/.test(value.trim());
};

const isValidInstagram = (value: string) => {
  if (!value.trim()) return true;
  return /^[A-Za-z0-9._]+$/.test(value.trim());
};

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `contact-${Date.now()}`;
};

const getTabForName = (name: string) => {
  const first = (name || '').charAt(0).toUpperCase();
  if (first <= 'C') return 'A-C';
  if (first <= 'F') return 'D-F';
  if (first <= 'I') return 'G-I';
  if (first <= 'L') return 'J-L';
  if (first <= 'O') return 'M-O';
  if (first <= 'R') return 'P-R';
  if (first <= 'U') return 'S-U';
  return 'V-Z';
};

const migrateLegacyContacts = (legacy: LegacyContact[]): Contact[] => {
  return legacy
    .filter((item) => item && item.firstName)
    .map((item) => {
      const shifts: Partial<Record<Day, Shift[]>> = {};
      if (item.shifts?.length) {
        item.shifts.forEach((shiftIndex) => {
          const dayIndex = Math.floor(shiftIndex / 3);
          const shiftIndexWithinDay = shiftIndex % 3;
          const day = DAYS[dayIndex];
          const shift = SHIFT_OPTIONS[shiftIndexWithinDay];
          if (!day || !shift) return;
          const existing = shifts[day] ?? [];
          if (!existing.includes(shift)) {
            shifts[day] = [...existing, shift];
          }
        });
      }
      return {
        id: item._id || createId(),
        firstName: item.firstName?.trim() || '',
        restaurant: item.place?.locationName || '',
        place: item.place,
        notes: item.notes || '',
        shifts,
      };
    });
};

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function ContactCard({ contact, onClick }: { contact: Contact; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rolo-card group relative w-full overflow-hidden rounded-[4px] border border-[#d4cfc5] bg-gradient-to-b from-[#fffef8] to-[#f9f6ee] text-left shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_4px_8px_rgba(0,0,0,0.06),_inset_0_1px_0_rgba(255,255,255,0.8)] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.18)]"
    >
      <div className="card-lines" aria-hidden />
      <div className="relative z-10 flex flex-col gap-1 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="font-rolodex text-[18px] tracking-wide text-[#2c2c2c]">{contact.firstName}</span>
          <span className="flex items-center gap-2 text-[#9b9b9b]">
            {contact.phone ? <PhoneIcon /> : null}
            {contact.instagram ? <InstagramIcon /> : null}
          </span>
        </div>
        <span className="text-[13px] text-[#666666]">{contact.restaurant || contact.place?.locationName || '—'}</span>
      </div>
    </button>
  );
}

function TabDivider({
  label,
  isActive,
  onClick,
  color,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`tab-divider ${isActive ? 'active' : ''}`}
      style={{ '--tab-color': color } as React.CSSProperties}
    >
      {label}
    </button>
  );
}

function ContactDetail({
  contact,
  onBack,
  onEdit,
  isClosing,
}: {
  contact: Contact;
  onBack: () => void;
  onEdit: () => void;
  isClosing: boolean;
}) {
  return (
    <div className={`rolo-overlay ${isClosing ? 'closing' : ''}`}>
      <div className="rolo-detail-card">
        <div className="card-lines" aria-hidden />
        <div className="relative z-10 space-y-5 p-5">
          <div className="flex items-center justify-between">
            <button type="button" className="icon-button" onClick={onBack}>
              <BackIcon />
            </button>
            <button type="button" className="icon-button edit-btn" onClick={onEdit}>
              EDIT
            </button>
          </div>

          <div className="space-y-1">
            <label className="detail-label">NAME</label>
            <div className="font-rolodex text-[24px] text-[#2c2c2c]">{contact.firstName}</div>
          </div>

          <div className="space-y-1">
            <label className="detail-label">RESTAURANT / LOCATION</label>
            <div className="text-[16px] text-[#333333]">{contact.restaurant || contact.place?.locationName || '—'}</div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="detail-label">TELEPHONE NO.</label>
              {contact.phone ? (
                <a className="detail-link" href={`tel:${contact.phone}`}>
                  {contact.phone}
                </a>
              ) : (
                <div className="text-[16px] text-[#333333]">—</div>
              )}
            </div>
            <div className="space-y-1">
              <label className="detail-label">INSTAGRAM</label>
              {contact.instagram ? (
                <a className="detail-link" href={`https://instagram.com/${contact.instagram}`} target="_blank" rel="noreferrer">
                  @{contact.instagram}
                </a>
              ) : (
                <div className="text-[16px] text-[#333333]">—</div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="detail-label">SHIFTS</label>
            <div className="shifts-grid">
              <div className="shifts-header">
                <span />
                {DAY_LABELS.map((day) => (
                  <span key={day} className="shift-day-label">
                    {day}
                  </span>
                ))}
              </div>
              {SHIFT_OPTIONS.map((shift, index) => (
                <div key={shift} className="shifts-row">
                  <span className="shift-label">{SHIFT_LABELS[index]}</span>
                  {DAYS.map((day) => {
                    const hasShift = contact.shifts?.[day]?.includes(shift);
                    return (
                      <span key={day} className={`shift-cell ${hasShift ? 'active' : ''}`}>
                        {hasShift ? '●' : ''}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="detail-label">NOTES</label>
            <div className="text-[15px] italic text-[#555555]">{contact.notes || '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactForm({
  contact,
  onSave,
  onCancel,
  isClosing,
}: {
  contact?: Contact | null;
  onSave: (contact: Contact) => void;
  onCancel: () => void;
  isClosing: boolean;
}) {
  const [form, setForm] = useState<ContactFormState>({
    firstName: contact?.firstName || '',
    restaurant: contact?.restaurant || contact?.place?.locationName || '',
    phone: contact?.phone || '',
    instagram: contact?.instagram || '',
    place: contact?.place,
    shifts: contact?.shifts || {},
    notes: contact?.notes || '',
  });
  const [errors, setErrors] = useState<{ firstName?: string; phone?: string; instagram?: string }>({});

  const toggleShift = (day: Day, shift: Shift) => {
    setForm((prev) => {
      const dayShifts = prev.shifts[day] || [];
      const nextDayShifts = dayShifts.includes(shift) ? dayShifts.filter((s) => s !== shift) : [...dayShifts, shift];
      return {
        ...prev,
        shifts: { ...prev.shifts, [day]: nextDayShifts },
      };
    });
  };

  const validate = () => {
    const nextErrors: { firstName?: string; phone?: string; instagram?: string } = {};
    if (!form.firstName.trim()) {
      nextErrors.firstName = 'First name is required.';
    }
    if (!isValidPhone(form.phone)) {
      nextErrors.phone = 'Enter a valid phone number.';
    }
    if (!isValidInstagram(form.instagram)) {
      nextErrors.instagram = 'Only letters, numbers, periods, and underscores.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      id: contact?.id || createId(),
      firstName: form.firstName.trim(),
      restaurant: form.restaurant.trim(),
      phone: form.phone.trim(),
      instagram: sanitizeInstagram(form.instagram.trim()),
      place: form.place,
      shifts: form.shifts,
      notes: form.notes.trim(),
    });
  };

  return (
    <div className={`rolo-overlay ${isClosing ? 'closing' : ''}`}>
      <div className="rolo-detail-card">
        <div className="card-lines" aria-hidden />
        <div className="relative z-10 space-y-6 p-5">
          <div className="flex items-center justify-between">
            <button type="button" className="icon-button" onClick={onCancel}>
              <XIcon />
            </button>
            <button type="button" className="icon-button save" onClick={handleSubmit}>
              <CheckIcon />
            </button>
          </div>

          <div className="font-rolodex text-[20px] text-[#333333]">{contact ? 'Edit Contact' : 'Add a friend'}</div>

          <div className="space-y-4">
            <div className="form-section-title">Basics</div>
            <div>
              <label className="form-label" htmlFor="first-name">
                First name
              </label>
              <input
                id="first-name"
                className="rolo-input"
                type="text"
                value={form.firstName}
                onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
                placeholder="Name"
              />
              {errors.firstName ? <div className="form-error">{errors.firstName}</div> : null}
            </div>
            <div>
              <PlacesAutocomplete
                value={form.restaurant}
                onInput={(value) => setForm((prev) => ({ ...prev, restaurant: value, place: undefined }))}
                onSelect={(place) =>
                  setForm((prev) => ({
                    ...prev,
                    restaurant: place.locationName,
                    place,
                  }))
                }
                placeholder="Where do they work?"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="form-section-title">Contact</div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="form-label" htmlFor="phone">
                  Phone
                </label>
                <input
                  id="phone"
                  className="rolo-input"
                  type="tel"
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                  placeholder="555-0123"
                />
                {errors.phone ? <div className="form-error">{errors.phone}</div> : null}
              </div>
              <div>
                <label className="form-label" htmlFor="instagram">
                  Instagram
                </label>
                <input
                  id="instagram"
                  className="rolo-input"
                  type="text"
                  value={form.instagram}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      instagram: sanitizeInstagram(event.target.value),
                    }))
                  }
                  placeholder="username"
                />
                {errors.instagram ? <div className="form-error">{errors.instagram}</div> : null}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="form-section-title">Shifts</div>
            <div className="shifts-grid editable">
              <div className="shifts-header">
                <span />
                {DAY_LABELS.map((day) => (
                  <span key={day} className="shift-day-label">
                    {day}
                  </span>
                ))}
              </div>
              {SHIFT_OPTIONS.map((shift, index) => (
                <div key={shift} className="shifts-row">
                  <span className="shift-label">{SHIFT_LABELS[index]}</span>
                  {DAYS.map((day) => {
                    const isActive = form.shifts?.[day]?.includes(shift);
                    return (
                      <button
                        key={day}
                        type="button"
                        className={`shift-cell clickable ${isActive ? 'active' : ''}`}
                        onClick={() => toggleShift(day, shift)}
                      >
                        {isActive ? '●' : ''}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="form-section-title">Additional info</div>
            <div>
              <label className="form-label" htmlFor="notes">
                Notes
              </label>
              <textarea
                id="notes"
                className="rolo-input min-h-[90px] resize-y"
                value={form.notes}
                onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                placeholder="Anything else to remember..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoloApp() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [listMode, setListMode] = useState<'name' | 'restaurant'>('name');
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'form'>('list');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [isClosingDetail, setIsClosingDetail] = useState(false);
  const [isClosingForm, setIsClosingForm] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [showMigration, setShowMigration] = useState(false);
  const [legacyContacts, setLegacyContacts] = useState<Contact[]>([]);
  const [pwaPrompt, setPwaPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [pwaDismissed, setPwaDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(ROLO_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Contact[];
        if (Array.isArray(parsed)) {
          setContacts(parsed);
        }
      } catch {
        localStorage.removeItem(ROLO_STORAGE_KEY);
      }
    }

    const migrated = localStorage.getItem(MIGRATION_KEY);
    const legacyStored = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!migrated && legacyStored) {
      try {
        const parsedLegacy = JSON.parse(legacyStored) as LegacyContact[];
        if (Array.isArray(parsedLegacy) && parsedLegacy.length) {
          const migratedContacts = migrateLegacyContacts(parsedLegacy);
          if (migratedContacts.length) {
            setLegacyContacts(migratedContacts);
            setShowMigration(true);
          }
        }
      } catch {
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    }

    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    localStorage.setItem(ROLO_STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts, hasLoaded]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateMobile = () => setIsMobile(window.innerWidth < 768);
    updateMobile();
    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissed = localStorage.getItem(PWA_DISMISS_KEY);
    if (dismissed) {
      setPwaDismissed(true);
    }
    const handler = (event: Event) => {
      event.preventDefault();
      setPwaPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const restaurantTabs = useMemo(() => {
    const names = contacts
      .map((contact) => (contact.restaurant || contact.place?.locationName || '').trim())
      .filter((name): name is string => !!name);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    let result = contacts.slice();
    const term = searchTerm.trim().toLowerCase();

    if (term) {
      result = result.filter((contact) => {
        const restaurantName = contact.restaurant || contact.place?.locationName || '';
        return contact.firstName.toLowerCase().includes(term) || restaurantName.toLowerCase().includes(term);
      });
    }

    if (activeTab && !term) {
      if (listMode === 'name') {
        const [start, end] = activeTab.split('-');
        result = result.filter((contact) => {
          const first = contact.firstName.charAt(0).toUpperCase();
          return first >= start && first <= end;
        });
      } else {
        result = result.filter((contact) => (contact.restaurant || contact.place?.locationName) === activeTab);
      }
    }

    const score = (contact: Contact) => {
      if (!term) return 0;
      const name = contact.firstName.toLowerCase();
      const rest = (contact.restaurant || contact.place?.locationName || '').toLowerCase();
      if (name.startsWith(term)) return 0;
      if (name.includes(term)) return 1;
      if (rest.startsWith(term)) return 2;
      if (rest.includes(term)) return 3;
      return 4;
    };

    return result.sort((a, b) => {
      const diff = score(a) - score(b);
      if (diff !== 0) return diff;
      return a.firstName.localeCompare(b.firstName);
    });
  }, [contacts, searchTerm, activeTab, listMode]);

  const groupedContacts = useMemo(() => {
    const groups: Record<string, Contact[]> = {};
    filteredContacts.forEach((contact) => {
      const restaurantName = contact.restaurant || contact.place?.locationName || '';
      const key = listMode === 'name' ? getTabForName(contact.firstName) : restaurantName || 'Unknown';
      if (!groups[key]) groups[key] = [];
      groups[key].push(contact);
    });

    Object.values(groups).forEach((group) => {
      group.sort((a, b) => a.firstName.localeCompare(b.firstName));
    });

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredContacts, listMode]);

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setViewMode('detail');
  };

  const handleAddNew = () => {
    setButtonPressed(true);
    setTimeout(() => {
      setButtonPressed(false);
      setEditingContact(null);
      setViewMode('form');
    }, 250);
  };

  const handleEdit = () => {
    if (!selectedContact) return;
    setEditingContact(selectedContact);
    setViewMode('form');
  };

  const handleSave = (contact: Contact) => {
    setContacts((current) => {
      const existing = current.find((item) => item.id === contact.id);
      if (existing) {
        return current.map((item) => (item.id === contact.id ? contact : item));
      }
      return [...current, contact];
    });
    setSelectedContact(contact);
    setViewMode('detail');
  };

  const handleBack = () => {
    setIsClosingDetail(true);
    setTimeout(() => {
      setIsClosingDetail(false);
      setViewMode('list');
      setSelectedContact(null);
    }, 200);
  };

  const handleCancelForm = () => {
    setIsClosingForm(true);
    setTimeout(() => {
      setIsClosingForm(false);
      if (editingContact) {
        setViewMode('detail');
      } else {
        setViewMode('list');
      }
      setEditingContact(null);
    }, 200);
  };

  const handleMigrationAccept = () => {
    setContacts((current) => [...current, ...legacyContacts]);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    localStorage.setItem(MIGRATION_KEY, 'true');
    setShowMigration(false);
  };

  const handleMigrationDecline = () => {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    localStorage.setItem(MIGRATION_KEY, 'true');
    setShowMigration(false);
  };

  const handleInstallPwa = async () => {
    if (!pwaPrompt) return;
    await pwaPrompt.prompt();
    await pwaPrompt.userChoice;
    setPwaPrompt(null);
  };

  const handleDismissPwa = () => {
    setPwaDismissed(true);
    localStorage.setItem(PWA_DISMISS_KEY, '1');
  };

  const showTabs = !searchTerm;
  const showPwaBanner = isMobile && pwaPrompt && !pwaDismissed;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#5a5a5a_0%,#2b2b2b_45%,#1a1a1a_100%)] px-0 py-0 text-[#2c2c2c] sm:px-4 sm:py-6">
      <div className="rolo-shell">
        <header className="rolo-header">
          <span className="font-rolodex text-[28px] tracking-[3px] text-[#e8e4dc] drop-shadow-[2px_2px_0_#222]">
            Rolo
          </span>
          <button type="button" className={`header-button ${buttonPressed ? 'pressed' : ''}`} onClick={handleAddNew}>
            NEW
          </button>
        </header>

        <div className="search-container">
          <div className="search-box">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by name or restaurant..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                if (event.target.value) setActiveTab(null);
              }}
            />
            {searchTerm ? (
              <button type="button" className="search-clear" onClick={() => setSearchTerm('')}>
                <XIcon />
              </button>
            ) : null}
          </div>

          <div className="mode-toggle">
            <button
              type="button"
              className={`mode-toggle-button ${listMode === 'name' ? 'active' : ''}`}
              onClick={() => {
                setListMode('name');
                setActiveTab(null);
              }}
            >
              Alphabetical
            </button>
            <button
              type="button"
              className={`mode-toggle-button ${listMode === 'restaurant' ? 'active' : ''}`}
              onClick={() => {
                setListMode('restaurant');
                setActiveTab(null);
              }}
            >
              By Location
            </button>
          </div>
        </div>

        {showTabs ? (
          <div className="tabs-container">
            {listMode === 'name'
              ? ALPHABET_TABS.map((tab, index) => (
                  <TabDivider
                    key={tab}
                    label={tab}
                    isActive={activeTab === tab}
                    onClick={() => setActiveTab(activeTab === tab ? null : tab)}
                    color={TAB_COLORS[index]}
                  />
                ))
              : restaurantTabs.map((tab, index) => (
                  <TabDivider
                    key={tab}
                    label={tab}
                    isActive={activeTab === tab}
                    onClick={() => setActiveTab(activeTab === tab ? null : tab)}
                    color={TAB_COLORS[index % TAB_COLORS.length]}
                  />
                ))}
          </div>
        ) : null}

        <div className="cards-area">
          {filteredContacts.length === 0 ? (
            <div className="empty-state">
              {searchTerm ? (
                <>
                  <h3>No matches found</h3>
                  <p>No contacts matching "{searchTerm}"</p>
                </>
              ) : (
                <>
                  <h3>Welcome to Rolo!</h3>
                  <p>Tap NEW to add your first contact.</p>
                </>
              )}
            </div>
          ) : (
            groupedContacts.map(([group, groupContacts]) => (
              <div key={group} className="card-group">
                <div className="card-group-label">{group}</div>
                <div className="space-y-2">
                  {groupContacts.map((contact) => (
                    <ContactCard key={contact.id} contact={contact} onClick={() => handleContactClick(contact)} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {showMigration ? (
          <div className="migration-banner">
            <div>
              We found {legacyContacts.length} contacts on this device. Import them to your account?
            </div>
            <div className="migration-actions">
              <button type="button" className="migration-button secondary" onClick={handleMigrationDecline}>
                Skip
              </button>
              <button type="button" className="migration-button" onClick={handleMigrationAccept}>
                Import
              </button>
            </div>
          </div>
        ) : null}

        {showPwaBanner ? (
          <div className="pwa-banner">
            <div className="pwa-title">Keep Rolo on your home screen</div>
            <div className="pwa-copy">Add a shortcut to your phone for quick access to your contacts.</div>
            <div className="pwa-actions">
              <button type="button" className="pwa-button secondary" onClick={handleDismissPwa}>
                Not now
              </button>
              <button type="button" className="pwa-button" onClick={handleInstallPwa}>
                Add to Home Screen
              </button>
            </div>
          </div>
        ) : null}

        {(viewMode === 'detail' || isClosingDetail) && selectedContact ? (
          <ContactDetail contact={selectedContact} onBack={handleBack} onEdit={handleEdit} isClosing={isClosingDetail} />
        ) : null}

        {(viewMode === 'form' || isClosingForm) && (
          <ContactForm contact={editingContact} onSave={handleSave} onCancel={handleCancelForm} isClosing={isClosingForm} />
        )}
      </div>
    </div>
  );
}
