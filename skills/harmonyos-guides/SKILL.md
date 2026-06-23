---
name: harmonyos-guides
description: 查 HarmonyOS 官方 API/Kit 用法、接口参数、调用流程、开发指南时触发(如 "AVPlayer 怎么初始化"、"Audio Kit 录音接口"、"ArkUI List 滑动属性"、"Ability 生命周期")。对应 harmonyos-guides-mcp 的 search_guides / get_guide / list_guides_by_topic 工具,检索 5489 篇官方开发指南。注意:这是查"API 怎么用",若要场景化最佳实践和参考代码请用 harmonyos-best-practices。
---

# 鸿蒙官方指南 检索指引

本地有 5489 篇 HarmonyOS 官方开发指南(harmonyos-guides-mcp 提供),覆盖各 Kit/API 的用法、接口参数、调用流程。**在为用户调用某个鸿蒙 API/Kit 前,若不确定其用法或参数,先检索官方指南,不要凭记忆编造 `@ohos.*` 接口。**

## 何时用本 Skill(而非 best-practices)

- ✅ 用本指南:查**某个 API/Kit 怎么用**——接口名、参数、返回值、调用顺序、生命周期。例:"AVPlayer 状态机""AudioCapturer 录音参数""ArkUI Text 组件属性""Ability 启动模式"。
- ❌ 用 best-practices:查**某类场景的最佳做法 + 参考代码**——性能/稳定性/功耗优化、长列表丢帧、组件复用范例。
- 两者可配合:先本指南查清 API 用法,再 best-practices 看该场景怎么做最好。

## 检索流程

1. **检索**:`search_guides`,用 `API/Kit 名 + 功能` 关键词(中英文均可,如 `AVPlayer 播放视频 初始化`、`Audio Kit 录音`、`ArkUI List 滑动`)。返回按相关度排序的指南列表(含标题与分类路径)。

2. **读全文**:对最相关的命中调 `get_guide({name:"<docId>"})` 读完整指南正文,理解接口签名、参数、示例代码片段。

3. **依据指南编码**:按官方用法实现,接口名/参数以指南为准,不凭空编造。

## 辅助

- 不确定某功能归哪类时,用 `list_guides_by_topic()` 看顶级类(基础入门/应用框架/系统/媒体/图形/应用服务…),再 `list_guides_by_topic({topic:"媒体"})` 下钻,支持传完整路径前缀(如 `媒体 / Audio Kit`)进一步缩小。
- docId 即文件名(不含 .md),如 `avplayer-overview`、`audio-recorder`。

## 反模式(避免)

- ❌ 不检索就直接写鸿蒙代码,凭印象编造 `@ohos.*` 接口名/参数/返回类型。
- ❌ 把本指南当成"最佳实践"用——它讲的是 API 正确用法,不是场景化优化建议(那用 best-practices)。
- ❌ 忽略指南里的参数约束(必填/取值范围/异步回调签名),直接按猜的传参。
