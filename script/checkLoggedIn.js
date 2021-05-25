firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      window.location.replace("login.html")
    }
  });