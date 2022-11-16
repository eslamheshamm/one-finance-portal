export function PMT(ir, np, pv, fv, type) {
    /*
     * ir   - interest rate per month
     * np   - number of periods (months)
     * pv   - present value
     * fv   - future value
     * type - when the payments are due:
     *        0: end of the period, e.g. end of month (default)
     *        1: beginning of period
     */
    var pmt, pvif;

    fv || (fv = 0);
    type || (type = 0);

    if (ir === 0)
        return -(pv + fv)/np;

    pvif = Math.pow(1 + ir, np);
    pmt = - ir * (pv * pvif + fv) / (pvif - 1);

    if (type === 1)
        pmt /= (1 + ir);

    return pmt;
}
export function Days360(sd, fd, m) {
	var d1 = new Date(sd);
	var d2 = new Date(fd);
	var d1_1 = d1;
	var d2_1 = d2;
	var method = m || false;
	var d1_y = d1.getFullYear();
	var d2_y = d2.getFullYear();
	var dy = 0;
	var d1_m = d1.getMonth();
	var d2_m = d2.getMonth();
	var dm = 0;
	var d1_d = d1.getDate();
	var d2_d = d2.getDate();
	var dd = 0;
	if (method) {
		// euro
		if (d1_d == 31) d1_d = 30;
		if (d2_d == 31) d2_d = 30;
	} else {
		// american NASD
		if (d1_d == 31) d1_d = 30;
		if (d2_d == 31) {
			if (d1_d < 30) {
				if (d2_m == 11) {
					d2_y = d2_y + 1;
					d2_m = 0;
					d2_d = 1;
				} else {
					d2_m = d2_m + 1;
					d2_d = 1;
				}
			} else {
				d2_d = 30;
			}
		}
	}
	dy = d2_y - d1_y;
	dm = d2_m - d1_m;
	dd = d2_d - d1_d;
	return parseFloat(dy * 360 + dm * 30 + dd);
}

export function RATE(nper, pmt, pv, fv, type, guess) {
	// Sets default values for missing parameters
	fv = typeof fv !== "undefined" ? fv : 0;
	type = typeof type !== "undefined" ? type : 0;
	guess = typeof guess !== "undefined" ? guess : 0.1;

	// Sets the limits for possible guesses to any
	// number between 0% and 100%
	var lowLimit = 0;
	var highLimit = 1;

	// Defines a tolerance of up to +/- 0.00005% of pmt, to accept
	// the solution as valid.
	var tolerance = Math.abs(0.00000005 * pmt);

	// Tries at most 40 times to find a solution within the tolerance.
	for (var i = 0; i < 40; i++) {
		// Resets the balance to the original pv.
		var balance = pv;

		// Calculates the balance at the end of the loan, based
		// on loan conditions.
		for (var j = 0; j < nper; j++) {
			if (type == 0) {
				// Interests applied before payment
				balance = balance * (1 + guess) + pmt;
			} else {
				// Payments applied before insterests
				balance = (balance + pmt) * (1 + guess);
			}
		}

		// Returns the guess if balance is within tolerance.  If not, adjusts
		// the limits and starts with a new guess.
		if (Math.abs(balance + fv) < tolerance) {
			return guess;
		} else if (balance + fv > 0) {
			// Sets a new highLimit knowing that
			// the current guess was too big.
			highLimit = guess;
		} else {
			// Sets a new lowLimit knowing that
			// the current guess was too small.
			lowLimit = guess;
		}

		// Calculates the new guess.
		guess = (highLimit + lowLimit) / 2;
	}

	// Returns null if no acceptable result was found after 40 tries.
	return null;
}

export function IPMT(rate, period, periods, present, future, type) {
	// Credits: algorithm inspired by Apache OpenOffice
  
	// Initialize type
	var type = (typeof type === 'undefined') ? 0 : type;
  
	// Evaluate rate and periods (TODO: replace with secure expression evaluator)
	rate = eval(rate);
	periods = eval(periods);
  
	// Compute payment
	var payment = PMT(rate, periods, present, future, type);
	
	// Compute interest
	var interest;
	if (period === 1) {
	  if (type === 1) {
		interest = 0;
	  } else {
		interest = -present;
	  }
	} else {
	  if (type === 1) {
		interest = FV(rate, period - 2, payment, present, 1) - payment;
	  } else {
		interest = FV(rate, period - 1, payment, present, 0);
	  }
	}
	
	// Return interest
	return interest * rate;
  }

  function FV(rate, nper, pmt, pv, type) {
	var pow = Math.pow(1 + rate, nper),
	  fv;
  
	pv = pv || 0;
	type = type || 0;
  
	if (rate) {
	  fv = (pmt*(1+rate*type)*(1-pow)/rate)-pv*pow;
	} else {
	  fv = -1 * (pv + pmt * nper);
	}
	return fv;
  }