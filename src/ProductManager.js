import fs from "fs";

class ProductManager {
    constructor() {
        this.products = [];
    }

    loadProducts() {
        const data = fs.readFileSync('public/products.md', 'utf-8');
        const lines = data.split('\n').slice(1);

        lines.forEach(line => {
            const [name, price, quantity, promotion] = line.split(',');
            this.products.push({
                name,
                price: parseInt(price, 10),
                quantity: parseInt(quantity, 10),
                promotion: promotion !== 'null' ? promotion : null,
            });
        });
    }

    getProduct(name) {
        return this.products.find(product => product.name === name);
    }

    updateStock(promoProduct, regularProduct, promoQuantity, regularQuantity) {
        let success = true;

        if (promoProduct) {
            if (promoProduct.quantity >= promoQuantity) {
                promoProduct.quantity -= promoQuantity;
            } else {
                success = false;
            }
        }

        if (regularProduct) {
            if (regularProduct.quantity >= regularQuantity) {
                regularProduct.quantity -= regularQuantity;
            } else {
                success = false;
            }
        }

        return success;
    }
}

export default new ProductManager();
