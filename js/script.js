/* =========================================================
   Savour - Restaurant Discovery & Reservation Platform
   Main JavaScript File
   COS10005 Assignment 2 - Semester 1, 2026

   This file is organised into clear sections:
   1. Restaurant Data (used by multiple pages)
   2. Mobile Menu Toggle (used on all pages)
   3. Restaurants Page (Reserve button -> reservation page)
   4. Recommendation Page (rule-based matching)
   5. Registration Page (form validation)
   6. Reservation Page (dynamic fields + validation)
   7. Bill Calculator (bonus page)

   The script runs on every page. Each section first checks
   if its target elements exist before doing anything.
   ========================================================= */


/* =========================================================
   SECTION 1: RESTAURANT DATA
   A simple array of restaurant objects. Multiple pages
   read from this same source so the data stays consistent.
   ========================================================= */
var restaurants = [
    {
        id: 1,
        name: "The Velvet Bistro",
        cuisine: "French",
        price: 95,             // average price per person (AUD)
        deposit: 50,           // deposit required for reservation
        dietary: ["vegetarian"],
        purpose: ["date", "business"]
    },
    {
        id: 2,
        name: "Sakura Garden",
        cuisine: "Japanese",
        price: 65,
        deposit: 30,
        dietary: ["vegan", "vegetarian"],
        purpose: ["date", "business", "family"]
    },
    {
        id: 3,
        name: "Spice Route",
        cuisine: "Indian",
        price: 45,
        deposit: 20,
        dietary: ["vegan", "vegetarian", "halal"],
        purpose: ["family", "business"]
    },
    {
        id: 4,
        name: "La Bella Trattoria",
        cuisine: "Italian",
        price: 55,
        deposit: 25,
        dietary: ["vegetarian"],
        purpose: ["family", "date"]
    },
    {
        id: 5,
        name: "Olive & Vine",
        cuisine: "Mediterranean",
        price: 75,
        deposit: 40,
        dietary: ["vegan", "vegetarian", "halal"],
        purpose: ["date", "business"]
    },
    {
        id: 6,
        name: "Bahar Grill",
        cuisine: "Middle Eastern",
        price: 40,
        deposit: 20,
        dietary: ["halal", "vegetarian"],
        purpose: ["family", "business"]
    }
];


/* =========================================================
   SECTION 2: MOBILE MENU TOGGLE
   On mobile, the navigation is hidden. The hamburger button
   shows/hides it by toggling the "open" class.
   ========================================================= */
var menuButton = document.getElementById('menu-toggle');
var mainNav = document.getElementById('main-nav');

if (menuButton && mainNav) {
    menuButton.addEventListener('click', function () {
        mainNav.classList.toggle('open');
    });
}


/* =========================================================
   SECTION 3: RESTAURANTS PAGE - RESERVE BUTTONS
   When a user clicks "Reserve" on a restaurant card,
   we send them to reservation.html with the restaurant id
   in the URL (so reservation page can pre-fill the form).
   The HTML buttons already have href="reservation.html?id=X"
   so no JS is strictly required here — but we keep this
   note for clarity.
   ========================================================= */
// (No JS needed - links use ?id= URL parameter)


/* =========================================================
   SECTION 4: RECOMMENDATION PAGE
   Read the user's 3 choices (dietary, budget, purpose),
   loop through every restaurant, and keep the ones
   that match ALL 3 conditions. Display them on the page.
   ========================================================= */
var recommendForm = document.getElementById('recommend-form');

