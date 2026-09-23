export type OrderStatus =
  | "pending"
  | "processing"
  | "dispatched"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: string;
  orderId: string;
  productName: string;
  quantity: number;
  size: string;
  price: number;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  note?: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string | null;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  status: OrderStatus;
  trackingNumber?: string | null;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  history?: OrderStatusHistory[];
}

export interface OrderLookupRequest {
  orderNumber: string;
  phoneOrEmail: string;
}

export const STAGE_STEPS: Array<{
  statusKey: OrderStatus;
  label: string;
  subtitle: string;
  iconName: "clock" | "scissors" | "package" | "truck" | "check";
  stageNumber: number;
}> = [
  {
    statusKey: "pending",
    label: "Order Placed",
    subtitle: "Payment received & confirmed",
    iconName: "clock",
    stageNumber: 1,
  },
  {
    statusKey: "processing",
    label: "Processing & Tailoring",
    subtitle: "Pattern cut & handcrafted stitch",
    iconName: "scissors",
    stageNumber: 2,
  },
  {
    statusKey: "dispatched",
    label: "Dispatched",
    subtitle: "Handed to priority courier",
    iconName: "package",
    stageNumber: 3,
  },
  {
    statusKey: "out_for_delivery",
    label: "Out For Delivery",
    subtitle: "Courier en route to address",
    iconName: "truck",
    stageNumber: 4,
  },
  {
    statusKey: "delivered",
    label: "Delivered",
    subtitle: "Package successfully received",
    iconName: "check",
    stageNumber: 4,
  },
];
