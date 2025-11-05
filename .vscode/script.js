/**
 * HYGIA - script.js
 * Lógica de inicialización del dashboard, navegación dinámica por roles y funcionalidades de módulos.
 */

// ==========================================================
// 1. DATOS DE CONFIGURACIÓN Y SIMULACIÓN
// ==========================================================

// Base de datos de pacientes simulada (Inicialmente con dos pacientes)
let PATIENTS_DB = [
    { id: 'P001', name: 'Ana María Soto', cedula: '101567890', phone: '+57 310 123 4567', birthdate: '1990-05-15', gender: 'F' },
    { id: 'P002', name: 'Carlos Javier López', cedula: '101567891', phone: '+57 320 987 6543', birthdate: '1985-11-20', gender: 'M' },
    // Los nuevos pacientes registrados se añadirán aquí
];

// Definición de la estructura de navegación por Rol
const NAVIGATION_MAP = {
    medico: [
        { name: 'Historia Clínica', icon: 'fas fa-file-medical', url: 'hce.html' },
        { name: 'Dashboard Médico', icon: 'fas fa-chart-line', url: 'dashboard_medico.html' },
    ],
    recepcionista: [
        { name: 'Admisión y Citas', icon: 'fas fa-calendar-check', url: 'admision.html' }
    ],
    farmaceutico: [
        { name: 'Inventario Farmacia', icon: 'fas fa-pills', url: 'farmacia.html' },
        { name: 'Órdenes de Compra', icon: 'fas fa-truck-loading', url: 'ordenes_compra.html' },
    ]
};

// ==========================================================
// 2. INICIALIZACIÓN PRINCIPAL (DOMContentLoaded)
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    // Obtener la información del usuario de la sesión
    const userRole = sessionStorage.getItem('userRole');
    const userName = sessionStorage.getItem('userName');
    const userAvatar = sessionStorage.getItem('userAvatar');
    
    // Inicializar el dashboard (Sidebar y Header) si el usuario está logeado
    if (userRole && userName) {
        initializeDashboard(userRole, userName, userAvatar);
    }

    // Inicializar la lógica específica del módulo activo
    if (window.location.pathname.includes('admision.html')) {
        initializeAdmissionModule();
    }

    if (window.location.pathname.includes('hce.html')) {
        initializeHCEModule();
    }
    
    // Aquí se añadirían las inicializaciones de otros módulos (e.g., farmacia.html)
});

// ==========================================================
// 3. FUNCIONES GLOBALES DE INICIALIZACIÓN
// ==========================================================

function initializeDashboard(role, name, avatar) {
    // Construir el menú lateral basado en el rol del usuario
    buildSidebarMenu(role);

    // Personalizar el Header con el nombre y avatar
    const welcomeElement = document.getElementById('user-welcome');
    const avatarElement = document.getElementById('user-avatar');
    
    if (welcomeElement) {
        welcomeElement.textContent = `Bienvenido/a, ${name.split(' ')[0]}`; // Solo el primer nombre
    }

    if (avatarElement) {
        avatarElement.textContent = avatar;
        avatarElement.title = name;
    }
}

function buildSidebarMenu(role) {
    const menuList = document.getElementById('menu-items');
    if (!menuList) return;

    menuList.innerHTML = ''; // Limpiar el menú

    const navItems = NAVIGATION_MAP[role] || [];
    const currentPath = window.location.pathname.split('/').pop();

    navItems.forEach(item => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        
        link.href = item.url;
        link.innerHTML = `<i class="${item.icon}"></i> <span>${item.name}</span>`;

        // Marcar el enlace activo
        if (item.url === currentPath) {
            link.classList.add('active');
        }
        
        listItem.appendChild(link);
        menuList.appendChild(listItem);
    });
}

// ==========================================================
// 4. LÓGICA ESPECÍFICA DEL MÓDULO DE ADMISIÓN
// ==========================================================

// ==========================================================
// LÓGICA ESPECÍFICA DEL MÓDULO DE ADMISIÓN (COMPLETA)
// ==========================================================

