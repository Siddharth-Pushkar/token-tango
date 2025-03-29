
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WalletBalance from '@/components/WalletBalance';
import TokenCreator from '@/components/TokenCreator';
import TokenMinter from '@/components/TokenMinter';
import TokenSender from '@/components/TokenSender';
import TokenDetails from '@/components/TokenDetails';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const { publicKey } = useWallet();
  const [selectedTokenAddress, setSelectedTokenAddress] = useState('');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-6">
          <div className="md:col-span-2">
            <div className="bg-gradient-to-r from-primary via-purple-500 to-secondary p-5 rounded-lg shadow-lg text-white mb-6">
              <h1 className="text-3xl font-bold mb-2">Solana Token Tango</h1>
              <p className="opacity-90">Create, mint and send SPL tokens on Solana Devnet</p>
            </div>
          </div>
          <div>
            <WalletBalance />
          </div>
        </div>
        
        {!publicKey ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Welcome to Solana Token Tango</CardTitle>
              <CardDescription>Connect your wallet to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This application allows you to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Create new SPL tokens on Solana Devnet</li>
                <li>Mint tokens to your wallet</li>
                <li>Send tokens to other wallets</li>
                <li>Check your token balances</li>
              </ul>
            </CardContent>
          </Card>
        ) : (
          <>
            <Tabs defaultValue="create" className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="create">Create Token</TabsTrigger>
                <TabsTrigger value="mint">Mint Token</TabsTrigger>
                <TabsTrigger value="send">Send Token</TabsTrigger>
              </TabsList>
              <TabsContent value="create" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TokenCreator />
                  <TokenDetails tokenAddressString={selectedTokenAddress} />
                </div>
              </TabsContent>
              <TabsContent value="mint" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TokenMinter />
                  <TokenDetails tokenAddressString={selectedTokenAddress} />
                </div>
              </TabsContent>
              <TabsContent value="send" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TokenSender />
                  <TokenDetails tokenAddressString={selectedTokenAddress} />
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
        
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-medium mb-2">📝 Note</h2>
          <p className="text-muted-foreground text-sm">
            This application runs on Solana Devnet. Tokens created are for testing purposes only and have no monetary value.
            Use the "Get Devnet SOL" button to request SOL from the Devnet faucet if needed.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
