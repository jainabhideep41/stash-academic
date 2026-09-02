import JSZip from "jszip";
import { FSD_TEMPLATE_BASE64 } from "./fsdTemplateBase64";

export interface OutputItem {
  heading: string;
  imageBytes?: Uint8Array | null;
  base64DataUrl?: string | null;
  width?: number;
  height?: number;
  imageType?: "png" | "jpg" | "gif";
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

function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function base64ToUint8Array(base64: string): Uint8Array {
  const cleanB64 = base64.replace(/^data:image\/\w+;base64,/, "").trim();
  if (typeof window !== "undefined" && typeof window.atob === "function") {
    const binaryString = window.atob(cleanB64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
  const buf = Buffer.from(cleanB64, "base64");
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
}

export async function generateFsdDocx(params: FsdDocxParams): Promise<Blob> {
  // 1. Load the official university base template (derived from FSD_EXP_03.docx)
  const templateBytes = base64ToUint8Array(FSD_TEMPLATE_BASE64);
  const zip = new JSZip();
  await zip.loadAsync(templateBytes);

  // 2. Prepare output screenshots and wire relationships in document.xml.rels
  const imageRels: string[] = [];
  const imageEntries: { id: string; rId: string; cx: number; cy: number; heading: string }[] = [];

  let outIndex = 0;
  for (const out of params.outputItems) {
    const rawImage = out.base64DataUrl || (out.imageBytes && out.imageBytes.length > 0 ? out.imageBytes : null);
    if (!rawImage) continue;

    let bytes: Uint8Array;
    if (typeof rawImage === "string") {
      bytes = base64ToUint8Array(rawImage);
    } else {
      bytes = rawImage;
    }

    if (!bytes || bytes.length === 0) continue;

    const rId = `rIdOut${outIndex}`;
    const filename = `output_${outIndex}.png`;

    // Save image into zip
    zip.file(`word/media/${filename}`, bytes);

    // Track relationship
    imageRels.push(
      `<Relationship Id="${rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${filename}"/>`
    );

    // Proportional dimensions in EMUs (1 pt = 12700 EMUs, 1 px at 96dpi = 9525 EMUs)
    // Target display width: ~6.2 inches (5670000 EMUs)
    let targetWidthPx = 590;
    let targetHeightPx = 330;

    if (out.width && out.height && out.width > 0 && out.height > 0) {
      const maxW = 590;
      const maxH = 340;
      const ratio = out.width / out.height;
      if (ratio > maxW / maxH) {
        targetWidthPx = maxW;
        targetHeightPx = Math.round(maxW / ratio);
      } else {
        targetHeightPx = Math.min(maxH, out.height);
        targetWidthPx = Math.round(targetHeightPx * ratio);
      }
    }

    const cx = Math.round(targetWidthPx * 9525);
    const cy = Math.round(targetHeightPx * 9525);

    imageEntries.push({
      id: `${outIndex + 1}`,
      rId,
      cx,
      cy,
      heading: out.heading,
    });

    outIndex++;
  }

  // Update word/_rels/document.xml.rels with image relationships
  const baseRelsXml = await zip.files["word/_rels/document.xml.rels"].async("text");
  // Strip any previous output image rels and insert new ones before </Relationships>
  const cleanBaseRels = baseRelsXml
    .replace(/<Relationship[^>]*Target="media\/output_[^>]*\/>/g, "")
    .replace("</Relationships>", `${imageRels.join("")}</Relationships>`);
  zip.file("word/_rels/document.xml.rels", cleanBaseRels);

  // 3. Construct the clean document XML body identical to FSD_EXP_03.docx
  const cleanExpNum = params.experimentNo.replace(/^[-_\s]+/, "");

  let bodyXml = "";

  // Title: Experiment [X] (Centered, Times New Roman Bold 16pt, single underlined)
  bodyXml += `
<w:p>
  <w:pPr>
    <w:pStyle w:val="Title"/>
    <w:jc w:val="center"/>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:b/>
      <w:sz w:val="32"/>
      <w:u w:val="single"/>
    </w:rPr>
  </w:pPr>
  <w:r>
    <w:rPr>
      <w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/>
      <w:b/>
      <w:sz w:val="32"/>
      <w:u w:val="single"/>
    </w:rPr>
    <w:t>Experiment ${escapeXml(cleanExpNum)}</w:t>
  </w:r>
</w:p>
`;

  // Student Info (4 clean lines matching FSD_EXP_03.docx with pos="5780" tabs and left ind="360")
  bodyXml += `
<w:p>
  <w:pPr>
    <w:tabs><w:tab w:val="left" w:pos="5780"/></w:tabs>
    <w:spacing w:before="159"/>
    <w:ind w:left="360"/>
    <w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="28"/></w:rPr>
  </w:pPr>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="28"/></w:rPr><w:t>Student Name: </w:t></w:r>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="28"/></w:rPr><w:t>${escapeXml(params.studentName)}</w:t></w:r>
  <w:r><w:rPr><w:sz w:val="28"/></w:rPr><w:tab/></w:r>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="28"/></w:rPr><w:t>UID: </w:t></w:r>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="28"/></w:rPr><w:t>${escapeXml(params.uid)}</w:t></w:r>
</w:p>

<w:p>
  <w:pPr>
    <w:tabs><w:tab w:val="left" w:pos="5780"/></w:tabs>
    <w:spacing w:before="24"/>
    <w:ind w:left="360"/>
    <w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="28"/></w:rPr>
  </w:pPr>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="28"/></w:rPr><w:t>Branch: </w:t></w:r>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="28"/></w:rPr><w:t>${escapeXml(params.branch)}</w:t></w:r>
  <w:r><w:rPr><w:sz w:val="28"/></w:rPr><w:tab/></w:r>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="28"/></w:rPr><w:t>Section/Group: </w:t></w:r>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="28"/></w:rPr><w:t>${escapeXml(params.sectionGroup)}</w:t></w:r>
</w:p>

<w:p>
  <w:pPr>
    <w:tabs><w:tab w:val="left" w:pos="5780"/></w:tabs>
    <w:spacing w:before="24"/>
    <w:ind w:left="360"/>
    <w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="28"/></w:rPr>
  </w:pPr>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="28"/></w:rPr><w:t>Semester: </w:t></w:r>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="28"/></w:rPr><w:t>${escapeXml(params.semester)}</w:t></w:r>
  <w:r><w:rPr><w:sz w:val="28"/></w:rPr><w:tab/></w:r>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="28"/></w:rPr><w:t>Date of Performance: </w:t></w:r>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="28"/></w:rPr><w:t>${escapeXml(params.dateOfPerformance)}</w:t></w:r>
</w:p>

<w:p>
  <w:pPr>
    <w:tabs><w:tab w:val="left" w:pos="5780"/></w:tabs>
    <w:spacing w:before="24"/>
    <w:ind w:left="360"/>
    <w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="28"/></w:rPr>
  </w:pPr>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="28"/></w:rPr><w:t>Subject Name: </w:t></w:r>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="28"/></w:rPr><w:t>${escapeXml(params.subjectName)}</w:t></w:r>
  <w:r><w:rPr><w:sz w:val="28"/></w:rPr><w:tab/></w:r>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="28"/></w:rPr><w:t>Subject Code: </w:t></w:r>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="28"/></w:rPr><w:t>${escapeXml(params.subjectCode)}</w:t></w:r>
</w:p>
`;

  // AIM Section (Headings and body text matching FSD_EXP_03.docx with non-bold body text)
  bodyXml += `
<w:p>
  <w:pPr><w:pStyle w:val="Heading1"/><w:tabs><w:tab w:val="left" w:pos="426"/></w:tabs><w:spacing w:before="240" w:after="120"/><w:ind w:left="426"/></w:pPr>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="28"/></w:rPr><w:t>AIM:</w:t></w:r>
</w:p>

<w:p>
  <w:pPr><w:pStyle w:val="BodyText"/><w:tabs><w:tab w:val="left" w:pos="426"/></w:tabs><w:spacing w:before="80" w:after="80"/><w:ind w:left="426"/></w:pPr>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="24"/></w:rPr><w:t>(Easy): </w:t></w:r>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/></w:rPr><w:t>${escapeXml(params.aimEasy.trim())}</w:t></w:r>
</w:p>

<w:p>
  <w:pPr><w:pStyle w:val="BodyText"/><w:tabs><w:tab w:val="left" w:pos="426"/></w:tabs><w:spacing w:before="80" w:after="80"/><w:ind w:left="426"/></w:pPr>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="24"/></w:rPr><w:t>(Medium): </w:t></w:r>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/></w:rPr><w:t>${escapeXml(params.aimMedium.trim())}</w:t></w:r>
</w:p>

<w:p>
  <w:pPr><w:pStyle w:val="BodyText"/><w:tabs><w:tab w:val="left" w:pos="426"/></w:tabs><w:spacing w:before="80" w:after="80"/><w:ind w:left="426"/></w:pPr>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="24"/></w:rPr><w:t>(Hard): </w:t></w:r>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/></w:rPr><w:t>${escapeXml(params.aimHard.trim())}</w:t></w:r>
</w:p>
`;

  // OBJECTIVE Section (Native Word round bullet points matching FSD_EXP_03.docx: numId="5")
  bodyXml += `
<w:p>
  <w:pPr><w:pStyle w:val="Heading1"/><w:tabs><w:tab w:val="left" w:pos="426"/></w:tabs><w:spacing w:before="240" w:after="120"/><w:ind w:left="426"/></w:pPr>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="28"/></w:rPr><w:t>OBJECTIVE:</w:t></w:r>
</w:p>
`;

  for (const obj of params.objectives) {
    bodyXml += `
<w:p>
  <w:pPr>
    <w:pStyle w:val="ListParagraph"/>
    <w:numPr><w:ilvl w:val="0"/><w:numId w:val="5"/></w:numPr>
    <w:ind w:left="720" w:hanging="360"/>
    <w:spacing w:before="40" w:after="60"/>
    <w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/></w:rPr>
  </w:pPr>
  <w:r>
    <w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/></w:rPr>
    <w:t>${escapeXml(obj.trim())}</w:t>
  </w:r>
</w:p>
`;
  }

  // CODE Section (Times New Roman, clean code without comments, 10pt)
  bodyXml += `
<w:p>
  <w:pPr><w:pStyle w:val="Heading1"/><w:tabs><w:tab w:val="left" w:pos="426"/></w:tabs><w:spacing w:before="240" w:after="120"/><w:ind w:left="426"/></w:pPr>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="28"/></w:rPr><w:t>CODE:</w:t></w:r>
</w:p>
`;

  for (const file of params.codeFiles) {
    bodyXml += `
<w:p>
  <w:pPr><w:pStyle w:val="Heading2"/><w:tabs><w:tab w:val="left" w:pos="426"/></w:tabs><w:spacing w:before="200" w:after="80"/><w:ind w:left="426"/></w:pPr>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="28"/></w:rPr><w:t>#${escapeXml(file.filename)}</w:t></w:r>
</w:p>
`;
    const lines = file.cleanCode.split("\n");
    for (const l of lines) {
      bodyXml += `
<w:p>
  <w:pPr><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="20"/></w:rPr></w:pPr>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve">${escapeXml(l)}</w:t></w:r>
</w:p>
`;
    }
  }

  // OUTPUT Section (Embedded screenshots with exact OpenXML pictures)
  bodyXml += `
<w:p>
  <w:pPr><w:pStyle w:val="Heading1"/><w:tabs><w:tab w:val="left" w:pos="426"/></w:tabs><w:spacing w:before="240" w:after="120"/><w:ind w:left="426"/></w:pPr>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="28"/></w:rPr><w:t>OUTPUT:</w:t></w:r>
</w:p>
`;

  for (let i = 0; i < params.outputItems.length; i++) {
    const item = params.outputItems[i];
    const headingClean = item.heading.replace(/^#+/, "").replace(/:*$/, "");

    bodyXml += `
<w:p>
  <w:pPr><w:pStyle w:val="Heading3"/><w:spacing w:before="160" w:after="80"/><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="28"/></w:rPr></w:pPr>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="28"/></w:rPr><w:t>#${escapeXml(headingClean)}:</w:t></w:r>
</w:p>
`;

    // Find the corresponding image entry
    const imgEntry = imageEntries[i];
    if (imgEntry) {
      bodyXml += `
<w:p>
  <w:pPr><w:spacing w:before="80" w:after="200"/></w:pPr>
  <w:r>
    <w:drawing>
      <wp:inline distT="0" distB="0" distL="0" distR="0">
        <wp:extent cx="${imgEntry.cx}" cy="${imgEntry.cy}"/>
        <wp:effectExtent l="0" t="0" r="0" b="0"/>
        <wp:docPr id="${i + 100}" name="Picture ${i + 100}"/>
        <wp:cNvGraphicFramePr>
          <a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/>
        </wp:cNvGraphicFramePr>
        <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
          <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
            <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
              <pic:nvPicPr>
                <pic:cNvPr id="${i + 1}" name=""/>
                <pic:cNvPicPr/>
              </pic:nvPicPr>
              <pic:blipFill>
                <a:blip r:embed="${imgEntry.rId}"/>
                <a:stretch><a:fillRect/></a:stretch>
              </pic:blipFill>
              <pic:spPr>
                <a:xfrm>
                  <a:off x="0" y="0"/>
                  <a:ext cx="${imgEntry.cx}" cy="${imgEntry.cy}"/>
                </a:xfrm>
                <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
              </pic:spPr>
            </pic:pic>
          </a:graphicData>
        </a:graphic>
      </wp:inline>
    </w:drawing>
  </w:r>
</w:p>
`;
    }
  }

  // LEARNING OUTCOMES Section (Native Word round bullet points matching FSD_EXP_03.docx: numId="5")
  bodyXml += `
<w:p>
  <w:pPr><w:pStyle w:val="Heading1"/><w:tabs><w:tab w:val="left" w:pos="426"/></w:tabs><w:spacing w:before="240" w:after="120"/><w:ind w:left="426"/></w:pPr>
  <w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:b/><w:sz w:val="28"/></w:rPr><w:t>LEARNING OUTCOMES:</w:t></w:r>
</w:p>
`;

  for (const outcome of params.learningOutcomes) {
    bodyXml += `
<w:p>
  <w:pPr>
    <w:pStyle w:val="ListParagraph"/>
    <w:numPr><w:ilvl w:val="0"/><w:numId w:val="5"/></w:numPr>
    <w:ind w:left="720" w:hanging="360"/>
    <w:spacing w:before="40" w:after="60"/>
    <w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/></w:rPr>
  </w:pPr>
  <w:r>
    <w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="24"/></w:rPr>
    <w:t>${escapeXml(outcome.trim())}</w:t>
  </w:r>
</w:p>
`;
  }

  // Section Properties linking to the exact official Chandigarh University header (header2.xml)
  bodyXml += `
<w:sectPr w:rsidR="005C4A55" w:rsidRPr="00B56DC0">
  <w:headerReference w:type="default" r:id="rId11"/>
  <w:pgSz w:w="12240" w:h="15840"/>
  <w:pgMar w:top="2420" w:right="1440" w:bottom="280" w:left="1080" w:header="0" w:footer="0" w:gutter="0"/>
  <w:cols w:space="720"/>
</w:sectPr>
`;

  // Wrap inside root document
  const finalDocXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
  <w:body>
    ${bodyXml}
  </w:body>
</w:document>`;

  zip.file("word/document.xml", finalDocXml);

  return await zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}
