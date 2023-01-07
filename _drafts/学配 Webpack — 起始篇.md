当我刚接触 Webpack，看到 Webpack 的配置文件时，是心生抗拒的，因为它看起来远没有 Gulp 那么直观。随着在项目中地深入使用，发现 Webpack 强大的功能总能满足各种需求，社区活跃，插件丰富，确实是目前前端项目最好的构建工具之一。关于 Webpack 的文章，社区早已积累大量教程，或许得有一半是入门教程。可是如果想发挥 Webpack 强大威力，入门教程是远远不够的，我们需要对 Webpack 及其生态环境有更充分的了解。

首先，要认识 Webpack 几个关键概念：

- Entry: 源代码的入口，可能是一个或多个 JS 文件
- Output: 代码打包后的出口，可能是一个或多个 JS 文件，以及 CSS、HTML 图片等资源
- Loaders：配置各种类型文件的加载方式，文件类型可以是 js、json 文件，还可以是 css、jpg、jsx 等文件
- Plugins：配置各种各样的任务，像打包优化、静态资源管理、环境变量设置等等
- Mode：打包环境，可选值有 development、production、none，webpack 会针对不同环境进行内置优化

以下是 [Element-UI](https://github.com/ElemeFE/element)（一个基于 Vue 的 UI 组件库，Github 40k+ starts）中 Webpack 的配置文件示例。可以看到`entry`、`output`、`plugins`、`mode` 四项的配置，loader 则在 `module.rules` 中进行配置。接下来，我会着重介绍这五个概念，然后对文件中其它条目逐一进行解释。如果还不清楚如何安装 Webpack，可以先看一看[官方入门教程](https://webpack.js.org/guides/getting-started/)。

```js
const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const config = require('./config');

module.exports = {
  mode: 'production',
  entry: {
    app: ['./src/index.js']
  },
  output: {
    path: path.resolve(process.cwd(), './lib'),
    publicPath: '/dist/',
    filename: 'element-ui.common.js',
    chunkFilename: '[id].js',
    libraryExport: 'default',
    library: 'ELEMENT',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: config.alias,
    modules: ['node_modules']
  },
  externals: config.externals,
  performance: {
    hints: false
  },
  stats: {
    children: false
  },
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|babel|es6)$/,
        include: process.cwd(),
        exclude: config.jsexclude,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new ProgressBarPlugin(),
    new VueLoaderPlugin()
  ]
};
```

## Loaders

最重要的放在前面。Loaders 是 Webpack 中最重要的功能之一，是 Webpack 实现“万物皆可加载”能力的基础。

安装 Webpack 后，就可以在 js 文件中使用 [CommonJS 语法](http://www.commonjs.org/specs/modules/1.0/)和 [ES6 Module 语法](http://es6.ruanyifeng.com/#docs/module)来加载文件，**默认情况下，Webpack 仅支持 js 或 json 两种格式**：

```
// CommonJs
const hello = require('./hello.js')

// ES6 Module
import hello from './hello.js
```

在配置了合适的 loaders 后，就可以实现各种各样格式文件的加载了。通俗点解释，webpack 比较憨憨，除了默认支持的格式，webpack 需要 loader 告诉它某个格式的文件要如何转化为我们想要的格式和载入的方式。还是以前面 Element-UI 的配置文件为例，它支持导入的文件格式就包括：

```
immport hello from './hello.jsx'
immport hello2 from './hello2.vue'
immport hello3 from './hello3.css'
immport hello4 from './hello4.svg'
immport hello5 from './hello5.gif'
immport hello6 from './hello6.ttf'
```

Loader 在配置文件中 `module.rules` 项进行配置，它的值是一个数组，数组中每一项中，会包含两个比较重要的属性：

- `test` 指定了需要转译的文件，通过正则表达式来匹配文件名。
- `loader` 指定了转换文件所需的加载器，可以是一个或多个。配置文件中`.css`后缀文件，就指定了`style-loader`、`css-loader`两个加载器进行转译。

其它属性：

- `include`
- `exclude`
- `options`
- `query`

```
module: {
  rules: [
    {
      test: /\.(jsx?|babel|es6)$/,
      include: process.cwd(),
      exclude: config.jsexclude,
      loader: 'babel-loader'
    },
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        compilerOptions: {
          preserveWhitespace: false
        }
      }
    },
    {
      test: /\.css$/,
      loaders: ['style-loader', 'css-loader']
    },
    {
      test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: path.posix.join('static', '[name].[hash:7].[ext]')
      }
    }
  ]
}
```

常见情况下，像 React JSX 语言和 Vue 的模板语言，会被转译成一个 JS 对象或函数（取决于导出的内容，也可能是 JS 基础类型）。CSS 或其它样式文件（例如 SASS、LESS），会在打包时插入到 style 标签中。资源文件，像图片、字体等，会被转译为 URL，URL 指向打包后资源文件所在的位置。当然，Webpack 支持的文件远不止这些，加载的行为也可能完全不一样，目前已经有大量成熟的[官方 Loader](https://webpack.js.org/loaders/)和社区 Loader，足以满足大部分的开发需求。如果必要的话，也可以根据需求实现自己的 Loader。像 Element-UI 项目中。就定制一个 `md-loader` 来加载带有 Demo 的 markdown 文档。

若想进一步地了解 Loader 的配置和常用 Loader，可参考[学配 Webpakck —— Loader 篇](./123.md)。


