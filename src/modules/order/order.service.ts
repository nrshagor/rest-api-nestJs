import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../product/entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Create a new order
  async createOrder(userId: number, createOrderDto: CreateOrderDto) {
    const orderItems = createOrderDto.items;

    let total_amount = 0;

    // Check stock availability and calculate total amount
    const processedItems = [];
    for (const item of orderItems) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        throw new BadRequestException(
          `Product with ID ${item.productId} not found`,
        );
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Product ${product.name} is out of stock`,
        );
      }

      // Deduct stock from the product
      product.stock -= item.quantity;
      await this.productRepository.save(product);

      const totalPriceForItem = product.price * item.quantity;
      total_amount += totalPriceForItem;

      const orderItem = this.orderItemRepository.create({
        product: product,
        quantity: item.quantity,
        price: product.price,
      });

      processedItems.push(orderItem);
    }

    // Create order
    const order = this.orderRepository.create({
      user: { id: userId } as User, // Associate order with user
      total_amount: total_amount,
      items: processedItems,
    });

    // Save order and associated order items
    await this.orderRepository.save(order);

    return order;
  }

  // Fetch order history for the logged-in user
  async getOrderHistory(userId: number) {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });

    return orders.map((order) => ({
      id: order.id,
      total_amount: order.total_amount,
      created_at: order.created_at,
      items: order.items.map((item) => ({
        productName: item.product.name,
        price: item.price,
        quantity: item.quantity,
      })),
    }));
  }
}
