const storageKey = 'theme-preference';


const getColorPrefence = () => {
    if(localStorage.getItem(storageKey)) {
        return localStorage.getItem(storageKey);
    }else {
        const {matches:isLight} = window.matchMedia('(prefers-color-scheme: light)')
        return isLight ? 'light' : 'dark';
    }
}

const theme = {
    value: getColorPrefence()
}

// 在html上反应当前的设置  data-theme aria-label
// 在css未加载之前设置 方式主题变换之间的闪烁 此时html一定存在了
const reflectPreference = () => {
    document.firstElementChild.dataset.theme = theme.value;

    document.querySelector('#theme-toggle')?.setAttribute('aria-label',theme.value);
}

reflectPreference();

const setPrefenrence = () => {
    localStorage.setItem(storageKey, theme.value);
    reflectPreference();
}

const onClick = () => {
    theme.value = 
        theme.value === 'light' ?
        'dark'
        :
        'light';
    // 保存到本地 并反应到html上 
    setPrefenrence();
    
}

window.onload = () => {
    // 此时设置的aria-label screen redder
    reflectPreference();

    // 给button#toggle-theme添加click事件
    document.querySelector('#theme-toggle').addEventListener('click', onClick);
}

// 同步系统偏好的更改
window
    .matchMedia('(prefers-color-schemes: light)')
    .addEventListener('change', ({matches: isLight}) => {
        theme.value = isLight ? 'dark' : 'light';
    // 保存到本地 并反应到html上 
        setPrefenrence();
    })



