// Daftar ID Karyawan yang diizinkan untuk login
const allowedEmployeeIds = [
    "4628757234274",
    "1234567890123",
    "9876543210987"
];

// Fungsi Login dengan Validasi ID Karyawan
function login() {
    const employeeName = document.getElementById('employeeName').value.trim();
    const employeeId = document.getElementById('employeeId').value.trim();

    if (!employeeName || !employeeId) {
        alert("Nama dan ID Karyawan diperlukan untuk login.");
        return;
    }

    if (!allowedEmployeeIds.includes(employeeId)) {
        alert("ID Karyawan tidak diizinkan untuk login.");
        return;
    }

    document.cookie = `employeeName=${employeeName}; path=/`;
    document.cookie = `employeeId=${employeeId}; path=/`;
    navigateTo('lobby.html');
}

function logout() {
    document.cookie = 'employeeName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'employeeId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigateTo('login.html');
}

// Fungsi Tanggal dan Pantun
document.addEventListener('DOMContentLoaded', () => {
    // Pastikan elemen HTML ada
    const dateElement = document.getElementById('date');
    const timeServerElement = document.getElementById('timeServer');
    const locationElement = document.getElementById('location');
    const noteElement = document.getElementById('note');

    if (dateElement) {
        dateElement.innerText = new Date().toLocaleDateString();
    }

    if (timeServerElement) {
        timeServerElement.innerText = new Date().toLocaleTimeString();
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            if (locationElement) {
                locationElement.innerText = `Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`;
            }
        }, error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Anda harus mengizinkan akses lokasi untuk melanjutkan.");
            }
            if (locationElement) {
                locationElement.innerText = "Lokasi tidak tersedia";
            }
        });
    } else {
        if (locationElement) {
            locationElement.innerText = "Lokasi tidak didukung browser";
        }
    }

    const pantunList = [
        "Buah mangga buah kedondong, lebih enak buah pepaya. Selamat pagi wahai kawan, semoga hari ini bahagia.",
        "Jalan-jalan ke kota Blitar, jangan lupa beli sukun. Selamat pagi wahai sahabat, semoga harimu menyenangkan.",
        "Ke pasar beli ikan, ikannya ikan tenggiri. Selamat pagi teman-teman, semoga hari ini berseri.",
        "Burung nuri terbang ke hutan, hinggap di dahan pohon jati. Selamat pagi kawan-kawan, semoga hari ini penuh arti."
    ];

    const randomPantun = pantunList[Math.floor(Math.random() * pantunList.length)];
    if (noteElement) {
        noteElement.value = randomPantun;
    }
});

// Menyimpan Histori di Cookies
function saveHistoryToCookies(data) {
    const history = JSON.parse(getCookie("attendanceHistory") || "[]");
    history.push(data);
    document.cookie = `attendanceHistory=${JSON.stringify(history)}; path=/;`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return "[]";
}

// Fungsi untuk memastikan lokasi tersedia sebelum melanjutkan
function ensureLocationAccess(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            callback(true, position);
        }, error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Anda harus mengizinkan akses lokasi untuk melanjutkan.");
            }
            callback(false, null);
        });
    } else {
        alert("Lokasi tidak didukung browser");
        callback(false, null);
    }
}

