// Daftar ID Karyawan yang diizinkan untuk login
const allowedEmployeeIds = [
    "4628757234274", // Contoh ID Karyawan
    "1234567890123", 
    "9876543210987" 
];

// Fungsi untuk menampilkan custom alert
function showCustomAlert(message, data = null) {
    const alertMessage = document.getElementById('alertMessage');
    const alertTable = document.getElementById('alertTable');
    const customAlert = document.getElementById('customAlert');
    
    alertMessage.textContent = message;
    
    // Jika ada data untuk ditampilkan dalam tabel
    if (data) {
        let tableHTML = '';
        for (const [key, value] of Object.entries(data)) {
            tableHTML += `<tr><td>${key}</td><td>${value}</td></tr>`;
        }
        alertTable.innerHTML = tableHTML;
        alertTable.style.display = 'table';
    } else {
        alertTable.style.display = 'none';
    }
    
    customAlert.style.display = 'flex';
}

// Fungsi untuk menutup custom alert
function closeCustomAlert() {
    document.getElementById('customAlert').style.display = 'none';
}

// Fungsi untuk login menggunakan Nama dan ID Karyawan
function login() {
    const employeeName = document.getElementById('employeeName').value.trim();
    const employeeId = document.getElementById('employeeId').value.trim();

    // Validasi input: Nama dan ID harus diisi
    if (employeeName === "" || employeeId === "") {
        showCustomAlert("Nama dan ID Karyawan diperlukan untuk login.", {
            "Status": "Gagal",
            "Kode Error": "EMP001",
            "Pesan": "Data login tidak lengkap"
        });
        return;
    }

    // Validasi ID Karyawan: periksa apakah ID ada dalam daftar yang diizinkan
    if (!allowedEmployeeIds.includes(employeeId)) {
        showCustomAlert("ID Karyawan tidak valid. Silakan coba lagi.", {
            "Status": "Gagal",
            "Kode Error": "EMP002",
            "ID": employeeId,
            "Pesan": "ID tidak terdaftar dalam sistem"
        });
        return;
    }

    // Simpan Nama dan ID karyawan di cookies
    document.cookie = `employeeName=${employeeName}; path=/`;
    document.cookie = `employeeId=${employeeId}; path=/`;

    // Arahkan ke halaman lobby setelah login berhasil
    console.log("Login berhasil, mengarahkan ke halaman lobby.");
    showLoading();
    setTimeout(() => {
        window.location.href = 'lobby.html';
    }, 800);
}

// Fungsi Logout untuk halaman lain
function logout() {
    // Hapus data Nama dan ID Karyawan dari cookies
    document.cookie = 'employeeName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'employeeId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    console.log("Logout berhasil, mengarahkan ke halaman login.");
    navigateTo('login.html');
}

// Fungsi untuk Navigasi Halaman
function navigateTo(page) {
    window.location.href = page;
}

// Menampilkan loading dengan animasi
function showLoading() {
    const loading = document.getElementById('loading');
    loading.style.display = 'flex';
    loading.style.opacity = '0';
    
    // Animasi fade in
    setTimeout(() => {
        loading.style.transition = 'opacity 0.3s ease';
        loading.style.opacity = '1';
    }, 10);
}

// Sembunyikan loading dengan animasi
function hideLoading() {
    const loading = document.getElementById('loading');
    
    // Cek apakah elemen loading ada
    if (loading) {
        loading.style.transition = 'opacity 0.3s ease';
        loading.style.opacity = '0';
        
        // Tunggu animasi selesai baru sembunyikan elemen
        setTimeout(() => {
            loading.style.display = 'none';
        }, 300);
    }
}

// Inisialisasi halaman
document.addEventListener('DOMContentLoaded', hideLoading); 