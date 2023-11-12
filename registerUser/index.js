


const { CosmosClient } = require("@azure/cosmos");
const { v4: uuidv4 } = require("uuid");

const cosmosClient = new CosmosClient(process.env.CosmosDBConnectionString);
const databaseName = "faoz-db";
const containerName = "users";

module.exports = async function (context, req) {
    context.log("JavaScript HTTP trigger function processed a request.");

    try {
        // Parse the request body
        const data = req.body;

        // Validate the required properties
        if (!data || !data.email || !data.fullname || !data.adress) {
            context.res = {
                status: 400,
                body: "Please provide name, full Name, and adress in the request body.",
            };
            return;
        }

        const database = cosmosClient.database(databaseName);
        const container = database.container(containerName);

        // Generate a unique ID using uuid
        // const userId = uuidv4();

        // Create the userId object
        const user = {
            // userid: userId,
            email: data.email,
            fullname: data.fullname,
            adress: data.adress,
            gender:data.gender,
            sports:data.sports
        };

        // Add the userId to Cosmos DB
        // await container.items.create(user);
        await container.items.create(user);

        context.res = {
            status: 201,
            body: "User registered successfully.",
        };
    } catch (error) {
        context.log.error(error);
        context.res = {
            status: 500,
            body: "Internal server error.",
        };
    }
};
