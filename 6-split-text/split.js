/*
    根据text, index创建span元素
    <span style=`--index: ${index}`>{text}</span>
*/
function span(text, index) {
    const node = document.createElement("span");
    node.textContent = text;

    node.style.setProperty("--index", index);
    
    return node;
}

export function byWord(text) {
    return text.split(" ").map(span);
}

export function byLetter(text) {
    return text.split("").map(span);
}