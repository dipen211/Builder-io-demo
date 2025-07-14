import {
  Customer,
  Invoice,
  DashboardStats,
  PaginatedResult,
} from "./BillingApiService";

export class DemoDataService {
  // Demo customers
  private static demoCustomers: Customer[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "555-0101",
      address: "123 Main St, City, State 12345",
      totalInvoices: 2,
      totalAmount: 2150.0,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "555-0102",
      address: "456 Oak Ave, City, State 12345",
      totalInvoices: 1,
      totalAmount: 890.0,
    },
    {
      id: 3,
      name: "Acme Corp",
      email: "billing@acme.com",
      phone: "555-0103",
      address: "789 Business Blvd, City, State 12345",
      totalInvoices: 1,
      totalAmount: 2350.0,
    },
    {
      id: 4,
      name: "XYZ Company",
      email: "finance@xyz.com",
      phone: "555-0104",
      address: "321 Corporate Dr, City, State 12345",
      totalInvoices: 1,
      totalAmount: 500.0,
    },
    {
      id: 5,
      name: "Tech Solutions Inc",
      email: "billing@techsolutions.com",
      phone: "555-0105",
      address: "654 Innovation Drive, City, State 12345",
      totalInvoices: 3,
      totalAmount: 4750.0,
    },
  ];

  // Demo invoices
  private static demoInvoices: Invoice[] = [
    {
      id: 1,
      invoiceNumber: "INV-20241201-1001",
      date: "2024-12-01",
      dueDate: "2024-12-31",
      customer: this.demoCustomers[0],
      subTotal: 1136.36,
      taxAmount: 113.64,
      total: 1250.0,
      status: "Paid",
      items: [
        {
          id: 1,
          description: "Web Development Services",
          quantity: 40,
          unitPrice: 25.0,
          total: 1000.0,
        },
        {
          id: 2,
          description: "Domain Registration",
          quantity: 1,
          unitPrice: 136.36,
          total: 136.36,
        },
      ],
    },
    {
      id: 2,
      invoiceNumber: "INV-20241202-1002",
      date: "2024-12-02",
      dueDate: "2025-01-01",
      customer: this.demoCustomers[1],
      subTotal: 809.09,
      taxAmount: 80.91,
      total: 890.0,
      status: "Sent",
      items: [
        {
          id: 3,
          description: "Logo Design",
          quantity: 1,
          unitPrice: 500.0,
          total: 500.0,
        },
        {
          id: 4,
          description: "Business Cards",
          quantity: 1,
          unitPrice: 309.09,
          total: 309.09,
        },
      ],
    },
    {
      id: 3,
      invoiceNumber: "INV-20241203-1003",
      date: "2024-12-03",
      dueDate: "2025-01-02",
      customer: this.demoCustomers[2],
      subTotal: 2136.36,
      taxAmount: 213.64,
      total: 2350.0,
      status: "Draft",
      items: [
        {
          id: 5,
          description: "Software Development",
          quantity: 80,
          unitPrice: 25.0,
          total: 2000.0,
        },
        {
          id: 6,
          description: "Testing Services",
          quantity: 1,
          unitPrice: 136.36,
          total: 136.36,
        },
      ],
    },
    {
      id: 4,
      invoiceNumber: "INV-20241130-1000",
      date: "2024-11-30",
      dueDate: "2024-12-30",
      customer: this.demoCustomers[3],
      subTotal: 454.55,
      taxAmount: 45.45,
      total: 500.0,
      status: "Overdue",
      items: [
        {
          id: 7,
          description: "Consultation Services",
          quantity: 5,
          unitPrice: 90.91,
          total: 454.55,
        },
      ],
    },
    {
      id: 5,
      invoiceNumber: "INV-20241204-1004",
      date: "2024-12-04",
      dueDate: "2025-01-03",
      customer: this.demoCustomers[0],
      subTotal: 818.18,
      taxAmount: 81.82,
      total: 900.0,
      status: "Sent",
      items: [
        {
          id: 8,
          description: "Mobile App Development",
          quantity: 20,
          unitPrice: 40.91,
          total: 818.18,
        },
      ],
    },
    {
      id: 6,
      invoiceNumber: "INV-20241205-1005",
      date: "2024-12-05",
      dueDate: "2025-01-04",
      customer: this.demoCustomers[4],
      subTotal: 1590.91,
      taxAmount: 159.09,
      total: 1750.0,
      status: "Paid",
      items: [
        {
          id: 9,
          description: "Database Setup",
          quantity: 35,
          unitPrice: 45.45,
          total: 1590.91,
        },
      ],
    },
  ];

  static async getDashboardStats(): Promise<DashboardStats> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const totalRevenue = this.demoInvoices
      .filter((inv) => inv.status === "Paid")
      .reduce((sum, inv) => sum + inv.total, 0);

    const pendingInvoices = this.demoInvoices.filter(
      (inv) => inv.status === "Sent",
    ).length;
    const overdueInvoices = this.demoInvoices.filter(
      (inv) => inv.status === "Overdue",
    ).length;
    const pendingAmount = this.demoInvoices
      .filter((inv) => inv.status === "Sent")
      .reduce((sum, inv) => sum + inv.total, 0);
    const overdueAmount = this.demoInvoices
      .filter((inv) => inv.status === "Overdue")
      .reduce((sum, inv) => sum + inv.total, 0);

    return {
      totalRevenue,
      pendingInvoices,
      totalCustomers: this.demoCustomers.length,
      overdueInvoices,
      pendingAmount,
      overdueAmount,
    };
  }

  static async getRecentInvoices(count: number = 5): Promise<Invoice[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    return this.demoInvoices
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, count);
  }

  static async getDashboardData(): Promise<{
    stats: DashboardStats;
    recentInvoices: Invoice[];
  }> {
    const [stats, recentInvoices] = await Promise.all([
      this.getDashboardStats(),
      this.getRecentInvoices(5),
    ]);

    return { stats, recentInvoices };
  }

  static async getInvoices(filters?: {
    status?: string;
    customerId?: number;
    dateFrom?: string;
    dateTo?: string;
    pageNumber?: number;
    pageSize?: number;
  }): Promise<PaginatedResult<Invoice>> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    let filteredInvoices = [...this.demoInvoices];

    // Apply filters
    if (filters?.status) {
      filteredInvoices = filteredInvoices.filter(
        (inv) => inv.status.toLowerCase() === filters.status!.toLowerCase(),
      );
    }

    if (filters?.customerId) {
      filteredInvoices = filteredInvoices.filter(
        (inv) => inv.customer.id === filters.customerId,
      );
    }

    // Sort by date (newest first)
    filteredInvoices.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    // Apply pagination
    const pageNumber = filters?.pageNumber || 1;
    const pageSize = filters?.pageSize || 10;
    const totalCount = filteredInvoices.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (pageNumber - 1) * pageSize;
    const items = filteredInvoices.slice(startIndex, startIndex + pageSize);

    return {
      items,
      totalCount,
      pageNumber,
      pageSize,
      totalPages,
      hasNextPage: pageNumber < totalPages,
      hasPreviousPage: pageNumber > 1,
    };
  }

  static async getCustomers(
    search?: string,
    pageNumber?: number,
    pageSize?: number,
  ): Promise<PaginatedResult<Customer>> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filteredCustomers = [...this.demoCustomers];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCustomers = filteredCustomers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower),
      );
    }

    // Sort by name
    filteredCustomers.sort((a, b) => a.name.localeCompare(b.name));

    // Apply pagination
    const page = pageNumber || 1;
    const size = pageSize || 10;
    const totalCount = filteredCustomers.length;
    const totalPages = Math.ceil(totalCount / size);
    const startIndex = (page - 1) * size;
    const items = filteredCustomers.slice(startIndex, startIndex + size);

    return {
      items,
      totalCount,
      pageNumber: page,
      pageSize: size,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  static async createCustomer(customerData: any): Promise<Customer> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newCustomer: Customer = {
      id: Math.max(...this.demoCustomers.map((c) => c.id)) + 1,
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone || "",
      address: customerData.address || "",
      totalInvoices: 0,
      totalAmount: 0,
    };

    this.demoCustomers.push(newCustomer);
    return newCustomer;
  }

  static async createInvoice(invoiceData: any): Promise<Invoice> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const customer = this.demoCustomers.find(
      (c) => c.id === invoiceData.customerId,
    );
    if (!customer) {
      throw new Error("Customer not found");
    }

    const subTotal = invoiceData.items.reduce(
      (sum: number, item: any) => sum + item.quantity * item.unitPrice,
      0,
    );
    const taxAmount = subTotal * 0.1;
    const total = subTotal + taxAmount;

    const newInvoice: Invoice = {
      id: Math.max(...this.demoInvoices.map((i) => i.id)) + 1,
      invoiceNumber: `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toISOString().slice(0, 10),
      dueDate: invoiceData.dueDate,
      customer,
      subTotal,
      taxAmount,
      total,
      status: "Draft",
      items: invoiceData.items.map((item: any, index: number) => ({
        id:
          Math.max(
            ...this.demoInvoices.flatMap((i) => i.items.map((item) => item.id)),
          ) +
          index +
          1,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      })),
      notes: invoiceData.notes,
    };

    this.demoInvoices.push(newInvoice);

    // Update customer totals
    customer.totalInvoices += 1;
    customer.totalAmount += total;

    return newInvoice;
  }

  static async updateInvoiceStatus(
    id: number,
    status: string,
  ): Promise<Invoice> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const invoice = this.demoInvoices.find((i) => i.id === id);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    invoice.status = status;
    return invoice;
  }

  static async deleteCustomer(id: number): Promise<void> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    const index = this.demoCustomers.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error("Customer not found");
    }

    // Check if customer has invoices
    const hasInvoices = this.demoInvoices.some((i) => i.customer.id === id);
    if (hasInvoices) {
      throw new Error("Cannot delete customer with existing invoices");
    }

    this.demoCustomers.splice(index, 1);
  }
}

export default DemoDataService;
