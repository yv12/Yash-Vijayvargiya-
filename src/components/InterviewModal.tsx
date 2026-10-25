import { useState, useId, useEffect, useRef } from "react";
import { contact } from "../content";

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOPICS = [
  "Product Strategy & Execution",
  "AI & LLM Architecture",
  "Case Study Deep-Dive",
  "Culture & Leadership Fit",
  "Informal Coffee Chat",
];

const DURATIONS: Array<{ minutes: 15 | 30 | 45; label: string; tag: string }> = [
  { minutes: 15, label: "15 min", tag: "Quick Intro" },
  { minutes: 30, label: "30 min", tag: "Standard" },
  { minutes: 45, label: "45 min", tag: "Deep Dive" },
];

const HOURS = [
  "11 AM",
  "12 PM",
  "01 PM",
  "02 PM",
  "03 PM",
  "04 PM",
  "05 PM",
  "06 PM",
];

const MINUTES = ["00", "15", "30", "45"];

// Helper to generate the next 14 available days (starting tomorrow)
function getAvailableDates() {
  const dates = [];
  const today = new Date();

  for (let i = 1; i <= 14; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const dayOfWeek = d.toLocaleDateString("en-US", { weekday: "short" });
    const month = d.toLocaleDateString("en-US", { month: "short" });
    const dayNum = d.getDate();
    const fullDate = d.toISOString().split("T")[0];
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;

    dates.push({
      dateStr: fullDate,
      dayOfWeek,
      month,
      dayNum,
      isWeekend,
      label: `${dayOfWeek}, ${month} ${dayNum}`,
    });
  }
  return dates;
}

interface WheelColumnProps {
  label: string;
  items: string[];
  value: string;
  onChange: (val: string) => void;
}

