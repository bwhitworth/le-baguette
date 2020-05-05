import Plotly from 'plotly.js-dist';

const chart = (divId, labels, data) => {
  Plotly.newPlot(divId, [{
    x: labels,
    y: data,
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
};

const chartMakerMenuItems = (divId, inputArray) => {
  const data = [];
  const labels = [];
  inputArray.forEach((obj) => {
    data.push(obj[1]);
    labels.push(obj[0]);
  });
  chart(divId, labels, data);
};

export default { chartMakerMenuItems, chart };
