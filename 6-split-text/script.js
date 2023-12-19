import { byWord, byLetter } from "./split.js";

const {matches:motionOK} = window.matchMedia('(prefers-reduced-motion: no-preference)');

if(motionOK) {
    const splitTargets = document.querySelectorAll("[split-by]");

    splitTargets.forEach(splitTarget => {
        const type = splitTarget.getAttribute("split-by");
        let nodes = null;
        if(type === 'letter')　{
            nodes = byLetter(splitTarget.innerText.trim())
        }else if(type === 'word'){
            nodes = byWord(splitTarget.innerHTML.trim());
        }

        if(nodes)
            splitTarget.firstChild.replaceWith(...nodes);
    })
}