import Moment from 'moment';
import Plotly from 'plotly.js-dist';

import utils from '../../helpers/utils';
import smash from '../../helpers/data/smashData';


const resetFormValues = () => {
  $('#date1').val('');
  $('#date2').val('');
  $('#date3').val('');
};

const dateCheck = () => {
  const date1 = $('#date1').val();
  const date2 = $('#date2').val();
  const date3 = $('#date3').val();
  let modifiedDate1 = '';
  let modifiedDate2 = '';
  if (date3 === '') {
    modifiedDate1 = Moment(date1).format('YYYY/MM/DD');
    modifiedDate2 = Moment(date2).format('YYYY/MM/DD');
  } else {
    modifiedDate1 = Moment(date3).format('YYYY/MM/DD');
    modifiedDate2 = Moment(date3).format('YYYY/MM/DD');
  }
  return [modifiedDate1, modifiedDate2];
};

const getProperArray = (start, end) => new Promise((resolve, reject) => {
  const names = [];
  const counts = {};
  smash.getIngredientsForDateRange(start, end).then((results) => {
    results.forEach((result) => {
      const singleArray = result.flat();
      singleArray.forEach((obj) => { if (obj) names.push(obj.name); }); // pulls name out of ingredient object and into array of names
    });
    // concisely iterates [names] and creates an object with the ingredient name as the key and its count as the value
    names.forEach((x) => { counts[x] = (counts[x] || 0) + 1; });
    resolve(counts);
  }).catch((err) => reject(err));
});

const ingredientChart = () => new Promise((resolve, reject) => {
  const dates = dateCheck();
  const chartData = [];
  const chartLabels = [];
  const chart = 'ingredient-chart';
  getProperArray(dates[0], dates[1]).then((results) => { // dateCheck returns an array! Hence the index #'s
    Object.entries(results).forEach((result) => {
      const key = result[0];
      const value = result[1];
      chartData.push(value);
      chartLabels.push(key);
    });
    Plotly.newPlot(chart, [{ // Builds basic graph plot for data
      x: chartLabels,
      y: chartData,
      type: 'bar',
      marker: {
        color: 'rgb(245, 119, 56',
        opacity: 0.7,
        line: {
          color: 'rgb(245, 182, 56)',
          width: 1.5,
        },
      },
    }],
    {
      yaxis: {
        title: 'Quantity Used',
      },
    });
    resetFormValues();
    resolve(results);
  }).catch((err) => reject(err));
});

const getIngredientsReport = () => new Promise((resolve, reject) => {
  let domString = '';
  const dates = dateCheck();
  const startDate = dates[0];
  const endDate = dates[1];
  getProperArray(startDate, endDate).then((results) => {
    domString += '<div id="card-container" class="col-12 flex row">';
    domString += '<h4 class="col-12" style="text-align: center;">Inventory Used ';
    domString += `${startDate === endDate ? `on ${startDate}` : `from ${startDate} to ${endDate}`}</h4>`; // title change based on a single date or a range
    Object.entries(results).forEach((result) => {
      const ingredient = result[0];
      const ingredientCount = result[1];
      domString += '<div class="card col-3">';
      domString += '<div class="card-body">';
      domString += `${ingredient} x ${ingredientCount}`;
      domString += '</div>';
      domString += '</div>';
    });
    domString += '</div>';
    domString += '<div id="ingredient-chart"></div>';
    utils.printToDom('ingredient-reporting-section', domString);
    resolve(results);
    $(document).ready(ingredientChart());
    resetFormValues();
  }).catch((err) => reject(err));
});

const ingredientReportEvents = () => {
  $('body').on('click', '#ingredient-reporting-button', getIngredientsReport);
};

export default { getIngredientsReport, ingredientReportEvents };