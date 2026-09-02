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
  base64DataUrl?: string | null;
  width?: number;
  height?: number;
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

  // 1. Experiment Header (Centered, Times New Roman, Bold, 16pt, Underlined matching template)
  const cleanExpNum = params.experimentNo.replace(/^[-_\s]+/, "");
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 180 },
      children: [
        new TextRun({
          text: `Experiment ${cleanExpNum}`,
          bold: true,
          size: 32, // 16pt
          font: FONT_NAME,
          underline: { type: UnderlineType.SINGLE },
        }),
      ],
    })
  );

  // Helper for 2-Column Metadata Cells: Label in Bold, Value in Normal (Regular)
  const createMetaCell = (label: string, value: string, widthPercent: number) => {
    return new TableCell({
      width: { size: widthPercent, type: WidthType.PERCENTAGE },
      children: [
        new Paragraph({
          spacing: { before: 30, after: 40 },
          children: [
            new TextRun({
              text: `${label}: `,
              bold: true,
              size: 28, // 14pt
              font: FONT_NAME,
            }),
            new TextRun({
              text: value,
              bold: false, // Normal (NOT bold)
              size: 28, // 14pt
              font: FONT_NAME,
            }),
          ],
        }),
      ],
    });
  };

  // 2. Student & Course Meta Info (Clean 2-Column Table matching FSD_EXP_04.docx)
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
          createMetaCell("Student Name", params.studentName, 55),
          createMetaCell("UID", params.uid, 45),
        ],
      }),
      new TableRow({
        children: [
          createMetaCell("Branch", params.branch, 55),
          createMetaCell("Section/Group", params.sectionGroup, 45),
        ],
      }),
      new TableRow({
        children: [
          createMetaCell("Semester", params.semester, 55),
          createMetaCell("Date of Performance", params.dateOfPerformance, 45),
        ],
      }),
      new TableRow({
        children: [
          createMetaCell("Subject Name", params.subjectName, 55),
          createMetaCell("Subject Code", params.subjectCode, 45),
        ],
      }),
    ],
  });

  children.push(metaTable);

  // Helper for Aim Lines: (Level): in Bold 12pt, description in Normal 12pt
  const createAimLine = (level: "Easy" | "Medium" | "Hard", text: string) => {
    return new Paragraph({
      spacing: { before: 40, after: 60 },
      children: [
        new TextRun({
          text: `(${level}): `,
          bold: true,
          size: 24, // 12pt
          font: FONT_NAME,
        }),
        new TextRun({
          text: text.trim(),
          bold: false, // Normal (NOT bold)
          size: 24, // 12pt
          font: FONT_NAME,
        }),
      ],
    });
  };

  // 3. AIM Section (Label Bold, Description Normal)
  children.push(createHeading("AIM:", 240, 100));
  children.push(createAimLine("Easy", params.aimEasy));
  children.push(createAimLine("Medium", params.aimMedium));
  children.push(createAimLine("Hard", params.aimHard));

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
    const rawImage = out.base64DataUrl || (out.imageBytes && out.imageBytes.length > 0 ? out.imageBytes : null);
    if (rawImage) {
      try {
        let imageBytes: Uint8Array;
        if (typeof rawImage === "string") {
          imageBytes = base64ToUint8Array(rawImage);
        } else {
          imageBytes = rawImage;
        }

        const detected = detectImageType(imageBytes);
        const finalType = detected === "jpg" ? "jpeg" : detected;

        // Proportional sizing up to 540pt width and 340pt height
        let targetWidth = 520;
        let targetHeight = 310;
        if (out.width && out.height && out.width > 0 && out.height > 0) {
          const maxWidth = 540;
          const maxHeight = 340;
          const ratio = out.width / out.height;
          if (ratio > maxWidth / maxHeight) {
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth / ratio);
          } else {
            targetHeight = Math.min(maxHeight, out.height);
            targetWidth = Math.round(targetHeight * ratio);
          }
        }

        children.push(
          new Paragraph({
            spacing: { before: 80, after: 200 },
            children: [
              new ImageRun({
                data: imageBytes,
                transformation: {
                  width: targetWidth,
                  height: targetHeight,
                },
                type: finalType,
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
