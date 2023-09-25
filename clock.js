tick();
async function tick() {
  var today = new Date();
  if (today.getMinutes() < 10) {
    time = today.getHours() + ":0" + today.getMinutes();
  } else {
    time = today.getHours() + ":" + today.getMinutes();
  }
  document.getElementById("clock").innerHTML = "&nbsp;" + time;
  await sleep(1000);
  tick();
}
function sleep(ms) {
  return new Promise((val) => setTimeout(val, ms));
}
