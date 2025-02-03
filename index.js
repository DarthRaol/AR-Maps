

document.getElementById("LoginModal").style.display = "none";



document.getElementById("arksForm").addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    // Get form inputs
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    
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
        window.location.href = "LocationTnC.html"; // Replace with your desired page
    
});






function hideButton() {

    document.getElementById("LoginModal").style.display = "none";

  }


  function ShowModal(Title, InnerText) {
    document.getElementById("LoginModal").style.display = "inline";
    document.getElementById("ModalTitle").innerHTML = Title;
    document.getElementById("modal-body").innerHTML = InnerText;

  }


  function VoucherResult(bIsUserTop100,VoucherCode){
    document.getElementById(bIsUserTop100?"Above100":"Top100").style.display = "none";
    if(bIsUserTop100)
        document.getElementById("Voucher").innerHTML = VoucherCode;
  } 