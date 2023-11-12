

const { CosmosClient } = require("@azure/cosmos");

const cosmosClient = new CosmosClient(process.env.CosmosDBConnectionString);
const databaseName = "faoz-db";
const containerName = "users";

module.exports = async function (context, req) {
    context.log("JavaScript HTTP trigger function processed a request.");

    try {
        // Extract the uid from the query parameters
        const userId = req.query.id;

        if (!userId) {
            context.res = {
                status: 400,
                body: "Please provide a uid in the query parameters.",
            };
            return;
        }

        const database = cosmosClient.database(databaseName);
        const container = database.container(containerName);

        // Use the read() method with uid as both item ID and partition key
        const { resource: user } = await container.item(userId, userId).read();

        if (user) {
            context.res = {
                status: 200,
                body: user,
            };
        } else {
            context.res = {
                status: 404,
                body: `User with UID ${userId} not found.`,
            };
        }
    } catch (error) {
        context.log.error(error);
        context.res = {
            status: 500,
            body: "Internal server error.",
        };
    }
};
