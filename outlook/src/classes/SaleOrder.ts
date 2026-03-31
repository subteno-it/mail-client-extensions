class SaleOrder {
    id: number;
    name: string;
    amountTotal: string;
    state: string;
    dateOrder: string;

    static fromJSON(o: Object): SaleOrder {
        const order = new SaleOrder();
        order.id = o['sale_order_id'];
        order.name = o['name'];
        order.amountTotal = this.removeDecimals(o['amount_total']);
        order.state = o['state'];
        order.dateOrder = o['date_order'];
        return order;
    }

    static copy(order: SaleOrder): SaleOrder {
        const newOrder = new SaleOrder();
        newOrder.id = order.id;
        newOrder.name = order.name;
        newOrder.amountTotal = order.amountTotal;
        newOrder.state = order.state;
        newOrder.dateOrder = order.dateOrder;
        return newOrder;
    }

    private static removeDecimals(revenue: string): string {
        if (!revenue) return '';
        if (revenue.search(/\.00\D*$/) != -1) {
            return revenue.replace(/\.00/, '');
        } else if (revenue.search(/,00\D*$/) != -1) {
            return revenue.replace(/,00/, '');
        }
        return revenue;
    }
}

export default SaleOrder;