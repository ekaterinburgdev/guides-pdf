import PDFMerger from "pdf-merger-js";
import { launch } from "puppeteer";

export const createPdf = async (urls, filename) => {
  const browser = await launch({
      ignoreHTTPSErrors: true,
      headless: 'new',
      args: ['--no-sandbox']
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
      timeout: 0
    });
    merger.add(pagePdf);
  }
  
  await merger.save(filename);
}
