import { MockProvider } from './mocks/mockProvider';

describe('Income Certificate Contract', () => {
  let provider: MockProvider;

  beforeEach(() => {
    provider = new MockProvider();
  });

  test('Ensure that a contract can be uploaded', async () => {
    const user1 = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    const contractFile = 'test contract';
    const contractAmount = 1000000; // 1 STX

    const result = await provider.executeContract(
      'incomecertificate',
      'upload-contract',
      [contractFile, contractAmount],
      user1
    );

    expect(result.success).toBe(true);
    const contractId = result.value;

    const contractResult = await provider.executeContract(
      'incomecertificate',
      'get-user-contract',
      [user1, contractId],
      user1
    );

    expect(contractResult.success).toBe(true);
    expect(contractResult.value).toEqual({
      'contract-file': contractFile,
      'contract-amount': contractAmount,
    });
  });

  test('Ensure that we can retrieve the contract count for a user', async () => {
    const user1 = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

    await provider.executeContract(
      'incomecertificate',
      'upload-contract',
      ['contract 1', 1000000],
      user1
    );
    await provider.executeContract(
      'incomecertificate',
      'upload-contract',
      ['contract 2', 2000000],
      user1
    );

    const result = await provider.executeContract(
      'incomecertificate',
      'get-user-contract-count',
      [user1],
      user1
    );

    expect(result.success).toBe(true);
    expect(result.value).toBe(2);
  });

  test('Ensure that we can retrieve a specific contract for a user', async () => {
    const user1 = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    const contractFile = 'test contract';
    const contractAmount = 1000000; // 1 STX

    const uploadResult = await provider.executeContract(
      'incomecertificate',
      'upload-contract',
      [contractFile, contractAmount],
      user1
    );
    const contractId = uploadResult.value;

    const result = await provider.executeContract(
      'incomecertificate',
      'get-user-contract',
      [user1, contractId],
      user1
    );

    expect(result.success).toBe(true);
    expect(result.value).toEqual({
      'contract-file': contractFile,
      'contract-amount': contractAmount,
    });
  });

  test('Ensure that contract IDs are unique and incremental', async () => {
    const user1 = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';

    const result1 = await provider.executeContract(
      'incomecertificate',
      'upload-contract',
      ['contract 1', 1000000],
      user1
    );
    const result2 = await provider.executeContract(
      'incomecertificate',
      'upload-contract',
      ['contract 2', 2000000],
      user1
    );
    const result3 = await provider.executeContract(
      'incomecertificate',
      'upload-contract',
      ['contract 3', 3000000],
      user1
    );

    expect(result1.value).toBe(1);
    expect(result2.value).toBe(2);
    expect(result3.value).toBe(3);
  });
});