// Modifikasi fungsi submitAbsensi untuk menambahkan validasi
function submitAbsensi() {
    const employeeId = document.getElementById('employeeId').value;
    const employeeName = document.getElementById('employeeName').value;
    const date = document.getElementById('date').innerText;
    const note = document.getElementById('note').value;
    const attendanceType = document.getElementById('attendanceType').value;
    const timeServer = document.getElementById('timeServer').innerText;
    const resiType = document.getElementById('resiType').value;

    // Validasi form
    if (!employeeId || !employeeName || !note || !attendanceType || !resiType) {
        const randomCode = Math.floor(Math.random() * 10000); // Kode acak
        alert(`ERROR!, COBA SEKALI LAGI, MUNGKIN SEBAGIAN TABEL BELUM ANDA ISI! Kode Eror: ${randomCode}`);
        return; // Hentikan eksekusi jika ada yang kosong
    }

    // Validasi ID Karyawan
    if (!allowedEmployeeIds.includes(employeeId)) {
        const randomWarningCode = Math.random().toString(36).substring(2, 14); // Kode acak 12 karakter
        alert(`MAAF!, ID YANG ANDA MASUKAN TIDAK VALID ATAU TIDAK ADA TERDAFTAR DI SERVER DATA BASE KAMI !, COBA ULANG SEKALI LAGI DAN TELITI DALAM MENGINPUT ID DAN LAINNYA. Kode Eror: ${randomWarningCode}`);
        return; // Hentikan eksekusi jika ID tidak valid
    }

    // Menggunakan crypto API untuk membuat kode resi yang lebih acak
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    let resiCode;
    if (resiType === "detailed") {
        resiCode = `${employeeId}-${date}-${array[0].toString(36).toUpperCase()}`;
    } else {
        resiCode = array[0].toString(36).toUpperCase();
    }
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 3);

    const attendanceData = { 
        id: employeeId, 
        name: employeeName, 
        date: date, 
        type: attendanceType, 
        code: resiCode,
        expired: expiredDate.toLocaleDateString() 
    };
    saveHistoryToCookies(attendanceData);

    const qrCodeUrl = `https://quickchart.io/qr?text=${resiCode}&size=150`;
    const barcodeUrl = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${resiCode}&scale=3`;

    const resiContent = `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    color: #333;
                    background-color: #f9f9f9;
                    padding: 20px;
                }
                h1, h2 {
                    color: #0056b3;
                }
                p {
                    margin: 5px 0;
                }
                .qr-code, .barcode {
                    margin: 20px 0;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 0.9em;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <h1>RESI SISTEM KEHADIRAN KARYAWAN</h1>
            <h2>resi karyawan akan tersimpan secara otomatis di device anda</h2>
            <p>NAMA: ${employeeName}</p>
            <p>ID: ${employeeId}</p>
            <p>TANGGAL: ${date}</p>
            <p>LOKASI KORDINAT: ${location}</p>
            <p>CATATAN: ${note}</p>
            <p>JENIS ABSENSI: ${attendanceType}</p>
            <p>WAKTU SERVER: ${timeServer}</p>
            <p>------------------------------------------</p>
            <div class="qr-code">
                <p>QR CODE:</p>
                <p>Silahkan scan barcode di bawah untuk mengetahui tanggal,</p>
                <p>bulan dan tahun resi di buat:</p>
                <img src="${qrCodeUrl}" alt="QR Code" />
            </div>
            <div class="barcode">
                <p>BARCODE:</p>
                <img src="${barcodeUrl}" alt="Barcode" />
            </div>
            <p>------------------------------------------</p>
            <p>KODE ABSENSI: ${resiCode}</p>
            <p>TANGGAL RESI EXPIRY: ${expiredDate.toLocaleDateString()}</p>
            <p>VERSI RESI: 1.0</p>
            <p>-------------------------------------------</p>
            <div class="footer">
                <p>MARI LEBIH SEMAGAT DALAM BEKERJA!</p>
                <p>DIBUAT OLEH: TIM PENGEMBANGAN IT EPS</p>
            </div>
        </body>
        </html>
    `;

    const blob = new Blob([resiContent], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Resi_Absensi_${employeeId}_${date.replace(/\//g, '-')}.html`;
    link.click();
}

// Fungsi untuk Navigasi Halaman dengan animasi
function navigateTo(page) {
    showLoading();
    
    // Tambahkan delay untuk efek loading yang terlihat
    setTimeout(() => {
        window.location.href = page;
    }, 800); // Waktu loading 800ms untuk pengalaman yang lebih baik
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
document.addEventListener('DOMContentLoaded', () => {
    // Ambil nama karyawan dari cookies dan tampilkan
    const employeeNameElement = document.getElementById('employeeName');
    if (employeeNameElement) {
        const employeeName = getCookieValue('employeeName');
        if (employeeName) {
            employeeNameElement.textContent = employeeName;
        }
    }
    
    // Sembunyikan loading saat halaman selesai dimuat
    hideLoading();
    
    // Lain-lain inisialisasi halaman yang sudah ada
});

// Helper function untuk mendapatkan nilai cookie
function getCookieValue(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }
    return null;
}

