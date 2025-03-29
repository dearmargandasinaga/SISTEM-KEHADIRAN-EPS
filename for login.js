// Daftar ID Karyawan yang diizinkan untuk login
const allowedEmployeeIds = [
    "4628757234274", // Contoh ID Karyawan
    "1234567890123", 
    "9876543210987" 
    
];

// Fungsi untuk login menggunakan Nama dan ID Karyawan
function login() {
    const employeeName = document.getElementById('employeeName').value.trim();
    const employeeId = document.getElementById('employeeId').value.trim();

    // Validasi input: Nama dan ID harus diisi
    if (employeeName === "" || employeeId === "") {
        alert("Nama dan ID Karyawan diperlukan untuk login.");
        return;
    }

    // Validasi ID Karyawan: periksa apakah ID ada dalam daftar yang diizinkan
    if (!allowedEmployeeIds.includes(employeeId)) {
        alert("ID Karyawan tidak valid. Silakan coba lagi.");
        return;
    }

    // Simpan Nama dan ID karyawan di cookies
    document.cookie = `employeeName=${employeeName}; path=/`;
    document.cookie = `employeeId=${employeeId}; path=/`;

    // Arahkan ke halaman lobby setelah login berhasil
    console.log("Login berhasil, mengarahkan ke halaman lobby.");
    window.location.href = 'lobby.html';
}

// Fungsi Logout untuk halaman lain
function logout() {
    // Hapus data Nama dan ID Karyawan dari cookies
    document.cookie = 'employeeName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'employeeId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    console.log("Logout berhasil, mengarahkan ke halaman login.");
    window.location.href = 'login.html';
}
