window.onload = function () {

  window.onclick = function (e) {
    if (!e.target.classList.contains("btn-dropdown")) {
      let listDropdowns = document.getElementsByClassName("dropdown-menu")
      for (let i = 0; listDropdowns.length > i; i++) {
        listDropdowns[i].style.display = 'none'
      }
    }
  }
  
  if (document.getElementById("amount-recive")) {
    document.getElementById("amount-recive").addEventListener('input', function (input) {
      document.getElementById("total-dolars").innerHTML = (Number(input.target.value) * 0.413).toFixed(2)
    })
  }
  
  function handlerFocusInput() {
    document.getElementById("search").focus();
  }
  
  if (document.getElementById("loupe")) {
    document.getElementById("loupe").addEventListener("click", handlerFocusInput);
  }
}

window.initAle = function () {
  if (document.getElementsByClassName("dropdown-menu").length != 0) {
    var listDropdowns = document.getElementsByClassName("btn-dropdown")
    var listMenu = document.getElementsByClassName("dropdown-menu")
    var target
    for (let i = 0; listDropdowns.length > i; i++) {
      listDropdowns[i].addEventListener('click', function (e) {
        console.log('sdf',i)
        if (listMenu[i].style.display == 'none') listMenu[i].style.display = 'block'
        else listMenu[i].style.display = 'none'
        target = e.target
        for (let j = 0; listDropdowns.length > j; j++) {
          if (target != listDropdowns[j]) {
            listMenu[j].style.display = 'none'
          }
        }
      })
    }
  }
}
