class MockClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
  }
  async signUp() {}
  async signIn(key) {}
  async logOut() {}
  async createOrder() {}
  async getOrders() {}
  async getMessages() {}
  async uploadDraft(title, price, data) {}
  onEvent(handler) {}
}

class Message {
  constructor(data) {
    this.from = data.from || '';
    this.to = data.to || '';
    this.ts = data.ts || new Date();
    this.message = data.message || '';
  }
}

class Draft {
}

class Order {
  constructor(data) {
    this.title = data.title || '';
    this.abstract = data.abstract || '';
    this.details = data.details || '';
    this.messages = (data.messages || []).map(el => new Message(el));
  }
}

class DataModel {
  constructor(client) {
    this.client = client;
    this.publicKey = null;
    this.privateKey = null;
  }
  setKeys(publicKey, privateKey) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }
}
