#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Start the MCP server using tsx (TypeScript execution)
npx tsx src/index.ts
