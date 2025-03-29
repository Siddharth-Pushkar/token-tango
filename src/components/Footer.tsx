
import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built on <a href="https://solana.com" target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4">Solana</a>.
          Running on <span className="font-medium">Devnet</span>.
        </p>
        <div className="flex items-center space-x-1">
          <a 
            href="https://explorer.solana.com/?cluster=devnet" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground"
          >
            Solana Explorer
          </a>
          <a 
            href="https://solana.com/developers" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground"
          >
            Developer Resources
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
