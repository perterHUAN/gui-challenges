
/*
    滚动section时，对应的tab变成active状态
*/

const tabgroup = document.querySelector('snap-tabs');
const tabsection = tabgroup.querySelector(":scope > section");
const tabnav = tabgroup.querySelector("header nav");
const tabnavitems = tabnav.querySelectorAll('a');

function setActiveTab(tabbtn) {
    tabnav.querySelector(".active")?.classList.remove("active");
    tabbtn.classList.add("active");
    tabbtn.scrollIntoView();
} 

function determineActiveTab() {
    const idx = tabsection.scrollLeft / tabsection.clientWidth;
    const matchingNavItem = tabnavitems[idx];
    matchingNavItem && setActiveTab(matchingNavItem);
}
tabsection.addEventListener("scroll", (event) =>{
    // 防抖
    clearTimeout(tabsection.scrollEndTimer);
    tabsection.scrollEndTimer = setTimeout(determineActiveTab, 100);
})

/*
    一加载我们就先确定active tab
  
    1. 一般就是第一个, scrollLeft = 0
    2. 当location.hash对应一个artile时，设置scrollLeft使该article出现在视野中

    调用determineActivTab
 */

window.onload = () => {
    if(location.hash) 
        tabsection.scrollLeft = tabsection.querySelector(location.hash).offsetLeft;
    determineActiveTab();
}


/*
    显示动画，使用js添加tab切换效果

    颜色切换
    tab indicator 的过渡效果
*/

const sectionScrollTimeLine = new ScrollTimeline({
    scrollSource:tabsection,
    orientation: 'inline',
    fill: 'both'
}
);

/*
    从头滑到尾的时间分为四帧，每个元素都有四帧
*/
tabnavitems.forEach(navitem => {
    navitem.animate({
        color: [...tabnavitems].map(item => 
            item === navitem
            ? `var(--text-active-color)`
            : `var(--text-color)`
        ) 
    }, {
        duration: 1000,
        fill: 'both',
        timeline: sectionScrollTimeLine
    })
})


const {matches:motionOK} = window.matchMedia(
    '(prefers-reduced-motion: no-preference)'
);

const tabindicator = tabgroup.querySelector(".indicator");

if(motionOK) {
    console.log("OK");
    const fr = {
        transform: [...tabnavitems].map(({offsetLeft}) => `translateX(${offsetLeft}px)`),
        width: [...tabnavitems].map(({offsetWidth}) => `${offsetWidth}px`)
    };
    console.log(fr);
    tabindicator.animate(fr,
    {
        duration: 1000,
        fill: 'both',
        timeline: sectionScrollTimeLine
    })    
}

