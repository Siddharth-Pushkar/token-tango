
import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { connection, requestAirdrop } from '@/utils/solana';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const WalletConnect: FC = () => {
  const { publicKey } = useWallet();
  const [isAirdropping, setIsAirdropping] = useState(false);

  const handleAirdrop = async () => {
    if (!publicKey) return;

    setIsAirdropping(true);
    try {
      await requestAirdrop(connection, publicKey, 1);
      toast.success('Airdrop successful! 1 SOL received');
    } catch (error) {
      console.error('Airdrop failed:', error);
      toast.error('Airdrop failed. Please try again.');
    } finally {
      setIsAirdropping(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
      <WalletMultiButton />
      
      {publicKey && (
        <Button 
          variant="outline" 
          onClick={handleAirdrop} 
          disabled={isAirdropping}
          className="ml-0 sm:ml-2"
        >
          {isAirdropping ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Airdropping...
            </>
          ) : (
            'Get Devnet SOL'
          )}
        </Button>
      )}
    </div>
  );
};

export default WalletConnect;
