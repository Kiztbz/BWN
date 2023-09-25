function Close()
{
    const tab = document.getElementById("mod6");
    tab.style.right = "-50%";
}

function Open()
{
    const tab = document.getElementById("mod6");
    tab.style.right = "0";
    console.log("closed");
}