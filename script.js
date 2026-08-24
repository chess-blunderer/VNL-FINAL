/* =========================================
   GET HTML ELEMENTS
   ========================================= */

const searchBar = document.getElementById("search-bar");

const suggestionsBox = document.getElementById("suggestions");

const table = document.getElementById("infoTable");

const nameBox = document.getElementById("name");

const hometownBox = document.getElementById("hometown");

const academicsBox = document.getElementById("academics");

const college = document.getElementById("college");

const mobileBox = document.getElementById("mobile");

const emailBox = document.getElementById("email");

/* =========================================
   CONTACT DATABASE
   ========================================= */

let contacts = [];

/* =========================================
   JSON COLUMN NAMES
   ========================================= */

const COLUMNS = {
  name: "Student Name",

  hometown: "Native place",

  college: "College",

  uan: "UAN No",

  mobile: "Mob No",

  course: "Current course",

  courseYear: "Current course year",

  email: "Mail id",
};

/* =========================================
   AUTOCOMPLETE VARIABLES
   ========================================= */

let currentSuggestions = [];

let selectedIndex = -1;

/* =========================================
   LOAD CONTACTS
   ========================================= */

async function loadContacts() {
  try {
    const response = await fetch("contacts.json");

    if (!response.ok) {
      throw new Error("contacts.json could not be loaded.");
    }

    contacts = await response.json();

    console.log("Loaded " + contacts.length + " contacts.");
  } catch (error) {
    console.error(error);

    alert(
      "Could not load contacts.json. " +
        "Make sure the file is in the same " +
        "folder and use Live Server.",
    );
  }
}

/* Start loading */

loadContacts();

/* =========================================
   CLEAN TEXT
   ========================================= */

function clean(value) {
  return String(value ?? "")
    .toLowerCase()
    .trim();
}

/* =========================================
   FIND MATCHES
   ========================================= */

function findMatches(query) {
  query = clean(query);

  if (query === "") {
    return [];
  }

  return contacts.filter(function (contact) {
    const name = clean(contact[COLUMNS.name]);

    const hometown = clean(contact[COLUMNS.hometown]);

    const college = clean(contact[COLUMNS.college]);

    const uan = clean(contact[COLUMNS.uan]);

    const mobile = clean(contact[COLUMNS.mobile]);

    const email = clean(contact[COLUMNS.email]);

    return (
      name.includes(query) ||
      hometown.includes(query) ||
      college.includes(query) ||
      uan.includes(query) ||
      mobile.includes(query) ||
      email.includes(query)
    );
  });
}

/* =========================================
   SHOW AUTOCOMPLETE
   ========================================= */

function showSuggestions() {
  const query = searchBar.value.trim();

  /*
       Clear previous suggestions.
    */

  suggestionsBox.innerHTML = "";

  currentSuggestions = [];

  selectedIndex = -1;

  /*
       Empty search.
    */

  if (query === "") {
    hideSuggestions();

    return;
  }

  /*
       Find matches.
    */

  currentSuggestions = findMatches(query);

  /*
       No matches.
    */

  if (currentSuggestions.length === 0) {
    hideSuggestions();

    return;
  }

  /*
       Maximum 8 visible suggestions.
    */

  currentSuggestions = currentSuggestions.slice(0, 20);

  /*
       Create suggestions.
    */

  currentSuggestions.forEach(function (contact, index) {
    const suggestion = document.createElement("div");

    suggestion.className = "suggestion";

    /*
               Student name
            */

    const studentName = document.createElement("div");

    studentName.className = "suggestion-name";

    studentName.textContent = contact[COLUMNS.name] || "Unknown";

    /*
               Extra information
            */

    const details = document.createElement("div");

    details.className = "suggestion-details";

    const hometown = contact[COLUMNS.hometown] || "Unknown";

    const course = contact[COLUMNS.course] || "";

    details.textContent = hometown + (course ? "  •  " + course : "");

    /*
               Add elements.
            */

    suggestion.appendChild(studentName);

    suggestion.appendChild(details);

    /*
               Mouse click.
            */

    suggestion.addEventListener("mousedown", function (event) {
      /*
                       Keeps click selection
                       reliable.
                    */

      event.preventDefault();

      selectedIndex = index;

      selectSuggestion();
    });

    /*
               Mouse hover.
            */

    suggestion.addEventListener("mouseenter", function () {
      selectedIndex = index;

      updateSelection();
    });

    suggestionsBox.appendChild(suggestion);
  });

  /*
       Show dropdown.
    */

  suggestionsBox.style.display = "block";
}

/* =========================================
   UPDATE SELECTED SUGGESTION
   ========================================= */

