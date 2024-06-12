function toggleFields() {
    const type = document.getElementById('type').value;
    const salaryFields = document.getElementById('salary-fields');
    const taxFields = document.getElementById('tax-fields');

    if (type === 'salary') {
        salaryFields.classList.remove('hidden');
        taxFields.classList.add('hidden');
    } else if (type === 'tax') {
        salaryFields.classList.add('hidden');
        taxFields.classList.remove('hidden');
    }
}

function calculate() {
    const type = document.getElementById('type').value;
    const resultDiv = document.getElementById('result');
    let result;

    if (type === 'salary') {
        const monthlySalary = parseFloat(document.getElementById('monthly-salary').value);
        const bonus = parseFloat(document.getElementById('bonus').value) || 0;
        const otherIncome = parseFloat(document.getElementById('other-income').value) || 0;

        const yearlySalary = (monthlySalary * 12) + bonus + otherIncome; // Calculate total yearly salary
        const oneThird = yearlySalary / 3;
        const twoThirds = yearlySalary - oneThird;

        let tax = 0;
        let taxableIncome = 0;

        // Calculate tax on the excess amount above 450,000 for one third portion
        if (oneThird > 450000) {
            taxableIncome += (oneThird - 450000);
        }

        // Calculate tax on the remaining two thirds portion
        if (twoThirds > 350000) {
            taxableIncome += (twoThirds - 350000);
            tax += 5000; // Minimum tax for the 350,000 to 450,000 slab
            taxableIncome -= 100000;

            // Tax for the slab over 450,000 up to 750,000
            if (taxableIncome > 0) {
                tax += taxableIncome * 0.10;
                taxableIncome -= 300000;

                // Tax for the slab over 750,000 up to 1,150,000
                if (taxableIncome > 0) {
                    tax += taxableIncome * 0.15;
                    taxableIncome -= 400000;

                    // Tax for the slab over 1,150,000 up to 1,650,000
                    if (taxableIncome > 0) {
                        tax += taxableIncome * 0.20;
                        taxableIncome -= 500000;
                        if (taxableIncome > 0) {
                            tax += taxableIncome * 0.25;
                        }
                    }
                }
            }
        }

        const monthlyTax = tax / 12;
        result = `For a yearly salary of BDT ${yearlySalary.toFixed(2)}, the total yearly tax amount is BDT ${tax.toFixed(2)}, which is approximately BDT ${monthlyTax.toFixed(2)} per month.`;

    } else if (type === 'tax') {
        let monthlyTax = parseFloat(document.getElementById('monthly-tax').value);

        // Ensure tax is not less than 5000
        monthlyTax = Math.max(monthlyTax, 5000 / 12);

        const yearlyTax = monthlyTax * 12; // Convert monthly tax to yearly tax

        if (yearlyTax < 5000) {
            result = 'The minimum tax amount is BDT 5000. Please enter a value of 5000 or more.';
        } else if (yearlyTax == 5000) {
            result = 'The tax amount of BDT 5000 corresponds to a salary range from BDT 350,000 to BDT 450,000 per year (approximately BDT 26,923 to BDT 34,615 per month).';
        } else {
            let remainingTax = yearlyTax - 5000; // Remove the first 5000 for 350,000 to 450,000 range
            let salary = 450000; // Starting point after the 350,000 to 450,000 slab

            if (remainingTax <= 30000) { // Within the 450,000 to 750,000 slab
                salary += remainingTax / 0.10;
            } else {
                remainingTax -= 30000;
                salary += 300000; // Complete 450,000 to 750,000 slab

                if (remainingTax <= 60000) { // Within the 750,000 to 1,150,000 slab
                    salary += remainingTax / 0.15;
                } else {
                    remainingTax -= 60000;
                    salary += 400000; // Complete 750,000 to 1,150,000 slab

                    if (remainingTax <= 100000) { // Within the 1,150,000 to 1,650,000 slab
                        salary += remainingTax / 0.20;
                    } else {
                        remainingTax -= 100000;
                        salary += 500000; // Complete 1,150,000 to 1,650,000 slab

                        salary += remainingTax / 0.25; // For amounts above 1,650,000
                    }
                }
            }

            const monthlySalary = salary / 13;
            result = `To get a monthly tax amount of BDT ${monthlyTax.toFixed(2)}, the estimated monthly salary should be approximately BDT ${monthlySalary.toFixed(2)}.`;
        }
    } else {
        result = 'Invalid selection.';
    }

    resultDiv.textContent = result;
}
