import { CartModel } from "../models/Cart.model.js";

class CartsManager {
    async createCart() {
        const newCart = { products: [] };
        const response = await CartModel.create(newCart)
        return response

    }
    async findAll() {
        const response = await CartModel.find().lean();
        return response
    }
    async findCartById(idCart) {
        const cart = await CartModel
            .findById(idCart)
            .populate('products.product');

        if (!cart) {
            return null;
        }
        const total = cart.products.reduce((acc, item) => {
            return acc + (item.product.price * item.quantity);
        }, 0);

        return { cart, total };
    }

    async addProductToCarts(idCart, idProduct) {
        const cart = await CartModel.findById(idCart)
        const productIndex = cart.products.findIndex(p => p.product.toString() === idProduct)
        if (productIndex === -1) {
            cart.products.push({ product: idProduct, quantity: 1 })
        } else {
            cart.products[productIndex].quantity++;
        }
        return cart.save();
    }
    async removeProductFromCart(idCart, idProduct) {
        const cart = await CartModel.findById(idCart);

        if (!cart) {
            return null;
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === idProduct);
        //const productIndex = cart.products.findIndex(p => p.product.equals(idProduct));

        if (productIndex === -1) {
            return null;
        } else {
            cart.products.splice(productIndex, 1);
            await cart.save();
            return cart;
        }
    }
    async updateCart(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                return null;
            }
            cart.products = updatedProducts;
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                return null;
            }
            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
            if (productIndex === -1) {
                return null;
            }
            cart.products[productIndex].quantity = quantity;
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw error;
        }
    }

    async deleteAllProducts(cartId) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                return null;
            }
            cart.products = [];
            const updatedCart = await cart.save();
            return updatedCart;
        } catch (error) {
            throw error;
        }
    }
}
export const cartsManager = new CartsManager();