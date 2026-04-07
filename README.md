# Image-resizer

# 🚀 Azure Serverless Image Resizer

This project demonstrates a **serverless image processing pipeline** using **Azure Functions + Blob Storage**.

When a user uploads an image, it is automatically resized and stored in a thumbnail container.

---

## 🧠 Architecture

```
User Upload → Blob Storage (uploads)
                    ↓
            Azure Function (Blob Trigger)
                    ↓
          Blob Storage (thumbnail)
```

---

## 📦 Prerequisites

Install the following:

* Node.js (v18+)
* Azure CLI
* Azure Functions Core Tools

```bash
npm install -g azure-functions-core-tools@4
```

---

## ☁️ Azure Setup

### 1. Login to Azure

```bash
az login
```

---

### 2. Create Resource Group

```bash
az group create --name image-resizer-rg --location centralindia
```

---

### 3. Create Storage Account

```bash
az storage account create \
  --name <your-storage-name> \
  --location centralindia \
  --resource-group image-resizer-rg \
  --sku Standard_LRS
```

---

### 4. Create Blob Containers

```bash
az storage container create --name uploads --account-name <your-storage-name>
az storage container create --name thumbnail --account-name <your-storage-name>
```

---

### 5. Create Function App

```bash
az functionapp create \
  --resource-group image-resizer-rg \
  --consumption-plan-location centralindia \
  --runtime node \
  --functions-version 4 \
  --name <your-function-app-name> \
  --storage-account <your-storage-name>
```

---

## 💻 Local Setup

### 1. Initialize Project

```bash
func init image-resizer --javascript
cd image-resizer
```

---

### 2. Create Function

```bash
func new
```

Select:

* Template: Blob trigger
* Name: resizeFunction
* Path: uploads/{name}

---

### 3. Install Dependencies

```bash
npm install sharp
```

---

## 📁 Project Structure

```
image-resizer/
 ├── host.json
 ├── package.json
 ├── local.settings.json
 └── resizeFunction/
      ├── function.json
      └── index.js
```

---

## 🧾 Code

### index.js

```js
const sharp = require("sharp");

module.exports = async function (context, inputBlob) {
    const blobName = context.bindingData.name;

    context.log("Processing:", blobName);

    const resized = await sharp(inputBlob)
        .resize(200, 200)
        .toBuffer();

    context.bindings.outputBlob = resized;
};
```

---

### function.json

```json
{
  "bindings": [
    {
      "name": "inputBlob",
      "type": "blobTrigger",
      "direction": "in",
      "path": "uploads/{name}",
      "connection": "AzureWebJobsStorage"
    },
    {
      "name": "outputBlob",
      "type": "blob",
      "direction": "out",
      "path": "thumbnail/{name}",
      "connection": "AzureWebJobsStorage"
    }
  ]
}
```

---

## ⚙️ Configuration

Update `local.settings.json`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "<your-connection-string>",
    "FUNCTIONS_WORKER_RUNTIME": "node"
  }
}
```

---

## ▶️ Run Locally

```bash
func start
```

---

## 🧪 Test

1. Upload image to:

```
uploads/test.png
```

2. Check output:

```
thumbnail/test.png
```

---

## 🚀 Deploy to Azure

```bash
func azure functionapp publish <your-function-app-name>
```

---

## 🔄 CI/CD with GitHub Actions

Create file:

```
.github/workflows/deploy.yml
```

```yaml
name: Deploy Azure Function

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '18'

      - run: npm install

      - uses: Azure/functions-action@v1
        with:
          app-name: <your-function-app-name>
          publish-profile: ${{ secrets.AZURE_FUNCTIONAPP_PUBLISH_PROFILE }}
```

---

## 📊 Monitoring

Enable Application Insights:

* Azure Portal → Function App → Application Insights

Query logs:

```kusto
traces
| order by timestamp desc
```

---

## 🚨 Alerts

* Go to Monitoring → Alerts
* Condition: Exceptions > 0
* Add Email/SMS notification

---

## 🎯 Key Features

* Serverless architecture
* Event-driven processing
* Automatic image resizing
* CI/CD deployment
* Monitoring & alerting

---

## 🏁 Conclusion

This project demonstrates a real-world **cloud-native DevOps use case** using Azure services.

---
