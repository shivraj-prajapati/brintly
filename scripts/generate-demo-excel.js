import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

// Company: Generic dummy company
const companyTitle = 'GLOBAL INDUSTRIES';

// Generic dummy employees data for multiple sheets
const dummyEmployeesSheet1 = [
  { sr: 1, name: 'Amit Sharma', rate: 550, days: 26, hours: 4, incr: 0, advance: 2000, pf: 1100, sec: 'Production Dept' },
  { sr: 2, name: 'Rahul Verma', rate: 600, days: 25, hours: 8, incr: 50, advance: 3000, pf: 1200, sec: 'Production Dept' },
  { sr: 3, name: 'Priya Patel', rate: 580, days: 24, hours: 0, incr: 0, advance: 1500, pf: 1150, sec: 'Production Dept' },
  { sr: 4, name: 'Sunil Kumar', rate: 500, days: 22, hours: 6, incr: 0, advance: 2500, pf: 1000, sec: 'Assembly Unit' },
  { sr: 5, name: 'Vikram Singh', rate: 650, days: 26, hours: 10, incr: 100, advance: 4000, pf: 1300, sec: 'Assembly Unit' },
  { sr: 6, name: 'Anjali Mehta', rate: 520, days: 20, hours: 2, incr: 0, advance: 1000, pf: 1040, sec: 'Assembly Unit' },
  { sr: 7, name: 'Deepak Joshi', rate: 570, days: 25, hours: 0, incr: 0, advance: 2000, pf: 1140, sec: 'Quality Control' },
  { sr: 8, name: 'Rajesh Gupta', rate: 620, days: 24, hours: 5, incr: 50, advance: 3500, pf: 1240, sec: 'Quality Control' },
  { sr: 9, name: 'Neha Choudhary', rate: 540, days: 23, hours: 3, incr: 0, advance: 1500, pf: 1080, sec: 'Packing Section' },
  { sr: 10, name: 'Manoj Tiwari', rate: 510, days: 22, hours: 0, incr: 0, advance: 2000, pf: 1020, sec: 'Packing Section' },
  { sr: 11, name: 'Kavita Yadav', rate: 530, days: 24, hours: 6, incr: 0, advance: 1200, pf: 1060, sec: 'Packing Section' },
  { sr: 12, name: 'Sanjay Rawat', rate: 590, days: 25, hours: 4, incr: 50, advance: 2500, pf: 1180, sec: 'Packing Section' },
];

const dummyEmployeesSheet2 = [
  { sr: 1, name: 'Amit Sharma', rate: 550, days: 25, hours: 2, incr: 0, advance: 1500, pf: 1100, sec: 'Production Dept' },
  { sr: 2, name: 'Rahul Verma', rate: 600, days: 26, hours: 6, incr: 50, advance: 2500, pf: 1200, sec: 'Production Dept' },
  { sr: 3, name: 'Priya Patel', rate: 580, days: 25, hours: 4, incr: 0, advance: 2000, pf: 1150, sec: 'Production Dept' },
  { sr: 4, name: 'Sunil Kumar', rate: 500, days: 24, hours: 0, incr: 0, advance: 1800, pf: 1000, sec: 'Assembly Unit' },
  { sr: 5, name: 'Vikram Singh', rate: 650, days: 25, hours: 8, incr: 100, advance: 3500, pf: 1300, sec: 'Assembly Unit' },
  { sr: 6, name: 'Anjali Mehta', rate: 520, days: 22, hours: 0, incr: 0, advance: 1000, pf: 1040, sec: 'Assembly Unit' },
  { sr: 7, name: 'Deepak Joshi', rate: 570, days: 26, hours: 4, incr: 0, advance: 2200, pf: 1140, sec: 'Quality Control' },
  { sr: 8, name: 'Rajesh Gupta', rate: 620, days: 25, hours: 6, incr: 50, advance: 3000, pf: 1240, sec: 'Quality Control' },
];

function buildSheet(empList) {
  const rows = [];
  // Row 1: Company Header
  rows.push([companyTitle]);
  // Row 2: Empty
  rows.push([]);
  // Row 3: Bilingual Column Headers (Same structure as standard salary sheet)
  rows.push([
    'क्रम संख्या',
    'नाम',
    'रेट',
    'दिन',
    'घंटा',
    'बढ़ाया',
    'पगार',
    'उपाढ़',
    'PF',
    'कुल पगार',
  ]);

  let currentSec = '';
  empList.forEach((e) => {
    if (e.sec !== currentSec) {
      currentSec = e.sec;
      rows.push([`-- ${currentSec} --`]);
    }
    const gross = (e.rate + e.incr) * e.days + Math.round(((e.rate + e.incr) / 12) * e.hours);
    const net = gross - e.advance - e.pf;
    rows.push([
      e.sr,
      e.name,
      e.rate,
      e.days,
      e.hours,
      e.incr,
      gross,
      e.advance,
      e.pf,
      net,
    ]);
  });

  return XLSX.utils.aoa_to_sheet(rows);
}

const wb = XLSX.utils.book_new();
const ws1 = buildSheet(dummyEmployeesSheet1);
const ws2 = buildSheet(dummyEmployeesSheet2);

XLSX.utils.book_append_sheet(wb, ws1, 'JAN');
XLSX.utils.book_append_sheet(wb, ws2, 'FEB');

const outPath = path.resolve('public', 'demo.xlsx');
XLSX.writeFile(wb, outPath);
console.log('Successfully generated public/demo.xlsx with generic dummy data.');
