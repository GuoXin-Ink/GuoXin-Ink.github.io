# News 更新指南

News 页面分为三部分：

- `content/news.toml`：英文列表中的标题、日期、地点、摘要和图片
- `content_zh/news.toml`：中文列表中的对应内容
- `content/news/` 与 `content_zh/news/`：每篇动态的英文和中文详细正文

照片建议放在 `public/news/文章名称/` 中。例如：

```text
public/news/egu-2027/
  cover.jpg
  field-01.jpg
  field-02.jpg
```

## 新增一篇动态

先在英文 `content/news.toml` 中增加：

```toml
[[items]]
slug = "egu-2027"
date = "2027-04-15"
title = "Attending EGU 2027"
summary = "A short description shown on the News list page."
location = "Vienna, Austria"
cover = "/news/egu-2027/cover.jpg"
content = "news/egu-2027.md"
gallery = [
  "/news/egu-2027/field-01.jpg",
  "/news/egu-2027/field-02.jpg"
]
```

再在中文 `content_zh/news.toml` 中加入相同的 `slug`、`date`、图片路径和正文文件路径，并把标题、摘要、地点翻译为中文。

然后创建正文：

- 英文：`content/news/egu-2027.md`
- 中文：`content_zh/news/egu-2027.md`

正文使用 Markdown，例如：

```markdown
这是动态的第一段。

## 小标题

这里可以继续写详细内容，也可以添加[外部链接](https://example.com)。

- 第一项
- 第二项
```

`slug` 只能使用小写英文字母、数字和短横线，并且中英文配置中的 `slug` 必须保持一致。文章地址将是 `/news/egu-2027/`。
