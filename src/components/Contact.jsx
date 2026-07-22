import React, { useState } from 'react';
import { personalData } from '../data/portfolioData';
import { Mail, Linkedin, Github, Copy, Check, Send, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';

/**
 * Web3Forms access key — enables real email delivery to your inbox.
 * Get a free key in ~30s at https://web3forms.com (enter your email, no signup).
 * You can hardcode it below OR set VITE_WEB3FORMS_ACCESS_KEY in Vercel env vars.
 * (Web3Forms access keys are safe to expose publicly — they only allow
 *  submissions to the single email address you registered.)
 */
const WEB3FORMS_ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '6a17ccce-ae4c-4387-8e66-58b56e871d83';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personalData.emails.primary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard unavailable — non-critical */
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    // Honeypot: if the hidden field is filled, it's a bot — silently succeed.
    if (formData.get('botcheck')) return;

    setStatus('submitting');
    setErrorMsg('');

    // Payload for Web3Forms.
    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `Portfolio Contact: ${formData.get('subject') || 'New message'}`,
      from_name: formData.get('name'),
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    // If no key configured, fall back to a mailto so the form never dead-ends.
    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      const body = `Name: ${payload.name}%0D%0AEmail: ${payload.email}%0D%0A%0D%0A${encodeURIComponent(
        formData.get('message') || ''
      )}`;
      window.location.href = `mailto:${personalData.emails.primary}?subject=${encodeURIComponent(
        payload.subject
      )}&body=${body}`;
      setStatus('success');
      form.reset();
      setTimeout(() => setStatus('idle'), 6000);
      return;
    }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        form.reset();
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
        setTimeout(() => setStatus('idle'), 6000);
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        'Something went wrong sending your message. Please email me directly at ' +
          personalData.emails.primary
      );
    }
  };

  const isSubmitting = status === 'submitting';

  return (
    <section id="contact" className="py-24 relative z-10" aria-labelledby="contact-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <SectionHeader
          icon={Mail}
          badge="Get in Touch"
          accent="cyan"
          title={
            <>
              <span id="contact-heading">
                Let's Build <span className="gradient-text">Together</span>
              </span>
            </>
          }
          description="Open for software engineering internships, full-stack development roles, and open-source collaborations."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Direct Contact Info & Copy Buttons */}
          <Reveal className="lg:col-span-5 space-y-6">

            {/* Primary Contact Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                <span>Contact Channels</span>
              </h3>

              {/* Copy Email Bar */}
              <div className="p-4 rounded-2xl bg-[#0a0d14] border border-slate-800 flex items-center justify-between gap-3">
                <div className="truncate">
                  <span className="block text-[10px] font-mono text-slate-500 uppercase">Primary Email</span>
                  <span className="text-xs sm:text-sm font-mono text-cyan-300 font-semibold truncate block">
                    {personalData.emails.primary}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label={copied ? 'Email address copied' : `Copy email address ${personalData.emails.primary}`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition-all shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              {/* Secondary Email */}
              <div className="p-4 rounded-2xl bg-[#0a0d14] border border-slate-800">
                <span className="block text-[10px] font-mono text-slate-500 uppercase">Secondary Email</span>
                <a
                  href={`mailto:${personalData.emails.secondary}`}
                  className="text-xs sm:text-sm font-mono text-purple-300 font-semibold hover:underline block mt-0.5"
                >
                  {personalData.emails.secondary}
                </a>
              </div>

              {/* Social Channels List */}
              <div className="space-y-3 pt-2">
                <a
                  href={personalData.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Connect with Qadees Asghar on LinkedIn (opens in a new tab)"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0a0d14]/80 border border-slate-800 hover:border-cyan-500/40 text-slate-200 hover:text-cyan-400 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-900 text-cyan-400">
                      <Linkedin className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="block text-xs sm:text-sm font-bold">LinkedIn</span>
                      <span className="block text-[10px] font-mono text-slate-500">Connect Professionally</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
                </a>

                <a
                  href={personalData.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="View Qadees Asghar's repositories on GitHub (opens in a new tab)"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0a0d14]/80 border border-slate-800 hover:border-purple-500/40 text-slate-200 hover:text-purple-300 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-900 text-purple-400">
                      <Github className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="block text-xs sm:text-sm font-bold">GitHub Repositories</span>
                      <span className="block text-[10px] font-mono text-slate-500">Explore Open Source</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-purple-300 group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
                </a>
              </div>
            </div>

          </Reveal>

          {/* Right Column: Direct Message Form */}
          <Reveal className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800/80" delay={120}>
            <h3 className="text-xl font-bold text-white mb-6">
              Send a Direct Message
            </h3>

            {status === 'success' ? (
              <div className="p-8 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-center space-y-3 animate-fadeIn" role="status" aria-live="polite">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" aria-hidden="true" />
                </div>
                <h4 className="text-lg font-bold text-white">Message Sent Successfully!</h4>
                <p className="text-slate-300 text-xs sm:text-sm">
                  Thank you for reaching out! Qadees will get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Honeypot spam trap — hidden from real users */}
                <input
                  type="checkbox"
                  name="botcheck"
                  className="hidden"
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Your Name</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="e.g. Alex Smith"
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0d14] border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Your Email</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="alex@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-[#0a0d14] border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Subject</label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    placeholder="Project Inquiry / Job Opportunity"
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0d14] border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Hello Qadees, I'd like to discuss a project..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0a0d14] border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs" role="alert" aria-live="assertive">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      <span>Sending…</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" aria-hidden="true" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </Reveal>

        </div>

        {/* Global Footer */}
        <footer className="mt-24 pt-8 border-t border-slate-800/80 text-center space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-400">
            <span>© {new Date().getFullYear()} Qadees Asghar</span>
            <span aria-hidden="true">•</span>
            <span>UET Lahore BS Software Engineering</span>
            <span aria-hidden="true">•</span>
            <span className="text-cyan-400">Full Stack Developer</span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            Built with React, Vite &amp; Tailwind CSS.
          </p>
        </footer>

      </div>
    </section>
  );
}
