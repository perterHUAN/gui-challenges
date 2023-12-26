// 主要就是更新main#loading-zone和progress
const progress = document.querySelector("progress");
const zone = document.querySelector("#loading-zone");





//  全局变量  当前进度

const state = {
    val: .1
}


/*
    1.2342
    借助于Math.round 四舍五入到最近的整数

    如何保留两位小数呢
    1.2342 * 100 = 123.42 
    然后再调用Math.round
*/
const roundDecimals = (val, places) => {
    return +(Math.round(val + "e+" + places) + "e-" + places);
}


// 根据state.val 设置进度信息
const setProgress = () =>{
    zone.setAttribute('aria-busy', state.val < 1);
    
    // indeterminate
    if(state.val === null) {
        progress.removeAttribute('aria-valuenow');
        progress.removeAttribute('value');
        progress.focus();
        return;
    }

    const val = roundDecimals(state.val, 2);
    state.val = val;
    const valPercent = val * 100 + "%";

    progress.setAttribute('aria-valuenow', valPercent);
    progress.value = val;
    progress.innerHTML = valPercent;

    progress.focus();
}

// 模拟
setTimeout(_ => setProgress(), 2000)
setTimeout(_ => {
  state.val = .4
  setProgress()
}, 4000)
setTimeout(_ => {
  state.val = .6
  setProgress()
}, 5000)
setTimeout(_ => {
  state.val = .9
  setProgress()
}, 6000)
setTimeout(_ => {
  state.val = 1
  setProgress()
}, 8000)

window.increase = e => {
    console.log(state.val);
  state.val += .2
  
    console.log(state.val);
  if (state.val > 1)
    state.val = 1
  
  setProgress()
}

// button onclick
window.decrease = e => {
    console.log(state.val);
  state.val -= .2
  
    console.log(state.val);
  if (state.val < 0)
    state.val = 0
  
  setProgress()
}

window.complete = e => {
  state.val = 1
  setProgress()
}

window.reset = e => {
  state.val = null
  setProgress()
}