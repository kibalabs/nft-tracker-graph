import { ethereum } from '@graphprotocol/graph-ts'

import { Account, Transfer, Transaction, TokenRegistry } from '../generated/schema'

import { Transfer as TransferEvent } from '../generated/IERC721/IERC721'

import { fetchRegistry } from './fetchRegistry'
import { fetchToken } from './fetchToken'

function get_transaction(event: ethereum.Event): Transaction {
  let tx = new Transaction(event.transaction.hash.toHex());
  tx.timestamp = event.block.timestamp;
  tx.blockNumber = event.block.number;
  tx.value = event.transaction.value;
  tx.gasUsed = event.transaction.gasUsed;
  tx.gasPrice = event.transaction.gasPrice;
  tx.save();
  return tx;
}

export function handleTransfer(event: TransferEvent): void {
  let optionalRegistry = fetchRegistry(event.address);
  if (!optionalRegistry) {
    return;
  }

  let registry = optionalRegistry as TokenRegistry;
  let token = fetchToken(registry, event.params.tokenId)
  let from = new Account(event.params.from.toHex())
  let to = new Account(event.params.to.toHex())

  token.owner = to.id

  registry.save()
  token.save()
  from.save()
  to.save()

  let transaction = get_transaction(event);
  let eventId = event.block.number.toString().concat('-').concat(event.logIndex.toString());
  let ev = new Transfer(eventId)
  ev.transaction = transaction.id
  ev.timestamp = event.block.timestamp
  ev.token = token.id
  ev.from = from.id
  ev.to = to.id
  ev.save()
}
