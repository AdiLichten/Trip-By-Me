const cityService = require('../services/cityService');

const getCitiesByState = async (req, res) => {
    const {state} = req.params;

    try {
        const cities = await cityService.getCitiesByState(state);
        res.json({cities});
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({message: 'Error fetching cities'});
    }
};

module.exports = {
    getCitiesByState,
};
