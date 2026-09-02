import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Header,
  AlignmentType,
  UnderlineType,
} from "docx";
import { CU_HEADER_BASE64 } from "./cuHeaderBase64";

export interface OutputItem {
  heading: string;
  imageBytes?: Uint8Array | null;
  imageType?: "image/png" | "image/jpeg" | "image/gif";
}

export interface CodeFileItem {
  filename: string;
  cleanCode: string;
}

export interface FsdDocxParams {
  experimentNo: string;
  studentName: string;
  uid: string;
  branch: string;
  sectionGroup: string;
  semester: string;
  dateOfPerformance: string;
  subjectName: string;
  subjectCode: string;
  aimEasy: string;
  aimMedium: string;
  aimHard: string;
  objectives: string[];
  codeFiles: CodeFileItem[];
  outputItems: OutputItem[];
  learningOutcomes: string[];
}

function detectImageType(bytes: Uint8Array): "png" | "jpg" | "gif" {
  if (bytes && bytes.length >= 4) {
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
      return "png";
    }
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      return "jpg";
    }
    if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
      return "gif";
    }
  }
  return "png";
}

export async function generateFsdDocx(params: FsdDocxParams): Promise<Blob> {
  const children: (Paragraph | Table)[] = [];

  // Font family constant
  const FONT_NAME = "Times New Roman";

  // Helper for Heading (Bold, 14pt => sz 28)
  const createHeading = (text: string, spaceBefore = 240, spaceAfter = 120) => {
    return new Paragraph({
      spacing: { before: spaceBefore, after: spaceAfter },
      children: [
        new TextRun({
          text,
          bold: true,
          size: 28, // 14pt
          font: FONT_NAME,
        }),
      ],
    });
  };

  // Helper for Body/Pointers/Aim (Normal, 12pt => sz 24)
  const createBodyLine = (text: string, bold = false, spaceAfter = 60) => {
    return new Paragraph({
      spacing: { before: 40, after: spaceAfter },
      children: [
        new TextRun({
          text,
          bold,
          size: 24, // 12pt
          font: FONT_NAME,
        }),
      ],
    });
  };

  // Helper for Code Lines (Normal, 10pt => sz 20)
  const createCodeLine = (line: string) => {
    return new Paragraph({
      spacing: { before: 0, after: 0, line: 240 },
      children: [
        new TextRun({
          text: line,
          bold: false,
          size: 20, // 10pt
          font: FONT_NAME,
        }),
      ],
    });
  };

  // 1. Experiment Header (Centered, Times New Roman, Bold, 16pt, Underlined)
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 180 },
      children: [
        new TextRun({
          text: `Experiment-${params.experimentNo}`,
          bold: true,
          size: 32, // 16pt (half-points: 16 * 2)
          font: FONT_NAME,
          underline: { type: UnderlineType.SINGLE },
        }),
      ],
    })
  );

  // 2. Student & Course Meta Info (Clean 2-Column Table matching FSD_EXP_04)
  const noBorder = { style: BorderStyle.NONE, size: 0, color: "auto" };
  const metaTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: noBorder,
      bottom: noBorder,
      left: noBorder,
      right: noBorder,
      insideHorizontal: noBorder,
      insideVertical: noBorder,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { before: 40, after: 60 },
                children: [
                  new TextRun({
                    text: `Student Name: ${params.studentName}`,
                    bold: true,
                    size: 28, // 14pt
                    font: FONT_NAME,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { before: 40, after: 60 },
                children: [
                  new TextRun({
                    text: `UID: ${params.uid}`,
                    bold: true,
                    size: 28, // 14pt
                    font: FONT_NAME,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { before: 40, after: 60 },
                children: [
                  new TextRun({
                    text: `Branch: ${params.branch}`,
                    bold: true,
                    size: 28,
                    font: FONT_NAME,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { before: 40, after: 60 },
                children: [
                  new TextRun({
                    text: `Section/Group: ${params.sectionGroup}`,
                    bold: true,
                    size: 28,
                    font: FONT_NAME,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { before: 40, after: 60 },
                children: [
                  new TextRun({
                    text: `Semester: ${params.semester}`,
                    bold: true,
                    size: 28,
                    font: FONT_NAME,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { before: 40, after: 60 },
                children: [
                  new TextRun({
                    text: `Date of Performance: ${params.dateOfPerformance}`,
                    bold: true,
                    size: 28,
                    font: FONT_NAME,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { before: 40, after: 60 },
                children: [
                  new TextRun({
                    text: `Subject Name: ${params.subjectName}`,
                    bold: true,
                    size: 28,
                    font: FONT_NAME,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 45, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { before: 40, after: 60 },
                children: [
                  new TextRun({
                    text: `Subject Code: ${params.subjectCode}`,
                    bold: true,
                    size: 28,
                    font: FONT_NAME,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  children.push(metaTable);

  // 3. AIM Section (Exact same user text)
  children.push(createHeading("AIM:", 240, 100));
  children.push(createBodyLine(`(Easy): ${params.aimEasy.trim()}`, true));
  children.push(createBodyLine(`(Medium): ${params.aimMedium.trim()}`, true));
  children.push(createBodyLine(`(Hard): ${params.aimHard.trim()}`, true));

  // 4. OBJECTIVE Section (AI generated 5-6 points)
  children.push(createHeading("OBJECTIVE:", 240, 100));
  params.objectives.forEach((obj) => {
    children.push(createBodyLine(obj, false, 60));
  });

  // 5. CODE Section (Clean code without comments)
  children.push(createHeading("CODE:", 240, 100));
  params.codeFiles.forEach((file) => {
    // File label: #App.jsx
    children.push(
      new Paragraph({
        spacing: { before: 180, after: 80 },
        children: [
          new TextRun({
            text: `#${file.filename}`,
            bold: true,
            size: 28, // 14pt
            font: FONT_NAME,
          }),
        ],
      })
    );

    // Code lines in 10pt
    const lines = file.cleanCode.split("\n");
    lines.forEach((l) => {
      children.push(createCodeLine(l));
    });
  });

  // 6. OUTPUT Section
  children.push(createHeading("OUTPUT:", 240, 100));
  for (const out of params.outputItems) {
    // Output label: #Dashboard:
    children.push(
      new Paragraph({
        spacing: { before: 160, after: 80 },
        children: [
          new TextRun({
            text: `#${out.heading.replace(/^#+/, "").replace(/:*$/, "")}:`,
            bold: true,
            size: 28, // 14pt
            font: FONT_NAME,
          }),
        ],
      })
    );

    // Embedded Image if present
    if (out.imageBytes && out.imageBytes.length > 0) {
      try {
        const imgType = detectImageType(out.imageBytes);
        children.push(
          new Paragraph({
            spacing: { before: 80, after: 200 },
            children: [
              new ImageRun({
                data: out.imageBytes,
                transformation: {
                  width: 520,
                  height: 310,
                },
                type: imgType,
              }),
            ],
          })
        );
      } catch (imgErr) {
        console.warn("Could not embed image run:", imgErr);
      }
    }
  }

  // 7. LEARNING OUTCOMES Section (AI generated 5-6 points)
  children.push(createHeading("LEARNING OUTCOMES:", 260, 100));
  params.learningOutcomes.forEach((out) => {
    children.push(createBodyLine(out, false, 60));
  });

function base64ToUint8Array(base64: string): Uint8Array {
  if (typeof window !== "undefined" && typeof window.atob === "function") {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
  const buf = Buffer.from(base64, "base64");
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
}

  // Construct Document with official Chandigarh University header
  const cuHeaderBytes = base64ToUint8Array(CU_HEADER_BASE64);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 2420, // Accommodates header banner matching FSD_EXP_04.docx
              bottom: 1000,
              left: 1080,
              right: 1440,
              header: 360,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                spacing: { before: 0, after: 100 },
                children: [
                  new ImageRun({
                    data: cuHeaderBytes,
                    transformation: {
                      width: 594,
                      height: 154,
                    },
                    type: "png",
                  }),
                ],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
