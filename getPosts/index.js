const { CosmosClient } = require("@azure/cosmos");

const cosmosClient = new CosmosClient(process.env.CosmosDBConnectionString);
const databaseName = "faoz-db";
const containerName = "posts";

module.exports = async function (context, req) {
    context.log("JavaScript HTTP trigger function processed a request.");

    try {
        const database = cosmosClient.database(databaseName);
        const container = database.container(containerName);

        // Query Cosmos DB to get all posts
        const { resources: posts } = await container.items.query("SELECT * FROM c").fetchAll();

        context.res = {
            status: 200,
            body: posts,
        };

    } catch (error) {
        context.log.error(error);
        context.res = {
            status: 500,
            body: "Internal server error.",
        };
    }
};
