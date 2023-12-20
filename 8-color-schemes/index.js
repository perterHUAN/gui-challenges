/*
    获取form radio[name="theme"]的选项value,  将color-scheme={value}
    添加到html节点上，这样所有使用颜色变量都会更新
*/


const form = document.querySelector("#theme-switcher");
console.log(form)

form.addEventListener("change", (event) => {
    console.log("change...")    
    const target = event.target;
    
    document.documentElement.setAttribute("color-scheme", target.value);
})