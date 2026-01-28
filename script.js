let students = [];
let currentImg = "";

// Key untuk localStorage
const STORAGE_KEY = "biodataSiswa";

// Fungsi untuk menyimpan data ke localStorage
function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

// Fungsi untuk memuat data dari localStorage
function loadFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        students = JSON.parse(data);
    }
}

// Muat data saat halaman pertama kali dibuka
document.addEventListener('DOMContentLoaded', function () {
    loadFromStorage();

    // Deteksi folder saat ini
    const path = window.location.pathname.toLowerCase();

    if (path.includes("/dashboard/")) {
        renderTable();
    } else if (path.includes("/tambah/")) {
        checkEditMode();
        setupNumericInputs();
    } else if (path.includes("/biodata/")) {
        loadProfileForView();
    } else if (path.includes("/login/")) {
        setupLogin();
    }
});

function setupLogin() {
    const luser = document.getElementById('luser');
    const lpass = document.getElementById('lpass');
    if (luser && lpass) {
        luser.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') lpass.focus();
        });
        lpass.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') goLogin();
        });
    }
}

function setupNumericInputs() {
    const numericIds = ['ins', 'insn', 'ihp'];
    numericIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
            });
        }
    });
}

function goLogin() {
    const n = document.getElementById('luser').value;
    const p = document.getElementById('lpass').value;
    if (n === "admin" && p === "admin") {
        window.location.href = "../Dashboard/index.html";
    } else {
        alert("Akses Ditolak! Gunakan admin/admin");
    }
}

function loadImg(e) {
    let r = new FileReader();
    r.onload = function () {
        document.getElementById('pimg').src = r.result;
        document.getElementById('pimg').style.display = "block";
        document.getElementById('pht').style.display = "none";
        currentImg = r.result;
    }
    if (e.target.files[0]) r.readAsDataURL(e.target.files[0]);
}

function saveData() {
    const name = document.getElementById('inama').value;
    if (!name) return alert("Harap isi nama!");

    const studentData = {
        name: name,
        nis: document.getElementById('ins').value,
        nisn: document.getElementById('insn').value,
        kelas: document.getElementById('ikelas').value,
        jurusan: document.getElementById('ijur').value,
        ttl: document.getElementById('ittl').value,
        jenis_kelamin: document.getElementById('ijkel').value,
        hp: document.getElementById('ihp').value,
        hobi: document.getElementById('ihobi').value,
        cita: document.getElementById('icita').value,
        alamat: document.getElementById('ialmt').value,
        foto: currentImg || "https://via.placeholder.com/120x160"
    };

    const editingIdx = localStorage.getItem('editIndex');

    if (editingIdx !== null && editingIdx !== "-1") {
        students[parseInt(editingIdx)] = studentData;
        localStorage.removeItem('editIndex');
    } else {
        students.push(studentData);
    }

    saveToStorage();
    alert("Data Berhasil Disimpan!");
    window.location.href = "../Dashboard/index.html";
}

function renderTable() {
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) return;

    if (students.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 40px; color: #999;">Belum ada data siswa.</td></tr>';
        return;
    }

    let html = "";
    students.forEach((s, index) => {
        html += `<tr>
            <td>${index + 1}</td>
            <td><img src="${s.foto}" alt="Foto"></td>
            <td><b>${s.name}</b></td>
            <td>${s.nis} / ${s.nisn}</td>
            <td>
                <button class="btn btn-view" title="Lihat" onclick="viewProfile(${index})"><i class="fa-solid fa-eye"></i></button>
                <button class="btn btn-print-green" title="Cetak" onclick="printDir(${index})"><i class="fa-solid fa-print"></i></button>
                <button class="btn btn-yellow" title="Edit" onclick="editData(${index})"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-red" title="Hapus" onclick="deleteData(${index})"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`;
    });
    tableBody.innerHTML = html;
}

function viewProfile(index) {
    localStorage.setItem('viewIndex', index);
    window.location.href = "../Biodata/index.html";
}

function printDir(index) {
    localStorage.setItem('viewIndex', index);
    localStorage.setItem('autoPrint', 'true');
    window.location.href = "../Biodata/index.html";
}

function loadProfileForView() {
    const index = localStorage.getItem('viewIndex');
    if (index === null || !students[index]) {
        alert("Data tidak ditemukan!");
        window.location.href = "../Dashboard/index.html";
        return;
    }

    const s = students[index];
    const dataMap = [
        ["Nama Lengkap", s.name],
        ["NIS / NISN", `${s.nis} / ${s.nisn}`],
        ["Kelas / Jurusan", `${s.kelas} / ${s.jurusan}`],
        ["TTL", s.ttl],
        ["Jenis Kelamin", s.jenis_kelamin],
        ["No HP", s.hp],
        ["Hobi", s.hobi],
        ["Cita-cita", s.cita],
        ["Alamat", s.alamat]
    ];
    let out = "";
    dataMap.forEach(r => {
        out += `<tr>
            <td class="label-col">${r[0]}</td>
            <td class="colon-col">:</td>
            <td class="value-col">${r[1] || '-'}</td>
        </tr>`;
    });
    document.getElementById('resData').innerHTML = out;
    document.getElementById('rfoto').src = s.foto;

    if (localStorage.getItem('autoPrint') === 'true') {
        localStorage.removeItem('autoPrint');
        setTimeout(() => { window.print(); }, 1000);
    }
}

function editData(index) {
    localStorage.setItem('editIndex', index);
    window.location.href = "../Tambah/index.html";
}

function checkEditMode() {
    const index = localStorage.getItem('editIndex');
    if (index !== null && index !== "-1" && students[index]) {
        const s = students[index];
        document.getElementById('inama').value = s.name;
        document.getElementById('ins').value = s.nis || '';
        document.getElementById('insn').value = s.nisn || '';
        document.getElementById('ikelas').value = s.kelas || '';
        document.getElementById('ijur').value = s.jurusan || '';
        document.getElementById('ittl').value = s.ttl || '';
        document.getElementById('ijkel').value = s.jenis_kelamin || '';
        document.getElementById('ihp').value = s.hp || '';
        document.getElementById('ihobi').value = s.hobi || '';
        document.getElementById('icita').value = s.cita || '';
        document.getElementById('ialmt').value = s.alamat || '';

        const pimg = document.getElementById('pimg');
        const pht = document.getElementById('pht');
        if (s.foto && s.foto !== "https://via.placeholder.com/120x160") {
            pimg.src = s.foto;
            pimg.style.display = "block";
            pht.style.display = "none";
            currentImg = s.foto;
        }

        const header = document.querySelector('.card-header h2');
        if (header) header.innerHTML = '<i class="fa-solid fa-user-pen"></i> Edit Data Siswa';
    }
}

function deleteData(index) {
    if (confirm("Hapus data ini?")) {
        students.splice(index, 1);
        saveToStorage();
        renderTable();
    }
}

function resetForm() {
    if (confirm("Reset form?")) {
        document.querySelectorAll('input, textarea, select').forEach(i => {
            if (i.type !== 'file') i.value = "";
        });
        const kel = document.getElementById('ijkel');
        if (kel) kel.selectedIndex = 0;

        document.getElementById('pimg').style.display = "none";
        document.getElementById('pht').style.display = "block";
        document.getElementById('fin').value = "";
        currentImg = "";
        localStorage.removeItem('editIndex');
    }
}

function logout() {
    if (confirm("Keluar dari sistem?")) {
        window.location.href = "../Login/index.html";
    }
}