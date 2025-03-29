
import { FC, useState } from 'react';
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { createSplToken } from '@/utils/solana';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const TokenCreator: FC = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  
  const [decimals, setDecimals] = useState('9');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');

  const handleCreateToken = async () => {
    if (!publicKey || !signTransaction) {
      toast.error('Please connect your wallet');
      return;
    }

    const decimalValue = parseInt(decimals);

    // Validate decimals
    if (isNaN(decimalValue) || decimalValue < 0 || decimalValue > 9) {
      toast.error('Decimals must be a number between 0 and 9');
      return;
    }

    setIsLoading(true);
    
    try {
      const mintAddress = await createSplToken(
        connection, 
        { publicKey, signTransaction }, 
        publicKey, 
        decimalValue, 
        publicKey
      );
      
      setTokenAddress(mintAddress);
      toast.success('Token created successfully!');
    } catch (error) {
      console.error('Error creating token:', error);
      toast.error('Failed to create token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Create Token</CardTitle>
        <CardDescription>
          Create your own SPL token on Solana Devnet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="decimals">Token Decimals</Label>
            <Input
              id="decimals"
              placeholder="Enter decimals (0-9)"
              value={decimals}
              onChange={(e) => setDecimals(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          {tokenAddress && (
            <div className="flex flex-col space-y-1.5">
              <Label>Token Address</Label>
              <div className="flex items-center space-x-2">
                <Input
                  value={tokenAddress}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(tokenAddress);
                    toast.success('Address copied!');
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={handleCreateToken} 
          disabled={isLoading || !publicKey}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Token'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TokenCreator;
