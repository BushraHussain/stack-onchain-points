"use client"

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import Stack from '../stack/page';

const ConnectMetaMask = () => {
  const [account, setAccount] = useState<string | undefined | null | string[]>();
  const [errorMessage, setErrorMessage] = useState<string | null>('');

  useEffect(() => {
    const handleAccountsChanged = (accounts:any) => {
      if (accounts.length === 0) {
        setErrorMessage('Please connect to MetaMask.');
      } else {
        setAccount(accounts[0]);
      }
    };

    const init = async () => {
      const provider = (await detectEthereumProvider()) as any;
      if (provider) {
        provider.on('accountsChanged', handleAccountsChanged);
      }

      return () => {
        if (provider) {
          provider.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    };

    init();
  }, []);

  const connectWallet = async () => {
    const provider = (await detectEthereumProvider()) as any;
    if (provider) {
      try {
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setErrorMessage(null);
      } catch (err) {
        setErrorMessage('An error occurred while connecting to MetaMask.');
      }
    } else {
      setErrorMessage('MetaMask is not installed. Please install it to use this feature.');
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-center'>
        <div>
          <button className='w-64 h-12 bg-blue-600 rounded text-white' onClick={connectWallet}>Connect MetaMask Wallet</button>
        </div>
      </div>
      <div className='flex justify-center'>  
        {account ? (
          <div>
            <p>Connected Account: {account}</p>
          </div>
        ) : (
          <div>
            <p>{errorMessage}</p>
          </div>
        )}
       </div>

      <div>----------</div>
      <Stack props = {account} />
    </div>
  );
};

export default ConnectMetaMask;