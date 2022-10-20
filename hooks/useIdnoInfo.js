import { useEffect, useState } from "react";

const useIdnoInfo = (idno) => {
	const [dateOfBirth, setDateOfBirth] = useState(null);
	const [gender, setGender] = useState(null);
	const [age, setAge] = useState({});
	const [year, setYear] = useState(null);
	const [month, setMonth] = useState(null);
	const [day, setDay] = useState(null);
	// const [extractedData, setExtractedData] = useState({});
	const regex =
		/^([1-9]{1})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})[0-9]{3}([0-9]{1})[0-9]{1}$/;
	let extractedData = regex.exec(idno);
	useEffect(() => {
		if (idno && idno.length === 14) {
			if (extractedData && extractedData.length === 7) {
				setYear(extractedData[2]);
				setMonth(extractedData[3]);
				setDay(extractedData[4]);
				setDateOfBirth(
					`${extractedData[1] == 3 ? "20" : "19"}${extractedData[2]}-${
						extractedData[3]
					}-${extractedData[4]}`
				);
				setGender(
					extractedData[6] % 2 === 0
						? { id: 2, name: "Famale", arabicName: "أنثي" }
						: { id: 1, name: "Male", arabicName: "ذكر" }
				);
				setAge(new Date().getFullYear() - parseInt(extractedData[2]));
			}
		} else {
			setDateOfBirth(null);
			setGender(null);
		}
	}, [idno]);
	return { dateOfBirth, gender, age, year, month, day };
};
export default useIdnoInfo;
// extractedData.forEach((element, index) => {
// 	if (index === 2) {
// 		// year
// 		setYear(element);
// 		console.log(element, "year");
// 	}
// 	if (index === 3) {
// 		// month
// 		console.log(element, "month");
// 		setMonth(element);
// 	}

// 	if (index === 4) {
// 		//
// 		console.log(match, "day");
// 		setDay(element);
// 	}
// 	// gender
// 	if (index === 6) {
// 		//
// 		if (match % 2 == 0) {
// 			// famle
// 			setGender(2);
// 		} else {
// 			// male
// 			setGender(1);
// 			console.log(match, "maleeee");
// 		}
// 	}
// });
// };
