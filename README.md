## 使用说明

### 环境
- node@12
- 全局安装 `yarn` (`npm` 也可以)

### 步骤
```sh
# clone
git clone https://github.com/byq1213/xmind-list

cd xmind-list
# install dependencies
yarn 
# run 
yarn dev

```
### 依赖包
- vue3
- [`vite`](https://cn.vitejs.dev/) 构建工具

## 思考过程
- 粗看下是表单操作列表,进行过滤操作
- 拿到列表后需要
    - 格式化时间戳
    - `type` 找到对应的枚举
    - `category` 找到对应的分类名
- 需要设计好给定结构的ts声明、枚举
- 可能需要.csv文件重新上传,需要前端处理文件的步骤
- 计算总收入、总支出和各个分类的总收入时可能用`vue.computer`来触发
- 是否需要引入第三方UI库?
    - 还需要看第三方库的文档,样子不是重点
- 使用 vue3 的 `<script setup></script>`比较轻量,去掉繁琐的`setup return`等