document.getElementById('calculator-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const calculationType = document.getElementById('calculation-type').value;
    const currentAge = parseInt(document.getElementById('current-age').value);
    const retirementAge = parseInt(document.getElementById('retirement-age').value);
    const currentBalance = parseFloat(document.getElementById('current-balance').value);
    const annualContribution = parseFloat(document.getElementById('annual-contribution').value);
    const employerMatch = parseFloat(document.getElementById('employer-match').value) / 100;
    const annualSalary = parseFloat(document.getElementById('annual-salary').value);
    const annualReturn = parseFloat(document.getElementById('annual-return').value) / 100;

    const years = retirementAge - currentAge;
    let futureBalance = currentBalance;
    let balances = [currentBalance];
    let contributions = [];

    if (calculationType === 'fv') {
        for (let i = 0; i < years; i++) {
            const yearlyContribution = annualContribution + (annualSalary * employerMatch);
            futureBalance += yearlyContribution;
            futureBalance *= (1 + annualReturn);
            balances.push(futureBalance);
            contributions.push(yearlyContribution);
        }
        document.getElementById('results').innerText = `Projected 401(k) Balance at Retirement: $${futureBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    } else if (calculationType === 'pv') {
        for (let i = years; i >= 0; i--) {
            const yearlyContribution = annualContribution + (annualSalary * employerMatch);
            futureBalance /= (1 + annualReturn);
            futureBalance -= yearlyContribution;
            balances.unshift(futureBalance);
            contributions.unshift(yearlyContribution);
        }
        document.getElementById('results').innerText = `Present Value Needed: $${futureBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }

    const ctx = document.getElementById('balance-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: years + 1 }, (_, i) => currentAge + i),
            datasets: [
                {
                    label: '401(k) Balance',
                    data: balances,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'Annual Contributions',
                    data: contributions,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Age'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amount ($)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
});
