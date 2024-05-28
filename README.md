# 说明

因为 markedjs 只有基础功能，不支持很多高级功能，所以只能自己动手造轮子了。

## 功能

### 1. 修改图片的显示方式

**输入**

```
![图片标题](图片1的地址|对齐)
```

**输出**

```
<div align="对齐">
<div><img src="图片1的地址"></div>
<div>图 1：图片标题</div>
</div>
```

如果图片标题不输入，则不显示图片标题，只显示 `图 1` 。


默认为 left 。
有 left 、right 、center 、justify 可选。

### 2. 图片引用

当输入 `@[image](对应图片地址)` 的时候，就可以展现为图片的引用。

**输入**

```
@[image](图片1的地址)
```

**输出**

```
<span>图 1</span>
```

### 3. 标题

当输入 `#` 符号时，会判断是几重标题，并输出对应的内容。  
**仅当输入 `#` 时有效。**

**输入**

```
# 第一段
## 第一段第一章
### 第一段第一章第一节
### 第一段第一章第二节
#### 第一段第一章第一节第一小节
#### 第一段第一章第一节第二小节
## 第一段第二章
### 第一段第二章第一节
### 第一段第二章第二节
### 第一段第一章第三节
#### 第一段第二章第三节第一小节
#### 第一段第二章第三节第二小节
### 第一段第二章第三节
# 第二段
```

**输出**

```
1. 第一段
1.1. 第一段第一章
1.1.1. 第一段第一章第一节
1.1.2. 第一段第一章第二节
1.1.2.1. 第一段第一章第一节第一小节
1.1.2.2. 第一段第一章第一节第二小节
1.2. 第一段第二章
1.2.1. 第一段第二章第一节
1.2.2. 第一段第二章第二节
1.2.3. 第一段第一章第二节
1.2.3.1. 第一段第二章第三节第一小节
1.2.3.1. 第一段第二章第三节第二小节
1.2.4. 第一段第二章第三节
2. 第二段
```

### 4. 表格的题注和引用

#### 4.1. 题注

在表格后面加入，可以显示为表格的题注。  
表格的名称可以用任意字符。

**输入**

```
@[table](:表格1的名称)
```

**输出**

```
<div>表 1</div>
```

#### 4.2. 引用

在任意位置输入，可以引用表格。

**输入**

```
@[table](表格1的名称)
```

**输出**

```
<span>表 1</span>
```

### 4.3. 颜色

**输入**

```
#[FF0000](这里是红字)
```

输出

```
<span style="color:#FF0000;">这里是红字</span>
```

## API

### 全局对象

| API | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| parse | 不适用扩展功能，直接使用 markedjs 的原生处理 | markDownString | html |
| create | 创建一个 modell-markedjs-plus 的新实例 | 无 | modell-markedjs-plus 的新实例 |

# modell-markedjs-plus 实例

| API | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| parse | 解析 markdown | markDownString | html |
| addCustomExtension | 添加自定义 customExtension | object | 无 |
| getLexer | 获得 lexer 的实例 | 无 | lexer 实例 |
| getParser | 获得 parser 的实例 | 无 | parser 实例 |
| setFileDefaultUrl | 设置文件解析默认路径<br />有这个路径则以这个路径+md的定义进行解析<br />如果没有，则仅按 md 中的内容进行解析 | 路径 | 无 |
| setImageDefaultAlign | 设置图片默认对齐方案<br />如果md中有定义，则按md中的定义解析，如果没有则按这里的解析，默认居左 | 对齐方式 | 无 |