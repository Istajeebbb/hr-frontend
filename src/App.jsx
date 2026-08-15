import { useState, useEffect } from 'react';
import HrDashboard from './components/HrDashboard';
import HrRekapitulasi from './components/HrRekapitulasi';

export default function App() {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({ nama_kandidat: '', no_wa: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Mendeteksi URL yang sedang dibuka pengguna
  const currentPath = window.location.pathname;

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/schedules/available');
      const result = await response.json();
      if (result.status === 'success') {
        setSlots(result.data);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setMessage({ type: 'error', text: 'Gagal mengambil jadwal dari server.' });
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
  }, []);

  const formatTime = (datetime) => {
    const date = new Date(datetime);
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date) + ' WIB';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('http://127.0.0.1:8000/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          uuid: selectedSlot.uuid,
          nama_kandidat: formData.nama_kandidat,
          no_wa: formData.no_wa
        })
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Jadwal berhasil dipesan! Konfirmasi WhatsApp sedang dikirim.' });
        setFormData({ nama_kandidat: '', no_wa: '' });
        setSelectedSlot(null);
        fetchAvailableSlots(); // Refresh slot
      } else {
        setMessage({ type: 'error', text: result.message || 'Terjadi kesalahan saat memproses jadwal.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Sistem sedang sibuk. Silakan coba lagi nanti.' });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HALAMAN 1: TAMPILAN KHUSUS HR ADMIN (/admin)
  // ==========================================
  if (currentPath === '/admin') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '40px 20px', fontFamily: 'sans-serif' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h1 style={{ textAlign: 'center', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '15px' }}>
            👨‍💼 Area Khusus HR (Admin)
          </h1>
          
          <HrDashboard />
          <hr style={{ margin: '30px 0', borderTop: '1px solid #e2e8f0' }} />
          <HrRekapitulasi />
          
        </div>
      </div>
    );
  }

  // ==========================================
  // HALAMAN 2: TAMPILAN KANDIDAT (Default: /)
  // ==========================================
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 10px 0' }}>
            Portal Jadwal Interview
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px', margin: 0 }}>
            Silakan pilih slot waktu yang tersedia di bawah ini untuk mengamankan jadwal wawancara Anda.
          </p>
        </div>

        {message.text && (
          <div style={{ 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: message.type === 'success' ? '#166534' : '#991b1b',
            border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`
          }}>
            {message.text}
          </div>
        )}

        <div style={{ backgroundColor: '#ffffff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <div style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginTop: 0 }}>
              Slot Waktu Tersedia
            </h2>
            
            {slots.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <p style={{ color: '#64748b', fontSize: '16px' }}>Saat ini belum ada jadwal interview yang tersedia.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
                {slots.map((slot) => {
                  const isSelected = selectedSlot?.uuid === slot.uuid;
                  return (
                    <div
                      key={slot.uuid}
                      onClick={() => setSelectedSlot(slot)}
                      style={{
                        textAlign: 'left',
                        padding: '16px',
                        borderRadius: '12px',
                        border: `2px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`,
                        backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', color: '#1e293b', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', flexShrink: 0 }}>
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        {formatTime(slot.waktu_interview)}
                      </div>
                      {slot.posisi && (
                        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                          Posisi: <strong>{slot.posisi}</strong>
                        </div>
                      )}
                      <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', backgroundColor: '#dcfce7', color: '#166534' }}>
                        Tersedia
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {selectedSlot && (
            <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderTop: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', marginTop: 0, marginBottom: '16px' }}>Konfirmasi Identitas</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={formData.nama_kandidat}
                    onChange={(e) => setFormData({...formData, nama_kandidat: e.target.value})}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                    placeholder="Masukkan nama Anda"
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '6px' }}>Nomor WhatsApp Aktif</label>
                  <input
                    type="text"
                    required
                    value={formData.no_wa}
                    onChange={(e) => setFormData({...formData, no_wa: e.target.value})}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' }}
                    placeholder="Contoh: 081234567890"
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedSlot(null)}
                    style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', fontWeight: '500', cursor: 'pointer' }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: loading ? '#93c5fd' : '#2563eb', color: '#ffffff', fontWeight: '500', cursor: 'pointer' }}
                  >
                    {loading ? 'Memproses...' : 'Konfirmasi Jadwal'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}