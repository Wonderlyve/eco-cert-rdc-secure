
// Simulation d'une blockchain pour la certification de documents
export interface BlockchainDocument {
  id: string;
  hash: string;
  previousHash: string;
  timestamp: number;
  data: {
    documentId: string;
    documentType: string;
    title: string;
    recipient: string;
    institution: string;
    issueDate: string;
    metadata: Record<string, any>;
  };
  nonce: number;
}

export interface Block {
  index: number;
  timestamp: number;
  data: BlockchainDocument;
  previousHash: string;
  hash: string;
  nonce: number;
}

class BlockchainSimulation {
  private chain: Block[] = [];
  private difficulty = 2; // Nombre de zéros requis au début du hash

  constructor() {
    this.createGenesisBlock();
  }

  private createGenesisBlock(): void {
    const genesisBlock: Block = {
      index: 0,
      timestamp: Date.now(),
      data: {
        id: 'genesis',
        hash: '0',
        previousHash: '0',
        timestamp: Date.now(),
        data: {
          documentId: 'genesis',
          documentType: 'genesis',
          title: 'Genesis Block',
          recipient: 'System',
          institution: 'eCert RDC',
          issueDate: new Date().toISOString(),
          metadata: {}
        },
        nonce: 0
      },
      previousHash: '0',
      hash: '0',
      nonce: 0
    };
    
    genesisBlock.hash = this.calculateHash(genesisBlock);
    this.chain.push(genesisBlock);
  }

  private calculateHash(block: Block): string {
    const data = JSON.stringify({
      index: block.index,
      timestamp: block.timestamp,
      data: block.data,
      previousHash: block.previousHash,
      nonce: block.nonce
    });
    
    // Simulation simple d'un hash SHA-256
    return this.simpleHash(data);
  }

  private simpleHash(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  private mineBlock(block: Block): void {
    const target = Array(this.difficulty + 1).join('0');
    
    while (block.hash.substring(0, this.difficulty) !== target) {
      block.nonce++;
      block.hash = this.calculateHash(block);
    }
    
    console.log(`Bloc miné: ${block.hash}`);
  }

  public addDocument(document: Omit<BlockchainDocument, 'hash' | 'previousHash'>): Block {
    const previousBlock = this.getLatestBlock();
    const newBlock: Block = {
      index: this.chain.length,
      timestamp: Date.now(),
      data: {
        ...document,
        hash: '',
        previousHash: previousBlock.hash
      },
      previousHash: previousBlock.hash,
      hash: '',
      nonce: 0
    };

    this.mineBlock(newBlock);
    this.chain.push(newBlock);
    
    return newBlock;
  }

  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  public getChain(): Block[] {
    return this.chain;
  }

  public validateChain(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== this.calculateHash(currentBlock)) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  public getDocumentProof(documentId: string): Block | null {
    return this.chain.find(block => block.data.data.documentId === documentId) || null;
  }
}

export const blockchain = new BlockchainSimulation();
