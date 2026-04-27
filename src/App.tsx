/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cake, 
  FileUp, 
  Calendar, 
  CheckCircle2, 
  ArrowLeft, 
  Download, 
  RefreshCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { parseVCF } from './lib/vcard';
import { Birthday, generateICS, CalendarType } from './lib/calendar';

type State = 'UPLOAD' | 'OVERVIEW' | 'DONE';

export default function App() {
  const [step, setStep] = useState<State>('UPLOAD');
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [calendarType, setCalendarType] = useState<CalendarType>('recurring');
  const [targetYear, setTargetYear] = useState<number>(new Date().getFullYear());
  const [icsContent, setIcsContent] = useState<string>('');
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toolRef = useRef<HTMLDivElement>(null);

  const scrollToTool = () => {
    toolRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const parsed = parseVCF(content);
      if (parsed.length > 0) {
        setBirthdays(parsed);
        setStep('OVERVIEW');
        scrollToTool();
      } else {
        alert("No birthdays found or incorrect file format. Ensure cards have 'FN' and 'BDAY' fields.");
      }
    };
    reader.readAsText(file);
  };

  const handleGenerate = () => {
    try {
      const content = generateICS(birthdays, calendarType, targetYear);
      setIcsContent(content);
      setStep('DONE');
      scrollToTool();
    } catch (e) {
      alert("Error generating calendar. Please try again.");
    }
  };

  const downloadFile = () => {
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `birthdays-${calendarType}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setBirthdays([]);
    setStep('UPLOAD');
    setIcsContent('');
    scrollToTool();
  };

  const StepIndicator = ({ num, label, active, completed }: { num: number, label: string, active: boolean, completed: boolean }) => (
    <div className="flex items-center gap-2">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
        completed ? 'bg-[#CDEDA3] text-[#354E16]' : 
        active ? 'bg-[#4C662B] text-white' : 
        'bg-white border border-[#C5C8BA] text-[#44483D]'
      }`}>
        {completed ? '✓' : num}
      </div>
      <span className={`text-sm ${active ? 'font-bold' : 'font-medium transition-opacity opacity-70'}`}>{label}</span>
      {num < 3 && <div className="w-8 h-[1px] bg-[#C5C8BA] ml-2 hidden md:block" />}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAEF] font-sans text-[#1A1C16]">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-[#F9FAEF]/80 backdrop-blur-md border-b border-[#E1E4D5]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#4C662B] rounded-lg flex items-center justify-center text-white">
            <Cake size={18} />
          </div>
          <span className="font-bold text-lg tracking-tight">Birthdays</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium opacity-60">
          <a href="#how-it-works" className="hover:opacity-100">How it works</a>
          <a href="#features" className="hover:opacity-100">Features</a>
          <a href="#faq" className="hover:opacity-100">FAQ</a>
        </div>
        <button 
          onClick={scrollToTool}
          className="bg-[#4C662B] text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-[#4C662B]/20 hover:scale-105 active:scale-95 transition-all"
        >
          Try Now
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-8 flex flex-col items-center text-center overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#CDEDA3] rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute top-20 -right-20 w-80 h-80 bg-[#4C662B] rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl z-10"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#CDEDA3] text-[#354E16] text-[10px] font-bold uppercase tracking-widest mb-6 border border-[#CDEDA3]">
            vCard to iCalendar Converter
          </div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
            Never miss a <span className="text-[#4C662B]">meaningful</span> moment again.
          </h1>
          <p className="text-xl text-[#44483D] opacity-60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Beautifully simple conversion of your contact birthdays into smart, recurring calendar events. Automated age calculation included.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button 
              onClick={scrollToTool}
              className="px-8 py-4 bg-[#4C662B] text-white rounded-[20px] font-bold text-lg shadow-2xl shadow-[#4C662B]/20 hover:scale-105 transition-all"
            >
              Start Converting
            </button>
            <div className="flex items-center gap-2 text-sm text-[#44483D] opacity-40">
              <CheckCircle2 size={16} />
              No data uploaded
              <span className="mx-1">•</span>
              <CheckCircle2 size={16} />
              Free forever
            </div>
          </div>
        </motion.div>

        {/* Hero Image Mockup Area */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-20 w-full max-w-5xl relative z-10 px-4"
        >
          <div className="rounded-[40px] overflow-hidden shadow-3xl border-8 border-white/50 backdrop-blur-sm">
            <img 
              src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=2000" 
              alt="Professional celebration background" 
              className="w-full aspect-[16/9] object-cover contrast-110 saturate-[0.8]"
              referrerPolicy="no-referrer"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#F9FAEF] via-transparent opacity-60"></div>
          </div>
        </motion.div>
      </section>

      {/* Converter Section */}
      <section ref={toolRef} id="converter" className="py-24 px-8 flex justify-center bg-[#F5F5E9]/50">
        <div className="w-full max-w-[860px] min-h-[640px] bg-[#F5F5E9] rounded-[40px] shadow-2xl border border-[#E1E4D5] flex flex-col overflow-hidden relative">
          
          {/* Header / Stepper */}
          <header className="px-12 pt-10 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Birthdays</h2>
              <p className="text-sm text-[#44483D] opacity-70">Convert VCF to iCalendar</p>
            </div>
            <nav className="flex items-center gap-4">
              <StepIndicator num={1} label="Upload" active={step === 'UPLOAD'} completed={['OVERVIEW', 'DONE'].includes(step)} />
              <StepIndicator num={2} label="Overview" active={step === 'OVERVIEW'} completed={step === 'DONE'} />
              <StepIndicator num={3} label="Done" active={step === 'DONE'} completed={false} />
            </nav>
          </header>

          <main className="flex-1 px-12 pb-12 relative">
            <AnimatePresence mode="wait">
              {step === 'UPLOAD' && (
                <motion.div
                  key="step-upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full flex flex-col justify-center"
                >
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
                    onDragLeave={() => setIsHovering(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsHovering(false);
                      const file = e.dataTransfer.files[0];
                      if (file && file.name.endsWith('.vcf')) handleFileUpload(file);
                    }}
                    className={`
                      border-2 border-dashed rounded-[32px] p-24 flex flex-col items-center justify-center transition-all duration-300
                      ${isHovering ? 'border-[#4C662B] bg-[#CDEDA3]/30' : 'border-[#C5C8BA] bg-white/20'}
                    `}
                  >
                    <motion.div 
                      whileHover={{ rotate: 10 }}
                      className="bg-white p-6 rounded-3xl shadow-sm mb-6"
                    >
                      <FileUp size={48} className="text-[#4C662B]" />
                    </motion.div>
                    <h2 className="text-2xl font-semibold mb-2">Drop VCF File</h2>
                    <p className="text-sm text-[#44483D] opacity-60 mb-8 max-w-xs text-center">
                      Drag and drop your contact export file here, or click to browse.
                    </p>
                    
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept=".vcf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file);
                      }}
                    />
                    
                    <button 
                      id="select-vcf-btn"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#4C662B] text-white px-10 py-4 rounded-[20px] font-bold shadow-lg shadow-[#4C662B]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Select VCF File
                    </button>
                  </div>

                  <div className="mt-8 flex gap-4 text-xs text-[#44483D] leading-relaxed max-w-lg mx-auto bg-white/30 p-5 rounded-3xl border border-[#E1E4D5]">
                    <Info size={20} className="shrink-0 text-[#4C662B] opacity-60" />
                    <p className="opacity-70">
                      <span className="font-bold block mb-1 text-[10px] uppercase tracking-wider">Privacy First</span>
                      Your contact data is processed entirely on your device using local JavaScript. We never upload your VCF file to any server.
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 'OVERVIEW' && (
                <motion.div
                  key="step-overview"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-12 gap-8 h-full items-start"
                >
                  {/* Left: Controls */}
                  <aside className="col-span-12 md:col-span-5 flex flex-col gap-6">
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="p-6 bg-[#CDEDA3] rounded-[24px] flex items-center gap-4 border border-[#CDEDA3]"
                    >
                      <div className="text-4xl">🎉</div>
                      <div>
                        <div className="text-xl font-bold text-[#162000]">{birthdays.length} Birthdays Found</div>
                        <div className="text-sm text-[#354E16] opacity-80">Ready to generate your calendar</div>
                      </div>
                    </motion.div>

                    <div className="bg-white/50 border border-[#E1E4D5] rounded-[24px] p-6 space-y-6">
                      <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#44483D] block mb-3 opacity-60">Format Options</label>
                        <div className="flex p-1 bg-[#E1E4D5]/40 rounded-xl">
                          <button 
                            onClick={() => setCalendarType('with_age')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${calendarType === 'with_age' ? 'bg-white shadow-sm' : 'text-[#44483D] hover:opacity-70'}`}
                          >
                            With Age
                          </button>
                          <button 
                            onClick={() => setCalendarType('recurring')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${calendarType === 'recurring' ? 'bg-white shadow-sm' : 'text-[#44483D] hover:opacity-70'}`}
                          >
                            Recurring
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {calendarType === 'with_age' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                          >
                            <label className="text-[11px] font-bold uppercase tracking-wider text-[#44483D] block mb-3 opacity-60">Target Year</label>
                            <div className="relative">
                              <select 
                                value={targetYear}
                                onChange={(e) => setTargetYear(parseInt(e.target.value))}
                                className="w-full appearance-none bg-white border border-[#C5C8BA] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4C662B]/20"
                              >
                                {Array.from({ length: 11 }, (_, i) => 2026 + i).map(year => (
                                  <option key={year} value={year}>{year}</option>
                                ))}
                              </select>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <button 
                      id="generate-calendar-btn"
                      onClick={handleGenerate}
                      className="w-full bg-[#4C662B] text-white font-bold py-5 rounded-[24px] shadow-xl shadow-[#4C662B]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <Calendar size={20} />
                      Generate Calendar
                    </button>
                    
                    <button 
                      onClick={() => setStep('UPLOAD')}
                      className="text-xs font-bold text-[#44483D] uppercase tracking-widest opacity-40 hover:opacity-80 transition-opacity flex items-center justify-center gap-1"
                    >
                      <ArrowLeft size={12} />
                      Change File
                    </button>
                  </aside>

                  {/* Right: Preview List */}
                  <section className="col-span-12 md:col-span-7 flex flex-col h-full">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#44483D] mb-3 opacity-60">Preview (Top 5)</label>
                    <div className="bg-white/40 border border-[#E1E4D5] rounded-[32px] overflow-hidden flex flex-col flex-1 shadow-inner">
                      <div className="divide-y divide-[#E1E4D5] flex-1 overflow-y-auto px-6 custom-scrollbar">
                        {birthdays.slice(0, 5).map((b, i) => {
                          const age = b.originalYear ? (targetYear - b.originalYear) : 0;
                          const ageStr = (calendarType === 'with_age' && age > 0) ? `${age}${getOrdinal(age)} Birthday` : `Birthday`;
                          const initials = b.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                          
                          return (
                            <motion.div 
                              key={i} 
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: i * 0.05 }}
                              className="py-5 flex items-center justify-between group"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#DCE7C8] flex items-center justify-center font-bold text-[#4C662B] shadow-sm">
                                  {initials}
                                </div>
                                <div>
                                  <div className="text-sm font-bold text-[#1A1C16]">{b.name}</div>
                                  <div className="text-[11px] text-[#44483D] opacity-60">
                                    Born {b.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: b.originalYear ? 'numeric' : undefined })}
                                  </div>
                                </div>
                              </div>
                              <div className="text-[10px] font-bold uppercase tracking-tight px-3 py-1.5 bg-[#F5F5E9] rounded-full border border-[#E1E4D5] text-[#4C662B] group-hover:bg-[#CDEDA3] transition-colors">
                                {ageStr}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                      <div className="p-4 bg-[#F5F5E9]/80 border-t border-[#E1E4D5] text-center">
                        <p className="text-[10px] text-[#44483D] font-bold opacity-40 uppercase tracking-widest">
                          {birthdays.length > 5 ? `+ ${birthdays.length - 5} additional birthdays found` : 'All detected birthdays listed'}
                        </p>
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}

              {step === 'DONE' && (
                <motion.div
                  key="step-done"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                    className="w-32 h-32 bg-[#CDEDA3] text-[#4C662B] rounded-[48px] flex items-center justify-center mb-8 shadow-xl"
                  >
                    <CheckCircle2 size={64} strokeWidth={3} />
                  </motion.div>
                  
                  <h2 className="text-4xl font-bold mb-4 tracking-tight">Calendar is Ready</h2>
                  <p className="text-[#44483D] opacity-60 mb-10 max-w-sm mx-auto">
                    Your .ics file has been successfully generated. You can now import it into Apple Calendar, Google, or Outlook.
                  </p>

                  <div className="w-full max-w-sm space-y-4">
                    <button 
                      id="download-ics-btn"
                      onClick={downloadFile}
                      className="w-full bg-[#4C662B] text-white py-5 rounded-[24px] font-bold text-lg flex items-center justify-center gap-3 shadow-2xl shadow-[#4C662B]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      <Download size={24} />
                      Download .ics File
                    </button>
                    
                    <button 
                      id="convert-another-btn"
                      onClick={reset}
                      className="w-full bg-transparent text-[#44483D]/60 py-4 rounded-[24px] font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#E1E4D5]/30 transition-colors"
                    >
                      <RefreshCcw size={14} />
                      Process Another File
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold tracking-tight mb-4 text-[#1A1C16]">Three Simple Steps</h2>
          <p className="text-[#44483D] opacity-60 max-w-xl mx-auto">From contact list to calendar events in under 30 seconds.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            { num: "01", title: "Export Contacts", desc: "Download your contacts as a VCF file from your iPhone, Android, or Google Contacts." },
            { num: "02", title: "Drop & Detect", desc: "Drag your file here. We'll automatically identify every contact with a birthday field." },
            { num: "03", title: "Import Home", desc: "Download the generated ICS file and open it—your calendar app will handle the rest." }
          ].map((step, i) => (
            <div key={i} className="flex flex-col gap-6">
              <div className="text-6xl font-bold font-serif opacity-10 leading-none">{step.num}</div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-[#44483D] opacity-60 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-8 bg-[#CDEDA3]/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold tracking-tight mb-8 leading-[1.1]">Powerful features for a <br/><span className="text-[#4C662B]">clutter-free</span> brain.</h2>
              <div className="space-y-8">
                {[
                  { icon: <Sparkles />, title: "Smart Age Calculation", desc: "Optionally include the target age (e.g., 'John's 30th Birthday') directly in the event title." },
                  { icon: <RefreshCcw />, title: "Recurring Events", desc: "Generate truly annual events that sync across all your devices forever." },
                  { icon: <Info />, title: "Local Processing", desc: "Your contact details are sensitive. That's why everything happens in your browser." }
                ].map((feat, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#E1E4D5] flex items-center justify-center text-[#4C662B] shadow-sm">
                      {feat.icon}
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{feat.title}</h4>
                      <p className="text-sm text-[#44483D] opacity-60 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-[48px] p-12 shadow-2xl border border-[#E1E4D5]">
              <div className="aspect-square bg-[#F5F5E9] rounded-[32px] flex items-center justify-center relative overflow-hidden">
                <Cake size={120} className="text-[#4C662B] opacity-10 absolute -right-10 -bottom-10" />
                <div className="text-center z-10 px-8">
                  <div className="text-5xl font-bold font-serif mb-4 text-[#4C662B]">100%</div>
                  <div className="text-sm font-bold uppercase tracking-widest opacity-40">Private & Local</div>
                  <div className="h-[1px] w-12 bg-[#4C662B] mx-auto my-6 opacity-20"></div>
                  <p className="text-sm text-[#44483D] leading-relaxed">We utilize advanced client-side processing to ensure that not a single byte of your contact data ever touches our servers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-8 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 tracking-tight">Common Questions</h2>
        <div className="space-y-4">
          {[
            { q: "How do I get a VCF file?", a: "On iPhone: Go to Contacts > Select all > Export vCard. On Android/Google: Go to Google Contacts > Export > Choose vCard format." },
            { q: "Does this work with Google Calendar?", a: "Yes! Once you download the .ics file, you can import it into Google Calendar via Settings > Import & Export." },
            { q: "Is there a limit on contact numbers?", a: "No. Our browser-based parser can handle thousands of contacts in seconds." }
          ].map((item, i) => (
            <details key={i} className="group bg-white rounded-3xl border border-[#E1E4D5] overflow-hidden">
              <summary className="list-none p-8 flex justify-between items-center cursor-pointer font-bold hover:bg-[#F5F5E9]/50 transition-colors">
                {item.q}
                <div className="w-8 h-8 rounded-full bg-[#F5F5E9] flex items-center justify-center group-open:rotate-180 transition-transform">
                  <ArrowLeft size={16} className="-rotate-90" />
                </div>
              </summary>
              <div className="px-8 pb-8 text-[#44483D] opacity-70 leading-relaxed text-sm">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-[#E1E4D5]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#4C662B] rounded-lg flex items-center justify-center text-white">
                <Cake size={18} />
              </div>
              <span className="font-bold text-lg tracking-tight">Birthdays</span>
            </div>
            <p className="text-sm text-[#44483D] opacity-40 text-center md:text-left">
              The high-end way to manage <br/> what matters most.
            </p>
          </div>
          <div className="flex gap-12 text-xs font-bold uppercase tracking-widest text-[#44483D] opacity-40">
            <a href="#" className="hover:opacity-100">Privacy</a>
            <a href="#" className="hover:opacity-100">Contact</a>
            <a href="#" className="hover:opacity-100">GitHub</a>
          </div>
          <div className="text-[10px] text-[#44483D] opacity-20 font-bold uppercase tracking-[0.2em]">
            © 2026 BIRTHDAYS INC.
          </div>
        </div>
      </footer>
    </div>
  );
}


function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
