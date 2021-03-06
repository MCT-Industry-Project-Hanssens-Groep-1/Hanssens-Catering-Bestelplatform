var db = firebase.firestore();

var modal = document.getElementById("profielen-modal");
var editModal = document.getElementById("edit-modal");
var confirmModal = document.getElementById("confirm-modal");

var searchBar = document.getElementById('js-search');
var scholenData = [];

var updateSchool = function(){};
var deleteSchool = function(){};

searchBar.addEventListener('keyup', (e) => {
  var searchString = e.target.value.toLowerCase();
  var filteredScholenData = scholenData.filter(school => {
      return school.naam.toLowerCase().includes(searchString);
  })
  showScholen(filteredScholenData);
});

openEditModal = (id, naam, adres, telefoonnummer) => {
  var saveButton = document.querySelector('.js-edit-save');
  var naamField = document.getElementById("naamEditField");
  var adresField = document.getElementById("adresEditField");
  var telefoonnummerField = document.getElementById("telefoonnummerEditField");

  naamField.value = naam;
  adresField.value = adres;
  telefoonnummerField.value = telefoonnummer;

  editModal.style.transform = "translate(0)";
  editModal.style.opacity = "1";

  updateSchool = () => {
    db.collection('scholen').doc(id).update({
      naam: naamField.value,
      adres: adresField.value,
      telefoonnummer: telefoonnummerField.value,
    });
    closeEditModal();
  }

  saveButton.addEventListener('click', updateSchool);
}

closeEditModal = () => {
  var saveButton = document.querySelector('.js-edit-save');

  editModal.style.transform = "translate(9999px)";
  editModal.style.opacity = "0";

  saveButton.removeEventListener('click', updateSchool);
}

openConfirmModal = (id) => {
  const confirmButton = document.querySelector('.js-confirm');

  confirmModal.style.transform = "translate(0)";
  confirmModal.style.opacity = "1";

  deleteSchool = () => {
    db.collection("scholen")
    .doc(id)
    .delete()

    db.collection("users")
    .doc(id)
    .delete()

    closeConfirmModal();
  }

  confirmButton.addEventListener('click', deleteSchool);
}

closeConfirmModal = () => {
  const confirmButton = document.querySelector('.js-confirm');

  confirmModal.style.transform = "translate(9999px)";
  confirmModal.style.opacity = "0";

  confirmButton.addEventListener('click', deleteSchool);
}

showInputLactose = () => {
    var checkBox = document.getElementById("lactoseCheckbox");
    var input = document.getElementById("lactoseField");
  
    if (checkBox.checked == true){
      input.style.display = "block";
    } else {
      input.style.display = "none";
    }
  }

showInputVarkensvlees = () => {
    var checkBox = document.getElementById("varkensvleesCheckbox");
    var input = document.getElementById("varkensvleesField");
  
    if (checkBox.checked == true){
      input.style.display = "block";
    } else {
      input.style.display = "none";
    }
  }

showInputVegetarisch = () => {
    var checkBox = document.getElementById("vegetarischCheckbox");
    var input = document.getElementById("vegetarischField");
  
    if (checkBox.checked == true){
      input.style.display = "block";
    } else {
      input.style.display = "none";
    }
  }


openModal = () => {
    modal.style.transform = "translate(0)";
    modal.style.opacity = "1";
}

closeModal = () => {
    var checkBox = document.getElementById("lactoseCheckbox");
    var input = document.getElementById("lactoseField");
    var checkBox2 = document.getElementById("varkensvleesCheckbox");
    var input2 = document.getElementById("varkensvleesField");
    var checkBox3 = document.getElementById("vegetarischCheckbox");
    var input3 = document.getElementById("vegetarischField");

    modal.style.transform = "translate(9999px)";
    modal.style.opacity = "0";

    var elements = document.getElementsByTagName("input");
    for (var ii=0; ii < elements.length; ii++) {
      if (elements[ii].type == "text") {
        elements[ii].value = "";
      }
    }

    checkBox.checked = false;
    checkBox2.checked = false;
    checkBox3.checked = false;

    input.style.display = "none";
    input2.style.display = "none";
    input3.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
      closeModal();
    } else if (event.target == editModal) {
      closeEditModal();
    } else if (event.target == confirmModal) {
      closeConfirmModal();
    }
  }

