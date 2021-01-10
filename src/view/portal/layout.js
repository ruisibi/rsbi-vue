import $ from 'jquery'

//默认5种布局
export const layout = {
    l1 : {tr1:[{colspan:1, rowspan:1, width:100, height:100, id:1}]},
    l2 : {tr1:[{colspan:1, rowspan:1, width:50, height:100, id:1},{colspan:1, rowspan:1, width:50, height:100, id:2}]},
    l3: {tr1:[{colspan:2, rowspan:1, width:100, height:50, id:1}],tr2:[{colspan:1, rowspan:1, width:50, height:50, id:2},{colspan:1, rowspan:1, width:50, height:50, id:3}]},
    l4: {tr1:[{colspan:2, rowspan:1, width:100, height:33, id:1}],tr2:[{colspan:1, rowspan:1, width:50, height:33, id:2},{colspan:1, rowspan:1, width:50, height:33, id:3}], tr3:[{colspan:2, rowspan:1, width:100, height:33, id:4}]},
    l5:{tr1:[{colspan:2, rowspan:1, width:100, height:20, id:1}],tr2:[{colspan:1, rowspan:1, width:50, height:20, id:2},{colspan:1, rowspan:1, width:50, height:20, id:3}], tr3:[{colspan:2, rowspan:1, width:100, height:20, id:4}],tr4:[{colspan:1, rowspan:1, width:50, height:20, id:5},{colspan:1, rowspan:1, width:50, height:20, id:6}],tr5:[{colspan:2, rowspan:1, width:100, height:20, id:7}]}
};