
const { CosmosClient } = require("@azure/cosmos");
const { v4: uuidv4 } = require("uuid");

const cosmosClient = new CosmosClient(process.env.CosmosDBConnectionString);
const databaseName = "faoz-db";
const containerName = "posts";

module.exports = async function (context, req) {
    context.log("JavaScript HTTP trigger function processed a request.");

    try {
        // Parse the request body
        const data = req.body;

        // Validate the required properties
        if (!data || !data.name || !data.description || !data.content) {
            context.res = {
                status: 400,
                body: "Please provide name, description, and content in the request body.",
            };
            return;
        }

        const database = cosmosClient.database(databaseName);
        const container = database.container(containerName);

        // Generate a unique ID using uuid
        const postId = uuidv4();

        // Create the post object
        const post = {
            id: postId,
            name: data.name,
            description: data.description,
            content: data.content,
        };

        // Add the post to Cosmos DB
        await container.items.create(post);

        context.res = {
            status: 201,
            body: "Post added successfully.",
        };
    } catch (error) {
        context.log.error(error);
        context.res = {
            status: 500,
            body: "Internal server error.",
        };
    }
};
