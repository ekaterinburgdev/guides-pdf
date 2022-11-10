import puppeteer from "puppeteer";
import * as fs from "fs";

// TODO: https://github.com/parallax/jsPDF/issues/2640
export const createPdf = async (urls, filename) => {
    fs.writeFile(`${filename}.pdf`, '', (err) => {
        if (err) throw err;
        console.log(`File ${filename}.pdf is created successfully.`);
    });

    const browser = await puppeteer.launch({
        headless: false,
        ignoreHTTPSErrors: true,
        devtools: true
    });

    const [page] = await browser.pages();

    await page.addScriptTag({
        path: new URL('../node_modules/html2canvas/dist/html2canvas.min.js', import.meta.url).pathname,
    });

    await page.addScriptTag({
        path: new URL('../node_modules/jspdf/dist/jspdf.umd.min.js', import.meta.url).pathname,
    });

    await page.addStyleTag({
        content: 'html { color: red; }'
    });

    const pdfGenerate = await page.evaluate(
        async () => {
            const reader = new FileReader();
            const generatePdf = (res, rej) => {
                /**  @type {import('jspdf')} */
                const jspdf = window.jspdf;
                const pdf = new jspdf.jsPDF({
                    orientation: 'p',
                    unit: 'pt',
                    format: 'a4'
                });
                pdf.html(document.querySelector('html'), {
                    margin: [28, 0, 28, 0],
                    autoPaging: 'text',
                    callback: (pdf) => {
                        const data = pdf.output('blob')
                        reader.readAsBinaryString(data);
                        reader.onload = () => res(reader.result);
                        reader.onerror = () => rej('Error occurred while reading binary string');
                    }
                });
            }
            return new Promise(generatePdf);
        });

    for (const url of urls) {
        await Promise.all([
            page.waitForNavigation(),
            page.goto(url, {
                waitUntil: 'networkidle2'
            }),
            page.waitForSelector('html'),
        ]);
        const pdfData = Buffer.from(pdfGenerate, 'binary');
        fs.appendFileSync(`${filename}.pdf`, pdfData);
    }

    await browser.close();
};