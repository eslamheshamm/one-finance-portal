import { Days360, IPMT, PMT, RATE } from "./excel-functions";

const handleFirstInstallment = (requestDate) => {
	let dateInstallment;
	const date = new Date();
	const currentMonth = new Date(date.getFullYear(), date.getMonth(), 15);
	if (requestDate <= currentMonth) {
		dateInstallment = new Date(date.getFullYear(), date.getMonth() + 1, 1);
	} else {
		dateInstallment = new Date(date.getFullYear(), date.getMonth() + 2, 1);
	}
	return dateInstallment;
};

export const calcLoans = (
	loanAmount,
	loanDuration,
	flatRate,
	requestDate,
	interestMonth = 1
) => {
	let finalRepaymentAmount;
	if (loanAmount && loanDuration && requestDate) {
		const firstInstallmentDate = handleFirstInstallment(requestDate);
		const dateAdjusment = Days360(requestDate, firstInstallmentDate) - 30;
		const installment =
			loanAmount / loanDuration + (loanAmount * flatRate) / 100 / 12;
		const interestRate = RATE(loanDuration, -installment, loanAmount) * 12;
		const adjustedLoanAmount = Math.round(
			loanAmount * (dateAdjusment / 30) * (interestRate / 12)
		);
		const adjustedInstallment =
			adjustedLoanAmount / loanDuration +
			(adjustedLoanAmount * flatRate) / 100 / 12;
		const adjustedInterestRate = interestRate;
		const adjustedRepaymentAmount = -PMT(
			adjustedInterestRate / 12,
			loanDuration,
			adjustedLoanAmount
		);
		const repaymentAmount =
			-PMT(interestRate / 12, loanDuration, loanAmount) +
			adjustedRepaymentAmount;
		console.log(repaymentAmount, "repaymentAmount");
		finalRepaymentAmount = repaymentAmount.toFixed(2);
		// installment interest
		const installmentInterest =
			-IPMT(interestRate / 12, interestMonth, loanDuration, loanAmount) +
			adjustedRepaymentAmount;
		return finalRepaymentAmount;
	} else {
		finalRepaymentAmount = 0;
		return finalRepaymentAmount;
	}
};
