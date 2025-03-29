
import { FC, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { getTokenBalance, getTokenMetadata } from '@/utils/solana';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';

interface TokenDetailsProps {
  tokenAddressString?: string;
}

const TokenDetails: FC<TokenDetailsProps> = ({ tokenAddressString }) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  
  const [isLoading, setIsLoading] = useState(false);
  const [manualTokenAddress, setManualTokenAddress] = useState('');
  const [activeTokenAddress, setActiveTokenAddress] = useState('');
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [tokenMetadata, setTokenMetadata] = useState<any>(null);
  
  // Update active token address when props change
  useEffect(() => {
    if (tokenAddressString) {
      setManualTokenAddress(tokenAddressString);
      setActiveTokenAddress(tokenAddressString);
      fetchTokenData(tokenAddressString);
    }
  }, [tokenAddressString]);
  
  const fetchTokenData = async (addressString: string) => {
    if (!publicKey || !addressString) return;
    
    let tokenPublicKey: PublicKey;
    try {
      tokenPublicKey = new PublicKey(addressString);
    } catch (error) {
      toast.error('Invalid token address');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get token balance
      const balance = await getTokenBalance(connection, publicKey, tokenPublicKey);
      setTokenBalance(balance);
      
      // Get token metadata
      const metadata = await getTokenMetadata(connection, tokenPublicKey);
      setTokenMetadata(metadata);
    } catch (error) {
      console.error('Error fetching token data:', error);
      toast.error('Failed to fetch token data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLookup = () => {
    if (!manualTokenAddress) {
      toast.error('Please enter a token address');
      return;
    }
    
    setActiveTokenAddress(manualTokenAddress);
    fetchTokenData(manualTokenAddress);
  };
  
  // If wallet is not connected
  if (!publicKey) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Token Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Connect wallet to view token details</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle>Token Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="lookup-token">Token Address</Label>
            <div className="flex space-x-2">
              <Input
                id="lookup-token"
                placeholder="Enter token address"
                value={manualTokenAddress}
                onChange={(e) => setManualTokenAddress(e.target.value)}
                disabled={isLoading}
              />
              <Button 
                variant="outline" 
                onClick={handleLookup}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
          
          {activeTokenAddress && (
            <>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-5 w-3/5" />
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Balance:</span>
                    <span className="font-medium">
                      {tokenBalance !== null ? tokenBalance.toString() : 'N/A'}
                    </span>
                  </div>
                  
                  {tokenMetadata && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Decimals:</span>
                        <span className="font-medium">{tokenMetadata.decimals}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Supply:</span>
                        <span className="font-medium">{tokenMetadata.supply.toString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mint Authority:</span>
                        <span className="font-mono text-xs truncate max-w-[180px]">
                          {tokenMetadata.mintAuthority || 'N/A'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenDetails;
