import { Console } from '@woowacourse/mission-utils';

const OutputView = {
    printWelcomeMessage() {
        Console.print("안녕하세요. W편의점입니다.");
    },
    printProducts(products) {
        Console.print("현재 보유하고 있는 상품입니다.\n");
        products.forEach(product => {
            const stockStatus = product.quantity === 0 ? '재고 없음' : `${product.quantity}개`;
            const promoStatus = product.promotion ? product.promotion : '';
            Console.print(`- ${product.name} ${product.price.toLocaleString()}원 ${stockStatus} ${promoStatus}`);
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