if (recommendForm) {
    recommendForm.addEventListener('submit', function (event) {
        // Stop the page from reloading
        event.preventDefault();

        // Step 1: Read what the user selected
        var dietaryChoice = document.getElementById('dietary').value;
        var budgetChoice = document.getElementById('budget').value;
        var purposeChoice = document.getElementById('purpose').value;

        // Step 2: Loop through all restaurants and keep the matches
        var matches = [];
        for (var i = 0; i < restaurants.length; i++) {
            var r = restaurants[i];

            // Check dietary: pass if user picked "none" OR restaurant supports it
            var dietaryOk = false;
            if (dietaryChoice === 'none') {
                dietaryOk = true;
            } else if (r.dietary.indexOf(dietaryChoice) !== -1) {
                dietaryOk = true;
            }
            
            // Check budget: each restaurant's price must fit the chosen range
            var budgetOk = false;
            if (budgetChoice === 'low' && r.price <= 50) {
                budgetOk = true;
            } else if (budgetChoice === 'mid' && r.price > 50 && r.price <= 80) {
                budgetOk = true;
            } else if (budgetChoice === 'high' && r.price > 80) {
                budgetOk = true;
            }

            // Check purpose: restaurant must list this dining purpose
            var purposeOk = false;
            if (r.purpose.indexOf(purposeChoice) !== -1) {
                purposeOk = true;
            }

            // Add to matches only if ALL three conditions are true
            if (dietaryOk && budgetOk && purposeOk) {
                matches.push(r);
            }
        }

        // Step 3: Show the results on the page
        displayRecommendations(matches);
    });
}

// Helper function: builds the HTML for the recommendation results
function displayRecommendations(matches) {
    var resultsArea = document.getElementById('recommendation-results');
    var resultsList = document.getElementById('results-list');

    // If no matches were found, show a friendly message
    if (matches.length === 0) {
        resultsList.innerHTML =
            '<div class="no-results">' +
            '<h3>No exact matches found</h3>' +
            '<p>Try adjusting your preferences for more options.</p>' +
            '</div>';
    } else {
        // Build a card for each matched restaurant
        var html = '';
        for (var i = 0; i < matches.length; i++) {
            var r = matches[i];
            html += '<div class="restaurant-card">';
            html += '  <div class="card-body">';
            html += '    <span class="cuisine-tag">' + r.cuisine + '</span>';
            html += '    <h3>' + r.name + '</h3>';
            html += '    <p class="description">Average $' + r.price + ' per person · Deposit $' + r.deposit + '</p>';
            html += '    <a href="reservation.html?id=' + r.id + '" class="btn btn-primary">Reserve This Restaurant</a>';
            html += '  </div>';
            html += '</div>';
        }
        resultsList.innerHTML = html;
    }

    // Show the results section and scroll to it
    resultsArea.classList.add('show');
    resultsArea.scrollIntoView({ behavior: 'smooth' });
}


/* =========================================================
   SECTION 5: REGISTRATION PAGE - FORM VALIDATION
   We check each field one by one. If any check fails,
   we show an error message and stop the form submitting.
   ========================================================= */
var registerForm = document.getElementById('register-form');

