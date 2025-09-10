---
layout: page
title: Blog
permalink: /blog/
---

这里会展示我的博客文章。

<ul>
{% for post in site.posts %}
  <li>
    <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
    <span>— {{ post.date | date: "%Y-%m-%d" }}</span>
    <div>{{ post.excerpt }}</div>
  </li>
{% endfor %}
</ul> 