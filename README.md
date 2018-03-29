
## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

makedown语法
	语法规则bing.com一下
	https://github.com/vuejs/vue/blob/dev/README.md
	
#es6语法
	https://www.jianshu.com/p/287e0bb867ae
	let,const,var
	
	var a = "1";
	var b = "2";
	var obj = {a,b};
	
	var func = {
		data(){
			console.log("对象中方法的定义",this.val1);
		},
		val1:'hello',
		val2:'js'
	}
	var {val1,val2} = func;
	
	func.data.call(this);
	=> 函数
	不需要function关键字来创建函数
	省略return关键字
	继承当前上下文的 this 关键字
	//例如：
    [1,2,3].map( x => x + 1 )
    
	//等同于：
    [1,2,3].map((function(x){
        return x + 1
    }).bind(this))
    
	class,extend关键字
	
# build 构建脚本
	npm run dev 开发模式
	# config.dev.proxyTable可以配置后台数据源的代理，同时也是可以设置多个不同的数据源（比如在调试过程下单接口代理到胡斌本地服务其他接口代理到测试环境）
	npm run build 构建模式
	(根据config/index.js文件里面的配置构建所需页面，config.buildAll为true时不会考虑pages中的页面选择、src/pages/目录下的所有页面进行构建，
	如果config.buildAll为false则会根据config.pages的配置进行构建或开发，构建过程是将pages目录下的js文件作为入口js，js所在的目录作为页面名称
	打包到dist目录，然后把dist目录下的文件拷贝到shop-web目录整个构建过程结束)
	# 发布到测试或正式环境前需要吧shop-web目录下的变动提交到svn然后登陆Jenkins构建就好了(可能会有缓存，刷新下看看)
	
	npm run dll 静态组件配置文件
	/build/webpack.dll.conf.js的配置文件
	这个配置文件是将不会变动的第三方库通过webpack.DllPlugin打包成webpack下能够用的模块运行npm run dll命令后会有两个文件，一个是目标js文件
	另一个是模块映射关系的json文件，这两个文件都是可以通过配置来决定文件的输出目录的;在使用目标的js文件时需要在开发或构建模式下的配置文件添加
	webpack.DllPlugin插件同事配置好webpack.DllPlugin的context,manifest的两个参数确保webpack.base.conf.js和/build/webpack.dll.conf.js
	中的context参数一致，以及manifest配置文件的生成和使用的是同一个json文件，dll.js文件放在七牛上减少了自身服务器的流量负载
	
	npm run component 对外提供js文件
	通过这个命令可以将vue组件或者模块化的js文件根据自身的需要进行自定义的构建以供其他页面的需要，最终输出一个js文件
	配置文件是build/webpack.component.conf.js和普通的webpack打包配置文件一样，主要的区别是入口js文件的编写方面
	提供的参考文件是/src/login.js主要的原理是window全局对象下定义属性以供html页面的中其他js片段使用

# config 构建脚本参数配置
	打包页面配置
	数据代理配置可以配置多个数据源代理，针对性的调试某个数据源接口
	sourcemap配置设为true会生成一堆.map文件，提供线上调试的途径
	gzip配合进一步压缩代码，使目标文件体积更小
# shop-web 发布目录
	发布代码首先是提交shop-web目录下的文件，然后在去Jenkins里面找到相应的项目进行构建，不然构建不会生效
	src目录下的文件也要记得提交，做好版本控制
	svn代码提交，Jenkins发布
# src/assets 公共资源
	cookie,param url,wxapi
	页面错误上报,在线调试代码
	[设置cookie页面](http://test.wgmf.com/shop-web/cookie.html)设置key为'.debugger.'的值为'init'
	刷新下页面就会出现vconsole的调试工具提供页面错误调试
	
# src/components 公共组件
	vue组件,toast,confirm,loading,login
	这里面的组件修改后需要对pages下的页面全部构建才会在所有用到的页面中生效
	或者如果清除某个组件被那几个页面使用了，也可以单独构建使用过的页面
# src/pages 页面文件，以文件夹为页面划分
	每个页面里面包含至少两个文件，一个是程序入口的js文件，一个是index.html模板文件
	另外需要用到vue的也可以根据业务情况添加Vue文件
	(页面性能优化，域名预加载，浏览器内核选择)
	
# static 静态资源
	静态资源的访问路径问题/shop-web/static/js/login.js
	
	

