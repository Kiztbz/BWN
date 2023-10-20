function Close()
{
    const tab1 = document.getElementById("mod1");
    const tab2 = document.getElementById("mod2");
    const tab3 = document.getElementById("mod3");
    const tab4 = document.getElementById("mod4");
    const tab5 = document.getElementById("mod5");
    const tab6 = document.getElementById("mod6");
    const tab7 = document.getElementById("mod7");
    tab6.style.zIndex = "-1";
    tab6.style.filter = "opacity(0)";
    tab1.style.filter = "opacity(1) blur(0px)";
    tab2.style.filter = "opacity(1) blur(0px)";
    tab3.style.filter = "opacity(1) blur(0px)";
    tab4.style.filter = "opacity(1) blur(0px)";
    tab5.style.filter = "opacity(1) blur(0px)";
    tab7.style.filter = "opacity(1) blur(0px)";
}

function Open()
{
    const tab1 = document.getElementById("mod1");
    const tab2 = document.getElementById("mod2");
    const tab3 = document.getElementById("mod3");
    const tab4 = document.getElementById("mod4");
    const tab5 = document.getElementById("mod5");
    const tab6 = document.getElementById("mod6");
    const tab7 = document.getElementById("mod7");
    tab6.style.zIndex = "2";
    tab6.style.filter = "opacity(0.8)";
    tab1.style.filter = "opacity(0.8) blur(4px)";
    tab2.style.filter = "opacity(0.8) blur(4px)";
    tab3.style.filter = "opacity(0.8) blur(4px)";
    tab4.style.filter = "opacity(0.8) blur(4px)";
    tab5.style.filter = "opacity(0.8) blur(4px)";
    tab7.style.filter = "opacity(0.8) blur(4px)";
}