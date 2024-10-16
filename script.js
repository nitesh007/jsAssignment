const data = [
    { endpoint: "/home", time: '2023-10-08T02:18:17.735Z', requests: 2364, special: true },
    { endpoint: "/home", time: '2023-10-07T02:23:17.735Z', requests: 1132 },
    { endpoint: "/home", time: '2023-10-06T02:03:17.735Z', requests: 3433, special: true },
    { endpoint: "/product", time: '2023-10-07T02:13:17.735Z', requests: 1563 },
    { endpoint: "/product", time: '2023-10-06T02:12:17.735Z', requests: 1563 },
    { endpoint: "/contact", time: '2023-10-07T02:13:17.735Z', requests: 2298, special: true },
    { endpoint: "/product", time: '2023-10-08T02:17:17.735Z', requests: 3198, special: true },
    { endpoint: "/contact", time: '2023-10-08T02:13:17.735Z', requests: 1950, special: true },
    { endpoint: "/contact", time: '2023-10-06T02:01:17.735Z', requests: 2800 },
];

const ctx = document.getElementById('lineChart').getContext('2d');
let lineChart;

function createChart(filteredData) {
    if (lineChart) {
        lineChart.destroy(); // Destroy the previous chart instance if it exists
    }
    console.log(filteredData);
    const groupedData = groupDataByEndpoint(filteredData);
    const datasets = Object.keys(groupedData).map(endpoint => ({
        label: endpoint,
        data: groupedData[endpoint].map(item => ({
            x: new Date(item.time),
            y: item.requests,
        })),
        fill: false,
        borderColor: getRandomColor(),
        tension: 0.1,
    }));
    lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets,
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                    },
                    title: {
                        display: true,
                        text: 'Time',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Requests',
                    },
                },
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => {
                            const { dataset, parsed } = tooltipItem;
                            return `${dataset.label}: ${parsed.y} requests`;
                        }
                    }
                }
            },
        },
    });
}

function groupDataByEndpoint(data) {
    const grouped = {};
    data.forEach(item => {
        if (!grouped[item.endpoint]) {
            grouped[item.endpoint] = [];
        }
        grouped[item.endpoint].push(item);
    });
    return grouped;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function applyFilters() {
    const endpointFilter = document.getElementById('endpointFilter').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    let filteredData = data;

    if (endpointFilter === 'special') {
        filteredData = filteredData.filter(d => d.special);
    }

    if (startDate && endDate) {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        filteredData = filteredData.filter(d => {
            const time = new Date(d.time).getTime();
            return time >= start && time <= end;
        });
    }

    createChart(filteredData);
}

// Initialize chart with all data on load
window.onload = () => {
    createChart(data);
};
