# J.A.R.V.I.S

Personal AI-powered Media Board with drawing and diagram features

## How to run

You'll need ollama.com to run the AI feature

Once installed, just run `npm run dev`

## Architecture

We have an Ollama Client in Typescript. That's how the AI runs, we send a request to your Ollama, which in turns run a Cloud model
We have many tools so the AI can know what you have on-screen, as well as doing it's agent thing