import PDFMerger from "pdf-merger-js";
import { launch } from "puppeteer";
import ILovePDFApi from "@ilovepdf/ilovepdf-nodejs";
import fs from 'fs/promises';

const iLovePdf = new ILovePDFApi(
  process.env.PDF_PUBLIC_KEY, 
  process.env.PDF_SECRET_KEY
);

const compressor = iLovePdf.newTask('compress');

export const createPdf = async (urls, filename) => {
  const browser = await launch();
  const [page] = await browser.pages();
  const merger = new PDFMerger();

  for (const url of urls) {
    await page.goto(url, {
      waitUntil: 'networkidle0'
    });
    merger.add(await page.pdf({
      printBackground: true,
      format: 'a4'
    }));
  }

  await merger.save(filename);
  await compressor.addFile(filename);
  await compressor.process();

  const data = await compressor.download();
  await fs.writeFile('test.pdf', data);
}