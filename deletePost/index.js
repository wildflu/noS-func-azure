
const { CosmosClient } = require("@azure/cosmos");

const cosmosClient = new CosmosClient(process.env.CosmosDBConnectionString);
const databaseName = "faoz-db";
const containerName = "posts";


module.exports = async function (context, req) {
    context.log("JavaScript HTTP trigger function processed a request.");

    try {
        const database = cosmosClient.database(databaseName);
        const container = database.container(containerName);

        // Extract the post ID from the query parameters
        const postId = req.query.id;

        if (!postId) {
            context.res = {
                status: 400,
                body: "Please provide a post ID in the query parameters.",
            };
            return;
        }

        // Use the delete() method to delete the post directly
        await container.item(postId, postId).delete();

        context.res = {
            status: 200,  // 204 No Content indicates successful deletion
            body: `Post with ID ${postId} has been successfully deleted.`,
        };
    } catch (error) {
        if (error.code === 404) {
            // Handle not found separately
            context.res = {
                status: 404,
                body: `Post with ID ${postId} not found.`,
            };
        } else {
            context.log.error(error);
            context.res = {
                status: 500,
                body: "Internal server error.",
            };
        }
    }
};
