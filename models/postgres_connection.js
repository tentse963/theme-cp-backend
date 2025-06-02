const { Sequelize, DataTypes } = require('sequelize');

// const sequelize = new Sequelize('themecp', 'postgres', 'ten-tsering', {
//     host: 'localhost',
//     dialect: 'postgres',
//     logging: false,
// });

const sequelize = new Sequelize('postgresql://postgres:fxDcIfiXePQPGFyWSAfhdpOUqVatPOUx@metro.proxy.rlwy.net:46947/railway', {
    logging: false,
});

const user_data = sequelize.define(
    'user_data',
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        codeforces_username: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: 'user_data',
    }
);

const level_sheet = sequelize.define(
    'level_sheet',
    {
        level: {
            type: DataTypes.STRING,
        },
        time: {
            type: DataTypes.STRING,
        },
        Performance: {
            type: DataTypes.STRING,
        },
        P1: {
            type: DataTypes.STRING,
        },
        P2: {
            type: DataTypes.STRING,
        },
        P3: {
            type: DataTypes.STRING,
        },
        P4: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: 'level_sheet',
        timestamps: false,
    }
)

const user_contest = sequelize.define(
    'user_contest',
    {
        email: {
            type: DataTypes.STRING,
            references: {
                model: user_data,
                key: 'email',
            },
            allowNull: false,
        },
        handle: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: Sequelize.fn('NOW'),
        },
        contest_no: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        topic: {
            type: DataTypes.STRING,
            defaultValue: 'Random',
        },
        contest_level: {
            type: DataTypes.INTEGER,
        },
        contestId1 : {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        index1 : {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        R1: {
            type: DataTypes.INTEGER,
        },
        contestId2: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        index2 : {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        R2: {
            type: DataTypes.INTEGER,
        },
        contestId3: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        index3 : {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        R3: {
            type: DataTypes.INTEGER,
        },
        contestId4: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        index4 : {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        R4: {
            type: DataTypes.INTEGER,
        },
        T1: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
        T2: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
        T3: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
        T4: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
        performance: {  // Corrected typo from "performace"
            type: DataTypes.INTEGER,
        },
        rating: {
            type: DataTypes.INTEGER,
        },
        delta: {
            type: DataTypes.INTEGER,
        }
    },
    {
        tableName: 'user_contest',
    }
);


// Setting up associations
user_data.hasMany(user_contest, {
    foreignKey: 'email',
    onDelete: 'CASCADE',
});

user_contest.belongsTo(user_data, {
    foreignKey: 'email',
});

// Sync models
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection successful.');

        await user_data.sync({ alter: true });
        await user_contest.sync({ alter: true });
        await level_sheet.sync({ alter: true});

        console.log('Models synced successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

// Export models
module.exports = {
    user_data,
    user_contest,
    level_sheet,
};