addSchool = () => {
  var checkBoxLactose = document.getElementById("lactoseCheckbox");
  var inputLactose = document.getElementById("lactoseField");
  var checkBoxVarkensvlees = document.getElementById("varkensvleesCheckbox");
  var inputVarkensvlees = document.getElementById("varkensvleesField");
  var checkBoxVegetarisch = document.getElementById("vegetarischCheckbox");
  var inputVegetarisch = document.getElementById("vegetarischField");

  var voorkeurCodes = {};

  var lactoseCode = "";
  var varkensvleesCode = "";
  var vegetarischCode = "";

  if(checkBoxLactose.checked == true) {
    lactoseCode = inputLactose.value;
    if(lactoseCode != "") {
      voorkeurCodes['Lactosevrij'] = lactoseCode;
    }
  } else {
    lactoseCode = "";
  }

  if(checkBoxVarkensvlees.checked == true) {
    varkensvleesCode = inputVarkensvlees.value;
    if(varkensvleesCode != "") {
      voorkeurCodes['Varkensvleesvrij'] = varkensvleesCode;
    }
  } else {
    varkensvleesCode = "";
  }

  if(checkBoxVegetarisch.checked == true) {
    vegetarischCode = inputVegetarisch.value;
    if(vegetarischCode != "") {
      voorkeurCodes['Vegetarisch'] = vegetarischCode;
    }
  } else {
    vegetarischCode = "";
  }

  var naamField = document.getElementById("naamField").value;
  var emailField = document.getElementById("emailField").value;
  var adresField = document.getElementById("adresField").value;
  var telefoonnummerField = document.getElementById("telefoonnummerField").value;
  var besteltijdField = document.getElementById("besteltijdField").value;

  var kleuterField = document.getElementById("kleuterField").value;
  var eersteLeerjaarField = document.getElementById("eersteLeerjaarField").value;
  var tweedeLeerjaarField = document.getElementById("tweedeLeerjaarField").value;
  var derdeLeerjaarField = document.getElementById("derdeLeerjaarField").value;
  var vierdeLeerjaarField = document.getElementById("vierdeLeerjaarField").value;
  var vijfdeLeerjaarField = document.getElementById("vijfdeLeerjaarField").value;
  var zesdeLeerjaarField = document.getElementById("zesdeLeerjaarField").value;

  var errorText = document.querySelector('.js-error');

  if(!naamField == "" && !emailField == "" && !adresField == "" && !telefoonnummerField == "" && !besteltijdField == "" && !kleuterField == "" &&  !eersteLeerjaarField == "" && !tweedeLeerjaarField == "" && !derdeLeerjaarField == "" && !vierdeLeerjaarField == "" && !vijfdeLeerjaarField == "" && !zesdeLeerjaarField == "") {
    var leerjaarCodes = {};
    var userPassword = Math.random().toString(36).slice(-8);
    leerjaarCodes['Kleuter'] = kleuterField;
    leerjaarCodes['1ste leerjaar'] = eersteLeerjaarField;
    leerjaarCodes['2de leerjaar'] = tweedeLeerjaarField;
    leerjaarCodes['3de leerjaar'] = derdeLeerjaarField;
    leerjaarCodes['4de leerjaar'] = vierdeLeerjaarField;
    leerjaarCodes['5de leerjaar'] = vijfdeLeerjaarField;
    leerjaarCodes['6de leerjaar'] = zesdeLeerjaarField;


    secondaryApp.auth().createUserWithEmailAndPassword(emailField, userPassword)
        .then((userCredential) => {
            var user = userCredential.user;
            user.updateProfile({
              displayName: naamField,
            });
            db.collection('scholen').doc(user.uid).set({
              naam: naamField,
              email: emailField,
              adres: adresField,
              telefoonnummer: telefoonnummerField,
              leerjaren: leerjaarCodes,
              voorkeuren: voorkeurCodes,
              besteltijd: besteltijdField,
            });

            db.collection('users').doc(user.uid).set({
              role: "school"
            });

            firebase.auth().sendPasswordResetEmail(emailField).then(function() {
              // Email sent.
            }).catch(function(error) {
              // An error happened.
            });

            closeModal();
            secondaryApp.auth().signOut();
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
            if (errorCode == 'auth/invalid-email') {
                errorText.innerText = "Ongeldig e-mailadres!"
              } else if (errorCode == 'auth/email-already-in-use') {
                errorText.innerText = "Gebruiker bestaat al!"
              } else if (errorCode == 'auth/weak-password') {
                errorText.innerText = "Wachtwoord moet minimum 6 karakters bevatten!"
              }
            errorText.style.opacity = "100";
        });

  } else {
    errorText.innerText = "Alle velden moeten ingevuld zijn!"
    errorText.style.opacity = "100";
  }
}

getScholen = () => {
  db.collection('scholen')
  .onSnapshot((querySnapshot) => {
    scholenData = [];
    querySnapshot.forEach((doc) => {
      var object = doc.data();
      object["id"] = doc.id;
      scholenData.push(object);
    })
    showScholen(scholenData);
  })
}

showScholen = (data) => {
  let scholenHTML = document.querySelector('.js-scholen');
  let htmlString = `<tr>
  <th>Naam</th>
  <th>Adres</th>
  <th>E-mailadres</th>
  <th>Telefoonnummer</th>
  <th></th>
  <th></th>
</tr>`

  for(var obj of data) {
    htmlString += `<tr>
    <td>${obj.naam}</td>
    <td>${obj.adres}</td>
    <td>${obj.email}</td>
    <td>${obj.telefoonnummer}</td>
    <td class="c-table-icons">
        <i class="material-icons" onclick="openEditModal('${obj.id}', '${obj.naam}', '${obj.adres}', '${obj.telefoonnummer}')">edit</i>
    </td>
    <td class="c-table-icons">
        <i class="material-icons" onclick="openConfirmModal('${obj.id}')">delete</i>
    </td>
  </tr>`
  }
  scholenHTML.innerHTML = htmlString;
}

logout = () => {
    firebase.auth().signOut();
}

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        if(localStorage.getItem('role') == "school") {
          window.location.replace('/admin/leerlingen');
        }
      }
    });

    getScholen();
});