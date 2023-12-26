/*  
    定义一些新的事件
    定义在何时触发这些事件(在这里我们需要监控一些dom的变化) 但是如何去处理这些事件可以随时添加 (index.js里完成)
*/

const dialogClosingEvent = new Event("closing");
const dialogClosedEvent = new Event("closed");
const dialogOpeningEvent = new Event("opening");
const dialogOpenedEvent = new Event("opened");
const dialogRemovedEvent = new Event("removed");

// 等待动画完成
const animationComplete = (element) => {
  return Promise.allSettled(
    element.getAnimations().map((animation) => animation.finished)
  );
};

// 点击背景时退出
const lightDismiss = ({target: dialog}) => {
    if(dialog.nodeName === 'DIALOG')
        dialog.close('dismiss');
}

// 关闭dialog
const dialogClose = async ({target: dialog}) => {
    // 禁止交互
    dialog.setAttribute('inert', '');

    // 触发 dialogClosingEvent事件
    dialog.dispatchEvent(dialogClosingEvent);
    
    await animationComplete(dialog);

    dialog.dispatchEvent(dialogClosedEvent);
}





// 监控属性值的变化 dialog open true/false
const dialogAttrObserver = new MutationObserver((mutations, oberver) => {
  mutations.forEach(async (mutation) => {
    if (mutation.attributeName === "open") {
      const dialog = mutation.target;

      /* open (switch attribute) 变化了
                1. true -> false  not have open attribute 
                2. false -> true   have open attribute
        */

      const isOpen = dialog.hasAttribute("open");
      if (!isOpen) return;

      /*
                关闭状态 inert禁止交互
                开启状态要去掉 inert
            */
      dialog.removeAttribute("inert");

      // set focus
      const focusTarget = dialog.querySelector("[autofocus]");
      focusTarget
        ? focusTarget.focus()
        : dialog.querySelector("button").focus();

      // 触发 dialogOpeningEvent事件 如何处理这里不需要管 做什么和怎么做 分离
      dialog.dispatchEvent(dialogOpeningEvent);

      await animationComplete(dialog);

      dialog.dispatchEvent(dialogOpenedEvent);
    }
  });
});


// 监控子元素的删除

const dialogDeleteObserver = new MutationObserver((mutations, observer) => {
    mutations.forEach(mutation => {
        mutation.removedNodes.forEach(removeNode => {
            // 去除绑定的事件
            if(removeNode.nodeName === 'DIALOG') {
                removeNode.removeEventListener('click', lightDismiss);
                removeNode.removeEventListener('close', dialogClose);

                // 触发 dialogRemovedEvent
                removeNode.dispatchEvent(dialogRemovedEvent);
            }

        })
    })
})



export default async function(dialog) {
    // dialog 添加基本的事件处理
    // 点击 backdrop 关闭
    dialog.addEventListener('click', lightDismiss);
    dialog.addEventListener('close', dialogClose);


    dialogAttrObserver.observe(dialog, {
        attributes: true
    });

    dialogDeleteObserver.observe(document.body, {
        attributes: false,
        subtree: false,
        childList: true
    })

    await animationComplete(dialog);

}