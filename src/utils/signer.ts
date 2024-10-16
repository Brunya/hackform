type SignerFunction = (message: string) => Promise<string>;

interface CustomSigner {
  custom: (signFunction: SignerFunction, address?: string) => (data: any) => Promise<any>;
}

export const createSigner: CustomSigner = {
  custom: (signFunction, address) => {
    return async (data: any) => {
      const message = JSON.stringify(data);
      const signature = await signFunction(message);
      return { ...data, signature, address };
    };
  },
};