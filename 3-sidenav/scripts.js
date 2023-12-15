/*
    关闭 -> 打开 焦点移动到 a#sidenav-close
    打开 -> 关闭 焦点移动到 a#sidenav-button


    如何知道现在是打开还是关闭状态?
    打开 -> #sidenav-open
    关闭 -> #

    document.location.hash


    什么时候焦点移动?
    transform动画完成的时候
    aside#sidenav-open  transitionend事件发生时且property为transform
*/



const closenav = document.querySelector("#sidenav-close");
const opennav = document.querySelector("#sidenav-button");
const sidenav = document.querySelector("#sidenav-open");



sidenav.addEventListener("transitionend", (event) => {
    if(event.propertyName !== 'transform') return;

    const isOpen = document.location.hash === "#sidenav-open";

    isOpen ? closenav.focus() : opennav.focus();
})


/*
    当按下escape时，从打开到关闭（如果此时打开的话）
    最好监听keyup事件，长按的时候会触发多次keydown事件但是只会触发一次keyup事件
*/

sidenav.addEventListener("keyup", (event) => {
    if(event.key !== 'Escape') return;
    const isOpen = document.location.hash === "#sidenav-open";
    if(isOpen) document.location.hash = '';
})


