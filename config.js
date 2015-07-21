var config = {
    NUM_SECTORS: 100,
    MIN_NEIGHBORS: 2,
    MAX_NEIGHBORS: 5,
    MIN_CLUSTERS:  5,
    MIN_SECTORS_PER_CLUSTER: 4,
    MAX_SECTORS_PER_CLUSTER: 8,
    ONE_WAY_RATIO: .15, // 5% of sectors should be one-way
    TWO_WAY_RATIO: .3,  // 30% of sectors should have two-way connections


    SHOP_DENSITY         : 0.4, // 40% of sectors have shops
    SHOP_MIN_BANKROLL    : 10000,
    SHOP_AVERAGE_BANKROLL: 500000,

    FUEL_STANDARD_PRICE: 100,
    ORGANICS_STANDARD_PRICE: 500,
    EQUIPMENT_STANDARD_PRICE: 2500,

    FUEL_MIN_PRICE: 50,
    ORGANICS_MIN_PRICE: 150,
    EQUIPMENT_MIN_PRICE: 750,
};

module.exports = config;