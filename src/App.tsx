import { useState, type FormEvent } from 'react';
import { Heart, Calendar, MapPin, User, Save, Upload, CheckCircle, X, Loader2, Info } from 'lucide-react';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwHMml43PJZUSjMlMWMfRhf_XMCMKiomEZy64K_5poSi6w_35a2i5BSdX8OTl24rBQ0/exec';

const DRIVE_LINK =
  'https://drive.google.com/drive/folders/1N9XgAOuuxexa5MPWDWbLolMIpgbT4rfk?usp=drive_link';

interface Rekapan {
  pendampingan: string;
  tanggal: string;
  lokasi: string;
  pendamping: string;
}

const emptyForm: Rekapan = {
  pendampingan: '',
  tanggal: '',
  lokasi: '',
  pendamping: '',
};

export default function App() {
  const [form, setForm] = useState<Rekapan>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (field: keyof Rekapan, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.pendampingan || !form.tanggal || !form.lokasi || !form.pendamping) {
      showToast('error', 'Mohon lengkapi semua kolom terlebih dahulu.');
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          pendampingan: form.pendampingan,
          tanggal: form.tanggal,
          lokasi: form.lokasi,
          pendamping: form.pendamping,
        }),
      });
      if (!response.ok && response.type !== 'opaque') {
        throw new Error('Request failed');
      }
      showToast('success', 'Rekapan berhasil disimpan dan dikirim ke pengelola.');
      setForm(emptyForm);
    } catch {
      showToast('error', 'Gagal menyimpan. Periksa koneksi Anda.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadDrive = () => {
    window.open(DRIVE_LINK, '_blank', 'noopener,noreferrer');
    showToast('success', 'Folder Google Drive berhasil dibuka. Silakan unggah file rekapan ke folder Dampingcare.');
  };

  return (
    <div className="min-h-screen bg-damping-bg flex justify-center">
      <div className="w-full max-w-[430px] min-h-screen flex flex-col relative">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-black/5">
          <div className="px-5 py-3.5 flex items-center gap-3">
            <img src="/logo.svg" alt="Dampingcare" className="w-11 h-11 shrink-0" />
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-tight truncate">Dampingcare</h1>
              <p className="text-xs text-black/50 leading-tight">Rekap Pendampingan</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pt-5 pb-8">
          <div className="mb-5 animate-fade-in-up">
            <h2 className="text-2xl font-bold leading-tight">Rekap Pendampingan</h2>
            <p className="text-sm text-black/50 mt-1">Catat kegiatan pendampingan Anda dengan mudah.</p>
          </div>

          {/* Form Card */}
          <form
            onSubmit={handleSave}
            className="bg-white rounded-3xl shadow-soft p-5 space-y-5 animate-fade-in-up"
            style={{ animationDelay: '0.05s' }}
          >
            {/* Pendampingan */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <Heart className="w-4 h-4 text-damping-pink" strokeWidth={2} />
                Pendampingan Apa?
              </label>
              <input
                type="text"
                value={form.pendampingan}
                onChange={(e) => handleChange('pendampingan', e.target.value)}
                placeholder="Contoh: Rawat Inap, Rawat Jalan, MCU, Antar Jemput"
                className="w-full px-4 py-3.5 rounded-2xl bg-damping-bg/40 border border-transparent focus:border-damping-pink focus:bg-white focus:outline-none transition-all duration-200 text-sm placeholder:text-black/35"
              />
            </div>

            {/* Tanggal */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <Calendar className="w-4 h-4 text-damping-pink" strokeWidth={2} />
                Tanggal
              </label>
              <input
                type="date"
                value={form.tanggal}
                onChange={(e) => handleChange('tanggal', e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-damping-bg/40 border border-transparent focus:border-damping-pink focus:bg-white focus:outline-none transition-all duration-200 text-sm"
              />
            </div>

            {/* Lokasi */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <MapPin className="w-4 h-4 text-damping-pink" strokeWidth={2} />
                Di Mana?
              </label>
              <input
                type="text"
                value={form.lokasi}
                onChange={(e) => handleChange('lokasi', e.target.value)}
                placeholder="Contoh: RSUD Dr. Moewardi"
                className="w-full px-4 py-3.5 rounded-2xl bg-damping-bg/40 border border-transparent focus:border-damping-pink focus:bg-white focus:outline-none transition-all duration-200 text-sm placeholder:text-black/35"
              />
            </div>

            {/* Pendamping */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold">
                <User className="w-4 h-4 text-damping-pink" strokeWidth={2} />
                Nama Pendamping
              </label>
              <input
                type="text"
                value={form.pendamping}
                onChange={(e) => handleChange('pendamping', e.target.value)}
                placeholder="Masukkan nama pendamping"
                className="w-full px-4 py-3.5 rounded-2xl bg-damping-bg/40 border border-transparent focus:border-damping-pink focus:bg-white focus:outline-none transition-all duration-200 text-sm placeholder:text-black/35"
              />
            </div>

            {/* Info note */}
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-2xl bg-damping-bg/50">
              <Info className="w-4 h-4 text-damping-pink shrink-0 mt-0.5" strokeWidth={2} />
              <p className="text-xs text-black/60 leading-relaxed">
                Rekapan akan disimpan ke Google Sheet dan dikirim ke pengelola Dampingcare.
              </p>
            </div>

            {/* Buttons */}
            <div className="pt-1 space-y-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-4 rounded-full bg-damping-pink text-white font-semibold text-sm shadow-pink active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" strokeWidth={2} />
                    Simpan Rekapan
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleUploadDrive}
                className="w-full py-4 rounded-full bg-white text-damping-pink font-semibold text-sm border-2 border-damping-pink active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 hover:bg-damping-pink/5"
              >
                <Upload className="w-5 h-5" strokeWidth={2} />
                Upload ke Google Drive
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-black/40 mt-6">
            Dampingcare &copy; {new Date().getFullYear()}
          </p>
        </main>

        {/* Toast Notification */}
        {toast && (
          <div className="fixed inset-x-0 top-20 z-50 px-4 flex justify-center animate-slide-in-top">
            <div
              className={`w-full max-w-[398px] rounded-2xl shadow-soft-lg p-4 flex items-start gap-3 animate-scale-in ${
                toast.type === 'success' ? 'bg-white' : 'bg-white border border-red-200'
              }`}
            >
              <div
                className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                  toast.type === 'success' ? 'bg-damping-pink/10' : 'bg-red-100'
                }`}
              >
                {toast.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-damping-pink" strokeWidth={2} />
                ) : (
                  <X className="w-5 h-5 text-red-500" strokeWidth={2} />
                )}
              </div>
              <p className="text-sm text-black/80 pt-1.5 leading-snug">{toast.message}</p>
              <button
                onClick={() => setToast(null)}
                className="ml-auto shrink-0 p-1 -mt-0.5 text-black/30 hover:text-black/60 transition-colors"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
