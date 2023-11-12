

const { CosmosClient } = require("@azure/cosmos");

const cosmosClient = new CosmosClient(process.env.CosmosDBConnectionString);
const databaseName = "faoz-db";
const postsCollectionName = "posts";
const usersCollectionName = "users";

module.exports = async function (context, req) {
    context.log("JavaScript HTTP trigger function processed a request.");

    try {
        // Extract user ID from the query parameters
        const userId = req.query.id;

        if (!userId) {
            context.res = {
                status: 400,
                body: "Please provide a userId in the query parameters.",
            };
            return;
        }

        const database = cosmosClient.database(databaseName);
        const postsContainer = database.container(postsCollectionName);
        const usersContainer = database.container(usersCollectionName);

        // Fetch user details to verify if the user exists (optional)
        const { resource: user } = await usersContainer.item(userId, userId).read();

        if (!user) {
            context.res = {
                status: 404,
                body: `User with ID ${userId} not found.`,
            };
            return;
        }

        // Query posts created by the user
        const querySpec = {
            query: "SELECT * FROM c WHERE c.posterid = @userId",
            parameters: [
                {
                    name: "@userId",
                    value: userId,
                },
            ],
        };

        const { resources: posts } = await postsContainer.items.query(querySpec).fetchAll();

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