function searchResi() {
    const searchResiInput = document.getElementById('searchResiInput').value.trim();
    const searchResult = document.getElementById('searchResult');
    const history = JSON.parse(getCookie("attendanceHistory") || "[]");

    const foundResi = history.find(item => item.code === searchResiInput);

    if (foundResi) {
        const resiContent = `
            <p>NAMA: ${foundResi.name}</p>
            <p>ID: ${foundResi.id}</p>
            <p>TANGGAL: ${foundResi.date}</p>
            <p>JENIS ABSENSI: ${foundResi.type}</p>
            <p>KODE ABSENSI: ${foundResi.code}</p>
            <p>TANGGAL RESI EXPIRY: ${foundResi.expired}</p>
            <a href="data:text/html;charset=utf-8,${encodeURIComponent(generateResiHTML(foundResi))}" download="Resi_Absensi_${foundResi.id}_${foundResi.date.replace(/\//g, '-')}.html">Download Resi</a>
        `;
        searchResult.innerHTML = resiContent;
    } else {
        searchResult.innerHTML = "Resi tidak ditemukan.";
    }
}

function generateResiHTML(data) {
    return `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    color: #333;
                    background-color: #f9f9f9;
                    padding: 20px;
                }
                h1, h2 {
                    color: #0056b3;
                }
                p {
                    margin: 5px 0;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 0.9em;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <h1>RESI SISTEM KEHADIRAN KARYAWAN</h1>
            <p>NAMA: ${data.name}</p>
            <p>ID: ${data.id}</p>
            <p>TANGGAL: ${data.date}</p>
            <p>JENIS ABSENSI: ${data.type}</p>
            <p>KODE ABSENSI: ${data.code}</p>
            <p>TANGGAL RESI EXPIRY: ${data.expired}</p>
            <div class="footer">
                <p>MARI LEBIH SEMAGAT DALAM BEKERJA!</p>
                <p>DIBUAT OLEH: TIM PENGEMBANGAN IT EPS</p>
            </div>
        </body>
        </html>
    `;
}

// Fungsi untuk mencari resi di cookies
function cariResi() {
    const qrCodeInput = document.getElementById('qrCodeInput').value.trim();
    const resiResult = document.getElementById('resiResult');
    const history = JSON.parse(getCookie("attendanceHistory") || "[]");

    const foundResi = history.find(item => item.code === qrCodeInput);

    if (foundResi) {
        const resiContent = `
            <p>NAMA: ${foundResi.name}</p>
            <p>ID: ${foundResi.id}</p>
            <p>TANGGAL: ${foundResi.date}</p>
            <p>JENIS ABSENSI: ${foundResi.type}</p>
            <p>KODE ABSENSI: ${foundResi.code}</p>
            <p>TANGGAL RESI EXPIRY: ${foundResi.expired}</p>
            <a href="data:text/html;charset=utf-8,${encodeURIComponent(generateResiHTML(foundResi))}" download="Resi_Absensi_${foundResi.id}_${foundResi.date.replace(/\//g, '-')}.html">Download Resi</a>
            <div id="qrCode"></div>
        `;
        resiResult.innerHTML = resiContent;
        generateQRCode(foundResi.code);
    } else {
        resiResult.innerHTML = "Resi tidak ditemukan.";
    }
}

function generateQRCode(code) {
    const qrCodeContainer = document.getElementById('qrCode');
    qrCodeContainer.innerHTML = ""; // Clear previous QR code
    new QRCode(qrCodeContainer, {
        text: code,
        width: 128,
        height: 128
    });
}

// Fungsi untuk toggle FAQ
function toggleFaq(element) {
    const answer = element.nextElementSibling;
    answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
}
