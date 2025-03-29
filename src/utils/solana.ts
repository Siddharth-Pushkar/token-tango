
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from '@solana/web3.js';

import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
  getAccount,
  getMint,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createInitializeMintInstruction,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

// SPL token creation helper
export async function createSplToken(
  connection: Connection,
  payer: any,
  mintAuthority: PublicKey,
  decimals: number,
  freezeAuthority: PublicKey | null = null
) {
  try {
    const mint = await createMint(
      connection,
      payer,
      mintAuthority,
      freezeAuthority,
      decimals
    );
    
    console.log(`Token created: ${mint.toBase58()}`);
    return mint.toBase58();
  } catch (error) {
    console.error('Error creating token:', error);
    throw error;
  }
}

// SPL token minting helper
export async function mintSplToken(
  connection: Connection,
  payer: any,
  mint: PublicKey,
  destination: PublicKey,
  authority: PublicKey,
  amount: number
) {
  try {
    // Get or create the associated token account for the destination
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      destination
    );

    // Mint tokens to the destination
    const signature = await mintTo(
      connection,
      payer,
      mint,
      tokenAccount.address,
      authority,
      amount
    );
    
    console.log(`Minted ${amount} tokens: ${signature}`);
    return signature;
  } catch (error) {
    console.error('Error minting tokens:', error);
    throw error;
  }
}

// SPL token transfer helper
export async function transferSplToken(
  connection: Connection,
  payer: any,
  source: PublicKey,
  destination: PublicKey,
  owner: PublicKey,
  mint: PublicKey,
  amount: number
) {
  try {
    // Get or create the source token account
    const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      source
    );

    // Get or create the destination token account
    const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      destination
    );

    // Transfer tokens
    const signature = await transfer(
      connection,
      payer,
      sourceTokenAccount.address,
      destinationTokenAccount.address,
      owner,
      amount
    );
    
    console.log(`Transferred ${amount} tokens: ${signature}`);
    return signature;
  } catch (error) {
    console.error('Error transferring tokens:', error);
    throw error;
  }
}

// Get SOL balance
export async function getSolBalance(connection: Connection, publicKey: PublicKey) {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('Error getting SOL balance:', error);
    throw error;
  }
}

// Get token balance
export async function getTokenBalance(
  connection: Connection,
  publicKey: PublicKey,
  mint: PublicKey
) {
  try {
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      { publicKey } as any, // Placeholder, actual signing not needed for query
      mint,
      publicKey
    );
    
    const tokenAccountInfo = await getAccount(connection, tokenAccount.address);
    return Number(tokenAccountInfo.amount);
  } catch (error) {
    console.error('Error getting token balance:', error);
    return 0; // Return 0 if the token account doesn't exist
  }
}

// Get token metadata
export async function getTokenMetadata(
  connection: Connection,
  mint: PublicKey
) {
  try {
    const mintInfo = await getMint(connection, mint);
    return {
      supply: Number(mintInfo.supply),
      decimals: mintInfo.decimals,
      mintAuthority: mintInfo.mintAuthority?.toBase58(),
      freezeAuthority: mintInfo.freezeAuthority?.toBase58(),
    };
  } catch (error) {
    console.error('Error getting token metadata:', error);
    throw error;
  }
}

// Request SOL airdrop (devnet only)
export async function requestAirdrop(
  connection: Connection,
  publicKey: PublicKey,
  amount: number = 1
) {
  try {
    const signature = await connection.requestAirdrop(
      publicKey,
      amount * LAMPORTS_PER_SOL
    );
    await connection.confirmTransaction(signature);
    console.log(`Airdropped ${amount} SOL to ${publicKey.toBase58()}`);
    return signature;
  } catch (error) {
    console.error('Error requesting airdrop:', error);
    throw error;
  }
}

export const DEVNET_ENDPOINT = clusterApiUrl('devnet');
export const connection = new Connection(DEVNET_ENDPOINT);
