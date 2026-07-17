const FIREBASE_URL = "https://trendgear-dashboar-default-rtdb.firebaseio.com/.json";

let customerRecords = [];
let filteredRecords = [];

let currentPage = 1;
const rowsPerPage = 20;

// DOM
const tableBody = document.getElementById("tableBody");
const kpiTotalRevenue = document.getElementById("kpiTotalRevenue");
const kpiAvgSpent = document.getElementById("kpiAvgSpent");
const kpiAvgAge = document.getElementById("kpiAvgAge");
const kpiPremiumCount = document.getElementById("kpiPremiumCount");
const searchInput = document.getElementById("searchInput");
const btnReload = document.getElementById("btnReload");
const hamburgerBtn = document.getElementById("hamburgerBtn");
const navMenu = document.getElementById("navMenu");

/**
 * FETCH DATA
 */
async function fetchDataset() {
    renderLoadingState();

    try {
        const response = await fetch(FIREBASE_URL);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!data) {
            customerRecords = [];
        } else {
            customerRecords = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }));
        }

        filteredRecords = [...customerRecords];
        currentPage = 1;

        processKPIs(filteredRecords);
        renderTable(filteredRecords);

    } catch (error) {
        renderErrorState(error.message);
    }
}

/**
 * KPIs
 */
function processKPIs(records) {
    if (records.length === 0) return;

    const totalRevenue = records.reduce((sum, item) => sum + Number(item.amountSpent || 0), 0);
    const avgSpent = totalRevenue / records.length;

    const totalAge = records.reduce((sum, item) => sum + Number(item.age || 0), 0);
    const avgAge = totalAge / records.length;

    const activeUsers = records.filter(item => item.membershipStatus === "activa").length;

    kpiTotalRevenue.textContent = `$${totalRevenue.toLocaleString('es-CO')}`;
    kpiAvgSpent.textContent = `$${Math.round(avgSpent).toLocaleString('es-CO')}`;
    kpiAvgAge.textContent = `${Math.round(avgAge)} años`;
    kpiPremiumCount.textContent = activeUsers;
}

/**
 * TABLA + PAGINACIÓN
 */
function renderTable(records) {
    tableBody.innerHTML = "";

    if (records.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9">No hay datos</td></tr>`;
        return;
    }

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = records.slice(start, end);

    paginatedData.forEach(customer => {

        const rawAmount = Number(customer.amountSpent);
        const formattedAmount = isNaN(rawAmount)
            ? "$0"
            : `$${rawAmount.toLocaleString('es-CO')}`;

        let badgeClass = customer.membershipStatus === "activa" ? "gold" : "standard";

        const rowHTML = `
            <tr>
                <td>${customer.id}</td>
                <td>
                    <div>${customer.name}</div>
                    <div style="font-size:0.8rem;">${customer.email}</div>
                </td>
                <td>${customer.productPurchased}</td>
                <td>${customer.purchaseDate}</td>
                <td style="font-weight:700;">${formattedAmount}</td>
                <td>${customer.age}</td>
                <td>${customer.city}</td>
                <td>${customer.paymentMethod}</td>
                <td><span class="badge ${badgeClass}">${customer.membershipStatus}</span></td>
            </tr>
        `;

        tableBody.insertAdjacentHTML("beforeend", rowHTML);
    });

    renderPagination(records.length);
}

/**
 * PAGINACIÓN
 */
function renderPagination(totalRecords) {
    const totalPages = Math.ceil(totalRecords / rowsPerPage);
    let html = '';

    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    html += `<div class="pagination">`;

    // Botón anterior
    html += `
        <button onclick="changePage(${currentPage - 1})"
        class="nav-btn"
        ${currentPage === 1 ? "disabled" : ""}>
        ←
        </button>
    `;

    if (start > 1) {
        html += `<button onclick="changePage(1)">1</button>`;
        if (start > 2) html += `<span class="dots">...</span>`;
    }

    for (let i = start; i <= end; i++) {
        html += `
            <button onclick="changePage(${i})"
            class="${i === currentPage ? 'active' : ''}">
            ${i}
            </button>
        `;
    }

    if (end < totalPages) {
        if (end < totalPages - 1) html += `<span class="dots">...</span>`;
        html += `<button onclick="changePage(${totalPages})">${totalPages}</button>`;
    }

    html += `
        <button onclick="changePage(${currentPage + 1})"
        class="nav-btn"
        ${currentPage === totalPages ? "disabled" : ""}>
        →
        </button>
    `;

    html += `</div>`;

    document.getElementById("pagination").innerHTML = html;
}

/**
 * CAMBIAR PÁGINA
 */
function changePage(page) {
    const totalPages = Math.ceil(filteredRecords.length / rowsPerPage);

    if (page < 1 || page > totalPages) return;

    currentPage = page;
    renderTable(filteredRecords);
}

/**
 * BUSCADOR
 */
searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();

    filteredRecords = customerRecords.filter(r => {
        return (
            String(r.id || "").toLowerCase().includes(term) ||
            String(r.name || "").toLowerCase().includes(term) ||
            String(r.email || "").toLowerCase().includes(term) ||
            String(r.city || "").toLowerCase().includes(term) ||
            String(r.productPurchased || "").toLowerCase().includes(term)
        );
    });

    currentPage = 1;

    processKPIs(filteredRecords);
    renderTable(filteredRecords);
});

/**
 * UI STATES
 */
function renderLoadingState() {
    tableBody.innerHTML = `<tr><td colspan="9">Cargando...</td></tr>`;
}

function renderErrorState(msg) {
    tableBody.innerHTML = `<tr><td colspan="9">Error: ${msg}</td></tr>`;
}

/**
 * EVENTOS
 */
btnReload.addEventListener("click", fetchDataset);

hamburgerBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

window.addEventListener("DOMContentLoaded", fetchDataset);