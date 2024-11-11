import { Console } from '@woowacourse/mission-utils';

const InputView = {
    async readItem() {
        return await Console.readLineAsync("\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])");
    },
    async confirmAdditionalItem(name, promoQuantity) {
        return await Console.readLineAsync(`현재 ${name}은(는) ${promoQuantity}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`);
    },
    async confirmMembership() {
        return await Console.readLineAsync("멤버십 할인을 받으시겠습니까? (Y/N)");
    },
    async confirmAnotherPurchase() {
        return await Console.readLineAsync("감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)");
    },
    async confirmApplyFullPrice(price, quantity) {
        return await Console.readLineAsync(`현재 ${price} ${quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)`);
    },
};

export default InputView;
