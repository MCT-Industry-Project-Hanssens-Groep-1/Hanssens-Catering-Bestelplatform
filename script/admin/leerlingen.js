var db = firebase.firestore();

var unverifiedData = [], verifiedData = [], userData;

var modal = document.getElementById("profielen-modal");

var updateKind = function(){};

openModal = (familienaam, voornaam, rijksregisternummer, leerjaar, klas, voorkeur) => {
    const selectedLeerjaar = document.querySelector(".js-leerjaar-selected");
    const optionsContainerLeerjaar = document.querySelector(".js-leerjaar");
    const klasHTML = document.querySelector('.js-klas');

    var saveButton = document.querySelector('.js-save');
    var naamField = document.getElementById("naamField");
    var voornaamField = document.getElementById("voornaamField");
    var klasField = document.getElementById("klasField");


    if(voorkeur != "Geen") {
        var voorkeurRadioBtns = document.getElementById(voorkeur);
        voorkeurRadioBtns.checked = true;
    } else {
        const voorkeurenHTML = document.querySelector('input[name="voorkeur"]:checked');
        if(voorkeurenHTML != null) {
            voorkeurenHTML.checked = false;
        }
    }

    naamField.value = familienaam;
    voornaamField.value = voornaam;

    modal.style.transform = "translate(0)";
    modal.style.opacity = "1";

    selectedLeerjaar.innerHTML = document.getElementById(leerjaar).querySelector('label').innerHTML;
    selectedLeerjaar.id = document.getElementById(leerjaar).querySelector('input').id;
    selectedLeerjaar.setAttribute('value', document.getElementById(leerjaar).querySelector('input').getAttribute('value'));
    optionsContainerLeerjaar.classList.remove("active");
    if(selectedLeerjaar.innerText == "Kleuter") {
        klasHTML.querySelector("input").placeholder = "bv. 1A, 2A, 3B";
        klasHTML.querySelector("input").setAttribute('maxlength', 2);
        klasHTML.querySelector("input").value = String(klas).substring(1,2);
    } else {
        klasHTML.querySelector("input").placeholder = "bv. A, B, C";
        klasHTML.querySelector("input").setAttribute('maxlength', 1);
        klasHTML.querySelector("input").value = String(klas).charAt(1);
    }

    updateKind = () => {
        var userLeerjaar = document.querySelector('.js-leerjaar-selected');
        var userVoorkeur = document.querySelector('input[name="voorkeur"]:checked');
        var errorText = document.querySelector('.js-error');
        let voorkeurCode = ""
        let voorkeurId = "Geen"
    
        if(userVoorkeur != null) {
            voorkeurId = userVoorkeur.id;
            voorkeurCode = userVoorkeur.getAttribute('code');
          } else {
            if(userLeerjaar != null) {
              voorkeurCode = userLeerjaar.id;
            }
          }
            if(!userLeerjaar == "") {
                var userLeerjaarNummer = userLeerjaar.getAttribute('value');
                if(userLeerjaar.getAttribute('value') == 7) {
                userLeerjaarNummer = "K";
            }
          }

          if(userLeerjaar != null) {
            if(!naamField.value == "" && !voornaamField.value == "" && !userLeerjaar.innerText == "" && userLeerjaar.innerText != "Selecteer een leerjaar" && !klasField.value == "" && !voorkeurCode == "") {
                db.collection("kinderen")
                .doc(`${rijksregisternummer}`)
                .set({
                    naam: `${naamField.value.charAt(0).toUpperCase() + naamField.value.slice(1)}` + " " + `${voornaamField.value.charAt(0).toUpperCase() + voornaamField.value.slice(1)}`,
                    voornaam: `${voornaamField.value.charAt(0).toUpperCase() + voornaamField.value.slice(1)}`,
                    familienaam: `${naamField.value.charAt(0).toUpperCase() + naamField.value.slice(1)}`,
                    leerjaar: userLeerjaar.innerText,
                    voorkeur: voorkeurId,
                    code: voorkeurCode,
                    klas: `${userLeerjaarNummer}` + `${(klasField.value).toUpperCase()}`,
                }, {merge: true})
                closeModal();
            } else {
                errorText.innerText = "Alle velden moeten ingevuld zijn!"
                errorText.style.opacity = "100";
            }
          } else {
            errorText.innerText = "Alle velden moeten ingevuld zijn!"
            errorText.style.opacity = "100";
          }
      }

      saveButton.addEventListener('click', updateKind);
}

