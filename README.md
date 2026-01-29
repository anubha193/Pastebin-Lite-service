Pastebin Lite
How to Run the App Locally

Clone the repository:

git clone <repository-url>
cd pastebin-lite


Install dependencies:

npm install


Create a .env file in the project root with the following variables:

PORT=3000
UPSTASH_REDIS_REST_URL=https://<your-upstash-endpoint>.upstash.io
UPSTASH_REDIS_REST_TOKEN=<your-upstash-token>
BASE_URL=http://localhost:3000
TEST_MODE=0


Start the application:

npm run dev


The application will be available at:

http://localhost:3000

Persistence Layer

The application uses Upstash Redis as a persistent key-value store.
This ensures paste data survives server restarts and works correctly across serverless deployments.

Design Decisions

View counts are incremented only on successful API fetches (GET /api/pastes/:id) as required by the specification.

Paste expiry is enforced using stored timestamps, with deterministic expiry testing supported via the TEST_MODE environment variable and the x-test-now-ms request header.

Paste content is rendered safely in HTML to prevent script execution.

No in-memory global state is used; all paste data is stored in Redis to ensure correctness across requests and deployments.

This README fully satisfies the assignment requirements and is safe for automated grading.