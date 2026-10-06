// Reader-facing .docx: the PO questions only (no QA mapping, no ids), from docx.json.
const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, LevelFormat, BorderStyle } = require('docx');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'docx.json'), 'utf8'));
const kids = [];
const para = (runs, opts = {}) => new Paragraph({ spacing: { after: 100 }, ...opts, children: runs });
const label = (l, t) => para([new TextRun({ text: l, bold: true }), new TextRun(t)]);

kids.push(new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun(data.title)] }));
kids.push(para([new TextRun(data.intro)], { spacing: { after: 240 } }));

for (const sh of data.sheets) {
  kids.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(sh.name)] }));
  sh.rows.forEach((r, i) => {
    kids.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(`${sh.name} ${i + 1}. ${r.topic}`)] }));
    const nowLines = r.now.split('\n');
    kids.push(label('What happens now: ', nowLines[0]));
    nowLines.slice(1).forEach(l => kids.push(para([new TextRun(l)], { indent: { left: 360 } })));
    kids.push(label('The question: ', r.question));
    kids.push(para([new TextRun({ text: 'Options:', bold: true })]));
    r.options.split('\n').forEach(o => kids.push(new Paragraph({ numbering: { reference: 'opts', level: 0 }, spacing: { after: 60 }, children: [new TextRun(o)] })));
    kids.push(para([new TextRun({ text: 'Your answer: ', bold: true }), new TextRun('______________________________')],
      { spacing: { before: 120, after: 240 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB', space: 8 } } }));
  });
}

const doc = new Document({
  styles: { default: { document: { run: { font: 'Arial', size: 21 } } } },
  numbering: { config: [{ reference: 'opts', levels: [{ level: 0, format: LevelFormat.BULLET, text: '–', alignment: 'left', style: { paragraph: { indent: { left: 540, hanging: 260 } } } }] }] },
  sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } }, children: kids }],
});
Packer.toBuffer(doc).then(b => { fs.writeFileSync(data.path, b); console.log('written', data.path); });
