const helper = require("../helpers/csv_json")
const { settings } = require("../constants/app_constants");
const pool = require("../db/pgdb_connection");
const format = require("pg-format");

const converter = async (type) => {
    try {
        if (type === settings.CONVERTER_TYPES.CSV2JSON) {
            const convertedResponse = await helper.csv2json();
            if (convertedResponse.length === 0) {
                console.log("No data to insert.");
                return [];
            }

            const values = convertedResponse.map(data => {
                const name = `${data.name.firstName} ${data.name.lastName}`;
                const age = parseInt(data.age, 10); 
                const address = data.address ? JSON.stringify(data.address) : null;

                const additional_info = { ...data };
                delete additional_info.name;
                delete additional_info.age;
                delete additional_info.address;

                return [name, age, address, additional_info];
            });

            const query = format(
                `INSERT INTO public.users (name, age, address, additional_info) VALUES %L`,
                values
            );

            await pool.query(query);

            return { ageDistribution: await calculateAgeDistribution() };
        } else {
            //TODO: For any other converters we can call functions
        }
    } catch (error) {
        console.error("Error:converter service", error)
    }
}

const calculateAgeDistribution = async () => {
    try {
        const totalUsersResult = await pool.query(`SELECT COUNT(*) as total FROM public.users`);
        const totalUsers = parseInt(totalUsersResult.rows[0].total, 10);

        if (totalUsers === 0) {
            console.log("No users in the database.");
            return;
        }

        const ageDistributionQuery = `
            SELECT 
                COUNT(CASE WHEN age < 20 THEN 1 END) AS under_20,
                COUNT(CASE WHEN age BETWEEN 20 AND 40 THEN 1 END) AS between_20_40,
                COUNT(CASE WHEN age BETWEEN 40 AND 60 THEN 1 END) AS between_40_60,
                COUNT(CASE WHEN age > 60 THEN 1 END) AS above_60
            FROM public.users
        `;

        const result = await pool.query(ageDistributionQuery);
        const { under_20, between_20_40, between_40_60, above_60 } = result.rows[0];

        const percentages = {
            "< 20": ((under_20 / totalUsers) * 100).toFixed(0),
            "20 to 40": ((between_20_40 / totalUsers) * 100).toFixed(0),
            "40 to 60": ((between_40_60 / totalUsers) * 100).toFixed(0),
            "> 60": ((above_60 / totalUsers) * 100).toFixed(0),
        };

        console.log("\nAge-Group % Distribution");
        console.log("< 20          ", percentages["< 20"]);
        console.log("20 to 40      ", percentages["20 to 40"]);
        console.log("40 to 60      ", percentages["40 to 60"]);
        console.log("> 60          ", percentages["> 60"]);

        return percentages
    } catch (error) {
        console.error("Error calculating age distribution:", error);
    }
};


module.exports = { converter }

