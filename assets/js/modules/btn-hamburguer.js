/* ---------- 
  Esta Funcion Maneja el boton de hamburguesa y a su vez el menu que se 
  desa cambiar.
  Por supuesto la clase .show del menu ustedes 
  la pueden variar de acuerdo a sus nesecidades

  Para que Funcione cuando hagan el llamado a la funcion le pasan como
  parametro en un string un selector CSS (id o class) del elemento que desean que 
  actue como menu
---------- */

function btnHamburguer(nameMenu) {
  const menu = document.querySelector(nameMenu),
        btnH = document.querySelector('.btn-hamburguer');

  const removeClass = () => {
    menu.classList.remove('is-active-menu')
    btnH.classList.remove('active')
  }

  btnH.addEventListener('click', e =>{
      menu.classList.toggle('is-active-menu')
      setTimeout( () => btnH.classList.toggle('active'),10);
  });

  // menu.addEventListener('click', () => removeClass() );

}// <--< END btnHamburguer(string);

btnHamburguer(".menu-main");

