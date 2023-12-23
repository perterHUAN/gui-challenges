// create a section.gui-toast-group
const init = () => {
    const node = document.createElement("section");
    node.classList.add('gui-toast-group');

    document.firstElementChild.insertBefore(node, document.body);

    return node;
}


const Toaster = init();


// create a toast  outer.gui-toast

const createToast = (text) => {
    const node = document.createElement("output");
    node.classList.add("gui-toast");
    node.setAttribute('role', 'status');
    node.textContent = text;
    return node;
}

// add a toast to Toaster
const addToast = (toast) => {
    const {matches: motionOK} = window.matchMedia('(prefers-reduced-motion)');

    motionOK && Toaster.children.length ? 
        flipToast(toast)
        :
        Toaster.appendChild(toast);
}



// 将上面的函数结合在一起 
// create a toast
// add tost
// animation.fined
// remove toast 
const Toast = (text) => {
    const toast = createToast(text);
    addToast(toast);


    return new Promise(async(resolve, reject) => {
        await Promise.allSettled(
            toast.getAnimations().map(animation => animation.finished)
        )
        
        Toaster.removeChild(toast);
        resolve();
    })
}


const flipToast = (toast) => {
    const first = Toast.offsetHeight;
    
    Toast.appendChild(toast);

    const last = Toast.offsetHeight;

    const invert = last- first;

    const animation = Toast.animate([
        {transform: `translateY(${invert}px)`},
        {transform: 'translateY(0)'}
    ], {
        duration: 150,
        easing: 'ease-out'
    })

    animation.startTime = document.timeline.currentTime;
}


export default Toast;