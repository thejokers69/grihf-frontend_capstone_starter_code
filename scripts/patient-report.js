import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const lines = [
  '# StayHealthy Patient Report',
  'Go Digital initiative - fictitious training record',
  '',
  '## Patient',
  'Name: Amina El Fassi',
  'Patient ID: SH-10482',
  'Date of birth: 14 March 1992',
  'Phone: +212 6 12 34 56 78',
  'Email: amina.elfassi@example.com',
  'Location: Rural clinic catchment, remote follow-up',
  '',
  '## Visit',
  'Date: 23 September 2026',
  'Clinician: Dr. Leila Benali, General practice',
  'Visit type: Scheduled video consultation',
  'Reason: Persistent sneezing, itchy eyes, and a runny nose for six days',
  '',
  '## Assessment',
  'Mild seasonal allergic rhinitis. No fever, no shortness of breath, lungs clear.',
  '',
  '## Prescription',
  '1. Cetirizine 10 mg tablet, once daily for 14 days',
  '2. Fluticasone nasal spray, 2 sprays each nostril once daily for 7 days',
  '3. Saline nasal rinse, twice daily as needed',
  '',
  '## Advice',
  'Rest, fluids, and avoid outdoor dust when the wind is high.',
  'Return for a follow-up if symptoms last more than two weeks or breathing worsens.',
  '',
  'StayHealthy - This sample report is for the course project only.'
]

function escapePdf(value) {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

function buildPdf(rows) {
  let y = 760
  const ops = ['BT']
  for (const row of rows) {
    const heading = row.startsWith('# ')
    const sub = row.startsWith('## ')
    const size = heading ? 20 : sub ? 14 : 11
    const text = row.replace(/^#{1,2}\s/, '')
    ops.push(`/F1 ${size} Tf`)
    ops.push(`1 0 0 1 48 ${y} Tm`)
    ops.push(`(${escapePdf(text)}) Tj`)
    y -= heading ? 28 : sub ? 22 : 16
  }
  ops.push('ET')
  const stream = ops.join('\n')
  const objects = []
  objects.push('1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj')
  objects.push('2 0 obj << /Type /Pages /Count 1 /Kids [3 0 R] >> endobj')
  objects.push('3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj')
  objects.push(`4 0 obj << /Length ${Buffer.byteLength(stream)} >> stream\n${stream}\nendstream endobj`)
  objects.push('5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj')

  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf))
    pdf += `${object}\n`
  }
  const xref = Buffer.byteLength(pdf)
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  return pdf
}

const pdf = buildPdf(lines)
const targets = [
  path.join(root, 'patient_report.pdf'),
  path.join(root, 'public', 'patient_report.pdf')
]
for (const target of targets) {
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, pdf)
  console.log(`Wrote ${target}`)
}
