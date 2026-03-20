# charset-converter-mcp

字符集转换 MCP 工具，支持 130+ 种编码格式转换。

## 功能

将文件从一种字符集转换到另一种，**直接覆盖原文件**。

### 工具：convert-charset

**参数：**

| 参数         | 类型   | 必填 | 描述         |
| ------------ | ------ | ---- | ------------ |
| filePath     | string | ✅   | 文件绝对路径 |
| fromEncoding | string | ✅   | 源文件编码   |
| toEncoding   | string | ✅   | 目标编码     |

**支持的编码（130+ 种）：**

- 中文：UTF-8, GB2312, GBK, GB18030, Big5, HZ, GB12345, EUC-CN
- 日文：Shift_JIS, EUC-JP, ISO-2022-JP
- 韩文：EUC-KR, ISO-2022-KR
- 西方：ISO-8859-1~16, Windows-1250~1258
- 俄文：KOI8-R, KOI8-U, Windows-1251
- Unicode：UTF-8, UTF-16LE, UTF-16BE, UTF-32LE, UTF-32BE
- DOS/Windows：CP437, CP850, CP852, CP866, CP1250~CP1258
- Mac：MacRoman, MacCentralEurope, MacGreek 等

## 配置

```json
{
  "mcpServers": {
    "charset-converter": {
      "command": "npx",
      "args": ["-y", "charset-converter-mcp"]
    }
  }
}
```

## 注意事项

- ⚠️ 转换操作会直接覆盖原文件，请提前备份
- 请确保输入正确的源编码，否则转换结果可能乱码
