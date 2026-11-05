
// TRANSLATIONS

const translations = {
    en: {
        welcomeTitle: "Welcome to Loan Simulator",
        welcomeDescription: "Calculate your loan payments and manage your finances easily.",
        loanInformation: "📋 Loan Information",
        loanAmount: "💵 Loan Amount",
        interestRate: "📊 Interest Rate (%)",
        rateType: "📈 Interest Rate Type",
        monthly: "Effective Monthly",
        annual: "Effective Annual",
        loanTerm: "📅 Loan Term (Months)",
        calculateButton: "Calculate My Loan →",
        loanSummary: "📊 Loan Summary",
        monthlyPayment: "Monthly Payment",
        totalPayment: "Total Payment",
        totalInterest: "Total Interest",
        amortizationTitle: "📑 Amortization Schedule",
        paymentDetails: "Payment Details",
        month: "Month",
        payment: "Payment",
        principal: "Principal",
        interest: "Interest",
        balance: "Remaining Balance",
        emptyMessage: "Enter your loan information to see your amortization schedule.",
        footer: "Loan Simulator © 2026 | Smart Financial Planning",
        amountPlaceholder: "Enter loan amount",
        interestPlaceholder: "Enter interest rate",
        monthsPlaceholder: "Enter number of months",
        error: "Please enter valid loan information.",
        printButton: "🖨️ Print",
        pdfButton: "📄 Export to PDF",
        pdfTitle: "Loan Simulation Report",
        loanAmountPDF: "Loan Amount",
        ratePDF: "Interest Rate",
        termPDF: "Loan Term",
        monthlyPDF: "Monthly Payment",
        totalPDF: "Total Payment",
        interestPDF: "Total Interest",
        monthPDF: "Month",
        paymentPDF: "Payment",
        principalPDF: "Principal",
        interestColumnPDF: "Interest",
        balancePDF: "Remaining Balance"
    },

    es: {
        welcomeTitle: "Bienvenido al Simulador de Préstamos",
        welcomeDescription: "Calcula tus cuotas y administra tus finanzas fácilmente.",
        loanInformation: "📋 Información del Préstamo",
        loanAmount: "💵 Monto del Préstamo",
        interestRate: "📊 Tasa de Interés (%)",
        rateType: "📈 Tipo de Tasa de Interés",
        monthly: "Efectiva Mensual",
        annual: "Efectiva Anual",
        loanTerm: "📅 Plazo del Préstamo (Meses)",
        calculateButton: "Calcular mi Préstamo →",
        loanSummary: "📊 Resumen del Préstamo",
        monthlyPayment: "Cuota Mensual",
        totalPayment: "Pago Total",
        totalInterest: "Intereses Totales",
        amortizationTitle: "📑 Tabla de Amortización",
        paymentDetails: "Detalles de Pago",
        month: "Mes",
        payment: "Cuota",
        principal: "Capital",
        interest: "Intereses",
        balance: "Saldo Restante",
        emptyMessage: "Ingresa la información de tu préstamo para ver la tabla de amortización.",
        footer: "Loan Simulator © 2026 | Planificación Financiera Inteligente",
        amountPlaceholder: "Ingresa el monto del préstamo",
        interestPlaceholder: "Ingresa la tasa de interés",
        monthsPlaceholder: "Ingresa el número de meses",
        error: "Por favor, ingresa información válida del préstamo.",
        printButton: "🖨️ Imprimir",
        pdfButton: "📄 Exportar a PDF",
        pdfTitle: "Reporte de Simulación de Préstamo",
        loanAmountPDF: "Monto del Préstamo",
        ratePDF: "Tasa de Interés",
        termPDF: "Plazo del Préstamo",
        monthlyPDF: "Cuota Mensual",
        totalPDF: "Pago Total",
        interestPDF: "Intereses Totales",
        monthPDF: "Mes",
        paymentPDF: "Cuota",
        principalPDF: "Capital",
        interestColumnPDF: "Intereses",
        balancePDF: "Saldo Restante"
    }
};

let currentLanguage = "en";
let hasCalculated = false;


// CHANGE LANGUAGE

function changeLanguage(language) {
    currentLanguage = language;
    document.documentElement.lang = language;

    document.title = language === "es"
        ? "Simulador de Préstamos"
        : "Loan Simulator";

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        element.textContent = translations[language][key];
    });

    document.querySelectorAll("[data-placeholder]").forEach(element => {
        const key = element.getAttribute("data-placeholder");
        element.placeholder = translations[language][key];
    });

    if (!hasCalculated) {
        showEmptyMessage();
    }
}


// EMPTY TABLE MESSAGE

function showEmptyMessage() {
    document.getElementById("schedule").innerHTML = `
        <tr>
            <td colspan="5" class="empty-message">
                ${translations[currentLanguage].emptyMessage}
            </td>
        </tr>
    `;
}


// LOAN CALCULATION

