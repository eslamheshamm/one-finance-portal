import puppeteer from "puppeteer";
import hbs from "handlebars";
import fs from "fs";
import path from "path";
const NumbersToArabicWords = require("../../helpers/NumbersToArabicWords");

const compile = async (templateName, data) => {
	const filePath = path.join(
		`${__dirname}/../../../../`,
		"templates",
		`${templateName}.hbs`
	);
	if (!filePath) {
		throw new Error(`Could not find ${templateName}.hbs in generatePDF`);
	}
	const templateHtml = fs.readFileSync(filePath, "utf8");
	return hbs.compile(templateHtml)(data);
};
export default async function handler(req, res) {
	if (req.method === "POST") {
		const browser = await puppeteer.launch({
			headless: true,
			args: ["--no-sandbox"],
		});
		const page = await browser.newPage();
		// dates
		const newDate = new Date();
		const firstInstallmentDate = new Date(
			req.body.contractData.firstInstallment
		).toLocaleDateString("ar-EG");
		const lastInstallmentDate = new Date(
			req.body.contractData.lastInstallment
		).toLocaleDateString("ar-EG");

		const content = await compile(`${req.body.contractData.templete}`, {
			contractNumber: req.body.contractData.contractNumber,
			date: newDate.toLocaleDateString("ar-EG"),
			dayName: newDate.toLocaleDateString("ar-EG", {
				weekday: "long",
			}),
			customerName: req.body.contractData.customerName,
			customerIdNumber: req.body.contractData.customerIdNumber,
			address: req.body.contractData.address,
			amount: req.body.contractData.amount,
			amountArabic: NumbersToArabicWords.toArabicWord(
				req.body.contractData.amount
			),
			period: req.body.contractData.period,
			interestRate: req.body.contractData.interestRate,
			interestRateArabic: NumbersToArabicWords.toArabicWord(
				req.body.contractData.interestRate
			),
			adminFees: req.body.contractData.adminFees,
			adminFeesArabic: NumbersToArabicWords.toArabicWord(
				req.body.contractData.adminFees
			),
			otherFees: req.body.contractData.otherFees,
			otherFeesArabic: NumbersToArabicWords.toArabicWord(
				req.body.contractData.otherFees
			),
			totalUnitAmount: req.body.contractData.totalUnitAmount,
			totalUnitAmountArabic: NumbersToArabicWords.toArabicWord(
				req.body.contractData.totalUnitAmount
			),
			instalment: req.body.contractData.instalment,
			instalmentArabic: NumbersToArabicWords.toArabicWord(
				req.body.contractData.instalment
			),
			firstInstallmentDate: firstInstallmentDate,
			lastInstallmentDate: lastInstallmentDate,
			downPayment: req.body.contractData.downPayment,
			downPaymentArabic: NumbersToArabicWords.toArabicWord(
				req.body.contractData.downPayment
			),
			decliningInterstRate: req.body.contractData.decliningInterstRate,
			decliningInterstRateArabic: NumbersToArabicWords.toArabicWord(
				req.body.contractData.decliningInterstRate
			),
			penaltyCharges: req.body.contractData.penaltyChargesratio,
			// "periodArabic": NumbersToArabicWords.toArabicWord(12),
		});
		await page.setContent(content, {
			waitUntil: "networkidle0",
		});

		await page.emulateMediaType("screen");
		const pdf = await page.pdf({
			format: "A4",
			displayHeaderFooter: false,
			margin: {
				top: "0px",
				bottom: "0px",
			},
			// path: `contracts/${req.body.contractData.contractNumber}.pdf`,
			path: `../../almasria-backend/wwwroot/Contracts/${req.body.contractData.contractNumber}.pdf`,
		});
		res.send({
			success: true,
		});
		await browser.close();
	}
	if (req.method === "GET") {
		// const path = `contracts/${req.query.contractNumber}.pdf`;
		const path = `../../almasria-backend/wwwroot/Contracts/${req.query.contractNumber}.pdf`;
		try {
			if (fs.existsSync(path)) {
				//file exists
				res.send({
					success: true,
					url: `https://test.onefinance-eg.com:8000/Contracts/${req.query.contractNumber}.pdf`,
				});
			}
		} catch (err) {
			res.send({
				success: false,
			});
		}
	}
}

// export default async (req, res) => {
//   switch (req.method) {
//     case "GET":
//       console.log("👍 GET");
//       res.json([req.body]);
//       break;
//     case "POST":
//       console.log("👍 POST");
//       //res.json([]);
//       res.status(200).end();
//       break;
//     case "PUT":
//       console.log("👍 PUT");
//       //res.json([req.body]);
//       res.status(200).end();
//       break;
//     default:
//       res.status(405).end(); //Method Not Allowed
//       break;
//   }
// };
