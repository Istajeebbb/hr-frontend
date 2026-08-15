import React, { useState } from 'react';
import axios from 'axios';

const HrDashboard = () => {
  const [formData, setFormData] = useState({
    tanggal: '',
    jam_mulai: '',
    jam_selesai: '',
    durasi: 45, // Default durasi 45 menit
    posisi: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Pastikan URL API sesuai dengan alamat backend Laravel Anda
      const response = await axios.post('http://127.0.0.1:8000/api/schedules/generate', formData);
      setMessage({ type: 'success', text: response.data.message });
      setFormData({ tanggal: '', jam_mulai: '', jam_selesai: '', durasi: 45, posisi: '' }); // Reset form
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal membuat jadwal. Periksa kembali isian Anda.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>⚙️ HR Dashboard - Kelola Jadwal</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>Buat slot interview otomatis dalam hitungan detik.</p>

      {message && (
        <div style={{ padding: '10px', marginBottom: '15px', borderRadius: '4px', backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da', color: message.type === 'success' ? '#155724' : '#721c24' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Posisi yang Dilamar:</label>
          <input type="text" name="posisi" value={formData.posisi} onChange={handleChange} required placeholder="Contoh: IT Support" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tanggal Interview:</label>
          <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Jam Mulai:</label>
            <input type="time" name="jam_mulai" value={formData.jam_mulai} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Jam Selesai:</label>
            <input type="time" name="jam_selesai" value={formData.jam_selesai} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Durasi per Sesi (Menit):</label>
          <select name="durasi" value={formData.durasi} onChange={handleChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
            <option value="15">15 Menit</option>
            <option value="30">30 Menit</option>
            <option value="45">45 Menit</option>
            <option value="60">60 Menit (1 Jam)</option>
          </select>
        </div>

        <button type="submit" disabled={loading} style={{ marginTop: '10px', padding: '10px', backgroundColor: loading ? '#ccc' : '#0056b3', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Memproses...' : 'Buat Slot Otomatis'}
        </button>
      </form>
    </div>
  );
};

export default HrDashboard;