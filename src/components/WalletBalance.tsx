
import { FC, useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const WalletBalance: FC = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchBalance = async () => {
      if (!publicKey) {
        setBalance(null);
        return;
      }

      try {
        setIsLoading(true);
        const balance = await connection.getBalance(publicKey);
        
        if (isMounted) {
          setBalance(balance / LAMPORTS_PER_SOL);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
        if (isMounted) {
          setBalance(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchBalance();

    // Set up an interval to refresh the balance
    const intervalId = setInterval(fetchBalance, 30000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [connection, publicKey]);

  // If wallet is not connected
  if (!publicKey) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Wallet Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Connect wallet to view balance</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle>Wallet Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Address:</span>
            <span className="font-mono text-sm truncate max-w-[180px] sm:max-w-[300px]">
              {publicKey.toString()}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">SOL:</span>
            {isLoading ? (
              <Skeleton className="h-5 w-16" />
            ) : (
              <span className="text-xl font-semibold">
                {balance !== null ? balance.toFixed(4) : 'Error'}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletBalance;
