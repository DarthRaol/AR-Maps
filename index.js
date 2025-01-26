

document.getElementById("LoginModal").style.display = "none";



document.getElementById("arksForm").addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    // Get form inputs
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const location = document.getElementById("Location").value;
    const termsAccepted = document.getElementById("terms").checked;

    // Validation checks
    if (!firstName) {
        ShowModal("No <span>First Name</span>","Please enter your first name<br> to continue")
        return;
    }

    if (!lastName) {
        ShowModal("No <span>Last Name</span>","Please enter your last name<br> to continue")
        return;
    }

    if (!email) {
        ShowModal("No <span>Email</span>","Please enter your email address<br> to continue")
        
        return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        ShowModal("Invalid <span>Email</span>","Please enter a valid email address<br> to continue");
        return;
    }

    if (!termsAccepted) {
        ShowModal("<span>Terms & Condition</span>","You must accept the terms and conditions<br> to continue");
        return;
    }

    // Check location and redirect if valid
    if (location === "Mumbai") {
        window.location.href = "/pages/intro.html"; // Replace with your desired page
    } else {
        ShowModal("Coming <span>Soon</span>","Right now, the ARKS store hunt is all Mumbai’s,<br> but we’re going online on 14th February 2025!<br> Stay tuned to join the fun!");
    }
});

function hideButton() {

    document.getElementById("LoginModal").style.display = "none";

  }


  function ShowModal(Title, InnerText) {
    document.getElementById("LoginModal").style.display = "inline";
    document.getElementById("ModalTitle").innerHTML = Title;
    document.getElementById("modal-body").innerHTML = InnerText;

  }