closeModal = () => {
    var errorText = document.querySelector('.js-error');
    var saveButton = document.querySelector('.js-save');

    modal.style.transform = "translate(9999px)";
    modal.style.opacity = "0";

    saveButton.removeEventListener('click', updateKind);

    errorText.style.opacity = 0;
}

window.onclick = function(event) {
    if (event.target == modal) {
      closeModal();
    }
  }

setVerified = (rijksregisternummer) => {
    db.collection('kinderen')
    .doc(rijksregisternummer)
    .update({
        status: "verified"
    });
}

getLeerlingen = (user) => {
    db.collection('kinderen')
    .where("school", "==", user.displayName)
    .onSnapshot((querySnapshot) => {
        verifiedData = [];
        unverifiedData = [];
        querySnapshot.forEach((doc) => {
            if(doc.data().status == "unverified") {
                unverifiedData.push(doc.data());
            } else if (doc.data().status == "verified") {
                verifiedData.push(doc.data());
            }
        })
        showLeerlingen();
    })
}

  dropdownLeerjaar = async () => {
    const klasHTML = document.querySelector('.js-klas');
    let voorkeurenHTML = document.querySelector('.js-voorkeuren');
    let leerjarenHTML = document.querySelector('.js-leerjaren');
    let htmlStringVoorkeuren = "";
    let htmlStringLeerjaren = "";

    await db.collection("scholen")
    .doc(userData.uid)
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
              htmlStringLeerjaren += `<div class="js-leerjaar-option option" id="${key}">
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
    });

    const selectedLeerjaar = document.querySelector(".js-leerjaar-selected");
    const optionsContainerLeerjaar = document.querySelector(".js-leerjaar");
    const optionsListLeerjaar = document.querySelectorAll(".js-leerjaar-option");
  
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

showLeerlingen = () => {
    let unverifiedHTML = document.querySelector('.js-unverified');
    let verifiedHTML = document.querySelector('.js-verified');
    let htmlStringUnverified = "<table><tr><th>Geen kinderen om te accepteren</th></tr></table>";
    let htmlStringVerified = "<table><tr><th>Geen geaccepteerde kinderen</th></tr></table>";

    if(unverifiedData.length > 0) {
        htmlStringUnverified = `<table>
        <tr>
        <th>Naam</th>
        <th>Voornaam</th>  
        <th>Leerjaar</th>
        <th>Klas</th>
        <th></th>
        <th></th>
        <th></th>
        </tr>`;

        for(var key in unverifiedData) {
            var leerling = unverifiedData[key];
            htmlStringUnverified += `<tr>
                <td>${leerling.familienaam}</td>
                <td>${leerling.voornaam}</td>
                <td>${leerling.leerjaar}</td>
                <td>${leerling.klas}</td>
                <td class="c-table-icons">
                    <i onclick="setVerified('${leerling.rijksregisternummer}')" class="material-icons">done</i>
                </td>
                <td class="c-table-icons">
                    <i class="material-icons" onclick="openModal('${leerling.familienaam}', '${leerling.voornaam}', '${leerling.rijksregisternummer}', '${leerling.leerjaar}', '${leerling.klas}', '${leerling.voorkeur}')">edit</i>
                </td>
                <td class="c-table-icons">
                    <i class="material-icons">delete</i>
                </td>
            </tr>`
        }

        htmlStringUnverified += `</table>`;
    }

    if(verifiedData.length > 0) {
        htmlStringVerified = `<table>
        <tr>
        <th>Naam</th>
        <th>Voornaam</th>
        <th>Leerjaar</th>
        <th>Klas</th>
        <th></th>
    </tr>`;

        for(var key in verifiedData) {
            var leerling = verifiedData[key];
            htmlStringVerified += `<tr>
                    <td>${leerling.familienaam}</td>
                    <td>${leerling.voornaam}</td>
                    <td>${leerling.leerjaar}</td>
                    <td>${leerling.klas}</td>
                    <td class="c-table-icons">
                        <i class="material-icons" onclick="openModal('${leerling.familienaam}', '${leerling.voornaam}', '${leerling.rijksregisternummer}', '${leerling.leerjaar}', '${leerling.klas}', '${leerling.voorkeur}')">edit</i>
                    </td>
                </tr>`
        }

        htmlStringVerified += `</table>`;
    }

    unverifiedHTML.innerHTML = htmlStringUnverified;
    verifiedHTML.innerHTML = htmlStringVerified;
}

logout = () => {
    firebase.auth().signOut();
}

document.addEventListener('DOMContentLoaded', function() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            if(localStorage.getItem('role') == "hanssens") {
                window.location.replace('/admin/scholen');
            }
            userData = user;
            getLeerlingen(user);
            dropdownLeerjaar();
        }
    });
});