function WheelColumn({ label, items, value, onChange }: WheelColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScroll = useRef(false);

  const selectedIndex = Math.max(0, items.indexOf(value));

  // Sync scroll position when value changes (using 36px item height)
  useEffect(() => {
    if (!containerRef.current) return;
    const targetScroll = selectedIndex * 36;
    if (Math.abs(containerRef.current.scrollTop - targetScroll) > 2) {
      isProgrammaticScroll.current = true;
      containerRef.current.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
      const timer = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [selectedIndex]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isProgrammaticScroll.current) return;
    const top = e.currentTarget.scrollTop;
    const index = Math.round(top / 36);
    const clampedIndex = Math.max(0, Math.min(items.length - 1, index));
    if (items[clampedIndex] && items[clampedIndex] !== value) {
      onChange(items[clampedIndex]);
    }
  };

  const selectPrevious = () => {
    if (selectedIndex > 0) {
      onChange(items[selectedIndex - 1]);
    }
  };

  const selectNext = () => {
    if (selectedIndex < items.length - 1) {
      onChange(items[selectedIndex + 1]);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="flex items-center justify-between w-full px-1.5 mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#86868B]">
          {label}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={selectPrevious}
            disabled={selectedIndex === 0}
            className="w-4 h-4 rounded flex items-center justify-center text-[9px] text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#E5E5EA] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label={`Previous ${label}`}
          >
            ▲
          </button>
          <button
            type="button"
            onClick={selectNext}
            disabled={selectedIndex === items.length - 1}
            className="w-4 h-4 rounded flex items-center justify-center text-[9px] text-[#86868B] hover:text-[#1D1D1F] hover:bg-[#E5E5EA] disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label={`Next ${label}`}
          >
            ▼
          </button>
        </div>
      </div>

      <div className="relative w-full h-[126px] bg-[#F5F5F7] rounded-xl overflow-hidden border border-[#E5E5EA]">
        {/* Apple Center Selection Lens */}
        <div 
          className="pointer-events-none absolute inset-x-1 top-[45px] h-[36px] rounded-lg bg-white shadow-sm border border-[#0071E3]/25 z-0" 
          aria-hidden="true"
        />

        {/* Top Fade Gradient */}
        <div 
          className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#F5F5F7] via-[#F5F5F7]/80 to-transparent z-10" 
          aria-hidden="true"
        />
        {/* Bottom Fade Gradient */}
        <div 
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#F5F5F7] via-[#F5F5F7]/80 to-transparent z-10" 
          aria-hidden="true"
        />

        {/* Scroll Container */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="relative z-10 h-full overflow-y-auto snap-y snap-mandatory pt-[45px] pb-[45px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          tabIndex={0}
          role="listbox"
          aria-label={label}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              selectPrevious();
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              selectNext();
            }
          }}
        >
          {items.map((item, idx) => {
            const isSelected = item === value;
            const distance = Math.abs(idx - selectedIndex);

            return (
              <div
                key={item}
                onClick={() => {
                  onChange(item);
                  if (containerRef.current) {
                    containerRef.current.scrollTo({
                      top: idx * 36,
                      behavior: "smooth",
                    });
                  }
                }}
                role="option"
                aria-selected={isSelected}
                className={`h-[36px] snap-center flex items-center justify-center cursor-pointer select-none transition-all duration-150 ${
                  isSelected
                    ? "text-[#0071E3] font-display font-bold text-[15px] scale-105"
                    : distance === 1
                    ? "text-[#1D1D1F]/70 font-medium text-[12px]"
                    : "text-[#86868B]/40 font-normal text-[11px]"
                }`}
              >
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function InterviewModal({ isOpen, onClose }: InterviewModalProps) {
  const dates = getAvailableDates();
  const [duration, setDuration] = useState<15 | 30 | 45>(30);
  const [selectedDate, setSelectedDate] = useState(dates[0].dateStr);
  const [selectedHour, setSelectedHour] = useState("11 AM");
  const [selectedMinute, setSelectedMinute] = useState("30");
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [userTimeZone, setUserTimeZone] = useState("Local Time");

  const titleId = useId();

  // Combined selected time string in "HH:MM AM/PM" format
  const selectedTime = `${selectedHour.slice(0, 2)}:${selectedMinute} ${selectedHour.slice(3)}`;

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) setUserTimeZone(tz);
    } catch {
      // Fallback
    }
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Format UTC strings for Google Calendar & iCal
  const getEventTimestamps = () => {
    const [year, month, day] = selectedDate.split("-").map(Number);
    const [timeStr, modifier] = selectedTime.split(" ");
    let [hours, minutes] = timeStr.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const startDate = new Date(year, month - 1, day, hours, minutes);
    const endDate = new Date(startDate.getTime() + duration * 60 * 1000);

    const formatGCal = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const formatDisplayTime = (d: Date) => {
      let h = d.getHours();
      const m = d.getMinutes();
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12;
      if (h === 0) h = 12;
      const hStr = h < 10 ? `0${h}` : `${h}`;
      const mStr = m < 10 ? `0${m}` : `${m}`;
      return `${hStr}:${mStr} ${ampm}`;
    };

    return {
      startGCal: formatGCal(startDate),
      endGCal: formatGCal(endDate),
      startDate,
      endDate,
      formattedEnd: formatDisplayTime(endDate),
    };
  };

  const selectedDateObj = dates.find((d) => d.dateStr === selectedDate) || dates[0];
  const { formattedEnd } = getEventTimestamps();

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitted(true);
  };

  const getGoogleCalendarUrl = () => {
    const { startGCal, endGCal } = getEventTimestamps();
    const title = `Product Manager Interview: ${name} (${company || "Team"}) & Yash Vijayvargiya`;
    const details = `Interview Discussion with Yash Vijayvargiya\n\nTopic: ${selectedTopic}\nDuration: ${duration} minutes\nInterviewer: ${name}\nEmail: ${email}\nCompany: ${company || "Not specified"}\n\nNotes from Interviewer:\n${notes || "None provided"}\n\nDirect contact: yashvijay12@hotmail.com | https://linkedin.com/in/yv12`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${startGCal}/${endGCal}&details=${encodeURIComponent(
      details
    )}&add=${encodeURIComponent(email)},yashvijay12@hotmail.com`;
  };

  const handleDownloadIcs = () => {
    const { startGCal, endGCal } = getEventTimestamps();
    const title = `Product Manager Interview: ${name} & Yash Vijayvargiya`;
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Yash Vijayvargiya//Interview Booking//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:REQUEST",
      "BEGIN:VEVENT",
      `UID:interview-${Date.now()}@yashvijay.com`,
      `DTSTAMP:${startGCal}`,
      `DTSTART:${startGCal}`,
      `DTEND:${endGCal}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:Interview topic: ${selectedTopic}\\nDuration: ${duration} minutes\\nInterviewer: ${name} (${email})\\nCompany: ${company || "N/A"}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `interview-yash-vijayvargiya.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const whatsappNumber = (import.meta.env.VITE_WHATSAPP_PHONE || contact.whatsappPhone || "91XXXXXXXXXX").replace(/[^0-9]/g, "");
  const whatsappMessage = contact.whatsappMessage || "Hi Yash, I came across your portfolio and would love to chat about a product opportunity / project.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white border border-[#E5E5EA] rounded-[24px] sm:rounded-[28px] shadow-2xl overflow-hidden flex flex-col max-h-[96vh] md:max-h-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-[#F5F5F7] bg-white">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center font-bold text-[13px]">
              📅
            </span>
            <div>
              <h3 id={titleId} className="font-display text-[16px] sm:text-[18px] font-semibold text-[#1D1D1F] leading-tight">
                Schedule an Interview
              </h3>
              <p className="font-body text-[11px] text-[#86868B]">
                {duration}-minute discussion · {userTimeZone}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#1D1D1F] flex items-center justify-center text-[13px] font-semibold transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* ── Direct WhatsApp Action (Zero Friction, Instant Push Notification) ── */}
        <div className="bg-[#F0FDF4] border-b border-[#BBF7D0] px-5 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.077-2.029-.475-1.636-.679-2.684-2.339-2.766-2.449-.081-.11-.663-.883-.663-1.683s.42-.1.192.571-1.396c.153-.162.334-.203.447-.203.113 0 .227.002.326.007.104.005.244-.04.382.292.144.346.49 1.196.533 1.284.043.088.072.19.014.305-.058.115-.087.187-.174.289-.087.102-.183.228-.261.306-.088.088-.179.183-.077.359.102.175.454.749.974 1.213.67.597 1.235.782 1.41.87.175.088.277.073.38-.044.103-.117.438-.511.555-.686.117-.175.234-.146.394-.088.16.058 1.017.479 1.192.566.175.087.292.131.335.204.043.073.043.424-.101.829z"/>
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.981-1.396A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.05c-1.628 0-3.14-.492-4.407-1.336l-.316-.211-2.962.83.844-2.885-.23-.33A7.994 7.994 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8.05-8 8.05z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-[13px] font-bold text-[#1D1D1F]">
                  Direct WhatsApp Action
                </span>
                <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#25D366]/20 text-[#15803D]">
                  Zero Friction · Instant Push
                </span>
              </div>
              <p className="font-body text-[11px] text-[#475569]">
                Skip calendar selection · Opens directly on Yash's phone with pre-filled message
              </p>
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-1.5 font-display font-semibold text-[12px] text-white bg-[#15803D] hover:bg-[#166534] px-3.5 py-1.5 rounded-xl shadow-xs hover:shadow-sm transition-all"
          >
            <span>Message on WhatsApp</span>
          </a>
        </div>

        {/* Modal Body - 2 Column Dashboard Layout (Zero scroll on Desktop) */}
        <div className="p-4 sm:p-5 overflow-y-auto md:overflow-hidden">
          {!submitted ? (
            <form onSubmit={handleBook} className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-start">
              {/* LEFT COLUMN: Time, Date & Duration Selection */}
              <div className="space-y-3.5">
                {/* 1. Meeting Duration */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-display text-[12px] font-semibold text-[#1D1D1F]">
                      1. Duration
                    </label>
                    <span className="text-[10px] text-[#86868B] font-body">Select meeting length</span>
                  </div>
                  <div className="flex bg-[#F5F5F7] p-1 rounded-xl border border-[#E5E5EA]">
                    {DURATIONS.map((d) => {
                      const isSelected = duration === d.minutes;
                      return (
                        <button
                          key={d.minutes}
                          type="button"
                          onClick={() => setDuration(d.minutes)}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? "bg-white text-[#0071E3] font-bold shadow-sm"
                              : "text-[#1D1D1F] hover:text-[#0071E3] font-medium"
                          }`}
                        >
                          <span className="font-display text-[12px]">{d.label}</span>
                          <span className={`text-[10px] hidden sm:inline ${isSelected ? "text-[#0071E3]/80" : "text-[#86868B]"}`}>
                            · {d.tag}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Choose Date */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-display text-[12px] font-semibold text-[#1D1D1F]">
                      2. Choose Date
                    </label>
                    <span className="text-[10px] text-[#86868B] font-body">Next 14 Days</span>
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-0.5">
                    {dates.map((d) => {
                      const isSelected = selectedDate === d.dateStr;
                      return (
                        <button
                          key={d.dateStr}
                          type="button"
                          onClick={() => setSelectedDate(d.dateStr)}
                          className={`flex-shrink-0 flex flex-col items-center justify-center w-12 sm:w-[50px] py-1.5 rounded-xl border transition-all ${
                            isSelected
                              ? "bg-[#0071E3] text-white border-[#0071E3] shadow-sm scale-[1.02]"
                              : "bg-white text-[#1D1D1F] border-[#E5E5EA] hover:border-[#86868B] hover:bg-[#F5F5F7]"
                          }`}
                        >
                          <span className={`text-[9px] uppercase font-semibold leading-tight ${isSelected ? "text-white/80" : "text-[#86868B]"}`}>
                            {d.dayOfWeek}
                          </span>
                          <span className="text-[13px] font-display font-bold leading-tight mt-0.5">
                            {d.dayNum}
                          </span>
                          <span className={`text-[9px] leading-tight ${isSelected ? "text-white/80" : "text-[#86868B]"}`}>
                            {d.month}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. iOS Wheel Picker (11:00 AM - 06:00 PM) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-display text-[12px] font-semibold text-[#1D1D1F]">
                      3. Select Time ({userTimeZone})
                    </label>
                    <span className="text-[10px] text-[#86868B] font-body">11:00 AM – 06:00 PM</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <WheelColumn
                      label="Hour"
                      items={HOURS}
                      value={selectedHour}
                      onChange={setSelectedHour}
                    />

                    <div className="pt-4 font-display font-bold text-[18px] text-[#86868B]">
                      :
                    </div>

                    <WheelColumn
                      label="Minute"
                      items={MINUTES}
                      value={selectedMinute}
                      onChange={setSelectedMinute}
                    />
                  </div>

                  {/* Slot preview feedback pill */}
                  <div className="mt-2 flex items-center justify-between px-3 py-1.5 bg-[#F5F5F7] rounded-lg border border-[#E5E5EA] text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[#86868B] font-body">Window:</span>
                      <span className="font-display font-semibold text-[#1D1D1F]">
                        {selectedTime} – {formattedEnd}
                      </span>
                    </div>
                    <span className="font-display font-medium text-[#0071E3] bg-[#0071E3]/10 px-1.5 py-0.5 rounded text-[10px]">
                      {duration} min call
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Topic, Contact Info & Submission */}
              <div className="space-y-3.5 flex flex-col justify-between h-full">
                {/* 4. Select Topic */}
                <div>
                  <label className="block font-display text-[12px] font-semibold text-[#1D1D1F] mb-1.5">
                    4. Discussion Topic
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TOPICS.map((t) => {
                      const isSelected = selectedTopic === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTopic(t)}
                          className={`text-[11px] font-display px-2.5 py-1 rounded-full transition-all border ${
                            isSelected
                              ? "bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-sm font-medium"
                              : "bg-[#F5F5F7] text-[#1D1D1F] border-[#E5E5EA] hover:border-[#86868B]"
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Contact Details */}
                <div className="space-y-2.5 pt-2 border-t border-[#F5F5F7]">
                  <label className="block font-display text-[12px] font-semibold text-[#1D1D1F]">
                    5. Your Details
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-[#86868B] mb-0.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Sarah Connor"
                        className="w-full bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl px-3 py-1.5 text-[12px] font-body text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-[#86868B] mb-0.5">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sarah@company.com"
                        className="w-full bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl px-3 py-1.5 text-[12px] font-body text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-medium text-[#86868B] mb-0.5">
                        Company (Optional)
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Acme Ventures"
                        className="w-full bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl px-3 py-1.5 text-[12px] font-body text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] focus:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-[#86868B] mb-0.5">
                        Notes / Agenda (Optional)
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Google Meet or agenda"
                        className="w-full bg-[#F5F5F7] border border-[#E5E5EA] rounded-xl px-3 py-1.5 text-[12px] font-body text-[#1D1D1F] focus:outline-none focus:border-[#0071E3] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-display font-semibold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-[13px]"
                  >
                    <span>Confirm Slot: {selectedDateObj.label} @ {selectedTime} ({duration}m)</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Success Confirmation Screen (Compact & Single-View) */
            <div className="py-4 text-center flex flex-col items-center animate-fade-in space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-[22px]">
                ✓
              </div>
              <div>
                <h4 className="text-[18px] font-display font-bold text-[#1D1D1F]">
                  Interview Slot Selected!
                </h4>
                <p className="text-[13px] text-[#86868B] font-body mt-0.5">
                  {selectedDateObj.label} at {selectedTime} – {formattedEnd} ({userTimeZone})
                </p>
                <p className="text-[12px] text-[#1D1D1F] font-medium mt-0.5">
                  Topic: {selectedTopic}
                </p>
              </div>

              <div className="w-full max-w-md bg-[#F5F5F7] rounded-xl p-3 border border-[#E5E5EA] text-left text-[12px] space-y-1 font-body">
                <p><span className="text-[#86868B]">Participant:</span> {name} &lt;{email}&gt;</p>
                {company && <p><span className="text-[#86868B]">Company:</span> {company}</p>}
                <p><span className="text-[#86868B]">Duration:</span> {duration} minutes</p>
                <p><span className="text-[#86868B]">Host:</span> Yash Vijayvargiya (yashvijay12@hotmail.com)</p>
              </div>

              {/* Calendar Export CTAs */}
              <div className="w-full max-w-md space-y-2 pt-1">
                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-display font-semibold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-[12px]"
                >
                  <span>Add to Google Calendar</span>
                </a>

                <button
                  type="button"
                  onClick={handleDownloadIcs}
                  className="w-full bg-white hover:bg-[#F5F5F7] text-[#1D1D1F] border border-[#E5E5EA] font-display font-medium py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-[12px] cursor-pointer"
                >
                  <span>Download .ics Calendar Invite (Apple / Outlook)</span>
                  <span>📥</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#15803D] hover:bg-[#166534] text-white font-display font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 text-[12px]"
                >
                  <span>Ping Yash on WhatsApp for Instant Confirmation</span>
                </a>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="text-[12px] font-display font-medium text-[#86868B] hover:text-[#1D1D1F] transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
