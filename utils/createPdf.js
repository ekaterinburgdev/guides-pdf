import puppeteer from "puppeteer";
import * as fs from "fs";

export const createPdf = async (urls, filename) => {
    fs.writeFile(`${filename}.pdf`, '', function (err) {
        if (err) throw err;
        console.log(`File ${filename}.pdf is created successfully.`);
    });
    const browser = await puppeteer.launch({
        headless: false
    });
    const [page] = await browser.pages();
    await page.setDefaultNavigationTimeout(0);

    const pdfGenerate = () => {
        return page.evaluate(() => {
                function addJS(pathName) {
                    return (res, _) => {
                        const script = document.createElement('script');
                        script.src = pathName;
                        document.body.appendChild(script)
                        script.onload = () => {
                            res()
                        }
                    }
                }

                addJS('https://cdn.jsdelivr.net/npm/jspdf@2.4.0/dist/jspdf.umd.min.js');
                addJS('https://cdn.jsdelivr.net/npm/html2canvas@1.3.3/dist/html2canvas.min.js');
                addJS('https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js');

                const pdf = new window.jspdf.jsPDF({
                    orientation: 'p',
                    unit: 'pt',
                    format: 'a4'
                });

                pdf.html(document.querySelector('[class*="Template_templateColumn"]'), {
                    margin: [28, 0, 28, 0],
                    autoPaging: 'text',
                });

                return pdf.output('arraybuffer');
            }
        )
    };

    for (const url of urls) {
        await Promise.all([
            page.waitForNavigation(),
            page.goto(url, {
                waitUntil: 'networkidle2'
            }),
            page.waitForSelector('[class*="Template_templateColumn"]'),
        ]);
        
        pdfGenerate().then(buffer =>
            fs.appendFileSync(`${filename}.pdf`, Buffer.from(buffer))
        );
    }

    await browser.close();
};