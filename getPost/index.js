const { CosmosClient } = require("@azure/cosmos");

const cosmosClient = new CosmosClient(process.env.CosmosDBConnectionString);
const databaseName = "YourCosmosDBDatabaseName";
const containerName = "YourCosmosDBContainerName";

module.exports = async function (context, req) {
    context.log("JavaScript HTTP trigger function processed a request.");

    try {
        // Extract the post ID from the query parameters
        const postId = req.query.id;

        if (!postId) {
            context.res = {
                status: 400,
                body: "Please provide a post ID in the query parameters.",
            };
            return;
        }

        const database = cosmosClient.database(databaseName);
        const container = database.container(containerName);

        // Query Cosmos DB to get the post by ID
        const { resources: posts } = await container.items.query(`SELECT * FROM c WHERE c.id = @postId`, {
            parameters: [{ name: "@postId", value: postId }],
        }).fetchAll();

        if (posts.length === 0) {
            context.res = {
                status: 404,
                body: `Post with ID ${postId} not found.`,
            };
            return;
        }

        const post = posts[0];

        context.res = {
            status: 200,
            body: post,
        };
    } catch (error) {
        context.log.error(error);
        context.res = {
            status: 500,
            body: "Internal server error.",
        };
    }
};
