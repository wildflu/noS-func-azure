
// module.exports = async function (context, documents) {
//     if (!!documents && documents.length > 0) {
//         context.log('Document Id: ', documents[0].id);
//     }
// }
module.exports = async function (context, documents) {
    if (!!documents && documents.length > 0) {
        const { id } = documents[0];
        
        // Check if the "likes" field is already present
        if (!documents[0].likes) {
            // Add the "likes" field to the document
            documents[0].likes = 12;

            // Update the document in Cosmos DB
            context.bindings.documents = documents;

            context.log('Document Id: ', id);
            context.log('Likes field added with value 12.');
        } else {
            context.log('Likes field already present in the document.');
        }
    }
}