if (registerForm) {
    registerForm.addEventListener('submit', function (event) {
        // Always stop default submission so we can check the form first
        event.preventDefault();

        // Clear any previous errors before checking again
        clearAllErrors();

        // Read all field values
        var username = document.getElementById('username').value.trim();
        var email = document.getElementById('email').value.trim();
        var phone = document.getElementById('phone').value.trim();
        var password = document.getElementById('password').value;
        var confirmPassword = document.getElementById('confirm-password').value;
        var gender = getRadioValue('gender');
        var country = document.getElementById('country').value;

        // A flag we set to false if anything is invalid
        var formIsValid = true;

        // ---- Check 1: Username ----
        // Required, at least 5 chars, letters/numbers/underscore only
        if (username === '') {
            showError('username', 'Username is required.');
            formIsValid = false;
        } else if (username.length < 5) {
            showError('username', 'Username must be at least 5 characters.');
            formIsValid = false;
        } else if (/^[A-Za-z0-9_]+$/.test(username) === false) {
            showError('username', 'Only letters, numbers, and underscores are allowed.');
            formIsValid = false;
        }

        // ---- Check 2: Email ----
        // Required and must be a valid email format
        if (email === '') {
            showError('email', 'Email is required.');
            formIsValid = false;
        } else if (isValidEmail(email) === false) {
            showError('email', 'Please enter a valid email address.');
            formIsValid = false;
        }

        // ---- Check 3: Phone ----
        // Digits only, between 8 and 15 digits
        if (phone === '') {
            showError('phone', 'Phone number is required.');
            formIsValid = false;
        } else if (/^[0-9]+$/.test(phone) === false) {
            showError('phone', 'Phone must contain digits only.');
            formIsValid = false;
        } else if (phone.length < 8 || phone.length > 15) {
            showError('phone', 'Phone must be between 8 and 15 digits.');
            formIsValid = false;
        }

        // ---- Check 4: Password ----
        // At least 10 chars, must include upper, lower, number, special char
        if (password === '') {
            showError('password', 'Password is required.');
            formIsValid = false;
        } else if (isStrongPassword(password) === false) {
            showError('password',
                'Password must be 10+ characters and include uppercase, lowercase, a number, and a special character.');
            formIsValid = false;
        }

        // ---- Check 5: Confirm Password ----
        // Must match the password
        if (confirmPassword === '') {
            showError('confirm-password', 'Please confirm your password.');
            formIsValid = false;
        } else if (confirmPassword !== password) {
            showError('confirm-password', 'Passwords do not match.');
            formIsValid = false;
        }

        // ---- Check 6: Gender ----
        // Must be selected
        if (gender === '') {
            showError('gender', 'Please select a gender.');
            formIsValid = false;
        }

        // ---- Check 7: Country ----
        // Must be selected
        if (country === '') {
            showError('country', 'Please select your country.');
            formIsValid = false;
        }

        // If everything passed, show success and submit the form
        if (formIsValid) {
            var summary = document.getElementById('form-summary');
            summary.textContent = 'Registration successful! Your account has been created.';
            summary.className = 'form-summary success';
            // In a real site we'd submit. Here we just reset the form.
            registerForm.reset();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            var summary = document.getElementById('form-summary');
            summary.textContent = 'Please fix the errors below before submitting.';
            summary.className = 'form-summary error';
        }
    });
}

// Helper: check if a string looks like an email
function isValidEmail(email) {
    // Simple pattern: text@text.text
    var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}

// Helper: check if a password is strong enough
function isStrongPassword(password) {
    if (password.length < 10) return false;
    if (/[A-Z]/.test(password) === false) return false;       // need uppercase
    if (/[a-z]/.test(password) === false) return false;       // need lowercase
    if (/[0-9]/.test(password) === false) return false;       // need a number
    if (/[^A-Za-z0-9]/.test(password) === false) return false; // need a special char
    return true;
}

// Helper: get the selected value from a group of radio buttons
function getRadioValue(name) {
    var radios = document.getElementsByName(name);
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
    return '';
}

// Helper: show an error message for a specific field
function showError(fieldId, message) {
    var errorElement = document.getElementById('error-' + fieldId);
    var field = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    if (field) {
        field.classList.add('error-field');
    }
}

// Helper: clear all error messages on the page
function clearAllErrors() {
    var errors = document.querySelectorAll('.error-message');
    for (var i = 0; i < errors.length; i++) {
        errors[i].classList.remove('show');
        errors[i].textContent = '';
    }
    var fields = document.querySelectorAll('.error-field');
    for (var i = 0; i < fields.length; i++) {
        fields[i].classList.remove('error-field');
    }
    var summary = document.getElementById('form-summary');
    if (summary) {
        summary.className = 'form-summary';
        summary.textContent = '';
    }
}


/* =========================================================
   SECTION 6: RESERVATION PAGE
   This page has 3 jobs:
   (a) Pre-fill the restaurant if ?id= is in the URL
   (b) Update deposit and show/hide payment fields dynamically
   (c) Validate the form on submit
   ========================================================= */
var reservationForm = document.getElementById('reservation-form');

