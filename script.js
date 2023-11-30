const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// Retrieve transactions from local storage or set an empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Function to add transaction
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('Please add a description and amount');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);

        updateValues();

        updateLocalStorage();

        text.value = '';
        amount.value = '';
    }
}

// Generate unique ID for transactions
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Function to add transactions to the DOM list
function addTransactionDOM(transaction) {
    const item = document.createElement('li');
    const sign = transaction.amount < 0 ? '-' : '+';
    const type = transaction.amount < 0 ? 'minus' : 'plus';

    item.classList.add(type);

    item.innerHTML = `
        <span class="transaction-text">${transaction.text}</span>
        <span class="transaction-amount">${sign}${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">Remove</button>
    `;

    list.appendChild(item);

    // Add animation to new transactions
    item.classList.add('new-transaction');
    setTimeout(() => {
        item.classList.remove('new-transaction');
    }, 500);
}

// Function to update balance, income, and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    balance.innerText = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;
}

// Function to remove transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();

    init();
}

// Function to update local storage transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Function to initialize the app
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

// Initialize the app
init();

// Event listener for adding transactions
form.addEventListener('submit', addTransaction);
