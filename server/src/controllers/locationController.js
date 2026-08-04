const { NIGERIAN_STATES, PRODUCE_CATEGORIES, PRODUCE_UNITS } = require('../utils/nigerianStates');

const getMetaData = (req, res) => {
  res.json({
    states: Object.keys(NIGERIAN_STATES),
    statesAndLgas: NIGERIAN_STATES,
    categories: PRODUCE_CATEGORIES,
    units: PRODUCE_UNITS
  });
};

module.exports = {
  getMetaData
};
