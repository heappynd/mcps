import { z } from "zod";
import { type ToolMetadata, type InferSchema } from "xmcp";
import iconv from "iconv-lite";
import fs from "node:fs";
import path from "node:path";

const ENCODINGS = [
  "UTF-8",
  "UTF-16LE",
  "UTF-16BE",
  "UTF-32LE",
  "UTF-32BE",
  "GB2312",
  "GBK",
  "GB18030",
  "Big5",
  "HZ",
  "Shift_JIS",
  "EUC-JP",
  "ISO-2022-JP",
  "EUC-KR",
  "ISO-2022-KR",
  "ISO-8859-1",
  "ISO-8859-2",
  "ISO-8859-3",
  "ISO-8859-4",
  "ISO-8859-5",
  "ISO-8859-6",
  "ISO-8859-7",
  "ISO-8859-8",
  "ISO-8859-9",
  "ISO-8859-10",
  "ISO-8859-11",
  "ISO-8859-13",
  "ISO-8859-14",
  "ISO-8859-15",
  "ISO-8859-16",
  "Windows-1250",
  "Windows-1251",
  "Windows-1252",
  "Windows-1253",
  "Windows-1254",
  "Windows-1255",
  "Windows-1256",
  "Windows-1257",
  "Windows-1258",
  "Windows-874",
  "KOI8-R",
  "KOI8-U",
  "KOI8-T",
  "MacRoman",
  "MacCentralEurope",
  "MacCroatian",
  "MacRomania",
  "MacTurkish",
  "MacGreek",
  "MacHebrew",
  "MacArabic",
  "EBCDIC",
  "CP437",
  "CP737",
  "CP775",
  "CP850",
  "CP852",
  "CP855",
  "CP856",
  "CP857",
  "CP860",
  "CP861",
  "CP862",
  "CP863",
  "CP864",
  "CP865",
  "CP866",
  "CP869",
  "CP922",
  "CP1046",
  "CP1124",
  "CP1125",
  "CP1129",
  "CP1133",
  "CP1140",
  "CP1141",
  "CP1142",
  "CP1143",
  "CP1144",
  "CP1145",
  "CP1146",
  "CP1147",
  "CP1148",
  "CP1149",
  "CP1150",
  "CP1250",
  "CP1251",
  "CP1252",
  "CP1253",
  "CP1254",
  "CP1255",
  "CP1256",
  "CP1257",
  "CP1258",
  "ISO-646-CN",
  "EUC-CN",
  "GB12345",
  "ISO-IR-165",
  "armscii-8",
  "Georgian-Academy",
  "Georgian-PS",
  "TIS-620",
  "VISCII",
  "HZ-GB-2312",
  "GB-FR",
  "GB-ISO",
] as const;

export const schema = {
  filePath: z.string().describe("要转换的文件的绝对路径"),
  fromEncoding: z.enum(ENCODINGS).describe("源文件编码"),
  toEncoding: z.enum(ENCODINGS).describe("目标编码"),
};

export const metadata: ToolMetadata = {
  name: "convert-charset",
  description:
    "转换文件字符集编码。支持的编码包括：UTF-8, GB2312, GBK, GB18030, Big5, Shift_JIS, EUC-JP, EUC-KR, ISO-8859-1~16, Windows-1250~1258, KOI8-R, CP1251 等 100+ 种编码。此操作会直接覆盖原文件。",
  annotations: {
    title: "转换文件编码",
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: false,
  },
};

export default async function convertCharset({
  filePath,
  fromEncoding,
  toEncoding,
}: InferSchema<typeof schema>) {
  if (!fs.existsSync(filePath)) {
    return {
      content: [
        {
          type: "text" as const,
          text: `错误：文件不存在: ${filePath}`,
        },
      ],
    };
  }

  const stat = fs.statSync(filePath);
  if (!stat.isFile()) {
    return {
      content: [
        {
          type: "text" as const,
          text: `错误：路径不是文件: ${filePath}`,
        },
      ],
    };
  }

  try {
    const buffer = fs.readFileSync(filePath);
    const content = iconv.decode(buffer, fromEncoding);
    const convertedBuffer = iconv.encode(content, toEncoding);
    fs.writeFileSync(filePath, convertedBuffer);

    const fileName = path.basename(filePath);
    return {
      content: [
        {
          type: "text" as const,
          text: `转换成功！\n文件: ${fileName}\n路径: ${filePath}\n从: ${fromEncoding} → 到: ${toEncoding}\n文件大小: ${stat.size} bytes`,
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text" as const,
          text: `转换失败: ${errorMessage}`,
        },
      ],
    };
  }
}