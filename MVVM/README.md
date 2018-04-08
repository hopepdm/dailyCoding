[剖析vue实现原理，实现双向绑定](https://github.com/DMQ/mvvm/blob/master/readme.md)

目前几种主流的mvc(vm)框架都实现了单向数据绑定，而我所理解的双向数据绑定无非就是在单向绑定的基础上给可输入元素（input、textare等）添加了change(input)事件，来动态修改model和 view，并没有多高深。所以无需太过介怀是实现的单向或双向绑定。

实现数据绑定的做法大致有如下几种：

发布者-订阅者模式（backbone.js）

脏值检测（angular.js）

数据劫持（vue.js）