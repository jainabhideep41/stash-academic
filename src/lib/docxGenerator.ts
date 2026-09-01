import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
  BorderStyle,
} from "docx";

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

export async function generateFsdDocx(params: FsdDocxParams): Promise<Blob> {
  const children: Paragraph[] = [];

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

  // 1. Experiment Header
  children.push(createHeading(`Experiment ${params.experimentNo}`, 0, 140));

  // 2. Student & Course Meta Info (Bold 14pt / 12pt matching EXP 4)
  const metaLines = [
    `Student Name: ${params.studentName}\t\t\tUID: ${params.uid}`,
    `Branch: ${params.branch}\t\t\tSection/Group: ${params.sectionGroup}`,
    `Semester: ${params.semester}\t\t\tDate of Performance: ${params.dateOfPerformance}`,
    `Subject Name: ${params.subjectName}\t\tSubject Code: ${params.subjectCode}`,
  ];

  metaLines.forEach((line) => {
    children.push(
      new Paragraph({
        spacing: { before: 40, after: 60 },
        children: [
          new TextRun({
            text: line,
            bold: true,
            size: 28, // 14pt
            font: FONT_NAME,
          }),
        ],
      })
    );
  });

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
        children.push(
          new Paragraph({
            spacing: { before: 80, after: 200 },
            children: [
              new ImageRun({
                data: out.imageBytes,
                transformation: {
                  width: 540,
                  height: 320,
                },
              } as any),
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

  // Construct Document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1200,
              right: 1200,
            },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
