#!/bin/bash

touch ./.env
echo -e ./env "# Database configuration\n
# Replace with your database URL. For example: postgres://user:password@localhost:5432/mydatabase\n
DATABASE_URL=\n
# DATABASE_URL=\"postgres://default:olX96NDYnLtu@ep-quiet-dream-46841484.us-east-1.postgres.vercel-storage.com:5432/verceldb\"\n
\n
# NextAuth configuration\n
# Replace with your NextAuth URL. This is the URL where your application is running. For example: http://localhost:3000\n
NEXTAUTH_URL=\"http://localhost:3000\"\n

# Generate a secret for NextAuth with `openssl rand -hex 64` and replace here\n
NEXTAUTH_SECRET=\n

# Google OAuth configuration\n
# Replace with your Google Client ID and Secret. These are obtained from the Google Developer Console.\n
GOOGLE_CLIENT_ID=\"391616151250-i942casg5chgefg0veh9f3pifbdkactb.apps.googleusercontent.com\"\n
GOOGLE_CLIENT_SECRET=\n

# Github OAuth configuration\n
# Replace with your Github Client ID and Secret. These are obtained from the Github Developer Console.\n
GITHUB_CLIENT_ID=\"db15af1e897d0fe912a7\"\n
GITHUB_CLIENT_SECRET=\n

# Twitter Auth configuration\n
# Replace with your Twitter Client ID and Secret. These are obtained from the Twitter Developer Console.\n
TWITTER_CLIENT_ID=\"UVRXcVJ2T0xySV9wSXZGdGdvMTM6MTpjaQ\"\n
TWITTER_CLIENT_SECRET=\n

# Discord Auth configuration\n
# Replace with your Discord Client ID and Secret. These are obtained from the Discord Developer Console.\n
DISCORD_CLIENT_ID=\"1192864284351406244\"\n
DISCORD_CLIENT_SECRET=\n

# Supabase configuration
# Replace with your Supabase URL. This is obtained from your Supabase project settings.\n
NEXT_PUBLIC_SUPABASE_URL=\"https://bzquotasibuzwyhlneqp.supabase.co\"\n

# Replace with your Supabase Anon Key. This is obtained from your Supabase project API settings.\n
NEXT_PUBLIC_SUPABASE_ANON_KEY=\n

# Node environment\n
# Set to \"development\" for development mode or \"production\" for production mode\n
NODE_ENV=\"development\"\n

# Vercel KV configuration\n
KV_URL=\"redis://default:d23ebed4bd2849639c2f86d182aac726@concise-flea-49536.kv.vercel-storage.com:49536\"\n
KV_REST_API_URL=\"https://concise-flea-49536.kv.vercel-storage.com\"\n
KV_REST_API_TOKEN=\n
KV_REST_API_READ_ONLY_TOKEN=\n

# @upstash/redis configuration\n
REDIS_URL=\"https://us1-witty-bulldog-41625.upstash.io\"\n
REDIS_TOKEN=\n

NEXT_PUBLIC_REST_RPC=\"https://lcd.cascadia.foundation\"\n
NEXT_PUBLIC_RPC=\"https://testnet.cascadia.foundation\"\n

# Alignment smart contract address\n
NEXT_PUBLIC_VOTINGESCROW_ADDRESS=\"0x59F19cC382e5836eE0dD87619292F707436407a0\"\n
NEXT_PUBLIC_FEEDISTRIBUTOR_ADDRESS=\"0xADE30db2Ca86Eba5B7bb61354df2B8E8B1875862\"\n
NEXT_PUBLIC_REDEEM_ADDRESS=\"0x6aC889d09D244AA5539f62A11d28b1037C4dc1Ff\"\n
NEXT_PUBLIC_CCC_ADDRESS=\"0x0B7f369c97982461523F331eCc9883b825ddCAd4\"\n
NEXT_PUBLIC_WETH_ADDRESS=\"0xC81d312D5E0Ab82Bc8af8270e02E2Ba169c81b99\"\n

# Faucet\n
NEXT_PUBLIC_FAUCET_BACKEND_URL=\"https://faucet.cascadia.foundation\"\n
"