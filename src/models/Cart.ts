import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ICart extends Document {
  items: ICartItem[];
  total: number;
  itemCount: number;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  id: {
    type: String,
    required: [true, 'Item ID is required']
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Item price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Item quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    max: [100, 'Quantity cannot exceed 100']
  },
  image: {
    type: String,
    required: false
  }
}, { _id: false });

const cartSchema = new Schema<ICart>({
  items: [cartItemSchema],
  total: {
    type: Number,
    default: 0,
    min: [0, 'Total cannot be negative']
  },
  itemCount: {
    type: Number,
    default: 0,
    min: [0, 'Item count cannot be negative']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save middleware to calculate totals
cartSchema.pre('save', function(next) {
  this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
  next();
});

export default mongoose.model<ICart>('Cart', cartSchema);
