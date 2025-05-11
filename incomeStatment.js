document.addEventListener('DOMContentLoaded', () => {
  // Sections for navigation
  const sections = {
    income: document.getElementById('income-section'),
    balance: document.getElementById('balance-section'),
    cashflow: document.getElementById('cashflow-section'),
  };

  // Buttons for navigation
  const buttons = {
    income: document.getElementById('income-btn'),
    balance: document.getElementById('balance-btn'),
    cashflow: document.getElementById('cashflow-btn'),
  };

  // Show/Hide Sections
  Object.keys(buttons).forEach((key) => {
    buttons[key].addEventListener('click', () => {
      Object.values(sections).forEach((section) => section.classList.add('hidden'));
      sections[key].classList.remove('hidden');
    });
  });

  // Function to calculate total for a given class of inputs
  const calculateTotal = (className) => {
    const items = document.querySelectorAll(`.${className}`);
    let total = 0;
    items.forEach((item) => {
      const value = parseFloat(item.value);
      if (!isNaN(value)) {
        total += value;
      }
    });
    return total;
  };

  // Update Totals Dynamically
  const updateTotals = () => {
    // Income Statement Calculations
    const totalRevenue = calculateTotal('revenue-item');
    const beginningInventoryTotal = calculateTotal('beginning-inventory-item');
    const purchases = parseFloat(document.getElementById('purchases').value) || 0;
    const endingInventory = parseFloat(document.getElementById('ending-inventory').value) || 0;
    const totalCOGS = beginningInventoryTotal + purchases - endingInventory;
    const grossMargin = totalRevenue - totalCOGS;

    const totalOperatingExpenses = calculateTotal('op-exp-item');
    const totalNonOperatingExpenses = calculateTotal('non-op-exp-item');
    const totalExpenses = totalOperatingExpenses + totalNonOperatingExpenses;

    const operatingIncomeBeforeTax = grossMargin - totalExpenses;

    let totalTax = 0;
    const taxItems = document.querySelectorAll('.tax-item');
    taxItems.forEach((item) => {
      const percentage = parseFloat(item.value);
      if (!isNaN(percentage)) {
        totalTax += (percentage / 100) * operatingIncomeBeforeTax;
      }
    });

    const netIncome = operatingIncomeBeforeTax - totalTax;

    document.getElementById('total-revenue').textContent = totalRevenue.toFixed(2);
    document.getElementById('total-cogs').textContent = totalCOGS.toFixed(2);
    document.getElementById('gross-margin').textContent = grossMargin.toFixed(2);
    document.getElementById('total-op-exp').textContent = totalOperatingExpenses.toFixed(2);
    document.getElementById('total-non-op-exp').textContent = totalNonOperatingExpenses.toFixed(2);
    document.getElementById('total-expenses').textContent = totalExpenses.toFixed(2);
    document.getElementById('operating-income-before-tax').textContent = operatingIncomeBeforeTax.toFixed(2);
    document.getElementById('total-tax').textContent = totalTax.toFixed(2);
    document.getElementById('net-income').textContent = netIncome.toFixed(2);

    // Balance Sheet Calculations
    const totalCurrentAssets = calculateTotal('current-asset-item');
    const totalFixedAssets = calculateTotal('fixed-asset-item');
    const totalAssets = totalCurrentAssets + totalFixedAssets;

    const totalCurrentLiabilities = calculateTotal('current-liability-item');
    const totalFixedLiabilities = calculateTotal('fixed-liability-item');
    const totalLiabilities = totalCurrentLiabilities + totalFixedLiabilities;

    const commonStock = parseFloat(document.getElementById('common-stock').value) || 0;
    const preferredStock = parseFloat(document.getElementById('preferred-stock').value) || 0;
    const additionalCapital = parseFloat(document.getElementById('additional-capital').value) || 0;

    // Retained Earnings = Assets - Liabilities - (Common Stock + Preferred Stock + Additional Paid-In Capital)
    const retainedEarnings = totalAssets - totalLiabilities - (commonStock + preferredStock + additionalCapital);

    // Total Owner's Equity = Sum of all components
    const totalOwnersEquity = commonStock + preferredStock + additionalCapital + retainedEarnings;

    document.getElementById('total-current-assets').textContent = totalCurrentAssets.toFixed(2);
    document.getElementById('total-fixed-assets').textContent = totalFixedAssets.toFixed(2);
    document.getElementById('total-assets').textContent = totalAssets.toFixed(2);
    document.getElementById('total-current-liabilities').textContent = totalCurrentLiabilities.toFixed(2);
    document.getElementById('total-fixed-liabilities').textContent = totalFixedLiabilities.toFixed(2);
    document.getElementById('total-liabilities').textContent = totalLiabilities.toFixed(2);
    document.getElementById('retained-earnings').textContent = retainedEarnings.toFixed(2);
    document.getElementById('total-owners-equity').textContent = totalOwnersEquity.toFixed(2);

    // Cash Flow Statement Calculations
    const totalOperatingActivities =
      (parseFloat(document.getElementById('cash-received-customers').value) || 0) -
      (parseFloat(document.getElementById('payments-suppliers').value) || 0) -
      (parseFloat(document.getElementById('salaries-wages-paid').value) || 0) -
      (parseFloat(document.getElementById('rent-utilities').value) || 0) -
      (parseFloat(document.getElementById('taxes-paid').value) || 0);

    const totalInvestingActivities =
      (parseFloat(document.getElementById('sale-investments').value) || 0) -
      (parseFloat(document.getElementById('purchase-equipment').value) || 0) -
      (parseFloat(document.getElementById('rnd-expenses').value) || 0);

    const totalFinancingActivities =
      (parseFloat(document.getElementById('loan-proceeds').value) || 0) -
      (parseFloat(document.getElementById('loan-repayments').value) || 0) -
      (parseFloat(document.getElementById('dividend-payments').value) || 0) +
      (parseFloat(document.getElementById('stock-issuance-buyback').value) || 0);

    const netCashFlow =
      totalOperatingActivities + totalInvestingActivities + totalFinancingActivities;

    const beginningCashBalance = parseFloat(document.getElementById('beginning-cash-balance').value) || 0;
    const endingCashBalance = beginningCashBalance + netCashFlow;

    document.getElementById('total-operating-activities').textContent = totalOperatingActivities.toFixed(2);
    document.getElementById('total-investing-activities').textContent = totalInvestingActivities.toFixed(2);
    document.getElementById('total-financing-activities').textContent = totalFinancingActivities.toFixed(2);
    document.getElementById('net-cashflow').textContent = netCashFlow.toFixed(2);
    document.getElementById('ending-cash-balance').textContent = endingCashBalance.toFixed(2);
  };

  // Function to add dynamic input fields for a specific list
  const addDynamicItem = (listId, inputClass) => {
    const list = document.getElementById(listId);
    const newItem = document.createElement('div');
    newItem.innerHTML = `
      <input type="text" placeholder="Item Name">
      <input type="number" placeholder="Amount (USD)" class="${inputClass}">
    `;
    list.appendChild(newItem);

    // Add event listener to the new input fields to update totals dynamically
    newItem.querySelector(`.${inputClass}`).addEventListener('input', updateTotals);
  };

  // Attach Add Item Button Listeners
  document.getElementById('add-revenue-item').addEventListener('click', () => addDynamicItem('revenue-list', 'revenue-item'));
  document.getElementById('add-beginning-inventory-item').addEventListener('click', () => addDynamicItem('beginning-inventory-list', 'beginning-inventory-item'));
  document.getElementById('add-op-exp-item').addEventListener('click', () => addDynamicItem('op-exp-list', 'op-exp-item'));
  document.getElementById('add-non-op-exp-item').addEventListener('click', () => addDynamicItem('non-op-exp-list', 'non-op-exp-item'));
  document.getElementById('add-tax-item').addEventListener('click', () => addDynamicItem('tax-list', 'tax-item'));
  document.getElementById('add-current-asset-item').addEventListener('click', () => addDynamicItem('current-assets-list', 'current-asset-item'));
  document.getElementById('add-fixed-asset-item').addEventListener('click', () => addDynamicItem('fixed-assets-list', 'fixed-asset-item'));
  document.getElementById('add-current-liability-item').addEventListener('click', () => addDynamicItem('current-liabilities-list', 'current-liability-item'));
  document.getElementById('add-fixed-liability-item').addEventListener('click', () => addDynamicItem('fixed-liabilities-list', 'fixed-liability-item'));

  // Attach Input Listeners to Update Totals
  document.querySelectorAll('input[type="number"]').forEach((input) => {
    input.addEventListener('input', updateTotals);
  });
});