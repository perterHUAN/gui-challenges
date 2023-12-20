/*
    记录每个滚动容器中的焦点，当再次回到一个滚动容器时，从上一次离开该容器时的焦点开始移动，
    不需要每次都重新从头开始。

    还可以使用左右键来移动焦点 

    shift + tab, tab在滚动容器之间移动焦点
    左右上下键在一个滚动容器中移动焦点

*/

import {rovingIndex} from './roving-ux.js'

document.querySelectorAll('.horizontal-media-scroller')
  .forEach(scroller => rovingIndex({
    element: scroller,
    target: 'a',
  }))