function updateSelection() {
  const suggestions = suggestionsBox.querySelectorAll(".suggestion");

  suggestions.forEach(function (suggestion, index) {
    if (index === selectedIndex) {
      suggestion.classList.add("selected");
    } else {
      suggestion.classList.remove("selected");
    }
  });

  /*
       Keep highlighted result visible.
    */

  if (selectedIndex >= 0 && suggestions[selectedIndex]) {
    suggestions[selectedIndex].scrollIntoView({
      block: "nearest",
    });
  }
}

/* =========================================
   SELECT SUGGESTION
   ========================================= */

function selectSuggestion() {
  if (selectedIndex < 0 || selectedIndex >= currentSuggestions.length) {
    return;
  }

  const contact = currentSuggestions[selectedIndex];

  /*
       Put name into search bar.
    */

  searchBar.value = contact[COLUMNS.name];

  /*
       Close autocomplete.
    */

  hideSuggestions();

  /*
       Show information.
    */

  displayContact(contact);
}

/* =========================================
   HIDE SUGGESTIONS
   ========================================= */

function hideSuggestions() {
  suggestionsBox.style.display = "none";

  suggestionsBox.innerHTML = "";

  currentSuggestions = [];

  selectedIndex = -1;
}

/* =========================================
   DISPLAY CONTACT
   ========================================= */

function displayContact(contact) {
  /* =====================================
       NAME
       ===================================== */

  nameBox.textContent = contact[COLUMNS.name] || "N/A";

  /* =====================================
       HOMETOWN
       ===================================== */

  hometownBox.textContent = contact[COLUMNS.hometown] || "N/A";

  /* =====================================
       ACADEMICS
       ===================================== */

  const course = contact[COLUMNS.course] || "N/A";

  const year = contact[COLUMNS.courseYear] || "";

  if (year !== "") {
    academicsBox.textContent = course + " - " + year;
  } else {
    academicsBox.textContent = course;
  }

  /* =====================================
       ENROLLMENT
       ===================================== */

  college.textContent = contact[COLUMNS.college] || "N/A";

  /* =====================================
       MOBILE
       ===================================== */

  mobileBox.textContent = contact[COLUMNS.mobile] || "N/A";

  /* =====================================
       EMAIL
       ===================================== */

  emailBox.textContent = contact[COLUMNS.email] || "N/A";

  /*
       Trigger the CSS animation.

       Removing "show" first means that
       searching for another person will
       replay the animation.
    */

  table.classList.remove("show");

  /*
       Small delay allows the browser to
       register the hidden state before
       showing it again.
    */

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      table.classList.add("show");
    });
  });
}

/* =========================================
   TYPING
   ========================================= */

searchBar.addEventListener("input", function () {
  showSuggestions();
});

/* =========================================
   KEYBOARD NAVIGATION
   ========================================= */

searchBar.addEventListener("keydown", function (event) {
  /* =================================
           DOWN ARROW
           ================================= */

  if (event.key === "ArrowDown" && currentSuggestions.length > 0) {
    event.preventDefault();

    if (selectedIndex < currentSuggestions.length - 1) {
      selectedIndex++;
    } else {
      selectedIndex = 0;
    }

    updateSelection();
  } else if (event.key === "ArrowUp" && currentSuggestions.length > 0) {

  /* =================================
           UP ARROW
           ================================= */
    event.preventDefault();

    if (selectedIndex > 0) {
      selectedIndex--;
    } else {
      selectedIndex = currentSuggestions.length - 1;
    }

    updateSelection();
  } else if (event.key === "Enter") {

  /* =================================
           ENTER
           ================================= */
    event.preventDefault();

    if (selectedIndex >= 0 && currentSuggestions.length > 0) {
      selectSuggestion();
    } else {
      performSearch();
    }
  } else if (event.key === "Escape") {

  /* =================================
           ESCAPE
           ================================= */
    hideSuggestions();
  }
});

/* =========================================
   NORMAL SEARCH
   ========================================= */

function performSearch() {
  const query = searchBar.value.trim();

  if (query === "") {
    return;
  }

  const matches = findMatches(query);

  if (matches.length === 0) {
    alert("No contact found.");

    return;
  }

  /*
       Prefer an exact match.
    */

  const exactMatch = matches.find(function (contact) {
    const search = clean(query);

    return (
      clean(contact[COLUMNS.name]) === search ||
      clean(contact[COLUMNS.enrollment]) === search ||
      clean(contact[COLUMNS.uan]) === search ||
      clean(contact[COLUMNS.mobile]) === search
    );
  });

  /*
       Exact match if available,
       otherwise first result.
    */

  const contact = exactMatch || matches[0];

  hideSuggestions();

  displayContact(contact);
}

/* =========================================
   CLICK OUTSIDE
   ========================================= */

document.addEventListener("mousedown", function (event) {
  if (
    !searchBar.contains(event.target) &&
    !suggestionsBox.contains(event.target)
  ) {
    hideSuggestions();
  }
});
