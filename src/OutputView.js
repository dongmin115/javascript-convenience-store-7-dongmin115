import { Console } from '@woowacourse/mission-utils';
import ProductManager from "./ProductManager.js";

const OutputView = {
    printWelcomeMessage() {
        Console.print("안녕하세요. W편의점입니다.");
    },
    printProducts(products) {
        Console.print("현재 보유하고 있는 상품입니다.\n");

        const productNames = [...new Set(products.map(product => product.name))];

        productNames.forEach(name => {
            const groupedProducts = ProductManager.getProductsByName(name);

            groupedProducts.forEach(product => {
                const stockStatus = product.quantity === 0 ? '재고 없음' : `${product.quantity}개`;
                const promoStatus = product.promotion ? product.promotion : '';
                Console.print(`- ${product.name} ${product.price.toLocaleString()}원 ${stockStatus} ${promoStatus}`);
            });

            // 프로모션이 있는 상품만 있고, 같은 상품명이면서 프로모션이 없는 경우를 처리
            const hasNoPromotionProduct = groupedProducts.every(product => product.promotion);
            if (hasNoPromotionProduct) {
                Console.print(`- ${name} ${groupedProducts[0].price.toLocaleString()}원 재고 없음`);
            }
        });
    },
    printReceipt(items, total, discounts) {
        Console.print("==============W 편의점================");
        Console.print("상품명\t\t수량\t\t금액");
        items.forEach(item => {
            const itemPrice = item.price * item.quantity || 0;

            Console.print(`${item.name}\t\t${item.quantity}\t\t${itemPrice.toLocaleString()}`);
        });

        if (discounts.promoItems && discounts.promoItems.length > 0) {
            Console.print("=============증      정===============");
            discounts.promoItems.forEach(item => {
                Console.print(`${item.name}\t\t${item.quantity}`);
            });
        }

        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

        Console.print("====================================");
        Console.print(`총구매액\t${totalQuantity}\t\t${total ? total.toLocaleString() : "0"}`);
        Console.print(`행사할인 \t\t\t-${discounts.promoDiscount ? discounts.promoDiscount.toLocaleString() : "0"}`);
        Console.print(`멤버십할인 \t\t\t-${discounts.membershipDiscount ? discounts.membershipDiscount.toLocaleString() : "0"}`);
        Console.print(`내실돈 \t\t\t${discounts.finalPrice ? discounts.finalPrice.toLocaleString() : "0"}`);
    },
    printError(message) {
        Console.print(`[ERROR] ${message}`);
    }
};

export default OutputView;

