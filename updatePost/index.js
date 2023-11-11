

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

        // Extract the updated content from the request body
        const updatedContent = req.body;

        if (!updatedContent) {
            context.res = {
                status: 400,
                body: "Please provide updated content in the request body.",
            };
            return;
        }

        // Use the read() method to get the existing post
        const { resource: existingPost } = await container.item(postId, postId).read();

        if (!existingPost) {
            context.res = {
                status: 404,
                body: `Post with ID ${postId} not found.`,
            };
            return;
        }

        // Merge the existing post with the updated content
        const updatedPost = { ...existingPost, ...updatedContent };

        // Use the replace() method to update the post directly
        const { resource: result } = await container.item(postId, postId).replace(updatedPost);

        context.res = {
            status: 200,  // 200 OK indicates successful update
            body: result,
        };
    } catch (error) {
        context.log.error(error);

        if (error.code === 404) {
            // Handle not found separately
            context.res = {
                status: 404,
                body: `Post with ID ${postId} not found.`,
            };
        } else {
            context.res = {
                status: 500,
                body: "Internal server error.",
            };
        }
    }
};
