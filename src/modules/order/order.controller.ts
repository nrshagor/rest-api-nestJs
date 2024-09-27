import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Create a new order (Authenticated users only)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.userId;

    try {
      const order = await this.orderService.createOrder(userId, createOrderDto);
      return { message: 'Order placed successfully', order };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Get logged-in user's order history
  @UseGuards(JwtAuthGuard)
  @Get()
  async getOrderHistory(@Request() req) {
    const userId = req.user.userId;
    return this.orderService.getOrderHistory(userId);
  }
}
