<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digital Business Card ROI Calculator</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            /* Global font style for the page */
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f9f9f9; /* Page background color */
            color: #333; /* Default text color */
        }

        .calculator {
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background: #fff; /* Background color of the calculator */
            border-radius: 8px; /* Round corners for the calculator container */
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Shadow effect for elevation */
        }

        .calculator h2 {
            /* Heading styles */
            text-align: center;
            margin-bottom: 20px;
        }

        .form-group {
            /* Space between form elements */
            margin-bottom: 15px;
        }

        .form-group label {
            /* Styling for labels */
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }

        .form-group input, .form-group output, .form-group select {
            /* Styling for inputs and dropdowns */
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px; /* Rounded corners for inputs */
        }

        .form-group input[type="range"] {
            /* Styling for range slider */
            width: 100%;
        }

        .results {
            /* Styling for the results section */
            margin-top: 20px;
            text-align: center;
        }

        .results h3 {
            margin-bottom: 10px;
        }

        .summary {
            /* Layout for summary boxes */
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
            padding: 15px;
            background: #f1f1f1;
            border-radius: 8px; /* Rounded corners for summary boxes */
        }

        .summary div {
            /* Centering content within each summary box */
            text-align: center;
        }

        .summary div p {
            /* Font size and spacing for summary text */
            font-size: 1.2rem;
            margin: 5px 0;
        }

        canvas {
            /* Chart responsiveness and layout */
            max-width: 100%;
            margin: 20px auto;
        }

        .btn {
            /* Styling for the Calculate button */
            display: block;
            width: 100%;
            padding: 10px;
            background-color: #4CAF50; /* Button background color */
            color: white; /* Button text color */
            text-align: center;
            border: none;
            border-radius: 4px; /* Rounded corners for the button */
            cursor: pointer; /* Pointer cursor on hover */
        }

        .btn:hover {
            /* Button hover effect */
            background-color: #45a049; /* Slightly darker green */
        }
    </style>
</head>
<body>
    <div class="calculator">
        <h2>Digital Business Card ROI Calculator</h2>
        
        <!-- Input for the number of employees -->
        <div class="form-group">
            <label for="employees">How many employees are at your company?</label>
            <input type="number" id="employees" value="50">
        </div>

        <!-- Input for cards per employee -->
        <div class="form-group">
            <label for="cardsPerEmployee">How many business cards do you order for each employee per year?</label>
            <input type="number" id="cardsPerEmployee" value="100">
        </div>

        <!-- Input for the cost per paper card -->
        <div class="form-group">
            <label for="costPerCard">How much does each paper business card cost (in BDT)?</label>
            <input type="number" id="costPerCard" value="5">
        </div>

        <!-- Dropdown for NFC card type selection -->
        <div class="form-group">
            <label for="cardType">Choose NFC Card Type:</label>
            <select id="cardType" onchange="updateCardCost()">
                <option value="350">PVC - 350 BDT</option>
                <option value="750">Metal - 750 BDT</option>
                <option value="550">Wooden - 550 BDT</option>
            </select>
        </div>

        <!-- Display cost of NFC card -->
        <div class="form-group">
            <label>Cost of NFC card per employee (in BDT):</label>
            <p id="nfcCardCost">350 BDT</p> <!-- Updates dynamically based on dropdown -->
        </div>

        <!-- Display subscription cost -->
        <div class="form-group">
            <label>Subscription cost per employee per month (in BDT):</label>
            <p id="subscriptionCost">9 BDT</p> <!-- Hardcoded, updates if logic changes -->
        </div>

        <!-- Range slider for lifespan -->
        <div class="form-group">
            <label for="lifespan">Expected lifespan of NFC card (in years):</label>
            <input type="range" id="lifespan" min="1" max="10" value="5" oninput="updateLifespanDisplay(this.value)">
            <p id="lifespanDisplay">5 years</p> <!-- Dynamically updates as slider changes -->
        </div>

        <!-- Calculate ROI button -->
        <button class="btn" onclick="calculateROI()">Calculate ROI</button>

        <!-- Results section -->
        <div class="results" id="results">
            <h3>Return on Investment</h3>
            <div class="summary">
                <div>
                    <p>Paper Business Card Costs</p>
                    <p id="traditionalCost">BDT 0</p> <!-- Dynamically updates after calculation -->
                </div>
                <div>
                    <p>Caardify NFC Card Costs</p>
                    <p id="nfcCost">BDT 0</p> <!-- Dynamically updates after calculation -->
                </div>
                <div>
                    <p>Total Savings</p>
                    <p id="totalSavings">BDT 0</p> <!-- Dynamically updates after calculation -->
                </div>
            </div>
            <!-- Chart for visualization -->
            <canvas id="savingsChart"></canvas>
        </div>
    </div>

    <script>
        // Updates the displayed cost of the selected NFC card type
        function updateCardCost() {
            const cardType = document.getElementById('cardType');
            const nfcCardCost = cardType.value;
            document.getElementById('nfcCardCost').innerText = `${nfcCardCost} BDT`;
        }

        // Updates the lifespan display as the slider value changes
        function updateLifespanDisplay(value) {
            document.getElementById('lifespanDisplay').innerText = `${value} years`;
        }

        // Calculates ROI based on inputs and displays results
        function calculateROI() {
            const employees = parseFloat(document.getElementById('employees').value);
            const cardsPerEmployee = parseFloat(document.getElementById('cardsPerEmployee').value);
            const costPerCard = parseFloat(document.getElementById('costPerCard').value);
            const nfcCardCost = parseFloat(document.getElementById('cardType').value);
            const subscriptionCost = 9; // Hardcoded subscription cost
            const lifespan = parseFloat(document.getElementById('lifespan').value);

            const totalTraditionalCards = employees * cardsPerEmployee * lifespan;
            const traditionalCost = totalTraditionalCards * costPerCard;

            const totalNfcCost = (nfcCardCost + (subscriptionCost * 12 * lifespan)) * employees;

            const totalSavings = traditionalCost - totalNfcCost;

            document.getElementById('traditionalCost').innerText = `BDT ${traditionalCost.toFixed(2)}`;
            document.getElementById('nfcCost').innerText = `BDT ${totalNfcCost.toFixed(2)}`;
            document.getElementById('totalSavings').innerText = `BDT ${totalSavings.toFixed(2)}`;

            renderChart(traditionalCost, totalNfcCost);
        }

        // Renders the cost comparison chart
        function renderChart(traditionalCost, nfcCost) {
            const ctx = document.getElementById('savingsChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Paper Cards', 'Caardify NFC Cards'],
                    datasets: [{
                        label: 'Cost (BDT)',
                        data: [traditionalCost, nfcCost],
                        backgroundColor: ['#FF6384', '#36A2EB'], // Colors for the bars
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false // Hides legend for simplicity
                        }
                    }
                }
            });
        }
    </script>
</body>
</html>
