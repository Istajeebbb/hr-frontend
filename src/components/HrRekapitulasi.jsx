import { useState, useEffect } from 'react';

export default function HrRekapitulasi() {
  const [schedules, setSchedules] = useState([]);

  const fetchAllSchedules = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/schedules/all');
      const result = await response.json();
      if (result.status === 'success') {
        setSchedules(result.data);
      }
    } catch (error) {
      console.error('Gagal mengambil data rekap:', error);
    }
  };

  useEffect(() => {
    fetchAllSchedules();
    const interval = setInterval(fetchAllSchedules, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (datetime) => {
    const date = new Date(datetime);
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(date) + ' WIB';
  };

  const formatWaNumber = (number) => {
    if (!number) return '';
    let formatted = number.toString().replace(/\D/g, '');
    if (formatted.startsWith('0')) {
      formatted = '62' + formatted.substring(1);
    }
    return formatted;
  };

  // Template pesan WhatsApp baru sesuai permintaan Anda
  const generateWaLink = (item) => {
    const number = formatWaNumber(item.no_wa);
    const timeFormatted = formatTime(item.waktu_interview);
    
    const message = `Halo\n\n`
                  + `Perkenalkan, saya Sofie dari Tim HRD PT YAIJ Solusi Internasional.\n`
                  + `Terima kasih telah memilih jadwal interview. Berikut detail interview Anda:\n\n`
                  + `📅 Hari/Tanggal / Pukul: *${timeFormatted}*\n`
                  + `💻 Posisi: *${item.posisi || '-'}*\n`
                  + `💻 Media: Google Meet\n`
                  + `🔗 Link Interview: *(Masukkan Link Google Meet Di Sini)*\n\n`
                  + `Mohon bergabung tepat waktu sesuai jadwal yang telah dipilih serta memastikan perangkat dan koneksi internet dalam kondisi baik agar proses interview berjalan lancar.\n\n`
                  + `Apabila terdapat kendala yang menyebabkan anda tidak dapat mengikuti interview sesuai jadwal, mohon segera menginformasikannya melalui nomor ini.`;
    
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
        📊 Rekapitulasi Jadwal Interview
      </h2>
      
      <div style={{ overflowX: 'auto', marginTop: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
              <th style={{ padding: '12px 15px', color: '#334155' }}>Waktu Interview</th>
              <th style={{ padding: '12px 15px', color: '#334155' }}>Posisi</th>
              <th style={{ padding: '12px 15px', color: '#334155' }}>Kandidat</th>
              <th style={{ padding: '12px 15px', color: '#334155' }}>WhatsApp</th>
              <th style={{ padding: '12px 15px', color: '#334155' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Belum ada jadwal yang dibuat.</td>
              </tr>
            ) : (
              schedules.map((item) => (
                <tr key={item.uuid} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 15px', fontSize: '14px', color: '#0f172a' }}>{formatTime(item.waktu_interview)}</td>
                  <td style={{ padding: '12px 15px', fontSize: '14px', color: '#0f172a' }}>{item.posisi || '-'}</td>
                  <td style={{ padding: '12px 15px', fontSize: '14px', fontWeight: 'bold' }}>{item.nama_kandidat || '-'}</td>
                  <td style={{ padding: '12px 15px', fontSize: '14px' }}>
                    {item.no_wa ? (
                      <a 
                        href={generateWaLink(item)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          display: 'inline-flex', alignItems: 'center', gap: '6px', 
                          color: '#25d366', textDecoration: 'none', fontWeight: 'bold',
                          padding: '4px 8px', borderRadius: '6px',
                          backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
                          transition: 'all 0.2s'
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                        {item.no_wa}
                      </a>
                    ) : '-'}
                  </td>
                  <td style={{ padding: '12px 15px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                      backgroundColor: item.is_booked ? '#dcfce7' : '#f1f5f9',
                      color: item.is_booked ? '#166534' : '#475569'
                    }}>
                      {item.is_booked ? 'Booked' : 'Kosong'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}