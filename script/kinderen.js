//###########  MODAL ##################

var modal = document.getElementById("profielen-modal");
var confirmModal = document.getElementById("confirm-modal");

openModal = () => {
    modal.style.transform = "translate(0)";
    modal.style.opacity = "1";
}

openConfirmModal = (rijksregisternummer) => {
  const confirmButton = document.querySelector('.js-confirm');

  confirmModal.style.transform = "translate(0)";
  confirmModal.style.opacity = "1";

  confirmButton.addEventListener('click', () => {
    db.collection("kinderen")
    .doc(rijksregisternummer)
    .delete()

    closeConfirmModal();
  })
}

closeModal = () => {
    var errorText = document.querySelector('.js-error');
    const selectedSchool = document.querySelector(".js-scholen-selected");
    const optionsContainerScholen = document.querySelector(".js-scholen");
    const voorkeurenHTML = document.querySelector('.js-voorkeuren');
    const leerjarenHTML = document.querySelector('.js-leerjaren');
    const klasHTML = document.querySelector('.js-klas');

    modal.style.transform = "translate(9999px)";
    modal.style.opacity = "0";

    var elements = document.getElementsByTagName("input");
    for (var ii=0; ii < elements.length; ii++) {
      if (elements[ii].type == "text") {
        elements[ii].value = "";
      }
    }

    selectedSchool.innerHTML = "Selecteer een school";
    voorkeurenHTML.innerHTML = "";
    leerjarenHTML.innerHTML = "";
    errorText.style.opacity = 0;
    klasHTML.style.display = "none";
    klasHTML.querySelector("input").placeholder = "bv. A, B, C";
    klasHTML.querySelector("input").setAttribute('maxlength', 1);
    optionsContainerScholen.classList.remove("active");
}

closeConfirmModal = () => {
  confirmModal.style.transform = "translate(9999px)";
  confirmModal.style.opacity = "0";
}

window.onclick = function(event) {
    if (event.target == modal) {
      closeModal();
    }else if (event.target == confirmModal) {
      closeConfirmModal();
    }
  }

//###########  DROPDOWN ##################

dropdownScholen = () => {
  const selectedSchool = document.querySelector(".js-scholen-selected");
  const optionsContainerScholen = document.querySelector(".js-scholen");
  const searchBoxSchool = document.querySelector(".js-scholen-search input");
  const optionsListScholen = document.querySelectorAll(".js-scholen-option");

  selectedSchool.addEventListener("click", () => {
    optionsContainerScholen.classList.toggle("active");

    searchBoxSchool.value = "";
    filterList("");

    if(optionsContainerScholen.classList.contains("active")) {
      searchBoxSchool.focus();
    }
  });

  optionsListScholen.forEach(o => {
    o.addEventListener("click", () => {
      let voorkeurenHTML = document.querySelector('.js-voorkeuren');
      let leerjarenHTML = document.querySelector('.js-leerjaren');
      let klasHTML = document.querySelector('.js-klas');
      let htmlStringVoorkeuren = "";
      let htmlStringLeerjaren = "";
      
      selectedSchool.innerHTML = o.querySelector("label").innerHTML;
      optionsContainerScholen.classList.remove("active");
      db.collection("scholen")
      .doc(o.querySelector("input").id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          var voorkeuren = doc.data().voorkeuren;
          if(Object.keys(voorkeuren).length > 0) {
            htmlStringVoorkeuren = "<h5>Voorkeuren:<h5><ul class='o-list c-option-list'>";
            for(var key in voorkeuren) {
              htmlStringVoorkeuren += `
              <li class="c-form-field--option c-option-list__item">
                <input type="radio" class="o-hide-accessible c-option c-option--hidden" name="voorkeur" id="${key}" code="${voorkeuren[key]}">
                <label class="c-label c-label--option c-custom-option" for="${key}">
                  <span class="c-custom-option__fake-input c-custom-option__fake-input--radio">
                    <span class="c-custom-option__symbol"></span>
                  </span>
                  ${key}
                </label>
              <li class="c-form-field c-form-field--option c-option-list__item">`;
            }
            htmlStringVoorkeuren+=`</ul>`
          }
          var leerjaren = doc.data().leerjaren;
          const sortedLeerjaren = Object.fromEntries(
            Object.entries(leerjaren).sort()
          );
          var value = 1;
          htmlStringLeerjaren = `<label class="c-label">Leerjaar:</label>
            <div class="select-box">
              <div class="js-leerjaar options-container">`
              for(var key in sortedLeerjaren) {
                htmlStringLeerjaren += `<div class="js-leerjaar-option option">
                <input type="radio" class="radio" id="${leerjaren[key]}" value="${value}" name="leerjaar"/>
                <label for="${key}">${key}</label>
                </div>`;
            value += 1;
          }
          htmlStringLeerjaren += `
          </div>
          <div class="js-leerjaar-selected selected">Selecteer een leerjaar</div>
          </div>`;
        }
        value = 1;
        klasHTML.style.display = "block";
        voorkeurenHTML.innerHTML = htmlStringVoorkeuren;
        leerjarenHTML.innerHTML = htmlStringLeerjaren;
        dropdownLeerjaar();
      });
    })
  });

  searchBoxSchool.addEventListener("keyup", function(e) {
    filterList(e.target.value);
  });

  const filterList = searchTerm => {
    searchTerm = searchTerm.toLowerCase();
    optionsListScholen.forEach( option => {
      let label = option.firstElementChild.nextElementSibling.innerText.toLowerCase();
      if(label.indexOf(searchTerm) != -1) {
        option.style.display = "block";
      } else {
        option.style.display = "none";
      }
    })
  }
}