if (reservationForm) {
    // ----- (a) PRE-FILL FROM URL -----
    // Read ?id=X from the URL (set when user clicks Reserve elsewhere)
    var urlParams = new URLSearchParams(window.location.search);
    var preselectedId = urlParams.get('id');
    if (preselectedId) {
        var dropdown = document.getElementById('restaurant');
        dropdown.value = preselectedId;
        updateDeposit();   // make sure deposit updates too
    }

    // Set the minimum reservation date to today (prevents picking past dates)
    var dateInput = document.getElementById('reservation-date');
    var today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);


    // ----- (b) DYNAMIC FIELDS -----

    // When the restaurant changes, update the deposit amount shown
    document.getElementById('restaurant').addEventListener('change', updateDeposit);

    // When the payment method changes, show the correct extra fields
    var paymentRadios = document.getElementsByName('deposit-method');
    for (var i = 0; i < paymentRadios.length; i++) {
        paymentRadios[i].addEventListener('change', updatePaymentFields);
    }

    // "Same as email address" checkbox copies the email into billing email
    document.getElementById('same-email').addEventListener('change', function () {
        var billingField = document.getElementById('billing-email');
        if (this.checked) {
            billingField.value = document.getElementById('email').value;
            billingField.setAttribute('readonly', true);
        } else {
            billingField.value = '';
            billingField.removeAttribute('readonly');
        }
    });


    // ----- (c) FORM VALIDATION ON SUBMIT -----
    reservationForm.addEventListener('submit', function (event) {
        // We let the form submit at the end, but only if everything is valid.
        clearAllErrors();

        // Read all values
        var fullName = document.getElementById('full-name').value.trim();
        var email = document.getElementById('email').value.trim();
        var phone = document.getElementById('phone').value.trim();
        var restaurantId = document.getElementById('restaurant').value;
        var resDate = document.getElementById('reservation-date').value;
        var resTime = document.getElementById('reservation-time').value;
        var people = document.getElementById('people').value;
        var paymentMethod = getRadioValue('deposit-method');
        var billingEmail = document.getElementById('billing-email').value.trim();

        var formIsValid = true;

        // Required: full name
        if (fullName === '') {
            showError('full-name', 'Full name is required.');
            formIsValid = false;
        }

        // Required: valid email
        if (email === '') {
            showError('email', 'Email is required.');
            formIsValid = false;
        } else if (isValidEmail(email) === false) {
            showError('email', 'Please enter a valid email address.');
            formIsValid = false;
        }

        // Required: phone with at least 10 digits
        if (phone === '') {
            showError('phone', 'Phone number is required.');
            formIsValid = false;
        } else if (/^[0-9]+$/.test(phone) === false) {
            showError('phone', 'Phone must contain digits only.');
            formIsValid = false;
        } else if (phone.length < 10) {
            showError('phone', 'Phone must be at least 10 digits.');
            formIsValid = false;
        }

        // Required: restaurant must be selected
        if (restaurantId === '') {
            showError('restaurant', 'Please select a restaurant.');
            formIsValid = false;
        }

        // Required: date must not be in the past
        if (resDate === '') {
            showError('reservation-date', 'Please choose a date.');
            formIsValid = false;
        } else {
            var chosen = new Date(resDate);
            var todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            if (chosen < todayDate) {
                showError('reservation-date', 'Date cannot be in the past.');
                formIsValid = false;
            }
        }

        // Required: time
        if (resTime === '') {
            showError('reservation-time', 'Please choose a time.');
            formIsValid = false;
        }

        // Required: number of people > 0
        if (people === '' || parseInt(people) <= 0) {
            showError('people', 'Number of people must be greater than 0.');
            formIsValid = false;
        }

        // Required: deposit method must be selected
        if (paymentMethod === '') {
            showError('deposit-method', 'Please choose a deposit method.');
            formIsValid = false;
        }

        // If Online Payment is selected, check the credit card format
        if (paymentMethod === 'online') {
            var cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
            var cardType = document.getElementById('card-type').value;
            if (cardNumber === '') {
                showError('card-number', 'Credit card number is required.');
                formIsValid = false;
            } else if (/^[0-9]+$/.test(cardNumber) === false) {
                showError('card-number', 'Card number must contain digits only.');
                formIsValid = false;
            } else {
                // Visa/Mastercard = 16 digits, Amex = 15 digits
                if (cardType === 'amex' && cardNumber.length !== 15) {
                    showError('card-number', 'American Express card must be 15 digits.');
                    formIsValid = false;
                } else if ((cardType === 'visa' || cardType === 'mastercard') && cardNumber.length !== 16) {
                    showError('card-number', 'Visa/Mastercard must be 16 digits.');
                    formIsValid = false;
                }
            }
        }

        // Note: per the brief, voucher code does not require validation,
        // but we still check it isn't empty for user friendliness.
        if (paymentMethod === 'voucher') {
            var voucherCode = document.getElementById('voucher-code').value.trim();
            if (voucherCode === '') {
                showError('voucher-code', 'Please enter your voucher code.');
                formIsValid = false;
            }
        }

        // Billing email - if not using "same as email", validate it
        var sameEmailChecked = document.getElementById('same-email').checked;
        if (sameEmailChecked === false) {
            if (billingEmail === '') {
                showError('billing-email', 'Billing email is required.');
                formIsValid = false;
            } else if (isValidEmail(billingEmail) === false) {
                showError('billing-email', 'Please enter a valid billing email.');
                formIsValid = false;
            }
        }

        // If anything failed, stop the form here
        if (formIsValid === false) {
            event.preventDefault();
            var summary = document.getElementById('form-summary');
            summary.textContent = 'Please fix the errors below before submitting.';
            summary.className = 'form-summary error';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // If valid, the form submits naturally via POST to the action URL.
    });
}

