const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://localhost:7195/api";

class ApiService {
  async get(endpoint) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API GET Error:", error);
      throw error;
    }
  }

  async post(endpoint, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API POST Error:", error);
      throw error;
    }
  }

  // Invoice endpoints
  async getInvoices() {
    return this.get("/invoices");
  }

  async getInvoice(id) {
    return this.get(`/invoices/${id}`);
  }

  async createInvoice(invoiceData) {
    return this.post("/invoices", invoiceData);
  }

  // Customer endpoints
  async getCustomers() {
    return this.get("/customers");
  }

  async getCustomer(id) {
    return this.get(`/customers/${id}`);
  }

  async createCustomer(customerData) {
    return this.post("/customers", customerData);
  }
}

export default new ApiService();
