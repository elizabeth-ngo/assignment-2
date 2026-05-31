===========================================================
SAVOUR - Restaurant Discovery & Reservation Platform
COS10005 Web Development - Assignment 2, Semester 1, 2026
===========================================================


1. WEBSITE STRUCTURE

The site is a multi-page static website built with HTML5,CSS3, and vanilla JavaScript. 
The folder layout is: wd_assign2_105562880

+-- index.html         (Home page - introduces the platform)
+-- restaurants.html   (Lists all 6 restaurants)
+-- recommend.html     (Recommendation form + JS matching)
+-- register.html      (User registration with JS validation)
+-- reservation.html   (Booking form with dynamic deposit)
+-- bill.html          (BONUS - Estimated bill calculator)
+-- Readme.txt         (This file)
|
+-- css/
|   +-- style.css      (All styles - shared by every page)
|
+-- js/
|   +-- script.js      (All scripts - shared by every page)
|
+-- images/
    +-- logo.svg
    +-- hero.svg
    +-- restaurant1.svg ... restaurant6.svg

Every page has the SAME header and footer so users can navigate anywhere from anywhere. 
The current page is highlighted in the navigation by an "active" CSS class.


2. PAGES OVERVIEW

(a) index.html
    - Hero section with welcome message and call-to-action
    - "Values" section (Convenience, Variety, Accessibility)
    - "How It Works" section (3 steps: Discover, Recommend, Reserve)
    - "Built for every diner" section (Families, Couples, Pros, Tourists)
    - Includes the hero image (hero.svg)

(b) restaurants.html
    - Displays 6 restaurants in a responsive grid (2 columns on desktop, 1 column on tablet/mobile)
    - Each card shows: name, cuisine tag, description, top 3 dishes with prices, average price/person, deposit, and a "Reserve This Restaurant" button.
    - The Reserve button passes the restaurant ID via the URL (e.g. reservation.html?id=3) so the reservation page can pre-fill the dropdown.

(c) recommend.html
    - Form with 3 dropdowns: dietary, budget, dining purpose.
    - On submit, JavaScript filters the restaurant array (rule-based) and shows the matching cards below the form.
    - "No matches" message appears if nothing fits.

(d) register.html
    - Full registration form with username, email, phone,password+confirm, gender, dietary preferences, country.
    - All required fields validated by JavaScript with clear inline error messages.

(e) reservation.html
    - Full reservation form with personal info, restaurant dropdown (auto-filled from ?id= URL parameter), 
    date and time, group size, special requests, deposit method (Voucher / Online), conditional fields, and billing email.
    - The deposit amount updates LIVE when restaurant changes.
    - The voucher / credit-card fields show/hide based on payment method selection.
    - The "Same as email" checkbox copies the email into the billing email field and makes it read-only.

(f) bill.html  (BONUS)
    - Estimated Bill Calculator
    - User picks restaurant + number of people + optional dishes.
    - Total updates LIVE on the right-hand summary panel.
    - Automatically adds a 10% service charge for groups of 6 or more people.

3. GITHUB && Mercury
- Link to Github Repository: https://github.com/elizabeth-ngo/assignment-2.git
- Github pages: https://elizabeth-ngo.github.io/assignment-2/
- Link to Mercury: https://mercury.swin.edu.au/cos10005/s105562880/wd_assign2_105562880/index.html

4. JAVASCRIPT VALIDATION LOGIC (IN PLAIN ENGLISH)

All JavaScript lives in one file: js/script.js. It is split into 7 numbered 
sections with comments at the top of each.

------ Section 1: Restaurant Data ------
A simple array of restaurant objects. Each object holds id,name, cuisine, average 
price, deposit, dietary tags, and dining purpose tags. This same array is used by 
the recommendation page, the reservation page (to look up the deposit), and the bill calculator.

------ Section 2: Mobile Menu Toggle ------
On screens 767px or narrower, the navigation is hidden and replaced by a hamburger 
button. Clicking it toggles an "open" class on the menu, which CSS uses to show/hide it.

------ Section 4: Recommendation Logic ------
When the user clicks "Find My Restaurants", the script:

  1. Reads the 3 selected values (dietary, budget, purpose).
  2. Loops through every restaurant in the array.
  3. For each restaurant it checks 3 conditions:
       - dietaryOk: passes if user selected "none" OR
         the restaurant's dietary array includes the choice.
       - budgetOk: passes if the restaurant's average price
         falls into the chosen range
         (low <= $50, mid > $50 and <= $80, high > $80).
       - purposeOk: passes if the restaurant's purpose array
         includes the chosen purpose.
  4. If all 3 are true, the restaurant is added to a "matches" array.
  5. The matches are rendered as cards under the form. If the array is empty, a friendly "no matches" message shows.

This is purely rule-based - no AI, no APIs. Easy to trace through step by step.

------ Section 5: Registration Validation ------
Runs when the user submits the registration form. We call event.preventDefault() 
so the form does not submit until we have approved every field.

The script clears any previous errors then checks every field one by one using simple if statements:

  - Username  - must not be empty
              - at least 5 chars
              - only letters / digits / underscore (regex test)
  - Email     - must not be empty
              - must match a basic email regex (text@text.text)
  - Phone     - must not be empty
              - digits only (regex)
              - 8 to 15 digits long
  - Password  - at least 10 characters
              - must contain at least one uppercase
              - must contain at least one lowercase
              - must contain at least one digit
              - must contain at least one special character
  - Confirm   - must match Password exactly
  - Gender    - one radio button must be selected
  - Country   - dropdown must not be on the default value

