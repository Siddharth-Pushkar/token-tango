
import { FC, useState } from 'react';
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { mintSplToken } from '@/utils/solana';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const TokenMinter: FC = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  
  const [tokenAddress, setTokenAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signature, setSignature] = useState('');

  const handleMintToken = async () => {
    if (!publicKey || !signTransaction) {
      toast.error('Please connect your wallet');
      return;
    }

    // Validate token address
    if (!tokenAddress) {
      toast.error('Please enter a token address');
      return;
    }

    let mintPublicKey: PublicKey;
    try {
      mintPublicKey = new PublicKey(tokenAddress);
    } catch (error) {
      toast.error('Invalid token address');
      return;
    }

    // Validate amount
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    
    try {
      const txSignature = await mintSplToken(
        connection, 
        { publicKey, signTransaction }, 
        mintPublicKey, 
        publicKey, 
        publicKey, 
        amountValue
      );
      
      setSignature(txSignature);
      toast.success('Tokens minted successfully!');
    } catch (error) {
      console.error('Error minting tokens:', error);
      toast.error('Failed to mint tokens. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Mint Tokens</CardTitle>
        <CardDescription>
          Mint tokens to your wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="token-address">Token Address</Label>
            <Input
              id="token-address"
              placeholder="Enter token address"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              placeholder="Enter amount to mint"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          {signature && (
            <div className="flex flex-col space-y-1.5">
              <Label>Transaction Signature</Label>
              <div className="flex items-center space-x-2">
                <Input
                  value={signature}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(signature);
                    toast.success('Signature copied!');
                  }}
                >
                  Copy
                </Button>
              </div>
              <a 
                href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline mt-1"
              >
                View on Solana Explorer
              </a>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleMintToken} 
          disabled={isLoading || !publicKey}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Minting...
            </>
          ) : (
            'Mint Tokens'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TokenMinter;