function initializeAdmissionModule() {
    // 1. Obtención de elementos críticos para Admisión
    const btnShowRegister = document.getElementById('btn-show-register');
    const btnHideRegister = document.getElementById('btn-hide-register');
    const registrationFormPane = document.getElementById('patient-registration-form');
    const newPatientForm = document.getElementById('new-patient-form');
    const tabsContainer = document.querySelector('.hce-tabs');
    const listPatientsTabBtn = document.querySelector('[data-tab="list-patients"]');
    const searchInput = document.getElementById('search-input'); // <<<< REINTRODUCIDO ESTO

    // Comprobación de existencia de elementos críticos
    if (!btnShowRegister || !btnHideRegister || !registrationFormPane || !newPatientForm || !searchInput) {
        console.error("ADMISSION MODULE ERROR: Uno o más IDs críticos no se encontraron. Verifique la coincidencia de IDs en admision.html.");
        return; 
    }

    // 2. Manejo de Pestañas (Tabs)
    document.querySelectorAll('.hce-tab-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Ocultar el formulario de registro si estaba visible
            registrationFormPane.style.display = 'none';
            registrationFormPane.classList.remove('active-pane');
            tabsContainer.style.display = 'flex'; 

            // Activar la pestaña correcta
            document.querySelectorAll('.hce-tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.hce-tab-pane').forEach(pane => {
                pane.classList.remove('active-pane');
                pane.style.display = 'block'; 
            });
            
            this.classList.add('active');
            
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active-pane');
        });
    });

    // 3. Manejo de Formulario de Registro (Botones Mostrar/Ocultar y Submit)
    
    // Mostrar el formulario
    btnShowRegister.addEventListener('click', () => {
        document.querySelectorAll('.hce-tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.hce-tab-pane').forEach(pane => pane.classList.remove('active-pane'));
        tabsContainer.style.display = 'none';

        registrationFormPane.style.display = 'block';
        registrationFormPane.classList.add('active-pane');
    });

    // Ocultar el formulario y volver a la lista de pacientes
    btnHideRegister.addEventListener('click', () => {
        registrationFormPane.style.display = 'none';
        registrationFormPane.classList.remove('active-pane');

        tabsContainer.style.display = 'flex';
        listPatientsTabBtn.classList.add('active');
        document.getElementById('list-patients').classList.add('active-pane');
        renderPatientTable(PATIENTS_DB);
    });

    // Simulación de REGISTRO DE PACIENTE
    newPatientForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const name = document.getElementById('reg-name').value;
        const cedula = document.getElementById('reg-cedula').value;
        const birthdate = document.getElementById('reg-birthdate').value;
        const gender = document.getElementById('reg-gender').value;
        const phone = document.getElementById('reg-phone').value;
        
        // Generar nuevo ID (simulación)
        const newIdNum = PATIENTS_DB.length + 1;
        const newId = 'P' + String(newIdNum).padStart(3, '0');
        
        const newPatient = {
            id: newId,
            name: name,
            cedula: cedula,
            phone: phone,
            birthdate: birthdate,
            gender: gender
        };

        PATIENTS_DB.push(newPatient);
        
        alert(`Paciente ${name} (ID: ${newId}) registrado exitosamente. (Simulación)`);
        
        newPatientForm.reset();
        btnHideRegister.click(); 
    });

    // 4. Manejo de Búsqueda de Pacientes (Por Cédula o Nombre) <<<< REINTRODUCIDO ESTO
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        
        // Si la búsqueda está vacía, mostrar la lista completa
        if (query === '') {
            renderPatientTable(PATIENTS_DB);
            return;
        }

        const results = PATIENTS_DB.filter(patient => 
            patient.cedula.includes(query) || patient.name.toLowerCase().includes(query)
        );

        renderPatientTable(results);
    });
    
    // 5. Renderizado Inicial de la Tabla
    renderPatientTable(PATIENTS_DB);
}

// ==========================================================
// LÓGICA ESPECÍFICA DEL MÓDULO HCE
// ==========================================================

function initializeHCEModule() {
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('patient');
    
    const nameElement = document.getElementById('patient-name');
    const detailsElement = document.getElementById('patient-details');
    const warningElement = document.getElementById('patient-warning');
    
    if (!patientId) {
        // Si no hay ID en la URL, mostramos el mensaje de advertencia
        if (warningElement) warningElement.style.display = 'block';
        return;
    }

    // Buscar los datos del paciente en la base de datos simulada (PATIENTS_DB, definida en script.js)
    const patient = PATIENTS_DB.find(p => p.id === patientId);

    if (patient) {
        const age = calculateAge(patient.birthdate);
        
        nameElement.textContent = patient.name;
        detailsElement.innerHTML = `ID: ${patient.id} | Edad: ${age} años | Última Visita: Hoy (simulado)`;
        // Ocultamos la advertencia si el paciente se encuentra
        if (warningElement) warningElement.style.display = 'none';

    } else {
        nameElement.textContent = 'Paciente NO ENCONTRADO';
        detailsElement.innerHTML = `ID solicitado: ${patientId}`;
        if (warningElement) warningElement.style.display = 'block';
    }
    
    // Lógica para que las pestañas funcionen
    setupHCETabs();
}

function setupHCETabs() {
    document.querySelectorAll('.hce-tab-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Desactivar todos los botones y paneles
            document.querySelectorAll('.hce-tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.hce-tab-pane').forEach(pane => pane.classList.remove('active-pane'));
            
            // Activar el botón y el panel correctos
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active-pane');
        });
    });
}

// Función utilitaria para calcular la edad a partir de la fecha de nacimiento (YYYY-MM-DD)
function calculateAge(birthdate) {
    if (!birthdate) return '--';
    const today = new Date();
    const dob = new Date(birthdate);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}

// ==========================================================
// 5. FUNCIÓN DE AYUDA: Renderizar la Tabla de Pacientes
// ==========================================================
function renderPatientTable(patients) {
    const tableBody = document.querySelector('.data-table tbody');
    if (!tableBody) return;

    tableBody.innerHTML = ''; // Limpiar la tabla

    if (patients.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-color-light);">No se encontraron pacientes que coincidan con la búsqueda.</td></tr>';
        return;
    }

    patients.forEach(patient => {
        const row = `
            <tr>
                <td>${patient.id}</td>
                <td>${patient.name}</td>
                <td>${patient.cedula}</td>
                <td>${patient.phone || 'N/D'}</td>
                <td><a href="hce.html?patient=${patient.id}" class="btn btn-primary" style="padding: 5px 10px; font-size: 0.8em;"><i class="fas fa-eye"></i> Ver HCE</a></td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}