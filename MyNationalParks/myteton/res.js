let selectedBox = null;

const boxes = document.querySelectorAll(".box");
const modal = document.getElementById("reservationModal");
const closeModal = document.getElementById("closeModal");
const form = document.getElementById("reservationForm");

const toggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

const typeSelect = document.getElementById("type");

// Types list
const types = ["Camping", "Lodging", "Food", "Attraction", "Other"];

// Populate dropdown
typeSelect.innerHTML = '<option value="">-- Select Type --</option>';
types.forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeSelect.appendChild(option);
});

// Mobile menu toggle
toggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

/* --------------------------------------------
   LOCAL STORAGE SAVE / LOAD
-------------------------------------------- */

// Save all box data
function saveAllBoxes() {
    const boxData = {};

    boxes.forEach(box => {
        boxData[box.id] = {
            html: box.innerHTML,
            filled: box.classList.contains("filled")
        };
    });

    localStorage.setItem("reservationBoxes", JSON.stringify(boxData));
}

// Load saved box data on page start
function loadAllBoxes() {
    const saved = JSON.parse(localStorage.getItem("reservationBoxes"));
    if (!saved) return;

    boxes.forEach(box => {
        const data = saved[box.id];
        if (data) {
            box.innerHTML = data.html;
            if (data.filled) box.classList.add("filled");
        }
    });
}

/* Important: Because innerHTML is replaced, reattach event listeners */
function reattachDeleteListeners() {
    boxes.forEach(box => {
        box.addEventListener("click", event => {
            if (event.target.classList.contains("close-entry")) {
                clearBox(box);
                event.stopPropagation();
            }
        });
    });
}

// Load saved data first
loadAllBoxes();
reattachDeleteListeners();

/* --------------------------------------------
   CLEAR / RESET BOX
-------------------------------------------- */

function clearBox(box) {
    box.innerHTML = "Enter Reservation Info";
    box.classList.remove("filled");
    saveAllBoxes(); // update storage
}

/* --------------------------------------------
   BOX CLICK HANDLING
-------------------------------------------- */

function handleBoxClick(box, event) {
    if (box.classList.contains("filled")) {
        // If clicking the delete X
        if (event.target.classList.contains("close-entry")) {
            clearBox(box);
            return;
        }
        // Otherwise do not open modal
        return;
    }

    selectedBox = box;
    modal.style.display = "block";
}

// Attach click listener to each box
boxes.forEach(box => {
    box.addEventListener("click", event => handleBoxClick(box, event));
});

/* --------------------------------------------
   CLOSE MODAL
-------------------------------------------- */

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Close modal when clicking outside of it
window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
});

/* --------------------------------------------
   HELPER FUNCTIONS
-------------------------------------------- */

function formatDate(dateString) {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
}

/* --------------------------------------------
   FORM SUBMISSION
-------------------------------------------- */

form.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const type = typeSelect.value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const notes = document.getElementById("notes").value;
    const photoInput = document.getElementById("photo-input");

    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);

    // Function to update the box content
    const updateBoxContent = (photoHtml) => {
        selectedBox.innerHTML = `
            <div style="padding: 10px; width: 100%; height: 100%; box-sizing: border-box; position: relative;">
                <div style="font-size: 20px; font-weight: bold; line-height: 1.2;">
                    ${name}
                    <span class="close-entry" style="float: right; font-size: 24px; cursor: pointer;">&times;</span>
                </div>
                <div style="font-size: 18px; margin-bottom: 5px;">${type}</div>
                <div style="font-size: 16px; margin-bottom: 10px;">
                    ${formattedStart} - ${formattedEnd}
                </div>
                <div style="display: flex; gap: 10px; align-items: flex-start;">
                    ${photoHtml}
                    <div style="font-size: 14px; flex-grow: 1; overflow: hidden; max-height: 80px;">
                        <strong>Notes:</strong> ${notes}
                    </div>
                </div>
            </div>
        `;

        selectedBox.classList.add("filled");
        modal.style.display = "none";
        form.reset();

        saveAllBoxes();        // 🔥 save to localStorage
        reattachDeleteListeners(); // 🔥 reattach delete buttons
    };

    // If photo uploaded
    if (photoInput.files.length > 0) {
        const file = photoInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const photoSrc = e.target.result;
            const photoHtml = `
                <img src="${photoSrc}" alt="Reservation Photo"
                style="width: 80px; height: 80px; object-fit: cover; border: 2px solid #3e5e3c;">
            `;
            updateBoxContent(photoHtml);
        };

        reader.readAsDataURL(file);

    } else {
        // No photo placeholder
        const photoHtml = `
            <div style="width: 80px; height: 80px; border: 2px solid #3e5e3c;
                        display: flex; align-items: center; justify-content: center;
                        font-size: 30px; color: #3e5e3c; position: relative;">
                <span style="transform: rotate(45deg); position: absolute;">&times;</span>
                <span style="transform: rotate(-45deg); position: absolute;">&times;</span>
            </div>
        `;
        updateBoxContent(photoHtml);
    }
});
