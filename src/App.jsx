import { useState, useEffect } from 'react'

function App() {
  const [schedules, setSchedules] = useState([])
  const [bookedSchedules, setBookedSchedules] = useState([])
  
  // State untuk berpindah antara halaman Kandidat dan Admin
  const [isAdminView, setIsAdminView] = useState(false)

  const fetchAvailableSchedules = () => {
    fetch('http://127.0.0.1:8000/api/schedules/available')
      .then(res => res.json())
      .then(data => { if (data.status === 'success') setSchedules(data.data) })
  }

  const fetchBookedSchedules = () => {
    fetch('http://127.0.0.1:8000/api/schedules/booked')
      .then(res => res.json())
      .then(data => { if (data.status === 'success') setBookedSchedules(data.data) })
  }

  // Muat data sesuai mode halaman saat ini
  useEffect(() => {
    if (isAdminView) {
      fetchBookedSchedules()
    } else {
      fetchAvailableSchedules()
    }
  }, [isAdminView])

  const handleBooking = (uuid) => {
    const nama = window.prompt("Masukkan Nama Anda:")
    if (!nama) return; 

    const noWa = window.prompt("Masukkan Nomor WA Anda:")
    if (!noWa) return; 

    fetch('http://127.0.0.1:8000/api/schedules/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ uuid, nama_kandidat: nama, no_wa: noWa })
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        alert("Berhasil! Jadwal telah resmi menjadi milik Anda.")
        fetchAvailableSchedules() 
      } else {
        alert("Gagal: " + (data.message || "Jadwal sudah diambil orang lain!"))
      }
    })
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', color: 'white' }}>
      
      {/* Tombol Rahasia untuk Pindah Halaman */}
      <button 
        onClick={() => setIsAdminView(!isAdminView)}
        style={{ marginBottom: '30px', padding: '10px 20px', backgroundColor: isAdminView ? '#ff4646' : '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        {isAdminView ? "Kembali ke Mode Kandidat" : "Buka Dashboard Admin"}
      </button>

      {/* TAMPILAN ADMIN */}
      {isAdminView ? (
        <div>
          <h1 style={{ color: '#4CAF50' }}>Dashboard HRD - Jadwal Terisi</h1>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #555' }}>
                <th style={{ padding: '10px' }}>Jam Interview</th>
                <th style={{ padding: '10px' }}>Nama Kandidat</th>
                <th style={{ padding: '10px' }}>Nomor WA</th>
              </tr>
            </thead>
            <tbody>
              {bookedSchedules.length === 0 ? (
                <tr><td colSpan="3" style={{ padding: '20px' }}>Belum ada kandidat yang mendaftar.</td></tr>
              ) : (
                bookedSchedules.map((jadwal) => (
                  <tr key={jadwal.uuid} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '10px' }}>{jadwal.waktu_interview}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{jadwal.nama_kandidat}</td>
                    <td style={{ padding: '10px' }}>{jadwal.no_wa}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* TAMPILAN KANDIDAT (Sama seperti sebelumnya) */
        <div>
          <h1>Pilih Jadwal Interview</h1>
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            {schedules.length === 0 ? (
              <p>Semua jadwal sudah penuh...</p>
            ) : (
              schedules.map((jadwal) => (
                <div key={jadwal.uuid} style={{ border: '1px solid #555', padding: '20px', borderRadius: '8px', backgroundColor: '#242424' }}>
                  <h3 style={{ marginTop: 0 }}>Jam: {jadwal.waktu_interview.split(' ')[1]}</h3>
                  <p>Tanggal: {jadwal.waktu_interview.split(' ')[0]}</p>
                  <button onClick={() => handleBooking(jadwal.uuid)} style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#646cff', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Booking Jadwal Ini
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App