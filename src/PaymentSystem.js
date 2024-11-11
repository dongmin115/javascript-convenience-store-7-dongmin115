import ProductManager from './ProductManager.js';
import PromotionManager from './PromotionManager.js';
import OutputView from './OutputView.js';
import InputView from './InputView.js';

class PaymentSystem {
    async processPurchase(items, isMembership) {
        let total = 0;
        let promoDiscount = 0;
        const promoItems = [];
        const enrichedItems = [];

        for (let { name, quantity } of items) {
            // 상품 찾기
            const product = ProductManager.getProduct(name);
            if (!product) {
                OutputView.printError("존재하지 않는 상품입니다. 다시 입력해 주세요.");
                continue;
            }

            // 재고 확인
            if (product.quantity < quantity) {
                OutputView.printError("재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.");
                continue;
            }

            // 초기 변수 설정
            let promoQuantity = 0;
            let promoApplied = false;

            // 프로모션 확인 및 추가 구매 여부 확인
            if (product.promotion) {
                // 현재 날짜가 프로모션 기간 내에 있는지 확인
                const isPromotionActive = PromotionManager.isPromotionActive(product.promotion);
                if (isPromotionActive) {
                    const { promoQuantity: promoQty } = PromotionManager.checkPromotionForExactQuantity(product.promotion, quantity);
                    if (promoQty > 0) {
                        const addPromoItem = await InputView.confirmAdditionalItem(name, promoQty);
                        if (addPromoItem === 'Y') {
                            promoQuantity = promoQty;
                            quantity += promoQty;
                        }
                        promoApplied = true;
                    }
                }
            }

            // 상품 금액 계산 (프로모션 적용 후 금액만 반영)
            const itemTotal = product.price * (quantity - promoQuantity);
            total += itemTotal;
            promoDiscount += product.price * promoQuantity;

            // 프로모션 상품 기록
            if (promoApplied) {
                promoItems.push({ name, quantity: promoQuantity });
            }

            enrichedItems.push({ name: product.name, quantity, price: product.price });

            // 실제 구매 수량만큼 재고 업데이트
            ProductManager.updateStock(name, quantity - promoQuantity);
        }

        // 멤버십 할인 적용
        const membershipDiscount = isMembership ? Math.min(total * 0.3, 8000) : 0;

        // 최종 결제 금액 계산 및 음수 방지
        const finalPrice = Math.max(total - promoDiscount - membershipDiscount, 0);

        // 영수증 출력
        OutputView.printReceipt(enrichedItems, total, { promoDiscount, membershipDiscount, finalPrice, promoItems });
    }
}

export default PaymentSystem;
