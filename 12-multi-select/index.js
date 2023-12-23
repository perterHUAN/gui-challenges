import 'https://unpkg.com/isotope-layout@3.0.6/dist/isotope.pkgd.min.js'


const isotopeGrid = new Isotope('article', {
    itemSelector: 'span',
    layoutMode: 'fitRows',
    percentPosition: true
})


const filterGrid = query => {
    const {matches: motionOK} = window.matchMedia('(prefers-reduced-motion: no-preference)');

    // stagger  每个项目之间的过渡 让项目在进行排列时以一定的延迟出现
    // 过滤，排列
    isotopeGrid.arrange({
        filter: query,
        stagger: 25,
        transitionDuration: motionOK ? '0.4s' : '0'
    })
}


// 获取数据 并整理数据

// select option

const prepareSelectOptions = element => {
    return Array.from(element.selectedOptions).reduce((data, opt) => {
        data.push([opt.parentElement.label, opt.value])
        return data;
    }, [])
}

// select watcher

document.querySelector('aside select').addEventListener('input', (event) => {
    let selectData = prepareSelectOptions(event.target);
    console.log('Multiselect ', selectData);

    let query = selectData.reduce((query, val) => {
        query.push('.' + val[1].split(" ").join("-"))
        return query;
    }, []).join(",");

    filterGrid(query);


    // 更新辅助阅读内容
    let statusRoleElement = document.querySelector('#applied-filters');
    let filterResults = isotopeGrid.getFilteredItemElements().length;


    statusRoleElement.style.counterSet = `filter ${selectData.length}`;
    statusRoleElement.textContent = " giving " + filterResults + " results";
})


document.querySelector('aside form').addEventListener('input', (event) => {
    if(event.target.nodeName === 'SELECT') return;

    const formData = new FormData(document.querySelector('aside form'));
    console.log("checkbox: ", Array.from(formData));


    let query = Array.from(formData.values()).reduce((query, val) => {
        query.push('.' + val.split(" ").join("-"));
        return query;
    },[]).join(",");


    filterGrid(query);

    document.querySelector('#applied-filters').textContent = " giving " + isotopeGrid.getFilteredItemElements().length + " results";
})