var time;
var secs;
tick();
async function tick() {
  var today = new Date();
  time = today.getHours();
  if (today.getMinutes() < 10) {
    time = time + ":0" + today.getMinutes();
  } else {
    time = time + ":" + today.getMinutes();
  }
  document.getElementById("clock").innerHTML = time;
  if (today.getSeconds() < 10) {
    secs = ".0" + today.getSeconds();
  } else {
    secs = "." + today.getSeconds();
  }
  document.getElementById("secs").innerHTML = secs;
  await sleep(1000);
  tick();
}
function sleep(ms) {
  return new Promise((val) => setTimeout(val, ms));
}