dropdownLeerjaar = () => {
  const selectedLeerjaar = document.querySelector(".js-leerjaar-selected");
  const optionsContainerLeerjaar = document.querySelector(".js-leerjaar");
  const optionsListLeerjaar = document.querySelectorAll(".js-leerjaar-option");
  const klasHTML = document.querySelector('.js-klas');

  selectedLeerjaar.addEventListener("click", () => {
    optionsContainerLeerjaar.classList.toggle("active");
  });

  optionsListLeerjaar.forEach(o => {
    o.addEventListener("click", () => {
      selectedLeerjaar.innerHTML = o.querySelector("label").innerHTML;
      selectedLeerjaar.id = o.querySelector("input").id;
      selectedLeerjaar.setAttribute('value', o.querySelector("input").getAttribute('value'));
      optionsContainerLeerjaar.classList.remove("active");
      if(selectedLeerjaar.innerText == "Kleuter") {
        klasHTML.querySelector("input").placeholder = "bv. 1A, 2A, 3B";
        klasHTML.querySelector("input").setAttribute('maxlength', 2);
        klasHTML.querySelector("input").value = "";
      } else {
        klasHTML.querySelector("input").placeholder = "bv. A, B, C";
        klasHTML.querySelector("input").setAttribute('maxlength', 1);
        klasHTML.querySelector("input").value = "";
      }
    });
  });
}

//###########  FIREBASE ##################

var db = firebase.firestore()

getScholen = () => {
  let dropdownScholen = document.querySelector('.js-scholen');
  let htmlString = "";

  db.collection("scholen")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      htmlString += `<div class="js-scholen-option option">
      <input
        type="radio"
        class="radio"
        id="${doc.id}"
        name="school"
      />
      <label for="${doc.data().naam}">${doc.data().naam}</label>
    </div>`
  });
  dropdownScholen.innerHTML = htmlString;
  })
}

getProfiel = (user) => {
  let profielHTML = document.querySelector('.js-profiel');
  let htmlString = `<div class="c-profielen-subtitle">
  <h2>${user.displayName}</h2>

</div>
<div class="c-profielen-voorkeuren">
  <p><b>Email:</b> ${user.email}</p>
</div>`

  profielHTML.innerHTML = htmlString;
}

