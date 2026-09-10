"use client";

import { useState, useRef, useEffect } from "react";

export interface BranchContactInfo {
  id: string;
  name: string;
  address: string;
  city?: string | null;
  phone?: string | null;
  operating_hours?: string | null;
}

interface ContactViewProps {
  branches: BranchContactInfo[];
}

export function ContactView({ branches }: ContactViewProps) {
  // Target Branch for Message
  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    branches[0]?.id || ""
  );
  const [isMessageBranchOpen, setIsMessageBranchOpen] = useState(false);
  const messageDropdownRef = useRef<HTMLDivElement>(null);

  // Visited Branch for Ratings & Feedback
  const [feedbackBranchId, setFeedbackBranchId] = useState<string>(
    branches[0]?.id || ""
  );
  const [isFeedbackBranchOpen, setIsFeedbackBranchOpen] = useState(false);
  const feedbackDropdownRef = useRef<HTMLDivElement>(null);

  // Ratings & Feedback State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        messageDropdownRef.current &&
        !messageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMessageBranchOpen(false);
      }
      if (
        feedbackDropdownRef.current &&
        !feedbackDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFeedbackBranchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dynamically filter active branch info for the left display card
  const selectedBranch =
    branches.find((b) => b.id === selectedBranchId) || branches[0];

  const feedbackBranch =
    branches.find((b) => b.id === feedbackBranchId) || branches[0];

  const handleFeedbackSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFeedbackSubmitted(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT COLUMN: Online Connect, Socials & Dynamic Branch Card */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
        {/* Online Connect & Socials Card */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-5">
          <div>
            <h2 className="text-base font-extrabold text-navy-900 tracking-tight">
              Online Connect & Socials
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Reach us via email or follow our official social media channels.
            </p>
          </div>

          <div className="space-y-3 text-xs font-medium">
            {/* Email */}
            <a
              href="mailto:contactus@furbabies.ph"
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-orange-50/60 border border-slate-200/80 hover:border-orange-200 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Email
                </span>
                <span className="text-xs font-bold text-navy-900 group-hover:text-orange-600 transition-colors truncate block">
                  contactus@furbabies.ph
                </span>
              </div>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/furbabiesph"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-orange-50/60 border border-slate-200/80 hover:border-orange-200 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Facebook
                </span>
                <span className="text-xs font-bold text-navy-900 group-hover:text-orange-600 transition-colors truncate block">
                  facebook.com/furbabiesph
                </span>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/furbabiesnfriends/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 hover:bg-orange-50/60 border border-slate-200/80 hover:border-orange-200 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Instagram
                </span>
                <span className="text-xs font-bold text-navy-900 group-hover:text-orange-600 transition-colors truncate block">
                  instagram.com/furbabiesnfriends
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* Selected Branch Details Card */}
        <div className="bg-slate-900 text-white p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-400 block">
                Selected Branch
              </span>
              <h3 className="text-sm font-extrabold text-white mt-0.5">
                {selectedBranch ? selectedBranch.name : "Clinic Branch"}
              </h3>
            </div>
            {selectedBranch?.city && (
              <span className="text-[10px] font-extrabold text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700 shrink-0">
                📍 {selectedBranch.city}
              </span>
            )}
          </div>

          {selectedBranch && (
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Branch Address
                </span>
                <p className="text-slate-200 font-medium leading-relaxed bg-slate-950/50 p-3 rounded-2xl border border-slate-800/80">
                  {selectedBranch.address}
                </p>
              </div>

              {selectedBranch.phone && (
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Contact Phone
                  </span>
                  <p className="text-orange-400 font-bold bg-slate-950/50 p-3 rounded-2xl border border-slate-800/80 flex items-center gap-2">
                    <span>📞</span>
                    <span>{selectedBranch.phone}</span>
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="pt-3 border-t border-slate-800 space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-400 block">
              Operating Hours
            </span>
            <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/80 text-xs space-y-1 font-medium">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Regular Schedule:</span>
                <span className="font-bold text-white">
                  {selectedBranch?.operating_hours || "Mon - Sat: 8:00 AM - 6:00 PM"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Sunday & Holidays:</span>
                <span className="font-bold text-orange-400">By Appointment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Send Us a Message & Ratings / Feedback Forms */}
      <div className="lg:col-span-7 space-y-6">
        {/* 1. SEND US A MESSAGE FORM */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-5">
          <div>
            <h2 className="text-base font-extrabold text-navy-900 tracking-tight">
              Send Us a Message
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill out the form below and our staff will respond as soon as possible.
            </p>
          </div>

          <form className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label htmlFor="fullName" className="block text-xs font-bold text-slate-700">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  placeholder="e.g. Maria Santos"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="block text-xs font-bold text-slate-700">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label htmlFor="phone" className="block text-xs font-bold text-slate-700">
                  Mobile Contact Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  placeholder="e.g. 09171234567"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* CUSTOM LISTBOX FOR TARGET BRANCH */}
              <div className="space-y-1" ref={messageDropdownRef}>
                <label className="block text-xs font-bold text-slate-700">
                  Target Branch Location *
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsMessageBranchOpen(!isMessageBranchOpen)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center justify-between transition-all cursor-pointer text-left"
                  >
                    <span className="truncate">
                      {selectedBranch
                        ? selectedBranch.name
                        : "Select a clinic branch..."}
                    </span>
                    <svg
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isMessageBranchOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isMessageBranchOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 overflow-hidden max-h-56 overflow-y-auto animate-in fade-in duration-150">
                      {branches.map((b) => {
                        const isSelected = b.id === selectedBranchId;
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => {
                              setSelectedBranchId(b.id);
                              setIsMessageBranchOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-xs font-medium flex items-center justify-between transition-colors cursor-pointer border-b border-slate-100 last:border-0 ${
                              isSelected
                                ? "bg-orange-50/80 text-orange-600 font-bold"
                                : "text-navy-900 hover:bg-slate-50"
                            }`}
                          >
                            <span className="font-bold truncate">{b.name}</span>
                            {isSelected && (
                              <span className="text-orange-600 text-xs font-bold">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="subject" className="block text-xs font-bold text-slate-700">
                Subject / Concern *
              </label>
              <input
                id="subject"
                type="text"
                required
                placeholder="e.g. Appointment Inquiry, Grooming Slots, Vaccination"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className="block text-xs font-bold text-slate-700">
                Your Message *
              </label>
              <textarea
                id="message"
                required
                rows={3}
                placeholder="Write your detailed inquiry here..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Send Message</span>
              <span>➔</span>
            </button>
          </form>
        </div>

        {/* 2. RATINGS & FEEDBACK FORM */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-2xs space-y-5">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200 w-fit mb-1.5">
              <span>⭐</span>
              <span>Share Your Experience</span>
            </div>
            <h2 className="text-base font-extrabold text-navy-900 tracking-tight">
              Ratings & Feedback
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Help us improve our veterinary care and service quality by rating your visit.
            </p>
          </div>

          {isFeedbackSubmitted ? (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <span className="text-2xl">🎉</span>
              <h3 className="text-xs font-extrabold text-emerald-900">
                Thank You for Your Feedback!
              </h3>
              <p className="text-[11px] text-emerald-700 max-w-md mx-auto">
                Your review has been successfully submitted. We appreciate your time in helping FurBabies & Friends deliver the best pet healthcare.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsFeedbackSubmitted(false);
                  setFeedbackComment("");
                }}
                className="mt-1 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Submit Another Feedback
              </button>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              {/* Star Rating Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Overall Service Rating *
                </label>
                <div className="flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 w-fit">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const activeStar = hoverRating || rating;
                    const isFilled = star <= activeStar;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                        aria-label={`Rate ${star} out of 5 stars`}
                      >
                        {isFilled ? "⭐" : "☆"}
                      </button>
                    );
                  })}
                  <span className="text-xs font-extrabold text-navy-900 ml-2">
                    {rating === 5
                      ? "5 - Excellent"
                      : rating === 4
                      ? "4 - Good"
                      : rating === 3
                      ? "3 - Average"
                      : rating === 2
                      ? "2 - Poor"
                      : "1 - Terrible"}
                  </span>
                </div>
              </div>

              {/* CUSTOM LISTBOX FOR VISITED BRANCH (NO OS NATIVE DROPDOWN) */}
              <div className="space-y-1" ref={feedbackDropdownRef}>
                <label className="block text-xs font-bold text-slate-700">
                  Visited Branch *
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsFeedbackBranchOpen(!isFeedbackBranchOpen)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center justify-between transition-all cursor-pointer text-left"
                  >
                    <span className="truncate">
                      {feedbackBranch
                        ? feedbackBranch.name
                        : "Select visited branch..."}
                    </span>
                    <svg
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isFeedbackBranchOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isFeedbackBranchOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-50 overflow-hidden max-h-56 overflow-y-auto animate-in fade-in duration-150">
                      {branches.map((b) => {
                        const isSelected = b.id === feedbackBranchId;
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => {
                              setFeedbackBranchId(b.id);
                              setIsFeedbackBranchOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-xs font-medium flex items-center justify-between transition-colors cursor-pointer border-b border-slate-100 last:border-0 ${
                              isSelected
                                ? "bg-orange-50/80 text-orange-600 font-bold"
                                : "text-navy-900 hover:bg-slate-50"
                            }`}
                          >
                            <span className="font-bold truncate">{b.name}</span>
                            {isSelected && (
                              <span className="text-orange-600 text-xs font-bold">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Feedback Comment Textarea */}
              <div className="space-y-1">
                <label htmlFor="feedbackComment" className="block text-xs font-bold text-slate-700">
                  Feedback Comment *
                </label>
                <textarea
                  id="feedbackComment"
                  required
                  rows={3}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Share your detailed feedback regarding our veterinary care, staff, facilities, or grooming..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Submit Feedback & Rating</span>
                <span>⭐</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}