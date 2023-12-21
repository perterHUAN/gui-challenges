/*

    监听select的change事件，更新面包屑
*/

const selects = document.querySelectorAll('.crumb select');


// 有些设备上按上下键也会触发change，这是我们不希望的

const preventedKeys = new Set(['ArrowUp', 'ArrowDown']);
const allowedKeys = new Set(['Tab', 'Enter', ' ']);






selects.forEach(select => {
    // 每个select都有一个ignore，用于检测时候需要处理此次的change事件
    let ignore = false;
    
    select.addEventListener('change', (e) => {
        if(ignore) return;
        const option = e.target;
        const choice = option.value;
        const crumb = option.closest('.crumb');

        // 隐藏该crumb之后的兄弟节点
        crumb.classList.add("treechange");
        // 更新选项
        crumb.querySelector(":scope > a").textContent = choice;
    })

    select.addEventListener('keydown', (e) => {
        if(allowedKeys.has(e.key)) {
            ignore = false;
        }else if(preventedKeys.has(e.key)){
            ignore = true;
        }
    })


})






