const API_BASE_URL = "http://slim.localhost:8000/api";

// Types for API requests
export interface ActivateRequest {
  stoneCode: string;
  connectionName: string;
  partnerName: string;
  urlNotification: string;
}

export interface PayRequest {
  accountType: "credit" | "debit";
  installment: {
    type: number;
    number: number;
  };
  hasAlcoholicDrink: boolean;
  amount: number;
}

export interface CancelRequest {
  acquirerTransactionKey: string;
  amount: number;
  transactionType: string;
  panMask: string;
}

// PIX API Types
export interface PixPayRequest {
  amount: number;
  expiresIn: number;
}

export interface PixStatusRequest {
  transactionId: string;
}

export interface PixCancelRequest {
  transactionId: string;
  amount: number;
}

// PINPAD API Types
export interface PinpadSelectionRequest {
  Options: string[];
  Header: string;
}

export interface PinpadMessageRequest {
  message: string;
  secondMessage: string;
  formatMessage: string;
}

export interface CardHolderDataRequest {
  id: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Activate endpoint
  async activate(data: ActivateRequest): Promise<ApiResponse> {
    return this.makeRequest("/Activate", "POST", data);
  }

  // Pay endpoint
  async pay(data: PayRequest): Promise<ApiResponse> {
    return this.makeRequest("/Pay", "POST", data);
  }

  // Cancel endpoint
  async cancel(data: CancelRequest): Promise<ApiResponse> {
    return this.makeRequest("/Cancel/", "POST", data);
  }

  // PIX Pay endpoint
  async pixPay(data: PixPayRequest): Promise<ApiResponse> {
    return this.makeRequest("/Pix/Pay", "POST", data);
  }

  // PIX Status endpoint
  async pixStatus(data: PixStatusRequest): Promise<ApiResponse> {
    return this.makeRequest("/Pix/Status", "POST", data);
  }

  // PIX Cancel endpoint
  async pixCancel(data: PixCancelRequest): Promise<ApiResponse> {
    return this.makeRequest("/Pix/Cancel", "POST", data);
  }

  // Healthcheck endpoint
  async healthcheck(): Promise<ApiResponse> {
    return this.makeRequest("/Healthcheck", "GET");
  }

  // PINPAD Selection endpoint
  async pinpadSelection(data: PinpadSelectionRequest): Promise<ApiResponse> {
    return this.makeRequest("/Pinpad/Selection", "POST", data);
  }

  // PINPAD Message endpoint
  async pinpadMessage(data: PinpadMessageRequest): Promise<ApiResponse> {
    return this.makeRequest("/Pinpad/Message", "POST", data);
  }

  // Get Card Holder Data endpoint
  async getCardHolderData(data: CardHolderDataRequest): Promise<ApiResponse> {
    return this.makeRequest(`/Pinpad/GetCardHolderData/${data.id}`, "GET");
  }
}

export const apiService = new ApiService();
