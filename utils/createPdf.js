import PDFMerger from "pdf-merger-js";
import { launch } from "puppeteer";

export const createPdf = async (urls, filename) => {
  const browser = await launch({
      headless: true,
      ignoreHTTPSErrors: true
  });
  const [page] = await browser.pages();
  const merger = new PDFMerger();

  for (const url of urls) {
    await page.goto(url, {
      waitUntil: 'networkidle0'
    }, { timeout: 0 });
    await merger.add(await page.pdf({
      printBackground: true,
      format: 'a4'
    }));
  }
  
  merger.save(filename);
}
