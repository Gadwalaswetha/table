let transactions = [];
let filteredTransactions = [];
let page = 1;
const transactionsPerPage = 5;
let barChartInstance = null; // Store the Chart.js instance

function generateFakeTransactions() {
    transactions = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        title: `Transaction ${i + 1}`,
        description: `Description for transaction ${i + 1}`,
        price: Math.floor(Math.random() * 500) + 50
    }));
    filteredTransactions = transactions;
    renderTransactions();
    renderChart();
}

function renderTransactions() {
    const tableBody = document.getElementById("transactionsTable");
    tableBody.innerHTML = "";

    const start = (page - 1) * transactionsPerPage;
    const end = start + transactionsPerPage;
    const displayedTransactions = filteredTransactions.slice(start, end);

    displayedTransactions.forEach((t) => {
        const row = `<tr>
            <td>${t.title}</td>
            <td>${t.description}</td>
            <td>$${t.price}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });

    if (displayedTransactions.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="3">No transactions found</td></tr>`;
    }

    document.getElementById("pageNumber").innerText = `Page ${page}`;
    renderChart(); // Update the chart when transactions change
}

function renderChart() {
    const priceRanges = ["$0-$100", "$100-$200", "$200-$300", "$300-$400", "$400-$500"];
    const counts = [0, 0, 0, 0, 0];

    filteredTransactions.forEach((t) => {
        if (t.price <= 100) counts[0]++;
        else if (t.price <= 200) counts[1]++;
        else if (t.price <= 300) counts[2]++;
        else if (t.price <= 400) counts[3]++;
        else counts[4]++;
    });

    if (barChartInstance) {
        barChartInstance.destroy(); // Remove previous chart instance
    }

    const ctx = document.getElementById("barChart").getContext("2d");
    barChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: priceRanges,
            datasets: [{
                label: "Number of Items",
                data: counts,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderRadius: 5,
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 800,
                easing: "easeInOutCubic"
            }
        }
    });
}

document.getElementById("searchBox").addEventListener("input", (e) => {
    const searchText = e.target.value.toLowerCase();
    filteredTransactions = transactions.filter((t) =>
        t.title.toLowerCase().includes(searchText) ||
        t.description.toLowerCase().includes(searchText) ||
        t.price.toString().includes(searchText)
    );
    page = 1;
    renderTransactions();
});

document.getElementById("prevPage").addEventListener("click", () => {
    if (page > 1) {
        page--;
        renderTransactions();
    }
});

document.getElementById("nextPage").addEventListener("click", () => {
    if (page < Math.ceil(filteredTransactions.length / transactionsPerPage)) {
        page++;
        renderTransactions();
    }
});

document.getElementById("monthSelector").addEventListener("change", generateFakeTransactions);

generateFakeTransactions(); // Initial load