function calculateLoan() {
    const amount = parseFloat(document.getElementById("amount").value);
    const interest = parseFloat(document.getElementById("interest").value);
    const rateType = document.getElementById("rateType").value;
    const months = Number(document.getElementById("months").value);

    if (
        !Number.isFinite(amount) ||
        !Number.isFinite(interest) ||
        amount <= 0 ||
        interest < 0 ||
        !Number.isInteger(months) ||
        months <= 0
    ) {
        alert(translations[currentLanguage].error);
        return;
    }

    let monthlyRate;

    if (rateType === "monthly") {
        monthlyRate = interest / 100;
    } else {
        monthlyRate = Math.pow(1 + interest / 100, 1 / 12) - 1;
    }

    let payment;

    if (monthlyRate === 0) {
        payment = amount / months;
    } else {
        payment = amount * monthlyRate /
            (1 - Math.pow(1 + monthlyRate, -months));
    }

    let balance = amount;
    let totalInterest = 0;
    let scheduleHTML = "";

    for (let month = 1; month <= months; month++) {
        const interestPayment = balance * monthlyRate;
        let principalPayment = payment - interestPayment;
        let actualPayment = payment;

        if (month === months) {
            principalPayment = balance;
            actualPayment = principalPayment + interestPayment;
        }

        balance -= principalPayment;

        if (Math.abs(balance) < 0.000001) {
            balance = 0;
        }

        totalInterest += interestPayment;

        scheduleHTML += `
            <tr>
                <td>${month}</td>
                <td>${actualPayment.toFixed(2)}</td>
                <td>${principalPayment.toFixed(2)}</td>
                <td>${interestPayment.toFixed(2)}</td>
                <td>${balance.toFixed(2)}</td>
            </tr>
        `;
    }

    document.getElementById("monthlyPayment").textContent =
        payment.toFixed(2);

    document.getElementById("totalPayment").textContent =
        (amount + totalInterest).toFixed(2);

    document.getElementById("totalInterest").textContent =
        totalInterest.toFixed(2);

    document.getElementById("schedule").innerHTML = scheduleHTML;

    hasCalculated = true;
}


// PRINT FUNCTION

function printSimulation() {
    if (!hasCalculated) {
        alert(translations[currentLanguage].error);
        return;
    }

    window.print();
}


// EXPORT PDF FUNCTION

function exportPDF() {
    if (!hasCalculated) {
        alert(translations[currentLanguage].error);
        return;
    }

    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert("PDF library could not be loaded. Check your internet connection and try again.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const t = translations[currentLanguage];

    const amount = document.getElementById("amount").value;
    const interest = document.getElementById("interest").value;
    const rateType = document.getElementById("rateType").value;
    const months = document.getElementById("months").value;

    const monthlyPayment = document.getElementById("monthlyPayment").textContent;
    const totalPayment = document.getElementById("totalPayment").textContent;
    const totalInterest = document.getElementById("totalInterest").textContent;

    // PDF TITLE

    doc.setFontSize(18);
    doc.setTextColor(16, 42, 67);
    doc.text(t.pdfTitle, 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);

    // LOAN INFORMATION

    const rateLabel = rateType === "monthly"
        ? t.monthly
        : t.annual;

    doc.text(`${t.loanAmountPDF}: ${amount}`, 14, 35);
    doc.text(`${t.ratePDF}: ${interest}% (${rateLabel})`, 14, 43);
    doc.text(`${t.termPDF}: ${months}`, 14, 51);

    // RESULTS

    doc.setFontSize(12);
    doc.setTextColor(16, 42, 67);

    doc.text(`${t.monthlyPDF}: ${monthlyPayment}`, 14, 65);
    doc.text(`${t.totalPDF}: ${totalPayment}`, 14, 73);
    doc.text(`${t.interestPDF}: ${totalInterest}`, 14, 81);

    // AMORTIZATION TABLE

    const tableRows = [];

    document.querySelectorAll("#schedule tr").forEach(row => {
        const cells = Array.from(row.querySelectorAll("td"));

        if (cells.length === 5) {
            tableRows.push(
                cells.map(cell => cell.textContent.trim())
            );
        }
    });

    if (typeof doc.autoTable !== "function") {
        alert("PDF table library could not be loaded. Check your internet connection and try again.");
        return;
    }

    doc.autoTable({
        startY: 92,

        head: [[
            t.monthPDF,
            t.paymentPDF,
            t.principalPDF,
            t.interestColumnPDF,
            t.balancePDF
        ]],

        body: tableRows,

        theme: "grid",

        headStyles: {
            fillColor: [16, 42, 67],
            textColor: 255
        },

        styles: {
            fontSize: 9,
            cellPadding: 3
        },

        margin: {
            left: 14,
            right: 14
        }
    });

    // DOWNLOAD PDF

    doc.save("Loan-Simulation.pdf");
}
