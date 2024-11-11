import fs from "fs";
import { DateTimes } from "@woowacourse/mission-utils";

class PromotionManager {
    constructor() {
        this.promotions = [];
    }

    loadPromotions() {
        const data = fs.readFileSync('public/promotions.md', 'utf-8');
        const lines = data.split('\n').slice(1);

        lines.forEach(line => {
            const [name, buy, get, start_date, end_date] = line.split(',');
            this.promotions.push({
                name,
                buy: parseInt(buy, 10),
                get: parseInt(get, 10),
                startDate: new Date(start_date),
                endDate: new Date(end_date),
            });
        });
    }

    getPromotion(name) {
        return this.promotions.find(promo => promo.name === name) || null;
    }

    checkPromotionForExactQuantity(name, quantity) {
        const promotion = this.getPromotion(name);
        const today = DateTimes.now();

        // 프로모션 활성 상태 확인
        if (
            promotion &&
            today >= promotion.startDate &&
            today <= promotion.endDate &&
            quantity >= promotion.buy
        ) {
            return { promoQuantity: Math.floor(quantity / promotion.buy) * promotion.get };
        }
        return { promoQuantity: 0 }; // 프로모션이 적용되지 않는 경우
    }

    isPromotionActive(name) {
        const promotion = this.getPromotion(name);
        if (!promotion) return false;

        const today = DateTimes.now();
        return today >= promotion.startDate && today <= promotion.endDate;
    }
}

const promotionManager = new PromotionManager();
promotionManager.loadPromotions();
export default promotionManager;
