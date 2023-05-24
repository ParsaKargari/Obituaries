# Obituaries

This project is a web application developed using React.js for the frontend and AWS services for the backend infrastructure. The infrastructure is provisioned using Terraform, an open-source infrastructure as code (IaC) tool. The goal of the project is to provide a scalable and responsive web application using modern technologies and cloud services.

## Project Structure

The project consists of two main components: the React frontend and the AWS backend.

### React Frontend

The React frontend is built using components and libraries from the React ecosystem, including the usage of UUID and Link from React DOM. It provides a user-friendly interface for interacting with the application. The frontend code is organized in a modular way to promote reusability and maintainability.

- **UUID**: Used for generating unique identifiers within the application, ensuring uniqueness and avoiding collisions.
- **Link from React DOM**: Used for creating navigational links within the application, enabling seamless routing and navigation between different views.

These components and libraries enhance the functionality and user experience of the React frontend. The modular organization of the codebase allows for easier maintenance and extensibility.

Make sure to review the documentation and usage instructions of UUID and Link from React DOM to understand how they are utilized within your project.

### AWS Backend

The AWS backend is built using various services provided by Amazon Web Services (AWS), as well as other third-party services. The backend infrastructure is defined and managed using Terraform. Here are the AWS and third-party services used in the project:

- **Amazon S3**: Used for storing static assets and files.
- **AWS Lambda**: Used for running serverless functions to handle backend logic.
- **Amazon API Gateway**: Used as a RESTful API endpoint to interact with Lambda functions.
- **AWS DynamoDB**: Used as a NoSQL database to store application data.
- **Cloudinary**: Used for image and media management, including uploading, storing, and manipulating images.
- **ChatGPT**: Used for integrating a chatbot functionality into the application, providing conversational AI capabilities.
- **AWS Polly**: Used for text-to-speech functionality, converting text content into natural-sounding audio.
- **Parameter Store**: Used for securely storing and managing configuration parameters, such as API keys, credentials, and other sensitive information.

These services work together to provide a robust backend infrastructure for the application. The Terraform configuration files define the necessary resources and their interconnections to ensure a seamless integration of these services.

Please make sure to review the specific documentation and configuration files related to these services to understand how they are utilized within your project.

## Getting Started

To run this project locally, follow the steps below:

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd <project-directory>`
3. Install dependencies: `npm install`
4. Start the development server: `npm start`

Ensure that you have the necessary environment variables configured, such as AWS access keys, API endpoints, and other required settings. Refer to the project documentation or configuration files for more details.

## Deployment

To deploy the application to AWS, Terraform is used to provision the required infrastructure. Make sure you have Terraform installed on your machine and configured with appropriate AWS credentials.

1. Navigate to the Terraform directory: `cd terraform`
2. Initialize the Terraform workspace: `terraform init`
3. Review the changes that will be applied: `terraform plan`
4. Apply the changes and provision the infrastructure: `terraform apply`

Terraform will create the necessary AWS resources based on the defined infrastructure as code. Ensure that you review the configuration files and customize them as per your requirements before deploying.

## Authors

- [@ParsaKargari](https://github.com/ParsaKargari), Parsa Kargari
- [@Lujaina-E](https://github.com/Lujaina-E), Lujaina Eldelebshany

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code as per the terms of the license.

## Acknowledgements

We would like to thank the open-source community for providing the tools and libraries that made this project possible.
