import './index.css';
import liff from '@line/liff';
document.addEventListener("DOMContentLoaded", function() {
liff
  .init({
    liffId: "2003556825-NAK5W0Az", 
  })
  .then(() => {
      const loanAmountInput = document.getElementById("loanAmountInput");
      const interestRateSlider = document.getElementById("interestRateSlider");
      const loanPeriodSlider = document.getElementById("loanPeriodSlider");
      const displayYearSlider = document.getElementById("displayYearSlider");
      const rentYear0Input = document.getElementById("rentYear0Input");
      const declineRateSlider = document.getElementById("declineRateSlider");
      const runningCostInput = document.getElementById("runningCostInput");
     
      const cashFlowChart = document.getElementById("cashFlowChart").getContext("2d");
     
     const chart = new Chart(cashFlowChart, {
      type: "line",
      data: {
       labels: [],
       datasets: [
        {
         label: "Cash Flow",
         type: "line",
         backgroundColor: "rgb(50, 131, 76)",
         borderColor: "rgb(50, 131, 76)",
         data: [],
        },
        {
         label: "Actual Annual Income",
         type: "line",
         backgroundColor: "rgb(131, 131, 50)",
         borderColor: "rgb(131, 131, 50)",
         data: [],
        },
        {
         label: "Expenditure",
         type: "line",
         backgroundColor: "rgb(152, 0, 0)",
         borderColor: "rgb(152, 0, 0)",
         data: [],
        },
        {
         label: "Cumulative Cash Flow",
         type: "bar",
         backgroundColor: "rgba(78, 50, 131, 0.4)",
         data: [],
        },
       ],
      },
      options: {
       responsive: true,
       maintainAspectRatio: true,
       scales: {
        x: {
         type: "linear",
         beginAtZero: true,
         stacked: true,
         ticks: {
          callback: function (value, index, values) {
           return `Year ${value}`;
          },
         },
         grid: {
          display: false,
         },
        },
        y: {
         beginAtZero: false,
        },
       },
       interaction: {
        mode: "index",
       },
      },
     });
     
     function updateValues() {
      loanAmount.innerHTML = loanAmountInput.value;
      interestRate.innerHTML = interestRateSlider.value;
      loanPeriod.innerHTML = loanPeriodSlider.value; // Displayed loan period
      displayYear.innerHTML = displayYearSlider.value;
      rentYear0.innerHTML = rentYear0Input.value;
      declineRate.innerHTML = declineRateSlider.value;
      runningCost.innerHTML = runningCostInput.value;
     
      updateGraph();
     }
     
     function calculateCashFlows(loanAmount, interestRate, loanPeriod, rentYear0, declineRate, runningCost, displayYears) {
       console.log("Loan Amount:", loanAmount);
       console.log("Interest Rate:", interestRate);
       console.log("Loan Period:", loanPeriod);
       console.log("Rent at Year 0:", rentYear0);
       console.log("Decline Rate:", declineRate);
       console.log("Running Cost:", runningCost);
       console.log("Display Years:", displayYears);
      const cashFlows = [];
      const annualRepayment = (loanAmount * (1 + interestRate)) / loanPeriod;
     
      for (let year = 1; year <= loanPeriod; year++) {
       const rentalIncome = rentYear0 * Math.pow(1 - declineRate, year);
       const cashFlow = rentalIncome - (runningCost + annualRepayment);
       cashFlows.push(cashFlow);
      }
      if(loanPeriod < displayYears){
       for(let year = loanPeriod+1 ; year <= displayYears; year++){
         const rentalIncome = rentYear0 * Math.pow(1 - declineRate, year);
         cashFlows.push(rentalIncome - runningCost);
       }
       return cashFlows;
      }
     
      // if displayYears is smaller than loan amount we've to cut the object till the display year.
      return cashFlows.slice(0, displayYears);
     }
     
     function calculatePrincipalRepaymentPerYear(loanAmount, interestRate, loanPeriod) {
      const numberOfPayments = loanPeriod * 12;
      const monthlyPayment =
       (loanAmount * interestRate) /
       (1 - Math.pow(1 + interestRate, -numberOfPayments));
      const yearlyPrincipalRepayments = [];
      let remainingLoanAmount = loanAmount;
     
      for (let year = 1; year <= loanPeriod; year++) {
       let yearlyPrincipal = 0;
     
       for (let month = 1; month <= 12; month++) {
        const interestPayment = remainingLoanAmount * interestRate;
        const principalPayment = monthlyPayment - interestPayment;
     
        yearlyPrincipal += principalPayment;
        remainingLoanAmount -= principalPayment;
       }
     
       yearlyPrincipalRepayments.push(yearlyPrincipal);
      }
     
      return yearlyPrincipalRepayments;
     }
     
     function updateGraph() {
      const loanAmount = parseFloat(loanAmountInput.value);
      const interestRate = parseFloat(interestRateSlider.value) / 100;
      const loanPeriod = parseFloat(loanPeriodSlider.value);
      const displayYears = parseFloat(displayYearSlider.value); 
      const rentYear0 = parseFloat(rentYear0Input.value);
      const declineRate = parseFloat(declineRateSlider.value) / 100;
      const runningCost = parseFloat(runningCostInput.value);
     
      const cashFlows = calculateCashFlows(
       loanAmount,
       interestRate,
       loanPeriod,
       rentYear0,
       declineRate,
       runningCost,
       displayYears
      );
      const principalsRepayments = calculatePrincipalRepaymentPerYear(loanAmount, interestRate, loanPeriod);
     
      const annualRepayment = (loanAmount * (1 + interestRate)) / loanPeriod;
      const actualAnnualIncome = [];
      for(let year = 1; year<= displayYears; year++){
        const rentalIncome = rentYear0 * Math.pow(1 - declineRate, year);
        actualAnnualIncome.push(rentalIncome);
      }
     
      const expenditures = [];
      const temp = runningCost + annualRepayment;
      for (let i = 0; i < Math.min(cashFlows.length,loanPeriod); i++) {
       expenditures.push(temp);
      }
      if(cashFlows.length > loanPeriod){
       for(let i = loanPeriod ; i<= displayYears; i++){
         expenditures.push(runningCost);
       }
      }
     
      const cumulativeCashFlow = [];
      let currentCashFlow = -loanAmount; // Initial cash outflow would be in negative
      for (let i = 0; i < Math.min(cashFlows.length,loanPeriod); i++) {
       // Since cashflow excludes loan repayment, add principal repayment per year to find when the loan is repaid.
       currentCashFlow += cashFlows[i] + principalsRepayments[i];
       cumulativeCashFlow.push(currentCashFlow);
      }
      if(cashFlows.length > loanPeriod){
       for(let i = loanPeriod  ; i <= cashFlows.length; i++){
         currentCashFlow+=cashFlows[i];
         cumulativeCashFlow.push(currentCashFlow);
       }
      }
       // console.log(cashFlows);
       // console.log(actualAnnualIncome);
       // console.log(expenditures);
       // console.log(cumulativeCashFlow);
     
      chart.data.labels = Array.from({ length: displayYears }, (_, i) => i + 1);
      chart.data.datasets[0].data = cashFlows;
      chart.data.datasets[1].data = actualAnnualIncome;
      chart.data.datasets[2].data = expenditures;
      chart.data.datasets[3].data = cumulativeCashFlow;
     
      chart.update();
     }
       updateValues();
       loanAmountInput.addEventListener("input", updateValues);
       interestRateSlider.addEventListener("input", updateValues);
       loanPeriodSlider.addEventListener("input", updateValues);
       rentYear0Input.addEventListener("input", updateValues);
       declineRateSlider.addEventListener("input", updateValues);
       runningCostInput.addEventListener("input", updateValues);
       displayYearSlider.addEventListener("input", updateValues);   

  })
  .catch((err) => {
    // Error happens during initialization
    console.log(err.code, err.message);
  })
});