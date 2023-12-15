import PDFMerger from "pdf-merger-js";
import { launch } from "puppeteer";

import path from 'node:path';
import fs from 'node:fs';
import process from "process";
import { compress } from 'compress-pdf';

export const createPdf = async (urls, filename) => {
  const browser = await launch({
      ignoreHTTPSErrors: true,
      headless: 'new',
      args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  const merger = new PDFMerger();

  for (const url of urls) {
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 0
    });
    const pagePdf = await page.pdf({
      printBackground: true,
      format: 'a4',
      timeout: 0,
      margin: {
        top: '16px',
        bottom: '16px',
        left: '16px',
        right: '16px'
      }
    });
    merger.add(pagePdf);
  }
  
  await merger.save(filename);
  const buffer = await compress(path.resolve(process.cwd(), filename), {
    imageQuality: 60
  });
  const compressedPdf = path.resolve(process.cwd(), `compress_${filename}`);

  await fs.promises.writeFile(compressedPdf, buffer);
}
