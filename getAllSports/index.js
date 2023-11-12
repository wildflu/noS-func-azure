const { CosmosClient } = require("@azure/cosmos");

const cosmosClient = new CosmosClient(process.env.CosmosDBConnectionString);
const databaseName = "faoz-db"; // Replace with your actual database name
const usersCollectionName = "users";

module.exports = async function (context, req) {
    context.log("JavaScript HTTP trigger function processed a request.");

    try {
        const database = cosmosClient.database(databaseName);
        const usersContainer = database.container(usersCollectionName);

        // Query to retrieve all unique sports from the "sports" field
        const querySpec = {
            query: "SELECT DISTINCT value sports FROM sports IN c.sports",
        };

        const { resources: uniqueSports } = await usersContainer.items.query(querySpec).fetchAll();


        context.res = {
            status: 200,
            body: uniqueSports,
        };
    } catch (error) {
        context.log.error(error);
        context.res = {
            status: 500,
            body: "Internal server error.",
        };
    }
};
