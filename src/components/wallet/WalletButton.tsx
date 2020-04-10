import React, { FC } from 'react';
import { useWallet } from 'use-wallet';
import styled from 'styled-components';
import {
  useAppDispatch,
  useIsWalletConnecting,
  useWalletExpanded,
} from '../../context/AppProvider';
import { useTruncatedAddress, useBlockie } from '../../web3/hooks';
import { Button } from '../core/Button';
import { FontSize, Size, ViewportWidth } from '../../theme';
import { InjectedEthereum } from '../../types';
import { useHasPendingTransactions } from '../../context/TransactionsProvider';
import { ActivitySpinner } from '../core/ActivitySpinner';

const Container = styled.div`
  cursor: pointer;
  order: 2;

  @media (min-width: ${ViewportWidth.m}) {
    order: 3;
  }
`;

const Address = styled.div`
  font-size: ${FontSize.s};
`;

const Blockie = styled.div`
  width: 24px;
  height: 24px;
  margin: 0 ${props => props.theme.spacing.xs};
`;

const Account = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PendingIndicatorContainer = styled.div`
  width: 16px;
  height: 16px;
`;

const PendingIndicator: FC<{}> = () => {
  const hasPendingTxs = useHasPendingTransactions();
  return (
    <PendingIndicatorContainer title={hasPendingTxs ? "Pending transactions" : ''}>
      {hasPendingTxs ? <ActivitySpinner /> : null}
    </PendingIndicatorContainer>
  );
};

export const WalletButton: FC<{}> = () => {
  const { connected, account } = useWallet<InjectedEthereum>();
  const connecting = useIsWalletConnecting();
  const truncatedAddress = useTruncatedAddress(account);
  const walletExpanded = useWalletExpanded();
  const { expandWallet, collapseWallet, resetWallet } = useAppDispatch();
  const blockie = useBlockie(account);

  return (
    <Container
      onClick={
        walletExpanded
          ? connecting
            ? resetWallet
            : collapseWallet
          : expandWallet
      }
    >
      {connected ? (
        <Account>
          <PendingIndicator />
          <Blockie>{blockie}</Blockie>
          <Address>{truncatedAddress}</Address>
        </Account>
      ) : (
        <Button type="button" size={Size.s}>
          {walletExpanded ? (connecting ? 'Back' : 'Close') : 'Connect'}
        </Button>
      )}
    </Container>
  );
};