getKinderen = (user) => {
  let kinderenHTML = document.querySelector('.js-kinderen');
  db.collection("kinderen")
  .where("ouders", "array-contains", `${user.uid}`)
  .onSnapshot((querySnapshot) => {
    let htmlString = ""
    querySnapshot.forEach((doc) => {
      htmlString += `<div class="c-profielen-subtitle">
      <h2>${doc.data().naam}</h2>
      <i class="material-icons">edit</i>
      <i class="material-icons" onclick="openConfirmModal('${doc.data().rijksregisternummer}')">delete</i>
  </div>
  <div class="c-profielen-voorkeuren">
      <p><b>Voorkeur:</b> ${doc.data().voorkeur}</p>
      <p><b>School:</b> ${doc.data().school}</p>
      <p><b>Leerjaar:</b> ${doc.data().leerjaar}</p>
  </div>`
    })
    kinderenHTML.innerHTML = htmlString;
  })
}

addProfiel = () => {
  var userNaam = (document.getElementById("naamField").value).toLowerCase();
  var userVoornaam = (document.getElementById("voornaamField").value).toLowerCase();
  var userRijksregister = (document.getElementById("rijksregisterField").value).toLowerCase();
  var userSchool = document.querySelector('.js-scholen-selected').innerHTML;
  var userLeerjaar = document.querySelector('.js-leerjaar-selected');
  var userVoorkeur = document.querySelector('input[name="voorkeur"]:checked')
  var userKlas = (document.getElementById('klasField').value).toUpperCase();
  var errorText = document.querySelector('.js-error');

  let voorkeurCode = ""
  let voorkeurId = "Geen"

  if(userVoorkeur != null) {
    voorkeurId = userVoorkeur.id;
    voorkeurCode = userVoorkeur.getAttribute('code');
    console.log(voorkeurCode);
    console.log(voorkeurId);
  } else {
    if(userLeerjaar != null) {
      voorkeurCode = userLeerjaar.id;
      console.log(voorkeurCode);
      console.log(voorkeurId);
    }
  }
  if(!userLeerjaar == "") {
    var userLeerjaarNummer = userLeerjaar.getAttribute('value');
      if(userLeerjaar.getAttribute('value') == 7) {
      userLeerjaarNummer = "K";
  }
  }

  if(userLeerjaar != null) {
    if(!userNaam == "" && !userVoornaam == "" && !userRijksregister == "" && !userSchool == "" && !userLeerjaar.innerText == "" && !voorkeurCode == "" && !userKlas == "" && userSchool != "Selecteer een school" && userLeerjaar.innerText != "Selecteer een leerjaar") {
      if(userRijksregister.length == 11){
      db.collection("kinderen")
      .doc(userRijksregister)
      .set({
        naam: `${userNaam.charAt(0).toUpperCase() + userNaam.slice(1)}` + " " + `${userVoornaam.charAt(0).toUpperCase() + userVoornaam.slice(1)}`,
        voornaam: `${userVoornaam.charAt(0).toUpperCase() + userVoornaam.slice(1)}`,
        familienaam: `${userNaam.charAt(0).toUpperCase() + userNaam.slice(1)}`,
        rijksregisternummer: userRijksregister,
        school: userSchool,
        leerjaar: userLeerjaar.innerText,
        voorkeur: voorkeurId,
        code: voorkeurCode,
        ouders: [firebase.auth().currentUser.uid],
        status: "unverified",
        klas: `${userLeerjaarNummer}` + `${userKlas}`
      })
      getKinderen(firebase.auth().currentUser);
      closeModal();
      }
      else{
        errorText.innerText = "Voer een correct rijksregisternummer in."
        errorText.style.opacity = "100";
      }
    } else {
      errorText.innerText = "Alle velden moeten ingevuld zijn!"
      errorText.style.opacity = "100";
    }
  } else {
    errorText.innerText = "Alle velden moeten ingevuld zijn!"
    errorText.style.opacity = "100";
  }
}

logout = () => {
  firebase.auth().signOut();
}

document.addEventListener('DOMContentLoaded', function() {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        window.location.replace("/login")
    } else if (user) {
      getProfiel(user);
      getKinderen(user);
      getScholen();
      setTimeout(function(){ dropdownScholen(); }, 2000);
    }
  });
});