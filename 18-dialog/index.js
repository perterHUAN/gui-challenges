import GuiDialog from "./dialog.js";

/*
    定义如何处理各种事件
    closing
    closed
    opening
    opened
    removed
*/

const handleFile = (form) => {
  const file = form.get("user image");
  //返回的是一个对象 input[type=file]
  if (!file.size) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = (e) => {
    const main = document.querySelector("main");

    const user = document.createElement("div");
    user.classList.add("user");

    const img = document.createElement("img");
    img.src = e.target.result;

    const buttton = document.createElement("button");
    buttton.setAttribute("title", "remove user");

    buttton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;

    user.appendChild(img);
    user.appendChild(buttton);

    main.append(user);
    // 其实是在调整 button.user位置，使其仍处于最后一个
    main.append(document.querySelector("button.user"));
  };
};

const dialogClosing = ({ target: dialog }) => {
  console.log("Dialog closing: ", dialog);
};

const dialogClosed = ({ target: dialog }) => {
  console.log("Dialog closed: ", dialog);
  console.log("Dialog user action: ", dialog.returnValue);

  // 处理confirm
  if (dialog.returnValue === "confirm") {
    const dialogFormData = new FormData(dialog.querySelector("form"));

    console.log(
      "Dialog form data: ",
      Object.fromEntries(dialogFormData.entries())
    );

    handleFile(dialogFormData);

    //  reset
    document.querySelector("dialog form")?.reset();
  }
};

const dialogOpening = ({ target: dialog }) => {
  console.log("Dialog opening ", dialog);
};

const dialogOpened = ({ target: dialog }) => {
  console.log("Dialog opened ", dialog);
};

const dialogRemoved = ({ target: dialog }) => {
  dialog.removeEventListener("closing", dialogClosing);
  dialog.removeEventListener("closed", dialogClosed);

  dialog.removeEventListener("opening", dialogOpening);
  dialog.removeEventListener("opened", dialogOpened);

  dialog.removeEventListener("removed", dialogRemoved);

  console.log("Dialog removed", dialog);
};

// setup  diaglog modal-mode 'mega'
document.querySelectorAll('dialog[modal-mode="mega"]').forEach((dialog) => {
  /*
        绑定click, close事件
        监控dialog 决定什么时候触发事件 
     */
  GuiDialog(dialog);

  // 绑定新的事件 怎么做
  dialog.addEventListener("opening", dialogOpening);
  dialog.addEventListener("opened", dialogOpened);
  dialog.addEventListener("closed", dialogClosed);
  dialog.addEventListener("closing", dialogClosing);
  dialog.addEventListener("removed", dialogRemoved);
});

// setup  diaglog modal-mode 'mini'
// mini 就省略了很多事件
document.querySelectorAll('dialog[modal-mode="mini"]').forEach((dialog) => {
  GuiDialog(dialog);
});

// remove button
// 由main来代理 click事件

document.querySelector("main").addEventListener("click", (e) => {
  // 这个判断是否为removeButton还是有点危险，
  // 页面上再添加一些buttong,可能会将不是removeButton判断成button
  const removeButton = e.target.closest("button:not(.user)");
  if (!removeButton) return;

  // 让这个dialog显式靠近触发它的元素上
  // 相对于视口 x/left y/top right bottom 都是相对于左上角
  const bounds = removeButton.getBoundingClientRect();
  // 让 mini-modal的下边比removebutton的下边缘低15px
  const miniModalHeight = window.MiniDialog.clientHeight - 15;
  // miniModal左侧离removeButton左侧 clientWidth/2
  const miniModalWidth = window.MiniDialog.clientWidth / 2;

  let left = bounds.left - miniModalHeight;
  // left < 0 调整一下 不让它出现再屏幕之外
  if (left < 0) {
    left = 10;
  }

  window.MiniDialog.style.marginTop = bounds.top - miniModalHeight + "px";
  // 其实就是恢复到默认值 auto
  window.MiniDialog.style.marginLeft = null;
  if (window.innerWidth >= 768) {
    window.MiniDialog.style.marginLeft = left + "px";
  }

  // 开启 dialog
  window.MiniDialog.showModal();

  // 添加closing事件的处理函数
  // 主要是处理 confirm 删除一个头像
  window.MiniDialog.addEventListener(
    "closing",
    ({ target: dialog }) => {
      if (dialog.returnValue === "confirm") {
        // 这个事件函数套在另一个事件函数中 为了访问 removeButton 知道此次应该删除的是哪一个user
        const user = removeButton.closest(".user");
        user.style.animation = `var(--animation-scale-down), var(--animation-fade-out)`;

        user.addEventListener(
          "animationend",
          () => {
            //  删除节点 被侦听
            user.remove();
          },
          { once: true }
        );
      }
    },
    {
      once: true,
    }
  );
});