A "formIsValid" flag starts true and is set to false the moment any check fails. If the flag is 
still true at the end, we show the success message; otherwise the form stays on the page and the 
user can read the error labels.

Each error is displayed in a small <p> next to the field (class="error-message") and the field gets 
a red border (class="error-field"). A summary banner at the top of the form also tells the user to 
fix the errors below.

------ Section 6: Reservation Page ------
Three jobs on this page:

(A) Pre-fill from URL
    If the page is loaded with ?id=3 in the URL, JS reads the parameter using URLSearchParams, 
    sets the dropdown to that restaurant, and calls updateDeposit() to refresh the deposit box.

(B) Dynamic Updates (event listeners)
    - "change" on the restaurant dropdown -> updateDeposit() looks up the chosen restaurant 
    in the array and writes its deposit into the #deposit-amount element.
    - "change" on the payment radio -> updatePaymentFields() adds/removes the "active" class 
    on the voucher and card sections so only the relevant one is visible.
    - "change" on the "Same as email" checkbox -> copies the email value into the billing email 
    and makes it read-only; un-checking clears it again.

(C) Validation on submit
    Almost identical structure to the registration form.
    Additional checks:
    - Date must not be earlier than today (and the date input also has a min attribute as a UI safeguard).
    - People must be > 0.
    - If "Online" payment: card number must be digits and the length must match the card type (Visa/MC = 16,
      Amex = 15).
    - If "Voucher": voucher code must not be empty (the brief says no real validation is needed beyond this).
    - Billing email must be valid (unless "Same as email" is checked, in which case we skip the empty check
    because we already filled it from the main email).

    If everything passes, the form submits naturally via POST to the Mercury server action URL. If anything
    fails, event.preventDefault() stops the submission.

------ Section 7: Bill Calculator (BONUS) ------
A small interactive page that adds up:

    (avg price per person * group size)
    + (sum of any optional dishes ticked)
    + (10% service charge IF group size >= 6)

It re-runs the calculation on every "change" or "input" event so the summary on the right updates live as the
user adjusts things.

------ Helper Functions ------
A handful of small, reusable helpers sit at module level:

  isValidEmail(str)     - returns true if str looks like an email
  isStrongPassword(str) - checks length + 4 character classes
  getRadioValue(name)   - returns the value of the checked radio
                          in a group (or '' if none checked)
  showError(id, msg)    - displays an error message next to a field
                          and adds the red-border class
  clearAllErrors()      - resets every error message and red border
                          on the page

These keep the validation code short and readable.


5. RESPONSIVE DESIGN

Breakpoints used in style.css:
  - Desktop  (>= 1024px)  : default styles
  - Tablet   (768-1023px) : single-column grids, stacked layout
  - Mobile   (<= 767px)   : hamburger menu, full-width buttons,
                             reduced padding and font sizes

All grids gracefully collapse from 2-3 columns down to 1
column on smaller screens. Padding, gaps, and font sizes
scale down as well.


6. ACCESSIBILITY FEATURES

- All <img> tags have descriptive alt text.
- All form inputs have associated <label> elements.
- Sufficient colour contrast between text and background (dark ink #2A1F1A on cream
 #FBF7F0).
- Readable base font size of 16px (15px on small mobile).
- Logical heading hierarchy (one h1 per page, then h2/h3).
- A "Skip to main content" link is the first focusable item on every page (visually hidden, 
appears on focus).
- Focus styles use a high-contrast 3px gold outline.
- @media (prefers-reduced-motion: reduce) disables animations for users who prefer that.
- The mobile menu uses a real <button> with aria-label.
- <nav> elements have aria-label="Main navigation".


7. KNOWN ISSUES AND LIMITATIONS

- Restaurant images are SVG placeholders. They are styled to suit the theme of the site, 
but you may want to swap them for real photographs once the site is live. To do this: drop 
new files into the images/ folder using the same filenames, or update the src attributes in 
restaurants.html.
- The registration page does not actually save a user account anywhere - the spec says this 
page is "only a front-end form with JavaScript validation" and that no database is required. 
On success it just resets itself.
- The reservation form POSTs to a placeholder Mercury URL. 
- Browsers vary in how they style native <select>, <input type="date"> and <input type="time"> 
controls. The CSS styles them as best as is possible without third-party libraries.
- The "Voucher Code" field has a max length of 12 in the HTML but the spec asks for no validation, 
so any string up to 12 chars will pass.
- Credit card numbers are NOT processed - the spec explicitly says fake values are fine. We only check
digit count.


8. REFERENCES

- Fonts:    Fraunces & Outfit, both via Google Fonts (https://fonts.google.com).
            Free and open-source under the SIL Open Font
            License.

- Images:   All restaurant illustrations, the hero image, and the logo are original 
SVG artwork created specifically for this assignment. No third- party photographs are used.

- Icons:    Unicode emoji characters (in audience section and form options). Free to use, 
render natively on all platforms.

- Concepts: Layout inspiration drawn from typical restaurant booking platforms (OpenTable,
TheFork) but all HTML/CSS/JS code is written from scratch for this assignment.

--End of Readme.txt--
