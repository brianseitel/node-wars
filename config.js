var config = {
    NUM_SECTORS: 100,
    MIN_NEIGHBORS: 2,
    MAX_NEIGHBORS: 5,
    MIN_CLUSTERS:  5,
    MIN_SECTORS_PER_CLUSTER: 4,
    MAX_SECTORS_PER_CLUSTER: 8,
    ONE_WAY_RATIO: .15, // 5% of sectors should be one-way
    TWO_WAY_RATIO: .3,  // 30% of sectors should have two-way connections


    SHOP_MIN_BANKROLL: 10000,
    SHOP_AVERAGE_BANKROLL: 500000,
};

module.exports = config;