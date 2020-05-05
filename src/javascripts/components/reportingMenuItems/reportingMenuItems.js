// import utils from '../../helpers/utils';
import ordersData from '../../helpers/data/ordersData';
import menuData from '../../helpers/data/menuData';
import utils from '../../helpers/utils';
import chart from '../../helpers/chart';

const getMenuTopTen = () => {
  $('#most-ordered-section').removeClass('hide');
  $('#least-ordered-section').addClass('hide');
  $('#revenue-reporting-section').addClass('hide');
  $('#ingredient-reporting-section').addClass('hide');
  let domString = '';
  let sortedArray = [];
  ordersData.getSingleOrders()
    .then((singleOrders) => {
      menuData.getAllMenuItems()
        .then((menuItems) => {
          // Loop over the Reservations and grab the all the reservations that are equal to the date
          const singleOrderList = singleOrders;
          const listOfMenuObjects = [];
          const listOfMenuItems = [];
          // Then loop over the new reservations and inside that loop filter the orders and push the orders into an array that have the same id as the new reservations
          singleOrderList.forEach((singleOrder) => {
            const menuItemPerOrder = menuItems.filter((menuItem) => menuItem.id === singleOrder.menuItemId);
            listOfMenuObjects.push(menuItemPerOrder);
          });
          listOfMenuObjects.flat().forEach((menuItem) => listOfMenuItems.push(menuItem.name));
          const count = {};
          listOfMenuItems.forEach((i) => {
            count[i] = (count[i] || 0) + 1;
          });
          const menuItemsToArray = Object.entries(count);
          sortedArray = menuItemsToArray.sort((a, b) => b[1] - a[1]);
          if (sortedArray.length > 10) {
            sortedArray.length = 10;
          }
          domString += '<h4>The top 10 most selling menu items:</h4>';
          domString += '<div id="menu-items-chart"></div>';
          utils.printToDom('most-ordered-section', domString);
          $(document).ready(() => chart.chartMakerMenuItems('menu-items-chart', sortedArray));
        });
    });
};

const getMenuBottomTen = () => {
  $('#most-ordered-section').addClass('hide');
  $('#least-ordered-section').removeClass('hide');
  $('#revenue-reporting-section').addClass('hide');
  $('#ingredient-reporting-section').addClass('hide');
  ordersData.getSingleOrders()
    .then((singleOrders) => {
      menuData.getAllMenuItems()
        .then((menuItems) => {
          // Loop over the Reservations and grab the all the reservations that are equal to the date
          const singleOrderList = singleOrders;
          const listOfMenuObjects = [];
          const listOfMenuItems = [];
          // Then loop over the new reservations and inside that loop filter the orders and push the orders into an array that have the same id as the new reservations
          singleOrderList.forEach((singleOrder) => {
            const menuItemPerOrder = menuItems.filter((menuItem) => menuItem.id === singleOrder.menuItemId);
            listOfMenuObjects.push(menuItemPerOrder);
          });
          listOfMenuObjects.flat().forEach((menuItem) => listOfMenuItems.push(menuItem.name));
          const count = {};
          listOfMenuItems.forEach((i) => {
            count[i] = (count[i] || 0) + 1;
          });
          const menuItemsToArray = Object.entries(count);
          const sortedArray = menuItemsToArray.sort((a, b) => a[1] - b[1]);
          if (sortedArray.length > 10) {
            sortedArray.length = 10;
          }
          let domString = '';
          domString += '<h4>The 10 least selling menu items:</h4>';
          domString += '<div id="menu-items-chart-least"></div>';
          utils.printToDom('least-ordered-section', domString);
          $(document).ready(() => chart.chartMakerMenuItems('menu-items-chart-least', sortedArray));
        });
    });
};


const reportingMenuItemsEvents = () => {
  $('body').on('click', '#most-ordered-button', getMenuTopTen);
  $('body').on('click', '#least-ordered-button', getMenuBottomTen);
};

export default {
  getMenuTopTen,
  reportingMenuItemsEvents,
  getMenuBottomTen,
};
