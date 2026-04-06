// const { app } = require("@azure/functions");
// const sharp = require("sharp");

// app.storageBlob("resizeFunction", {
//     path: "uploads/{name}",
//     connection: "AzureWebJobsStorage",
//     handler: async (inputBlob, context) => {
//         const blobName = context.triggerMetadata.name;

//         context.log("Processing:", blobName);

//         const resized = await sharp(inputBlob)
//             .resize(200, 200)
//             .toBuffer();

//         return {
//             blob: resized,
//             path: `thumbnail/${blobName}`
//         };
//     }
// });

const sharp = require("sharp");

module.exports = async function (context, inputBlob) {
    const blobName = context.bindingData.name;

    context.log("Processing:", blobName);

    const resized = await sharp(inputBlob)
        .resize(200, 200)
        .toBuffer();

    // ❗ IMPORTANT FIX
    return {
        outputBlob: resized
    };
};