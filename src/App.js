import ProductManager from './ProductManager.js';
import PromotionManager from './PromotionManager.js';
import PaymentSystem from './PaymentSystem.js';
import InputView from './InputView.js';
import OutputView from './OutputView.js';

class App {
  async run() {
    ProductManager.loadProducts();
    PromotionManager.loadPromotions();

    OutputView.printWelcomeMessage();
    OutputView.printProducts(ProductManager.products);

    while (true) {
      const input = await InputView.readItem();
      const items = this.parseInput(input);

      // 재고 확인
      const isStockSufficient = items.every(item => {
        const product = ProductManager.getProduct(item.name);
        return product && product.quantity >= item.quantity;
      });

      if (!isStockSufficient) {
        OutputView.printError("[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.");
        continue; // 재입력을 요청하고 루프 처음으로 돌아갑니다.
      }

      // 멤버십 할인 적용 여부 확인
      const isMembership = await InputView.confirmMembership() === 'Y';

      // 결제 시스템 처리
      const paymentSystem = new PaymentSystem();
      await paymentSystem.processPurchase(items, isMembership);

      // 추가 구매 여부 확인
      const anotherPurchase = await InputView.confirmAnotherPurchase();
      if (anotherPurchase !== 'Y') break;

      // 재고가 업데이트된 상품 목록 출력
      OutputView.printProducts(ProductManager.products);
    }
  }

  parseInput(input) {
    return input.slice(1, -1).split('],[').map(item => {
      const [name, quantity] = item.split('-');
      return { name, quantity: parseInt(quantity, 10) };
    });
  }
}

export default App;
