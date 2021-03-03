import { ethereum, Bytes } from '@graphprotocol/graph-ts'

export function supportsInterface(contract: ethereum.SmartContract, interfaceId: string): boolean {
  let result = ethereum.call(new ethereum.SmartContractCall(
    contract._name,
    contract._address,
    'supportsInterface',
    'supportsInterface(bytes4):(bool)',
    [ethereum.Value.fromFixedBytes(Bytes.fromHexString(interfaceId) as Bytes)]
  ));
  return result != null && (result as Array<ethereum.Value>)[0].toBoolean();
}
