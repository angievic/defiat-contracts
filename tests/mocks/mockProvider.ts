export class MockProvider {
  private state: { [key: string]: any } = {};

    async executeContract(
      contractName: string,
      functionName: string,
      args: any[],
      sender: string
  ): Promise<{ success: boolean; value: any }> {
    if (functionName === 'upload-contract') {
      const contractId = Object.keys(this.state).length + 1;
      this.state[`${sender}-${contractId}`] = {
        'contract-file': args[0],
        'contract-amount': args[1],
      };
      return { success: true, value: contractId };
    } else if (functionName === 'get-user-contract') {
      const contract = this.state[`${args[0]}-${args[1]}`];
      return { success: true, value: contract };
    } else if (functionName === 'get-user-contract-count') {
      const count = Object.keys(this.state).filter(key => key.startsWith(args[0])).length;
      return { success: true, value: count };
    }
    return { success: false, value: null };
  }
}