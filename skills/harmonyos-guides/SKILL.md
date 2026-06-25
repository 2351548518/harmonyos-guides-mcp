---
name: harmonyos-guides
description: 查 HarmonyOS 官方 API/Kit 用法、接口参数、调用流程、开发指南时触发(如 "AVPlayer 怎么初始化"、"Audio Kit 录音接口"、"ArkUI List 滑动属性"、"Ability 生命周期")。对应 harmonyos-guides-mcp 的 search_guides / get_guide / list_guides_by_topic 工具,检索 5489 篇官方开发指南。注意:这是查"API 怎么用"(用法/调用流程/示例),若查接口精确定义用 harmonyos-api-references,查场景最佳实践和参考代码用 harmonyos-best-practices,查设计规范用 harmonyos-ui-design-guides。
---

# 鸿蒙官方指南 检索指引

本地有 5489 篇 HarmonyOS 官方开发指南(harmonyos-guides-mcp 提供),覆盖各 Kit/API 的用法、接口参数、调用流程。**在为用户调用某个鸿蒙 API/Kit 前,若不确定其用法或参数,先检索官方指南,不要凭记忆编造 `@ohos.*` 接口。**

## 何时用本 Skill(而非 best-practices/api-references/ui-design-guides)

- ✅ 用本指南:查**某个 API/Kit 怎么用**——接口名、参数、返回值、调用顺序、生命周期、示例代码。例:"AVPlayer 状态机""AudioCapturer 录音参数""ArkUI Text 组件属性""Ability 启动模式"。
- ❌ 用 best-practices:查**场景最佳实践 + 参考代码**(怎么做最好)。
- ❌ 用 api-references:查**接口精确定义**(参数/枚举/错误码)。
- ❌ 用 ui-design-guides:查**设计怎么做**(视觉/交互/控件设计规范)。
- 配合:先本指南查清 API 用法,再用 api-references 查精确签名、best-practices 看场景实践、ui-design-guides 定设计规范。

## 检索流程

1. **检索**:`search_guides`,用 `API/Kit 名 + 功能` 关键词(中英文均可,如 `AVPlayer 播放视频 初始化`、`Audio Kit 录音`、`ArkUI List 滑动`)。返回按相关度排序的指南列表(含标题与分类路径)。

2. **读全文**:对最相关的命中调 `get_guide({name:"<docId>"})` 读完整指南正文,理解接口签名、参数、示例代码片段。

3. **依据指南编码**:按官方用法实现,接口名/参数以指南为准,不凭空编造。

## 检索关键词指南(选对词,命中更准)

检索用 BM25 + CJK 权重 + 同义词扩展。关键词选择技巧:

- **API/Kit 名优先**:用 `@ohos.*` 模块名或组件英文名命中最准。例:`@ohos.multimedia.media AVPlayer`、`AudioCapturer 录音`、`Web组件 离线`。
- **中文功能词**:无明确 API 名时用功能描述。例:`数据 持久化 存储`、`权限 申请`、`后台任务 长时`、`网络 HTTP 请求`。
- **同义词已内置扩展**:弹窗↔弹出框↔dialog、列表↔list、开关↔toggle、菜单↔menu 等已自动 OR 扩展,用任一写法都能命中,无需手动换词。
- **避免歧义词**:`List 滑动` 可能误中"ohpm list",改用 `列表 滑动` 或 `List 组件` 更准;查 API 用法时尽量带上 `@ohos.` 前缀或 Kit 名。
- **查不到时**:先 `list_guides_by_topic` 看大类找方向,再下钻;或换 API 英文名重试。

## 大类清单(先定位,再下钻)

5489 篇指南,20 个顶级类(括号为文档数):

应用框架(1047)、系统(1001)、AI(947)、应用服务(883)、编写与调试应用(437)、媒体(365)、图形(233)、NDK开发(141)、开发环境搭建(128)、构建应用(62)、应用体验建议(58)、命令行工具(50)、基础入门(44)、优化应用性能(37)、使用AI智能辅助编程(31)、应用测试(21)、发布应用(1)、一次开发多端部署(1)、应用开发准备(1)、自由流转(1)。

用 `list_guides_by_topic({topic:"<大类>"})` 下钻,支持多级路径前缀(如 `媒体 / Audio Kit`,括号容错)。

## 辅助

- 不确定某功能归哪类时,用 `list_guides_by_topic()` 看顶级类(基础入门/应用框架/系统/媒体/图形/应用服务…),再 `list_guides_by_topic({topic:"媒体"})` 下钻,支持传完整路径前缀(如 `媒体 / Audio Kit`)进一步缩小。
- docId 即文件名(不含 .md),如 `avplayer-overview`、`audio-recorder`。

## 反模式(避免)

- ❌ 不检索就直接写鸿蒙代码,凭印象编造 `@ohos.*` 接口名/参数/返回类型。
- ❌ 把本指南当成"最佳实践"用——它讲的是 API 正确用法,不是场景化优化建议(那用 best-practices)。
- ❌ 忽略指南里的参数约束(必填/取值范围/异步回调签名),直接按猜的传参。