// Update the deposit display based on which restaurant is selected
function updateDeposit() {
    var dropdown = document.getElementById('restaurant');
    var depositBox = document.getElementById('deposit-amount');
    var selectedId = dropdown.value;

    if (selectedId === '') {
        depositBox.textContent = '$0';
        return;
    }

    // Find the chosen restaurant in our array
    for (var i = 0; i < restaurants.length; i++) {
        if (restaurants[i].id == selectedId) {
            depositBox.textContent = '$' + restaurants[i].deposit;
            return;
        }
    }
}

// Show or hide payment-specific fields based on the chosen method
function updatePaymentFields() {
    var method = getRadioValue('deposit-method');
    var voucherSection = document.getElementById('voucher-section');
    var cardSection = document.getElementById('card-section');

    if (method === 'voucher') {
        voucherSection.classList.add('active');
        cardSection.classList.remove('active');
    } else if (method === 'online') {
        voucherSection.classList.remove('active');
        cardSection.classList.add('active');
    } else {
        voucherSection.classList.remove('active');
        cardSection.classList.remove('active');
    }
}


/* =========================================================
   SECTION 7: BILL CALCULATOR (BONUS)
   The user picks a restaurant, group size, and optional
   dishes. We add everything up and update the summary live.
   ========================================================= */
var billPage = document.getElementById('bill-form');

