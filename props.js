//Getting window height and width
h = window.innerHeight;
w = window.innerWidth;

//Sending the values to root elements
document.documentElement.style.setProperty("--height", h + "px");
document.documentElement.style.setProperty("--width", w + "px");

function HWUpdate() {
  //Getting window height and width
  h = window.innerHeight;
  w = window.innerWidth;

  //Sending the values to root elements
  document.documentElement.style.setProperty("--height", h + "px");
  document.documentElement.style.setProperty("--width", w + "px");
}
