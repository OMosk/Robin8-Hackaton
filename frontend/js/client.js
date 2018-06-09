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
  async makeOffer(contentId, price) {}
  async acceptOffer(contentId) {}
  async rejectOffer(contentId) {}
  onEvent(handler) {}
}

class Message {
  constructor(data) {
    this.from = data.from || '';
    this.to = data.to || '';
    this.timestamp = data.timestamp || new Date();
    this.message = data.message || '';
  }
}

class Draft {
  constructor(data) {
    this.contentId = data.contentId || '';
    this.timestamp = data.timestamp || new Date();
    this.price = data.price || 0;
    this.offerMade = data.offerMade || false;
    this.offerAccepted = data.offerAccepted || false;
    this.offerRejected = data.offerRejected || false;
  }
}

class Order {
  constructor(data) {
    this.customer = data.customer || '';
    this.freelancer = data.freelancer || null;
    this.title = data.title || '';
    this.abstract = data.abstract || '';
    this.details = data.details || '';
    this.messages = (data.messages || []).map(el => new Message(el));
    this.drafts = (data.drafts || []).map(el => new Message(el));
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