if (billPage) {
    // Restaurant dish lists. Keyed by restaurant id.
    var dishMenus = {
        1: [ // The Velvet Bistro
            { name: 'Coq au Vin',           price: 38 },
            { name: 'Beef Bourguignon',     price: 42 },
            { name: 'Crème Brûlée',         price: 14 },
            { name: 'French Onion Soup',    price: 16 }
        ],
        2: [ // Sakura Garden
            { name: 'Omakase Sushi Set',    price: 55 },
            { name: 'Wagyu Tataki',         price: 32 },
            { name: 'Matcha Tiramisu',      price: 12 },
            { name: 'Miso Soup',            price: 6  }
        ],
        3: [ // Spice Route
            { name: 'Butter Chicken',       price: 22 },
            { name: 'Lamb Rogan Josh',      price: 26 },
            { name: 'Garlic Naan',          price: 5  },
            { name: 'Mango Lassi',          price: 7  }
        ],
        4: [ // La Bella Trattoria
            { name: 'Truffle Risotto',      price: 28 },
            { name: 'Osso Buco',            price: 36 },
            { name: 'Tiramisu',             price: 12 },
            { name: 'Burrata Caprese',      price: 18 }
        ],
        5: [ // Olive & Vine
            { name: 'Grilled Lamb Souvlaki', price: 32 },
            { name: 'Seafood Paella',        price: 38 },
            { name: 'Baklava',               price: 11 },
            { name: 'Mezze Platter',         price: 22 }
        ],
        6: [ // Bahar Grill
            { name: 'Mixed Grill Plate',    price: 28 },
            { name: 'Lamb Shawarma',        price: 22 },
            { name: 'Hummus & Pita',        price: 10 },
            { name: 'Baklava',              price: 9  }
        ]
    };

    // When restaurant changes, rebuild the dish list
    var billRestaurant = document.getElementById('bill-restaurant');
    billRestaurant.addEventListener('change', function () {
        renderDishOptions();
        recalculateBill();
    });

    // When the group size changes, recalculate
    document.getElementById('bill-people').addEventListener('input', recalculateBill);

    // Builds the dish checkboxes for the chosen restaurant
    function renderDishOptions() {
        var dishList = document.getElementById('dish-list');
        var chosenId = billRestaurant.value;

        if (chosenId === '' || !dishMenus[chosenId]) {
            dishList.innerHTML = '<p class="helper-text">Select a restaurant to see the menu.</p>';
            return;
        }

        var dishes = dishMenus[chosenId];
        var html = '';
        for (var i = 0; i < dishes.length; i++) {
            html += '<div class="dish-row">';
            html += '  <label>';
            html += '    <input type="checkbox" class="dish-check" data-price="' + dishes[i].price + '" onchange="recalculateBill()">';
            html += '    <span class="dish-name">' + dishes[i].name + '</span>';
            html += '  </label>';
            html += '  <span class="dish-price">$' + dishes[i].price + '</span>';
            html += '</div>';
        }
        dishList.innerHTML = html;
    }

    // Show the menu for whatever is selected on load
    renderDishOptions();
}

// Adds up the bill and updates the summary on the right
function recalculateBill() {
    var dropdown = document.getElementById('bill-restaurant');
    var peopleInput = document.getElementById('bill-people');

    if (!dropdown || !peopleInput) return;

    var chosenId = dropdown.value;
    var people = parseInt(peopleInput.value) || 0;

    // Find the chosen restaurant to get its average price
    var avgPrice = 0;
    var name = 'Not selected';
    for (var i = 0; i < restaurants.length; i++) {
        if (restaurants[i].id == chosenId) {
            avgPrice = restaurants[i].price;
            name = restaurants[i].name;
            break;
        }
    }

    // Base cost = average price per person * number of people
    var baseCost = avgPrice * people;

    // Add up checked dishes
    var dishCost = 0;
    var checks = document.querySelectorAll('.dish-check:checked');
    for (var j = 0; j < checks.length; j++) {
        dishCost += parseFloat(checks[j].getAttribute('data-price'));
    }

    // Add a 10% service charge for groups of 6 or more
    var serviceCharge = 0;
    if (people >= 6) {
        serviceCharge = (baseCost + dishCost) * 0.10;
    }

    var total = baseCost + dishCost + serviceCharge;

    // Update the summary on the right side
    document.getElementById('summary-restaurant').textContent = name;
    document.getElementById('summary-people').textContent = people;
    document.getElementById('summary-base').textContent = '$' + baseCost.toFixed(2);
    document.getElementById('summary-dishes').textContent = '$' + dishCost.toFixed(2);
    document.getElementById('summary-service').textContent = '$' + serviceCharge.toFixed(2);
    document.getElementById('summary-total').textContent = '$' + total.toFixed(2);
}
