

document.getElementById("LoginModal").style.display = "none";



document.getElementById("arksForm").addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    // Get form inputs
    const firstName = document.getElementById("firstName").value.trim();

    // Validation checks
    if (firstName.toLowerCase() !== "kuntal") {
        ShowModal("Not my <span>Cutie's </span> name","Please enter your first name<br> to continue")
        return;
    }
    else
        window.location.href = "./pages/Map.html"; // Replace with your desired page
    
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