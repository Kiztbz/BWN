function Close()
{
    const tab = document.getElementById("mod6");
    tab.style.zIndex = "-1";
    tab.style.filter = "opacity(0)";
}

function Open()
{
    const tab = document.getElementById("mod6");
    tab.style.zIndex = "2";
    tab.style.filter = "opacity(0.65)";
}