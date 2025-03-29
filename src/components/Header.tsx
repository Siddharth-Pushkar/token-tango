
import { FC } from 'react';
import WalletConnect from './WalletConnect';

const Header: FC = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            <h1 className="text-xl font-bold">Solana Token Tango</h1>
          </div>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">Devnet</span>
        </div>
        <WalletConnect />
      </div>
    </header>
  );
};

export default Header;
